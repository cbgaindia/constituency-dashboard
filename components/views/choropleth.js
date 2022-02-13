/* eslint-disable */
import React, { Component } from "react";
import * as topojson from "topojson-client";
import { MapContainer, TileLayer, FeatureGroup, GeoJSON } from "react-leaflet";
// import { acTopojson } from "public/assets/data/ac_orissa_topo";
// import { pcTopojson } from "public/assets/data/pc_orissa_topo";

//import { acTopojson as ac_orissa } from "public/assets/data/ac_orissa_topo";
//import { pcTopojson as pc_orissa } from "public/assets/data/pc_orissa_topo";
//import { acTopojson as ac_bihar } from "public/assets/data/ac_bihar_topo";
//import { pcTopojson as pc_bihar } from "public/assets/data/pc_bihar_topo";

//const acTopojson = props.selectedState == "Bihar" ? ac_bihar : ac_orissa;
//const pcTopojson = props.selectedState == "Bihar" ? pc_bihar : pc_orissa;

// import { statesTopojson } from 'public/assets/data/IndiaStates'
import "leaflet/dist/leaflet.css";
import Dropdown from "components/dropdown/dropdown";
import { sortList } from "utils/helpers";

const config = {};

const center_obj = {"Bihar":[25.09, 85.31], "Odisha":[20.95, 85.09], "Maharashtra":[19.75, 75.71], "Jharkhand":[23.61, 85.27], "Chhattisgarh":[21.27, 81.86], "Uttar Pradesh":[26.84, 80.94]};

config.params = {
  zoomControl: false,
  zoom: 7,
  maxZoom: 7,
  minZoom: 4,
  scrollwheel: false,
  legends: true,
  infoControl: true,
  attributionControl: true,
  dragging: true,
  id: "constituencyMap",
};

config.tileLayer = {
  uri: "https://api.mapbox.com/styles/v1/suchismitanaik/cj1nivbus001x2sqqlhmct7du/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic3VjaGlzbWl0YW5haWsiLCJhIjoiY2lqMmZ5N2N5MDAwZnVna25hcjE2b2Q1eCJ9.IYx8Zoc0yNPcp7Snd7yW2A",
  params: {
    minZoom: 4,
    attribution:
      '  © <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    accessToken: "",
  },
};

config.geojson = {
  weight: "1",
  color: "#662447",
  fill: true,
};

export default class Choropleth extends Component {
  constructor() {
    super();
    this.state = {
      budgetAttr: "BE",
      selectedYear: null,
      selectedFigure: null,
      hoverstate: null,
      hoverFigure: null,
      bandFigures: null,
      minMax: null,
      currentPos: null,
    };

    this.computeBands = this.computeBands.bind(this);
    this.mungeData = this.mungeData.bind(this);
    this.getYearList = this.getYearList.bind(this);
    this.handleYearChange = this.handleYearChange.bind(this);
    this.getstyle = this.getstyle.bind(this);
    this.onEachFeature = this.onEachFeature.bind(this);
    this.highlightFeature = this.highlightFeature.bind(this);
    this.resetHighlight = this.resetHighlight.bind(this);
    this.setToolTipContent = this.setToolTipContent.bind(this);
    this.getBandNum = this.getBandNum.bind(this);
    this.fillColor = this.fillColor.bind(this);
    this.handleClick = this.handleClick.bind(this);

    this.geojson = React.createRef(null);
  }

