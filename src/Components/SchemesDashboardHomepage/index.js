import React, {useState, useRef, useEffect} from "react";
import {Helmet} from 'react-helmet';
import SchemesCard from "../SchemesCard";

//import schemesData from "../../Data/schemes.json";
//import schemesData from "../../Data/local_schemes.json";
import ac_schemesData from "../../Data/ac_schemes.json";
import pc_schemesData from "../../Data/ac_schemes.json";
import schemeLogos from "../../Data/schemesLogos"

import RightCaret from "../../Images/arrow/right.svg"
import LeftCaret from "../../Images/arrow/left.svg"

import {generateSitemap} from "../../utils/sitemap-update"

import "./index.css";

const radioButtons = [
  { title: "All", val: "all"},
  { title: "Agriculture and Allied Activities ", val: "Agriculture and Allied Activities" },
  { title: "Drinking Water & Sanitation", val: "Drinking Water & Sanitation" },
  { title: "Education", val: "Education" },
  { title: "Environment and Forests", val: "Environment and Forests" },
  { title: "Food, Civil Supplies and Co-operation", val: "Food, Civil Supplies and Co-operation" },
  { title: "Drinking Water & Sanitation", val: "Drinking Water & Sanitation" },
  { title: "Education", val: "Education" },
  { title: "Environment and Forests", val: "Environment and Forests" },
  { title: "Food, Civil Supplies and Co-operation", val: "Food, Civil Supplies and Co-operation" },
];

const SchemesDashboardHomepage = (props) => {
  const [schemeType, setSchemeType] = useState("all")
  const [showLeftScrollButton, setShowLeftScrollButton] = useState(false)
  const [showRightScrollButton, setShowRightScrollButton] = useState(true)
  const [schemes, setSchemes] = useState([])

  const toolbarScrollRef = useRef(null)

  useEffect(() => {
    console.log('testing scheme slugs', props.schemeSlugs)
    let ac_schemes = Object.keys(ac_schemesData).map((scheme, index) => (
      {
      title: ac_schemesData[scheme].metadata.name, 
      link: `/scheme/${ac_schemesData[scheme].metadata.slug}/${ac_schemesData[scheme].data['indicator_01'].slug}`, 
      class: "mt-4", 
      img: schemeLogos[scheme]
      }
      ))
      ac_schemes.sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()))

    console.log('testing scheme slugs', props.schemeSlugs)
    let pc_schemes = Object.keys(pc_schemesData).map((scheme, index) => (
      {
      title: pc_schemesData[scheme].metadata.name, 
      link: `/scheme/${pc_schemesData[scheme].metadata.slug}/${pc_schemesData[scheme].data['indicator_01'].slug}`, 
      class: "mt-4", 
      img: schemeLogos[scheme]
      }
      ))
      pc_schemes.sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()))


    let schemes = ac_schemes.concat(pc_schemes).filter(function(o) {  
	  return this[o.link] ? false : this[o.link] = true;
	}, {});

    setSchemes(schemes)

    // generateSitemap(schemesData)
  }, [])

  const handleChangeSchemesType = (e) => {
    setSchemeType(e.target.value)
  }

  const handleScrollOnClick = (dir) => {
    if(dir === 'left'){
      toolbarScrollRef.current.scrollLeft -= 200;
    }
    else{
      toolbarScrollRef.current.scrollLeft += 200;
    }
  }

  const handleFilterOptionScroll = (e) => {
    if(e.target.scrollLeft < 30){
      setShowLeftScrollButton(false)
      setShowRightScrollButton(true)
    }
    else{
      if((e.target.scrollLeft + e.target.clientWidth) > e.target.scrollWidth - 30 ){
        setShowRightScrollButton(false)
      }
      else{
        setShowRightScrollButton(true)
      }
      setShowLeftScrollButton(true)
    }

  }
  return (
    <>	
    <Helmet>
        <title> Constituency Dashboard | Open Budgets India </title>
        <meta name="title" content="Constituency Dashboard | Open Budgets India"/>
        <meta property="og:url" content="https://schemes.openbudgetsindia.org/"/>
        <meta property="og:title" content="Constituency Dashboard | Open Budgets India"/>
        <meta property="twitter:url" content="https://schemes.openbudgetsindia.org/"/>
        <meta property="twitter:title" content="Constituency Dashboard | Open Budgets India"/>
    </Helmet>

    <div className="layout-wrapper pt-5">
      <h1 className="page-heading text-dark pl-3 mb-2">Constituency Dashboard</h1>
      <div className="horizontal-seperator mt-3 mb-1"></div>
      {/* <div className="radio-toolbar-container mt-3">
        {
          showLeftScrollButton
          ?
          <button className="scroll-button left" onClick={() => handleScrollOnClick('left')}><img src={RightCaret} /></button>
          : null
        }
        <div class="radio-toolbar d-flex tab-horizontal-scroll" onScroll={handleFilterOptionScroll} ref={toolbarScrollRef}>
          {radioButtons.map((radio) => (
            <>
              <input
                type="radio"
                id={radio.val}
                name="radios"
                value={radio.val}
                onChange={handleChangeSchemesType}
                checked={radio.val === schemeType}
              />
              <label className={radio.class} htmlFor={radio.val}>
                {radio.title}
              </label>
            </>
          ))}
        </div>
        {
          showRightScrollButton 
          ?
          <button className="scroll-button right" onClick={() => handleScrollOnClick('right')}><img src={RightCaret} /></button>
          : null
        }
      </div> */}
      <div className="schemes-list-container">
        {/* <div className="row"> */}
        {schemes.map((scheme, index) => {
          return (
            // <div className="col-md-3 mr-3">
            <SchemesCard scheme={scheme} key={index} />
            // </div>
          );
        })}
        {/* </div> */}
      </div>
    </div>
  </>
  );
};

export default SchemesDashboardHomepage;
