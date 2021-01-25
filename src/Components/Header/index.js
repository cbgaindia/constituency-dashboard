import React from "react"
import "./index.css"

const Header = () => {

  //   return (
  //       <header class="navbar navbar-static-top masthead">
  //           {/* {#{% block header_debug %}
  //   {% if g.debug and not g.debug_supress_header %}
  //     <div class="debug">Controller : {{ c.controller }}<br/>Action : {{ c.action }}</div>
  //   {% endif %}
  // {% endblock %}#} */}
  //           <div class="nav-container">
  //               <div class="d-flex align-center mobile-menu-navbar-content">
  //                   <div id="mobile-menu-sidebar" class="mobile-menu-sidebar">
  //                       <div id="mobile-menu-content">
  //                           <div id="mobile-menu-home" class="mobile-menu-home">
  //                               <button id="mobile-menu-close-btn" class="closebtn"></button>
  //                               <a href="#" id="obiPlatform" class="mobile-menu-link">
  //                                   <span>OBI Platform</span>
  //                                   <img src={require("../../Images/arrow/right-white.svg")} class="dropdown-right-arrow" />
  //                               </a>
  //                               <a href="#" id="dashboards" class="mobile-menu-link">
  //                                   <span>Dashboards</span>
  //                                   <img src={require("../../Images/arrow/right-white.svg")} class="dropdown-right-arrow" />
  //                               </a>
  //                               <a href="#" id="budgetDatasets" class="mobile-menu-link">
  //                                   <span>Budget Datasets</span>
  //                                   <img src={require("../../Images/arrow/right-white.svg")} class="dropdown-right-arrow" />
  //                               </a>
  //                           </div>
  //                       </div>
  //                       <div class="budget-basics-button-container">
  //                           <a class="home-primary-button budget-basics-btn" href="https://openbudgetsindia.org/budget-basics/" target="_blank">Budget Basics</a>
  //                       </div>
  //                   </div>
  //                   <button id="mobile-menu-toggle" class="mobile-menu-btn" type="button" aria-hidden="true" aria-label="Expand navigation bar" aria-controls="navbar">
  //                       {/* <span class="icon-bar"></span>
  //       <span class="icon-bar"></span>
  //       <span class="icon-bar"></span>  */}
  //                       <img src={require("../../Images/mobile-menu-hamburger-icon.svg")} alt="Mobile Menu Icon" />
  //                   </button>
  //                   {/* The .header-image class hides the main text and uses image replacement for the title  */}
  //                   <hgroup class="{{ g.header_class }}">
  //                       <a class="logo" href="{{ h.url('home') }}"><img src={require("../../Images/Logo_OBI4-31.png")} alt="Open Budgets India header logo" title="Open Budgets India" /></a>
  //                   </hgroup>
  //                   <span class="screen-reader-icon-seperator"></span>
  //                   <div class="dropdown screen-reader-tooltip ml-0">
  //                       <a href="#" class="dropdown-toggle" data-toggle="dropdown">
  //                           <img src={require("../../Images/screen-reader.svg")} alt="Screen Reader Icon" class="screen-reader-icon" />
  //                       </a>
  //                       <ul class="dropdown-menu" role="menu" aria-labelledby="drop1">
  //                           <p class="screen-reader-tooltip-text">
  //                               Open Budgets India is screen-reader accessible.
  //                               We’re adding more accessibility features to the
  //                               platform in the coming months
  //         </p>
  //                       </ul>
  //                   </div>
  //               </div>
  //               <div class="nav-collapse collapse" id="sidebar-collapse">
  //                   {/* {% block header_site_navigation %} */}
  //                   <nav role="navigation" class="section navigation">
  //                       <ul class="nav nav-pills">
  //                           <li class="dropdown ml-0">
  //                               <a href="#" class="dropdown-toggle" data-toggle="dropdown">OBI Platform<img class="nav-link-caret" src={require("../../Images/arrow/caret-down-white.svg")} /></a>
  //                               <ul class="dropdown-menu" role="menu" aria-labelledby="drop1">
  //                                   <li>
  //                                       <a href="/pages/how-to-use-the-portal" target="_blank">How to Use</a>
  //                                       {/* <!-- <img src="./arrow/right.svg" class="dropdown-right-arrow" /> --> */}
  //                                   </li>
  //                                   <li>
  //                                       <a href="/pages/faqs" target="_blank">FAQs</a>
  //                                       {/* <!-- <img src="./arrow/right.svg" class="dropdown-right-arrow" /> --> */}
  //                                   </li>
  //                                   <li>
  //                                       <a href="/about" target="_blank">About Us</a>
  //                                       {/* <!-- <img src="./arrow/right.svg" class="dropdown-right-arrow" /> --> */}
  //                                   </li>
  //                               </ul>
  //                           </li>
  //                           <li class="dropdown" id="dashboard-dropdown-toggle" name="dashboard-dropdown-toggle">
  //                               <a href="#" class="dropdown-toggle" name="dashboard-dropdown-toggle">Dashboards <img class="nav-link-caret" src={require("../../Images/arrow/caret-down-white.svg")} name="dashboard-dropdown-toggle" /></a>
  //                               <ul class="dropdown-menu dashboards-menu" id="dashboard-dropdown" name="dashboard-dropdown-element">
  //                                   {/* <!-- <div id="dropdown-menu-content"> --> */}
  //                                   {/* <!-- <li>
  //                   <a href="https://union2020.openbudgetsindia.org/en/" target="_blank">Union Budget Explorer 2020-21<sup>NEW</sup></a>
  //                   <img src="./arrow/right.svg" class="dropdown-right-arrow" />
  //                 </li>
  //                 <li>
  //                   <a href="https://union2019.openbudgetsindia.org/en/" target="_blank">Union Budget Explorer 2019-20</a>
  //                   <img src="./arrow/right.svg" class="dropdown-right-arrow" />
  //                 </li>
  //                 <li>
  //                   <a href="https://union2019i.openbudgetsindia.org/en/" target="_blank">Union Budget Explorer 2019-20(I)</a>
  //                   <img src="./arrow/right.svg" class="dropdown-right-arrow" />
  //                 </li>
  //                 <li>
  //                   <a href="https://union2018.openbudgetsindia.org/en/" target="_blank">Union Budget Explorer 2018-19</a>
  //                   <img src="./arrow/right.svg" class="dropdown-right-arrow" />
  //                 </li>
  //                 <li>
  //                   <a href="https://assam2019.openbudgetsindia.org/en/" target="_blank">Assam Budget Explorer 2019-20<sup>NEW</sup></a>
  //                   <img src="./arrow/right.svg" class="dropdown-right-arrow" />
  //                 </li> 
  //                 <li>
  //                   <a href="https://cbgaindia.github.io/story-generator/" target="_blank">Story Generator</a>
  //                   <img src="./arrow/right.svg" class="dropdown-right-arrow" />
  //                 </li>
  //                 <li>
  //                   <a href="https://dash.openbudgetsindia.org/superset/dashboard/odisha_balasore_treasury_dashboard/?standalone=true" target="_blank">Balasore District Treasury Dashboard<sup>NEW</sup></a>
  //                   <img src="./arrow/right.svg" class="dropdown-right-arrow" />
  //                 </li>
  //                 <li>
  //                   <a href="https://dash.openbudgetsindia.org/superset/dashboard/ap_krishna_treasury_dashboard/?standalone=true" target="_blank">Krishna District Treasury Dashboard<sup>NEW</sup></a>
  //                   <img src="./arrow/right.svg" class="dropdown-right-arrow" />
  //                 </li> --> */}

  //                                   <li class="dropdown-menu-link" id="unionDashboards" name="dashboard-dropdown-element">
  //                                       <a href="#" class="dropdown-menu-link" name="dashboard-dropdown-element">
  //                                           <span name="dashboard-dropdown-element">Union Dashboards</span>
  //                                           <img src={require("../../Images/arrow/right.svg")} class="dropdown-right-arrow dropdown-menu-link" name="dashboard-dropdown-element" />
  //                                       </a>
  //                                   </li>
  //                                   <li class="dropdown-menu-link" id="stateDashboards" name="dashboard-dropdown-element">
  //                                       <a href="#" class="dropdown-menu-link" name="dashboard-dropdown-element">
  //                                           <span name="dashboard-dropdown-element">State Dashboards</span>
  //                                           <img src={require("../../Images/arrow/right.svg")} class="dropdown-right-arrow dropdown-menu-link" name="dashboard-dropdown-element" />
  //                                       </a>
  //                                   </li>
  //                                   <li class="dropdown-menu-link" id="districtDashboards" name="dashboard-dropdown-element">
  //                                       <a href="#" class="dropdown-menu-link" name="dashboard-dropdown-element">
  //                                           <span name="dashboard-dropdown-element">District Dashboards</span>
  //                                           <img src={require("../../Images/arrow/right.svg")} class="dropdown-right-arrow dropdown-menu-link" name="dashboard-dropdown-element" />
  //                                       </a>
  //                                   </li>
  //                                   {/* <!-- </div> --> */}
  //                               </ul>
  //                           </li>
  //                           <li class="dropdown">
  //                               <a href="#" class="dropdown-toggle" data-toggle="dropdown">Budget Datasets<img class="nav-link-caret" src={require("../../Images/arrow/caret-down-white.svg")} /></a>
  //                               <ul class="dropdown-menu" role="menu" aria-labelledby="drop1">
  //                                   <li>
  //                                       <a href="/organization" target="_blank">Government-wise Budget Data</a>
  //                                       {/* <!-- <img src="./arrow/right.svg" class="dropdown-right-arrow" /> --> */}
  //                                   </li>
  //                                   <li>
  //                                       <a href="/group" target="_blank">Sector-wise Budget Data</a>
  //                                       {/* <!-- <img src="./arrow/right.svg" class="dropdown-right-arrow" /> --> */}
  //                                   </li>
  //                                   <li>
  //                                       <a href="/dataset" target="_blank">All Datasets</a>
  //                                       {/* <!-- <img src="./arrow/right.svg" class="dropdown-right-arrow" /> --> */}
  //                                   </li>
  //                               </ul>
  //                           </li>
  //                           <li>
  //                               <a href="/budget-basics/" target="_blank" class="home-primary-button budget-basics-btn">
  //                                   <span>Budget Basics</span>
  //                               </a>
  //                           </li>


  //                           {/* {#<li><a href="https://blog.openbudgetsindia.org/" target="_blank">Blogs</a></li>#} */}
  //                           {/* 
  //           {% if c.userobj %}
  //           <li class="dropdown">
  //             <a id="drop1" href="#" role="button" class="dropdown-toggle" data-toggle="dropdown">Account<b class="caret"></b></a>
              
  //               {% block header_account_container_content %}
  //               <ul class="dropdown-menu" role="menu" aria-labelledby="drop1">
  //                 {% if c.userobj %}
                 
                    
  //                     {% block header_account_logged %}
  //                       {% if c.userobj.sysadmin %}
  //                         <li>
  //                           <a href="{{ h.url_for(controller='admin', action='index') }}" title="{{ _('Sysadmin settings') }}">
  //                             <i class="icon-legal" aria-hidden="true"></i>
  //                             <span class="text">{{ _('Admin') }}</span>
  //                           </a>
  //                         </li>
  //                       {% endif %}
  //                       <li>
  //                         <a href="{{ h.url_for(controller='user', action='read', id=c.userobj.name) }}" class="image" title="{{ _('View profile') }}">
  //                           {{ h.gravatar((c.userobj.email_hash if c and c.userobj else ''), size=22) }}
  //                           <span class="username">{{ c.userobj.display_name }}</span>
  //                         </a>
  //                       </li>
  //                       {% set new_activities = h.new_activities() %}
  //                       <li class="notifications {% if new_activities > 0 %}notifications-important{% endif %}">
  //                         {% set notifications_tooltip = ngettext('Dashboard (%(num)d new item)', 'Dashboard (%(num)d new items)', new_activities) %}
  //                         <a href="{{ h.url_for(controller='user', action='dashboard') }}" title="{{ notifications_tooltip }}">
  //                           <i class="icon-dashboard" aria-hidden="true"></i>
  //                           <span class="text">{{ _('Dashboard') }}</span>
  //                           <span class="badge">{{ new_activities }}</span>
  //                         </a>
  //                       </li>
  //                       {% block header_account_settings_link %}
  //                         <li>
  //                           <a href="{{ h.url_for(controller='user', action='edit', id=c.userobj.name) }}" title="{{ _('Edit settings') }}">
  //                             <i class="icon-cog" aria-hidden="true"></i>
  //                             <span class="text">{{ _('Settings') }}</span>
  //                           </a>
  //                         </li>
  //                       {% endblock %}
  //                       {% block header_account_log_out_link %}
  //                         <li>
  //                           <a href="{{ h.url_for('/user/_logout') }}" title="{{ _('Log out') }}">
  //                             <i class="icon-signout" aria-hidden="true"></i>
  //                             <span class="text">{{ _('Log out') }}</span>
  //                           </a>
  //                         </li>
  //                       {% endblock %}
  //                     {% endblock %}
          
  //                 </ul>
                   
  //                 {% else %}
                    
  //                       {% block header_account_notlogged %}
  //                       <li>{% link_for _('Log in'), controller='user', action='login' %}</li>
  //                       {% if h.check_access('user_create') %}
  //                         <li>{% link_for _('Register'), controller='user', action='register', class_='sub' %}</li>
  //                       {% endif %}
  //                       {% endblock %}
                      
                    
  //                 {% endif %}
  //               {% endblock %}
  //               </li>
                
  //               {% endif %} */}
  //                       </ul>


  //                   </nav>
  //                   {/* {% endblock %} */}
  //               </div>
  //               <a href="/budget-basics/" target="_blank" class="home-primary-button budget-basics-btn btn-tab">
  //                   <span>Budget Basics</span>
  //               </a>
  //           </div>

  //           {/* {% block header_account %}
  //   {#<div class="container">
      
  //   </div>#}  
  // {% endblock %} */}
  //       </header>
  //   )
  return (
    <header class="navbar navbar-static-top masthead">Header</header>
  )
}

export default Header;