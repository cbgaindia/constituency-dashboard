import React, {useState, useEffect} from "react";
import { Route, Switch, Redirect } from 'react-router-dom';

import Header from "../Header";
import SchemesDashboardHomepage from "../SchemesDashboardHomepage"
import SchemeDashboard from "../SchemeDashboard"
import Footer from "../Footer";

import SchemesData from "../../Data/schemes (2).json"
import "./index.css";




const Layout = () => {
  const [schemeSlugs, setSchemeSlugs] = useState({})

  useEffect(() => {
    let schemeSlugs = {}
    Object.keys(SchemesData)
    .forEach(scheme => schemeSlugs[scheme] = SchemesData[scheme].metadata.slug)
    setSchemeSlugs(schemeSlugs)
  }, [])

  return (
    <div className="app-container">
      {/* Here comes the Header */}
      <Header />
      <div className="app-content-wrapper">
         {/* Here comes the main app content */}
        <Switch>
          <Route path="/" render={(props) => (<SchemesDashboardHomepage {...props} schemeSlugs={schemeSlugs} />)} exact />
          <Route path="/scheme/:scheme_slug/:indicator_slug" render={(props) => (<SchemeDashboard {...props} schemeSlugs={schemeSlugs} />)} />
          <Redirect to="/" />
        </Switch>
      </div>
      {/* Here comes the footer */}
      <Footer />
    </div>
  );
};

export default Layout;