  componentDidMount() {
    const MappedFigures = this.mungeData();
    this.setState({ selectedFigure: MappedFigures });
    const defaultYear = this.getYearList(this.props.schemeData)[
      this.getYearList(this.props.schemeData).length - 1
    ];
    this.props.setYearChange(defaultYear);
    this.setState({
      budgetAttr: this.props.budgetAttr,
      selectedYear: defaultYear,
    });
    this.computeBands(MappedFigures, defaultYear);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.schemeData != this.props.schemeData) {
      const MappedFigures = this.mungeData();
      const yearList = this.getYearList(this.props.schemeData);
      let flag = 0;
      for (const year in yearList) {
        if (this.state.selectedYear == yearList[year]) {
          flag = 1;
          break;
        }
      }

      if (flag == 0) {
        this.computeBands(MappedFigures, yearList[yearList.length - 1]);
        this.setState({ selectedYear: yearList[yearList.length - 1] });
        this.props.setYearChange(yearList[yearList.length - 1]);
      } else {
        this.computeBands(MappedFigures, this.state.selectedYear);
      }
      this.setState({ selectedFigure: MappedFigures });
    }
    if (
      prevState.selectedFigure != this.state.selectedFigure ||
      prevState.selectedYear != this.state.selectedYear
    ) {
      if (this.geojson.current) {
        this.geojson.current.clearLayers().addData(this.state.selectedFigure);
      }
    }
  }

  handleClick(e) {
    this.setState({ currentPos2: e.latlng });
  }

  computeBands(tempData, year) {
    const data = tempData;
    const stateData = [];

    data.features.forEach((state, index) => {
      if (
        state.properties[year] != null &&
        !isNaN(parseFloat(state.properties[year]))
      ) {
        stateData.push(parseFloat(state.properties[year]));
      }
      return null;
    });
    stateData.sort(function (a, b) {
      return a - b;
    });
    const uniq = [...new Set(stateData)];
    const binLength = Math.floor(uniq.length / 5);

    const retvalue = {
      "20%": [uniq[0], uniq[0 + binLength], 1],
      "40%": [uniq[binLength + 1], uniq[binLength * 2], 2],
      "60%": [uniq[2 * binLength + 1], uniq[binLength * 3], 3],
      "80%": [uniq[3 * binLength + 1], uniq[binLength * 4], 4],
      "100%": [uniq[4 * binLength + 1], uniq[uniq.length - 1], 5],
    };

    // let max = Math.max.apply(
    // 	null,
    // 	data.features.map((state, index) => {
    // 		if (
    // 			state.properties[year] != null &&
    // 			!isNaN(parseFloat(state.properties[year]))
    // 		) {
    // 			return parseFloat(state.properties[year])
    // 		}
    // 		return null
    // 	})
    // )

    // let min = Math.min.apply(
    // 	null,
    // 	data.features.map((state, index) => {
    // 		if (
    // 			state.properties[year] != null &&
    // 			!isNaN(parseFloat(state.properties[year]))
    // 		) {
    // 			return parseFloat(state.properties[year])
    // 		}
    // 		return null
    // 	})
    // )

    // let retvalue = {}
    // if (min + (max - min) === 0) {
    // 	retvalue = {
    // 		'20%': [0, 0, 1],
    // 		'40%': [0, 0, 2],
    // 		'60%': [0, 0, 3],
    // 		'80%': [0, 0, 4],
    // 		'100%': [0, 0, 5],
    // 	}
    // } else {
    // 	retvalue = {
    // 		'20%': [min, min + (20 * (max - min)) / 100, 1],
    // 		'40%': [
    // 			min + (20 * (max - min)) / 100,
    // 			min + (40 * (max - min)) / 100,
    // 			2,
    // 		],
    // 		'60%': [
    // 			min + (40 * (max - min)) / 100,
    // 			min + (60 * (max - min)) / 100,
    // 			3,
    // 		],
    // 		'80%': [
    // 			min + (60 * (max - min)) / 100,
    // 			min + (80 * (max - min)) / 100,
    // 			4,
    // 		],
    // 		'100%': [
    // 			min + (80 * (max - min)) / 100,
    // 			min + (100 * (max - min)) / 100,
    // 			5,
    // 		],
    // 	}
    // }

    this.setState({ bandFigures: retvalue });
    this.setState({ minMax: [uniq[uniq.length - 1], uniq[0]] });
  }

  mungeData() {
     const geoFile = this.props.isac
      ? JSON.parse(JSON.stringify(this.props.acTopojson))
      : JSON.parse(JSON.stringify(this.props.pcTopojson));

    const newGeoJsonData = new topojson.feature(geoFile, geoFile.objects.Geo);
    let MappedFigures = new Array();

    MappedFigures = newGeoJsonData.features.map((state, index) => {
      for (const variable in state.properties) {
        if (variable !== "GEO_NAME") {
          delete state.properties[variable];
        }
      }
      const stateCode = Object.keys(this.props.stateCodes).find(
        (code) => this.props.stateCodes[code] === state.properties.GEO_NAME
      );
      if (stateCode !== null) {
        const fiscalYears = Object.keys(this.props.schemeData.fiscal_year);
        fiscalYears.forEach((year) => {
          let valueToSet = this.props.schemeData.fiscal_year[year][stateCode];
          valueToSet =
            valueToSet === "NA" || valueToSet === undefined ? null : valueToSet;
          state.properties[year] = valueToSet;
        });
      }
      return state;
    });

    return { type: "FeatureCollection", features: MappedFigures };
  }

  getBandNum(figure) {
    if (figure) {
      const { bandFigures } = this.state;
      const bandKeys = Object.keys(bandFigures);
      for (const band in bandKeys) {
        if (
          figure >= bandFigures[bandKeys[band]][0] &&
          figure <= bandFigures[bandKeys[band]][1]
        ) {
          return bandFigures[bandKeys[band]][2];
        }
      }
    } else {
      return 0;
    }
  }

  fillColor(band) {
    if (band === 0 || band == null) {
      return "#676767";
    }
    if (band === 1) {
      return "hsl(328, 48%, 87%)";
    }
    if (band === 2) {
      return "hsl(328, 48%, 72%)";
    }
    if (band === 3) {
      return "hsl(328, 48%, 57%)";
    }
    if (band === 4) {
      return "hsl(328, 48%, 42%)";
    }
    if (band === 5) {
      return "hsl(328, 48%, 27%)";
    }
  }

  getstyle(feature) {
    const { selectedYear } = this.state;
    return {
      fillColor: this.fillColor(
        this.getBandNum(feature.properties[selectedYear])
      ),
      weight: 1.3,
      opacity: 1,
      color: "grey",
      dashArray: 0,
      fillOpacity: 0.8,
    };
  }

  handleYearChange(e) {
    this.computeBands(this.state.selectedFigure, e.target.value);
    this.setState({ selectedYear: e.target.value });
    this.props.setYearChange(e.target.value);
  }

  getYearList(data) {
    // const States = Object.keys(data.state_Obj);
    let yearList = [];
    // States.map((stateItem) => {
    yearList = Object.keys(data.fiscal_year);
    // });
    return yearList;
  }

  highlightFeature(e) {
    const layer = e.target;
    this.setToolTipContent(e.target);
    layer.setStyle({
      weight: 2,
      color: "#000",
      fillOpacity: 0.9,
    });
  }

  resetHighlight(e) {
    this.geojson.current.resetStyle(e.target);
    this.resetTooltipContent();
  }

  onEachFeature(component, feature, layer) {
    layer.on({
      mouseover: this.highlightFeature,
      mouseout: this.resetHighlight,
    });
  }

  setToolTipContent(values) {
    this.setState({
      hoverstate: values.feature.properties.GEO_NAME,
      hoverFigure: values.feature.properties[this.state.selectedYear],
    });
  }

  resetTooltipContent() {
    this.setState({ hoverstate: null, hoverFigure: null });
  }

  showConcordanceData() {
    this.setState({ vizActive: !this.state.vizActive });
  }

  render() {
    return (
      <div className="vis-wrapper">
        <MapContainer
          center={center_obj[this.props.selectedState]}
          zoom={config.params.zoom}
          zoomControl={config.params.zoomControl}
          dragging={config.params.dragging}
          whenCreated={(e) => e.invalidateSize()}
          id={config.params.id}
        >
          <TileLayer
            url={config.tileLayer.uri}
            maxZoom={config.params.maxZoom}
            minZoom={config.params.minZoom}
            attribution={config.tileLayer.params.attribution}
          />

          <div className="tcontainer">
            <YearSelector
              handleYearChange={this.handleYearChange}
              fiscalYears={this.getYearList(this.props.schemeData)}
              selectedYear={this.state.selectedYear}
            />
          </div>

          <div className="statetooltip">
            <StateToolTip
              statetooltip={this.state.hoverstate}
              allocations={this.state.hoverFigure}
              unit={this.props.unit}
            />
          </div>
          <FeatureGroup>
            {this.state.selectedFigure && (
              <GeoJSON
                data={this.state.selectedFigure}
                weight={config.geojson.weight}
                style={(feature) => this.getstyle(feature)}
                valueProperty={(feature) => feature.properties.GEO_NAME}
                onEachFeature={this.onEachFeature.bind(null, this)}
                ref={this.geojson}
              />
            )}
          </FeatureGroup>

          <div className="legendcontainer-mobile">
            {this.state.minMax && (
              <>
                <span> {this.state.minMax[0]}</span>
                <div className="legend-scale-mobile" />
                <span> {this.state.minMax[1]}</span>
              </>
            )}
          </div>
          <div className="legendcontainer">
            <div className="legend-scale">
              {this.state.bandFigures ? (
                <ul className="legend-labels">
                  <LegendStep
                    bgColor="hsl(328, 48%, 87%)"
                    band="20%"
                    range={this.state.bandFigures["20%"]}
                  />
                  <LegendStep
                    bgColor="hsl(328, 48%, 72%)"
                    band="40%"
                    range={this.state.bandFigures["40%"]}
                  />
                  <LegendStep
                    bgColor="hsl(328, 48%, 57%)"
                    band="60%"
                    range={this.state.bandFigures["60%"]}
                  />
                  <LegendStep
                    bgColor="hsl(328, 48%, 42%)"
                    band="80%"
                    range={this.state.bandFigures["80%"]}
                  />
                  <LegendStep
                    bgColor="hsl(328, 48%, 27%)"
                    band="100%"
                    range={this.state.bandFigures["100%"]}
                  />
                  <li>
                    <span
                      className="legendspanside"
                      style={{ background: "#676767" }}
                    >
                      Data Unavailable
                    </span>
                  </li>
                </ul>
              ) : null}
            </div>
          </div>
          <div className="license-text">
            License -{" "}
            <a
              href="https://creativecommons.org/licenses/by/4.0/"
              target="_blank"
              rel="noreferrer"
            >
              CC-BY 4.0
            </a>
          </div>
        </MapContainer>
      </div>
    );
  }
}

