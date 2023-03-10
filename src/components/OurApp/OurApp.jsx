import React from "react";

import AppDecription from "./AppDescription";
import playStore from "../../assets/play-store.png";
import appScreenShot from "../../assets/appScreenShot.png";
import "./OurApp.css";


const appDescription = [
  {
    item: "Start your Investment journey with quick digital Onbaording"
  },
  {
    item: "24x7 access to your wealth portfolio with our user friendly mobile app"
  },
  {
    item: "View, analyse, manage, and invest your and your family's wealth"
  },

];

const OurApp = (props) => {


  return (
    <div className="app-section section__padding section__margin" id="ourapp">
      <div className="appScreenShot-box">
        <img src={appScreenShot} alt="appScreenShot" />
      </div>

      <div className="app-description-box">
        <h3 className="section-heading app-secondary-heading">OUR APP</h3>
        <div className="app-heading-box">
          <p className="app-heading">Be Available Everywhere With
            our Mobile App</p>
        </div>

        <ul className="app-description-list">
          <AppDecription appDescription={appDescription} />
        </ul>

        <p className="description">Explore Our Apps</p>

        <a href="https://play.google.com/store/apps/details?id=com.dwt.AnupaatNivesh" target="_blank" className="app-download android-app">
          <img src={playStore} alt="playstore" className="playstore" />
        </a>

      </div>
    </div>
  );

}

export default OurApp;