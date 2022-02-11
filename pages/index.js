import React, { useState, useEffect } from "react";
import Seo from "components/seo/seo";
import { useRouter } from "next/router";
import Card from "components/card/card";
import SchemesData from "utils/schemesData";
import { fetchQuery } from "utils/api";
import Dropdown from "components/dropdown/dropdown";

export default function Home({ cardsData, statesData }) {

  let statesschemeData = {};

  statesData.map((state) => {
   
    state['state'].split(",").map((each_state) => {
       if (each_state in statesschemeData) {
         statesschemeData[each_state].push({'scheme_name':state["scheme-name"], 'scheme_slug':state["slug"]});          
	} 
       else{
         statesschemeData[each_state] = [{'scheme_name':state["scheme-name"], 'scheme_slug':state["slug"]}] ; 
        }
    });

  });

  const [schemes, setSchemes] = useState([]);
  const [valueState, setValueState] = useState(Object.keys(statesschemeData)[0]);
  const [schemeValue, setschemeValue] = useState(statesschemeData[Object.keys(statesschemeData)[0]][0]['scheme_name']);

  const router = useRouter();

  const goToSchemeDashboard = () => {
    const fetchLink = statesData.find((o) => {
      return o["scheme-name"] == schemeValue;
    });
    router.push({
      pathname: `/scheme/${fetchLink.slug}`,
      query: {
        state: valueState,
      },
    });
  };

  useEffect(() => {
    const allSchemes = cardsData.map((scheme) => ({
      title: scheme.name,
      link: `/scheme/${scheme.slug}`,
      icon: SchemesData[scheme.slug].logo,
    }));
    allSchemes.sort((a, b) =>
      a.title.toLowerCase().localeCompare(b.title.toLowerCase())
    );
    setSchemes(allSchemes);
  }, []);

  const seo = {
    url: "https://schemes.openbudgetsindia.org/",
    description:
      "Find downloadable data, visualisations and other useful information related to a number of schemes run by the Union and State Governments.",
  };

  return (
    <>
      <Seo seo={seo} />
      <div className="skiptarget">
        <span id="maincontent">-</span>
      </div>
      <main id="main" tabIndex="-1" className="wrapper home">
        <div style={{ display: "flex", gap: "1em" }}>
          <Dropdown
            options={Object.keys(statesschemeData)}
            heading="Select State"
            value={valueState}
            handleDropdownChange={(e) => {
              setValueState(e.target.value);
            }}
          />
          <Dropdown
            options={statesschemeData[valueState].map((each) => {return each['scheme_name']})}
            heading="Select Scheme"
            value={schemeValue}
            handleDropdownChange={(e) => {
              setschemeValue(e.target.value);
            }}
          />
          <button
            className="details__download"
            onClick={goToSchemeDashboard}
            type="button"
          >
            Explore
          </button>
        </div>
        <ul className="home__cards">
          {schemes.length > 0 &&
            schemes.map((scheme, index) => (
              <React.Fragment key={index}>
                <Card scheme={scheme} />
              </React.Fragment>
            ))}
        </ul>
      </main>
    </>
  );
}

export async function getStaticProps() {
  const data = await fetchQuery("schemeType", "Centrally Sponsored Scheme");
  return {
    props: {
      cardsData: data.map((scheme) => ({
        slug: scheme.extras[2].value,
        name: scheme.extras[0].value,
      })),
      statesData: data.map((scheme) => ({
        state: scheme.extras[3].value,
        "scheme-name": scheme.extras[0].value,
        slug: scheme.extras[2].value,
      })),
    },
    revalidate: 1,
  };
}
