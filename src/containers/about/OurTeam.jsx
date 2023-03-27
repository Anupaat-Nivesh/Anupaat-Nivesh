import React from "react";


import TeamPersonCard from "./TeamPersonCard";
import './OurTeam.css';



const OurTeam = () => {

  const ourTeamDescription = [
    {
      name: "Akash Garg",
      designation: "Financial Consultant",
      img: require("../../assets/teamProfiles/akash.png")
    },
    {
      name: "Gourav Chugh",
      designation: "Technology Consultant",
      img: require("../../assets/teamProfiles/gaurav.png")
    },
    {
      name: "Beant Singh",
      designation: "Business Consultant",
      img: require("../../assets/teamProfiles/beant.png")
    },
    {
      name: "Kanishk Jhorar",
      designation: "Marketing Officer",
      img: require("../../assets/teamProfiles/kanishk.png")
    },
    {
      name: "Mohit Rai",
      designation: "Operation Executive",
      img: require("../../assets/person.jpg")
    },
    {
      name: "Harshita Singh",
      designation: "Technical Executive",
      img: require("../../assets/teamProfiles/harshita.png")
    },
    {
      name: "Lokesh Singh",
      designation: "Technical Executive",
      img: require("../../assets/teamProfiles/lokesh.png")
    },
    {
      name: "Vimple Chugh",
      designation: "Business Executive",
      img: require("../../assets/teamProfiles/vimple.png")
    }
  ];

  return (
    <div>
      <div className="team-title section__padding" data-aos="fade-up"
        data-aos-duration="3000">
        <h2>Our <span className='section-heading-focus'>SuperHeroes</span></h2>
        <p className="lead">Meet our Young, Energetic and skillfull team</p>
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