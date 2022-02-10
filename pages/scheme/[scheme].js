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
// import { acTopojson } from "public/assets/data/ac_orissa_topo";
// import { pcTopojson } from "public/assets/data/pc_orissa_topo";



import { acTopojson as ac_orissa } from "public/assets/data/ac_orissa_topo";
import { pcTopojson as pc_orissa } from "public/assets/data/pc_orissa_topo";
import { acTopojson as ac_bihar } from "public/assets/data/ac_bihar_topo";
import { pcTopojson as pc_bihar } from "public/assets/data/pc_bihar_topo";



const Scheme = ({ scheme, related }) => {
  //console.log("enter", scheme);
  const [showViz, setShowViz] = useState(true);
  const [activeViz, setActiveViz] = useState("map");
  const [activeIndicator, setActiveIndicator] = useState("");
  const [activeYear, setActiveYear] = useState("2019-20");
  const [loading, setLoading] = useState(true);

  const [isac, setIsac] = useState(true);
  const States = Object.keys(scheme.ac.data.indicator_01.state_Obj);
  const [selectedState, setSelectedState] = useState(States[0]);

  //console.log(selectedState);

  const acTopojson = selectedState == "Bihar" ? ac_bihar : ac_orissa;
  const pcTopojson = selectedState == "Bihar" ? pc_bihar : pc_orissa;

  const acCodes = acTopojson.objects.Geo.geometries.reduce((result, geometry) => {
	  result[geometry.properties.GEO_NO] = geometry.properties.GEO_NAME;
	  return result;
	}, {});

  const pcCodes = pcTopojson.objects.Geo.geometries.reduce((result, geometry) => {
	  result[geometry.properties.GEO_NO] = geometry.properties.GEO_NAME;
	  return result;
	}, {});

  const [stateCodes, setstateCodes] = useState(acCodes);

  const router = useRouter();

  const indicatorKeys = Object.keys(isac ? scheme.ac.data : scheme.pc.data);
  indicatorKeys.map((indicator) => {
    scheme[isac ? "ac" : "pc"].data[indicator].fiscal_year =
      scheme[isac ? "ac" : "pc"].data[indicator].state_Obj[selectedState];
  });
  let currentScheme = isac ? scheme.ac : scheme.pc;

  useEffect(() => {

    const indicatorKeys = Object.keys(isac ? scheme.ac.data : scheme.pc.data);
    indicatorKeys.map((indicator) => {
	    scheme[isac ? "ac" : "pc"].data[indicator].fiscal_year =
	      scheme[isac ? "ac" : "pc"].data[indicator].state_Obj[selectedState];
    });
    currentScheme = isac ? scheme.ac : scheme.pc;
    console.log("a", currentScheme)


    const acTopojson = selectedState == "Bihar" ? ac_bihar : ac_orissa;
    const pcTopojson = selectedState == "Bihar" ? pc_bihar : pc_orissa;

    const acCodes = acTopojson.objects.Geo.geometries.reduce((result, geometry) => {
	  result[geometry.properties.GEO_NO] = geometry.properties.GEO_NAME;
	  return result;
	}, {});

    const pcCodes = pcTopojson.objects.Geo.geometries.reduce((result, geometry) => {
	  result[geometry.properties.GEO_NO] = geometry.properties.GEO_NAME;
	  return result;
	}, {});

    //console.log('accode', acCodes)
    //console.log('pccode', pcCodes)

    setstateCodes(isac ? acCodes : pcCodes);

    // Setting current indicator

    let currentIndicator = Object.keys(currentScheme.data).find(
      (indicator) =>
        currentScheme.data[indicator].slug === router.query.indicator
    );
    if (currentIndicator === undefined) currentIndicator = "indicator_01";
    setActiveIndicator(currentIndicator);
    setLoading(false);
  }, [router, selectedState]);

  const handleChangeViz = (type) => {
    setShowViz(true);
    setActiveViz(type);
  };
  const handleChangeloc = (value) => {
    setIsac(value);
    const indicatorKeys = Object.keys(value ? scheme.ac.data : scheme.pc.data);
    indicatorKeys.map((indicator) => {
      scheme[value ? "ac" : "pc"].data[indicator].fiscal_year =
        scheme[value ? "ac" : "pc"].data[indicator].state_Obj[selectedState];
    });
    currentScheme = value ? scheme.ac : scheme.pc;
    setstateCodes(value ? acCodes : pcCodes);
  };

  const handleStateChange = (e) => {
    setSelectedState(e.target.value);

    const acCodes = acTopojson.objects.Geo.geometries.reduce((result, geometry) => {
	  result[geometry.properties.GEO_NO] = geometry.properties.GEO_NAME;
	  return result;
	}, {});

    const pcCodes = pcTopojson.objects.Geo.geometries.reduce((result, geometry) => {
	  result[geometry.properties.GEO_NO] = geometry.properties.GEO_NAME;
	  return result;
	}, {});

   console.log(acTopojson)

    console.log('accode', acCodes)
    console.log('pccode', pcCodes)

    setstateCodes(isac ? acCodes : pcCodes);
  }

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
                  handleStateChange={handleStateChange}
                />
                {activeIndicator && (
                  <>
                    <IndicatorSelector
                      schemeData={currentScheme}
                      activeIndicator={activeIndicator}
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
                      stateCodes={stateCodes}
                      setYearChange={setYearChange}
                      isac={isac}
                      selectedState={selectedState}
                    />
                  </>
                )}
              </div>

              {/* <SchemeNews newsData={news} />

              <RelatedSchemes related={related} /> */}
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
  // const related = await fetchRelated(
  //   scheme.metadata.name,
  //   scheme.metadata.type
  // );
  // const news = await fetchNews(params.scheme);
  return {
    props: { scheme },
    revalidate: 1,
  };
}

export default Scheme;