class YearSelector extends Component {
  render() {
    const { props } = this;
    const fiscalList = sortList(props.fiscalYears);

    return (
      <Dropdown
        options={fiscalList}
        heading="Select Year"
        handleDropdownChange={props.handleYearChange}
      />
    );
  }
}

class StateToolTip extends React.Component {
  render() {
    if (this.props.statetooltip == null) {
      return <div className="statetoolPanelHeading">Select a state</div>;
    }
    return (
      <div>
        <div className="statetoolPanelHeading">
          <span className="glyphicon glyphicon-map-marker" />
          &nbsp;
          {this.props.statetooltip}
        </div>
        <div>
          <AllocationDetails
            allocations={this.props.allocations}
            unit={this.props.unit}
          />
        </div>
      </div>
    );
  }
}

class AllocationDetails extends React.Component {
  render() {
    if (
      this.props.allocations == null ||
      Number.isNaN(parseFloat(this.props.allocations))
    ) {
      return <span>Data unavailable</span>;
    }
    return (
      <span>
        {" "}
        {this.props.allocations}{" "}
        {this.props.unit == "Percentage" ? "%" : this.props.unit}
      </span>
    );
  }
}

class LegendStep extends React.Component {
  render() {
    return (
      <li style={{ background: this.props.bgColor }}>
        <span className="legendspanside">
          {this.props.range[0]} - {this.props.range[1]}
        </span>
      </li>
    );
  }
}
