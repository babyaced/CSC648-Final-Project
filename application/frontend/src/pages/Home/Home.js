import React from "react";
import HeroContainer from "../../components/Hero/HeroContainer.js";
import SiteDemo2 from "../../components/SiteDemo2/SiteDemo2";
import Footer from "../../components/Footer/Footer.js";

import styles from "./Home.module.css";
import { Redirect } from "react-router";

function Home({ appUser }) {
  if (appUser) {
    return <Redirect to="/Feed" />;
  }

  return (
    <div>
      <HeroContainer />
      <SiteDemo2 />
      <Footer />
    </div>
  );
}

export default Home;
