import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";


const TeamPersonCard = (props) => {

  return <div className="team-person-card" data-aos="fade-up"
    data-aos-duration="1000">
    <div className="image-container" >
      {props.image === "" ? <FontAwesomeIcon icon={faCircleUser} className="default-person-avatar" /> : <img src={props.image} alt="" className="person-image" />}
    </div>
    <div className="person-info" >
      <p className="person-name">{props.name}</p>
      <p className="person-designation">{props.designation}</p>
    </div>
    <div className="person-profiles">

      {/* <div className="profile"><a href='#'><img src={LinkedInLogo} alt="logo" /></a></div> */}

    </div>
  </div>
};

export default TeamPersonCard;