import React from "react";

import TeamPersonCard from "./TeamPersonCard";
import './OurTeam.css';

const OurTeam = () => {

  const ourTeamDescription = [
    {
      name: "Lokesh Singh",
      designation: "Web Developer",
      img:require("../../assets/person.jpg")
    },
    {
      name: "Lokesh Singh",
      designation: "Web Developer",
      img:require("../../assets/person.jpg")
    },
    {
      name: "Lokesh Singh",
      designation: "Web Developer",
      img:require("../../assets/person.jpg")
    },
    {
      name: "Lokesh Singh",
      designation: "Web Developer",
      img:require("../../assets/person.jpg")
    },
    {
      name: "Lokesh Singh",
      designation: "Web Developer",
      img:require("../../assets/person.jpg")
    },
    {
      name: "Lokesh Singh",
      designation: "Web Developer",
      img:require("../../assets/person.jpg")
    },
    {
      name: "Lokesh Singh",
      designation: "Web Developer",
      img:require("../../assets/person.jpg")
    },
    {
      name: "Lokesh Singh",
      designation: "Web Developer",
      img:require("../../assets/person.jpg")
    }
  ];

  return (
    <div>
      <h3 className="secondary-heading">Our Team</h3>
    <div className="ourteam-section">
      
           {ourTeamDescription.map(person => {
          return <TeamPersonCard key={person.name} name={person.name} designation={person.designation} image={person.img} ></TeamPersonCard>
        })}
   
    </div>
    </div>
  );
}

export default OurTeam;