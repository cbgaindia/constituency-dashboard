import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Seo from "components/seo/seo";
import { dataTransform, fetchRelated, fetchNews, fetchQuery } from "utils/api";
import { export_table_to_csv } from "utils/download-table";
import SchemeIntroduction from "components/schemeIntroduction/schemeIntroduction";
import domtoimage from "dom-to-image";
import DatavizViewControls from "components/datavizViewControls/datavizViewControls";
import IndicatorSelector from "components/indicatorSelector/indicatorSelector";
import SchemeDetailsView from "components/schemeDetailsView/schemeDetailsView";
import RelatedSchemes from "components/relatedSchemes/relatedSchemes";
import SchemeNews from "components/schemeNews/schemeNews";
import { acTopojson as ac_orissa } from "public/assets/data/ac_orissa_topo";
import { pcTopojson as pc_orissa } from "public/assets/data/pc_orissa_topo";
import { acTopojson as ac_bihar } from "public/assets/data/ac_bihar_topo";
import { pcTopojson as pc_bihar } from "public/assets/data/pc_bihar_topo";

const Scheme = ({ scheme, related }) => {
  const [showViz, setShowViz] = useState(true);
  const [activeViz, setActiveViz] = useState("map");
  const [activeIndicator, setActiveIndicator] = useState("");
  const [activeYear, setActiveYear] = useState("2019-20");
  const [loading, setLoading] = useState(true);

  const [isac, setIsac] = useState(true);
  const States = Object.keys(scheme.ac.data.indicator_01.state_Obj);
  const [selectedState, setSelectedState] = useState(States[0]);

  const router = useRouter();

  let indicatorKeys = Object.keys(isac ? scheme.ac.data : scheme.pc.data);
  indicatorKeys.map((indicator) => {
    scheme[isac ? "ac" : "pc"].data[indicator].fiscal_year =
      scheme[isac ? "ac" : "pc"].data[indicator].state_Obj[selectedState];
    return null;
  });
  let currentScheme = isac ? scheme.ac : scheme.pc;

  let acCodes = {};
  let pcCodes = {};
  let acTopojson = {};
  let pcTopojson = {};
  const ac_obj = { Bihar: ac_bihar, Odisha: ac_orissa };
  const pc_obj = { Bihar: pc_bihar, Odisha: pc_orissa };

  // Setting selected state and const type codes
  acTopojson = ac_obj[selectedState];
  pcTopojson = pc_obj[selectedState];

  useEffect(() => {
    // Setting CurrentScheme Data
    setSelectedState(router.query.state ?? States[0]);

    indicatorKeys = Object.keys(isac ? scheme.ac.data : scheme.pc.data);
    indicatorKeys.map((indicator) => {
      scheme[isac ? "ac" : "pc"].data[indicator].fiscal_year =
        scheme[isac ? "ac" : "pc"].data[indicator].state_Obj[selectedState];
      return null;
    });
    currentScheme = isac ? scheme.ac : scheme.pc;

    // Setting current indicator

    let currentIndicator = Object.keys(currentScheme.data).find(
      (indicator) =>
        currentScheme.data[indicator].slug === router.query.indicator
    );
    if (currentIndicator === undefined) currentIndicator = "indicator_01";
    setActiveIndicator(currentIndicator);
    setLoading(false);
  }, [router, selectedState, isac]);

  const handleChangeViz = (type) => {
    setShowViz(true);
    setActiveViz(type);
  };
  const handleChangeloc = (value) => {
    setIsac(value);
  };

  const getStateCodes = () => {
    // Setting selected state and const type codes
    acTopojson = ac_obj[selectedState];
    pcTopojson = pc_obj[selectedState];
    acCodes = acTopojson.objects.Geo.geometries.reduce((result, geometry) => {
      result[geometry.properties.GEO_NO] = geometry.properties.GEO_NAME;
      return result;
    }, {});

    pcCodes = pcTopojson.objects.Geo.geometries.reduce((result, geometry) => {
      result[geometry.properties.GEO_NO] = geometry.properties.GEO_NAME;
      return result;
    }, {});

    return isac ? acCodes : pcCodes;
  };

  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
    router.push({
      pathname: `/scheme/${router.query.scheme}`,
      query: {
        state: e.target.value,
        indicator:
          currentScheme.data[activeIndicator].slug ?? router.query.indicator,
      },
    });
  };

  const handleToggleShowViz = (status) => {
    setShowViz(status);
  };
  const setYearChange = (year) => {
    setActiveYear(year);
  };
  const seo = {
    title: currentScheme.metadata.name,
    description: currentScheme.metadata.description,
    url: `https://schemes.openbudgetsindia.org/scheme/${router.query.scheme}`,
  };

  const filterElements = (node) => {
    try {
      return (
        node.getAttribute("id") !== "hide-this-button" &&
        node.getAttribute("class") !== "statetooltip" &&
        node.getAttribute("class") !== "tcontainer" &&
        node.getAttribute("class") !== "select-container" &&
        node.getAttribute("class") !== "details__download" &&
        node.nodeType != 8 &&
        node.getAttribute("class") != "see-details-text"
      );
    } catch (err) {
      return true;
    }
  };

  const handleDownloadReportImage = () => {
    if (activeViz === "table") export_table_to_csv("table.csv");
    else
      domtoimage
        .toPng(document.getElementById("report-container"), {
          filter: filterElements,
        })
        .then((dataURL) => {
          const link = document.createElement("a");
          link.download = "Visualization Report.png";
          link.href = dataURL;
          link.click();
        });
  };

  return (
    <>
      <div className="skiptarget">
        <span id="maincontent">-</span>
      </div>

      <main id="main" className="wrapper scheme" tabIndex="-1">
        <div>
          <Seo seo={seo} />
          {!loading && (
            <>
              <SchemeIntroduction data={currentScheme.metadata} />
              <span className="horizontal-seperator" />

              <div className="scheme__container">
                <DatavizViewControls
                  view={activeViz}
                  handleChangeViz={handleChangeViz}
                  handleChangeloc={handleChangeloc}
                  isac={isac}
                  States={States}
                  value={selectedState}
                  handleStateChange={handleStateChange}
                />
                {activeIndicator && (
                  <>
                    <IndicatorSelector
                      schemeData={currentScheme}
                      activeIndicator={activeIndicator}
                      selectedState={selectedState}
                      currentSlug={router.query.scheme}
                    />

                    <SchemeDetailsView
                      handleDownloadReportImage={handleDownloadReportImage}
                      showViz={showViz}
                      activeViz={activeViz}
                      handleToggleShowViz={handleToggleShowViz}
                      schemeData={currentScheme}
                      activeIndicator={activeIndicator}
                      activeYear={activeYear}
                      stateCodes={getStateCodes()}
                      setYearChange={setYearChange}
                      isac={isac}
                      selectedState={selectedState}
                      acTopojson={acTopojson}
                      pcTopojson={pcTopojson}
                    />
                  </>
                )}
              </div>

              {/* <SchemeNews newsData={news} /> */}

              <RelatedSchemes related={related} /> 
            </>
          )}
        </div>
      </main>
    </>
  );
};

export async function getStaticPaths() {
  const data = await fetchQuery("schemeType", "Centrally Sponsored Scheme");
  return {
    paths: data.map((scheme) => ({
      params: {
        scheme: scheme.extras[2].value,
      },
    })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const scheme = await dataTransform(params.scheme);
  const related = await fetchRelated(
     scheme.ac.metadata.name,
     scheme.ac.metadata.type
  );
  // const news = await fetchNews(params.scheme);
  return {
    props: { scheme, related},
    revalidate: 1,
  };
}

export default Scheme;
