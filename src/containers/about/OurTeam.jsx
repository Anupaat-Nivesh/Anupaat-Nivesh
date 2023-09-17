import React from "react";


import TeamPersonCard from "./TeamPersonCard";
import './OurTeam.css';



const OurTeam = () => {

  const ourTeamDescription = [
    {
      name: "Akash Garg",
      designation: "Founder",
      img: require("../../assets/teamProfiles/akash.webp")
    },
    {
      name: "Gourav Chugh",
      designation: "Advisory Partner",
      img: require("../../assets/teamProfiles/gaurav.webp")
    },
    {
      name: "Beant Singh",
      designation: "Business Consultant",
      img: require("../../assets/teamProfiles/beant.webp")
    },
    
    {
      name: "Bhumika",
      designation: "Operation executive",
      img: "",
    },
    {
      name: "Lokesh Singh",
      designation: "Technical Executive",
      img: require("../../assets/teamProfiles/lokesh.webp")
    },
    {
      name: "Vimple",
      designation: "Business Executive",
      img: require("../../assets/teamProfiles/vimple.webp")
    }
  ];

  return (
    <div>
      <div className="team-title section__padding" data-aos="fade-up"
        data-aos-duration="1000">
        <h2>Our <span className='section-heading-focus'>Super Heroes</span></h2>
        <p className="lead">Meet our Young, Energetic and Skillfull Team</p>
      </div>

      <div className="ourteam-section">

        {ourTeamDescription.map(person => {
          return <TeamPersonCard key={person.name} name={person.name} designation={person.designation} image={person.img} ></TeamPersonCard>
        })}

      </div>
    </div>


  );
}

export default OurTeam;