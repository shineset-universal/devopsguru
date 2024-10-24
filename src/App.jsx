import React, { useState, useEffect } from "react";
import { Navigation } from "./components/navigation";
import { Header } from "./components/header";
import { About } from "./components/about";

import { Contact } from "./components/contact";
import JsonData from "./data/data.json";
import SmoothScroll from "smooth-scroll";
import "./App.css";
import { Features } from "./components/features";

export const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  speedAsDuration: true,
});

const App = () => {
  const [landingPageData, setLandingPageData] = useState({});
  useEffect(() => {
    setLandingPageData(JsonData);
  }, []);

  return (
    <div>
      <Navigation />
      <Header data={landingPageData.Header} />
      <Features data={landingPageData.Features}/>
      <About data={landingPageData.About}/>
      <About data={landingPageData.About1} revers />
      <About data={landingPageData.CI_CD_Pipelines}/>
      <About data={landingPageData.IaC_Configuration_Management} revers />
      <About data={landingPageData.Containerization_Docker}/>
      <About data={landingPageData.Monitoring_Logging} revers />
      <About data={landingPageData.GitOps_Infrastructure_Automation}/>
      <About data={landingPageData.Real_World_DevOps_Project} revers />
      
      <Contact data={landingPageData.Contact} />
    </div>
  );
};

export default App;
