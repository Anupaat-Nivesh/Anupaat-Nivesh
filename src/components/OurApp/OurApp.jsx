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
      <div className="appScreenShot-box" >
        <img src={appScreenShot} alt="appScreenShot" data-aos="fade-right" data-aos-offset="300"
          data-aos-easing="ease-in-sine" />
      </div>

      <div className="app-description-box" data-aos="fade-left">

        <div className="app-heading-box">
          <h2 className="app-heading">Be Available Everywhere With
            our <br></br><span className="section-heading-focus">Mobile App</span></h2>
        </div>

        <ul className="app-description-list">
          <AppDecription appDescription={appDescription} />
        </ul>

        <h3 className="description secondary-heading">Explore Our Apps</h3>

        <a href="https://play.google.com/store/apps/details?id=com.dwt.AnupaatNivesh" target="_blank" className="app-download android-app" rel="noreferrer">
          <img src={playStore} alt="playstore" className="playstore" />
        </a>

      </div>
    </div>
  );

}

export default OurApp;