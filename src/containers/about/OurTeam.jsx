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
      name: "a",
      designation: "Web Developer",
      img:require("../../assets/person.jpg")
    },
    {
      name: "b",
      designation: "Web Developer",
      img:require("../../assets/person.jpg")
    },
    {
      name: "c",
      designation: "Web Developer",
      img:require("../../assets/person.jpg")
    },
    {
      name: "d",
      designation: "Web Developer",
      img:require("../../assets/person.jpg")
    },
    {
      name: "e",
      designation: "Web Developer",
      img:require("../../assets/person.jpg")
    },
    {
      name: "f",
      designation: "Web Developer",
      img:require("../../assets/person.jpg")
    },
    {
      name: "g",
      designation: "Web Developer",
      img:require("../../assets/person.jpg")
    }
  ];

  return (
    <div>
      <h3 className="primary-heading">Our Team</h3>
    <div className="ourteam-section">
      
           {ourTeamDescription.map(person => {
          return <TeamPersonCard key={person.name} name={person.name} designation={person.designation} image={person.img} ></TeamPersonCard>
        })}
   
    </div>
    </div>
  );
}

export default OurTeam;