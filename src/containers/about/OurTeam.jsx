import React from "react";


import TeamPersonCard from "./TeamPersonCard";
import './OurTeam.css';



const OurTeam = () => {

  const ourTeamDescription = [
    {
      name: "Akash Garg",
      designation: "Financial Consultant",
      img: require("../../assets/person.jpg")
    },
    {
      name: "Gourav Chugh",
      designation: "Technology Consultant",
      img: require("../../assets/person.jpg")
    },
    {
      name: "Beant Singh",
      designation: "Business Consultant",
      img: require("../../assets/person.jpg")
    },
    {
      name: "Kanishk Jhorar",
      designation: "Marketing Officer",
      img: require("../../assets/person.jpg")
    },
    {
      name: "Mohit Rai",
      designation: "Operation Executive",
      img: require("../../assets/person.jpg")
    },
    {
      name: "Harshita Singh",
      designation: "Technical Executive",
      img: require("../../assets/person.jpg")
    },
    {
      name: "Lokesh Singh",
      designation: "Technical Executive",
      img: require("../../assets/person.jpg")
    },
    {
      name: "Vimple Chugh",
      designation: "Business Executive",
      img: require("../../assets/Vimple_Chugh.jpg")
    }
  ];

  return (
    <div>
      <div className="team-title section__padding">
        <h2>Our SuperHeroes</h2>
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