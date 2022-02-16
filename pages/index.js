import React, { useState, useEffect } from 'react';
import Seo from 'components/seo/seo';
import { useRouter } from 'next/router';
import Card from 'components/card/card';
import SchemesData from 'utils/schemesData';
import { fetchQuery } from 'utils/api';
import Dropdown from 'components/dropdown/dropdown';

export default function Home({ cardsData, statesData }) {
  const statesschemeData = {};

  statesData.map((state) => {
    state.state.split(',').map((each_state) => {
      if (each_state in statesschemeData) {
        statesschemeData[each_state].push({
          scheme_name: state.scheme_name,
          scheme_slug: state.slug,
        });
      } else {
        statesschemeData[each_state] = [
          { scheme_name: state.scheme_name, scheme_slug: state.slug },
        ];
      }
      return null;
    });
    return null;
  });

  const [valueState, setValueState] = useState(
    Object.keys(statesschemeData)[0]
  );
  const [schemeValue, setschemeValue] = useState(
    statesschemeData[Object.keys(statesschemeData)[0]][0].scheme_name
  );
  const router = useRouter();

  const goToSchemeDashboard = () => {
    const fetchLink = statesData.find((o) => o.scheme_name == schemeValue);
    router.push({
      pathname: `/scheme/${fetchLink.slug}`,
      query: {
        state: valueState,
      },
    });
  };

  const [schemes, setSchemes] = useState([]);
  const [cardStates, setCardStates] = useState([]);
  const [showStates, setShowStates] = useState(true);

  useEffect(() => {
    // const allSchemes = cardsData.map((scheme) => ({
    //   title: scheme.name,
    //   link: `/scheme/${scheme.slug}`,
    //   icon: SchemesData[scheme.slug].logo,
    // }));
    // allSchemes.sort((a, b) =>
    //   a.title.toLowerCase().localeCompare(b.title.toLowerCase())
    // );
    // setSchemes(allSchemes);

    const allStates = Object.keys(statesschemeData).map((state) => ({
      title: state,
      link: `#`,
      icon: SchemesData[state].logo,
    }));
    allStates.sort((a, b) =>
      a.title.toLowerCase().localeCompare(b.title.toLowerCase())
    );
    setCardStates(allStates);
  }, []);

  const getSchemes = (state) => {
    const filteredSchemes = statesschemeData[state];
    const Schemes = filteredSchemes.map((scheme) => ({
      title: scheme.scheme_name,
      link: `/scheme/${scheme.scheme_slug}?state=${state}`,
      icon: SchemesData[scheme.scheme_slug].logo,
    }));
    Schemes.sort((a, b) =>
      a.title.toLowerCase().localeCompare(b.title.toLowerCase())
    );
    setSchemes(Schemes);
    setShowStates(false);
  };

  const seo = {
    url: 'https://schemes.openbudgetsindia.org/',
    description:
      'Find downloadable data, visualisations and other useful information related to a number of schemes run by the Union and State Governments.',
  };

  return (
    <>
      <Seo seo={seo} />
      <div className="skiptarget">
        <span id="maincontent">-</span>
      </div>
      <div className="headercontent">
        <div className="wrapper">
          <h1>
            Explore the Scheme Expenditure in your State focusing on
            Constituencies
          </h1>
          <div className="headercontent__actionitems">
            <Dropdown
              options={Object.keys(statesschemeData)}
              heading="Select State"
              value={valueState}
              handleDropdownChange={(e) => {
                setValueState(e.target.value);
                setschemeValue(
                  statesschemeData[e.target.value][0].scheme_name
                );
              }}
            />
            <Dropdown
              options={statesschemeData[valueState].map(
                (each) => each.scheme_name
              )}
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
        </div>
      </div>
      <main id="main" tabIndex="-1" className="wrapper home">
        {!showStates && (
          <button
            className="details__download"
            onClick={() => {
              setShowStates(true);
            }}
            type="button"
          >
            Select States
          </button>
        )}
        <ul className="home__cards">
          {schemes.length > 0 &&
            !showStates &&
            schemes.map((scheme, index) => (
              <React.Fragment key={index}>
                <Card scheme={scheme} />
              </React.Fragment>
            ))}
          {cardStates.length > 0 &&
            showStates &&
            cardStates.map((state, index) => (
              <div onClick={() => getSchemes(state.title)} key={index}>
                <Card scheme={state} />
              </div>
            ))}
        </ul>
      </main>
    </>
  );
}

export async function getStaticProps() {
  const data = await fetchQuery('schemeType', 'Centrally Sponsored Scheme');
  return {
    props: {
      cardsData: data.map((scheme) => ({
        slug: scheme.extras[2].value,
        name: scheme.extras[0].value,
      })),
      statesData: data.map((scheme) => ({
        state: scheme.extras[3].value,
        scheme_name: scheme.extras[0].value,
        slug: scheme.extras[2].value,
      })),
    },
    revalidate: 1,
  };
}
