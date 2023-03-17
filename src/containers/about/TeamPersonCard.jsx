import React from "react";
import { SiFacebook, SiTwitter, SiLinkedin, SiYoutube, SiGmail, SiWhatsapp } from "react-icons/si";

const TeamPersonCard = (props) => {

  const [_,setProfileVisible] = React.useState(false);



const mouseEnterHandler = (event) =>{
  event.target.closest('.team-person-card').querySelector('.person-profiles').classList.add('show-person-profiles');
  event.target.closest('.team-person-card').querySelector('.person-info').style.color="#fff";
  event.target.closest('.team-person-card').querySelector('.image-container').classList.add('enlarge');

 

  // console.log(event.target.closest('.team-person-card'));
  
  setProfileVisible(true);
};




const mouseLeaveHandler = (event)=>{
  event.target.closest('.team-person-card').querySelector('.person-profiles').classList.remove('show-person-profiles');
  event.target.closest('.team-person-card').querySelector('.person-info').style.color="#000";

  event.target.closest('.team-person-card').querySelector('.image-container').classList.remove('enlarge');
  
  setProfileVisible(false);
}


 

 

  return <div className="team-person-card">
    <div className="image-container" onMouseEnter={mouseEnterHandler} onMouseLeave={mouseLeaveHandler}>
      <img src={props.image} alt="" className="person-image"/>
    </div>
    <div className="person-info" onMouseEnter={mouseEnterHandler} onMouseLeave={mouseLeaveHandler}>
      <p className="person-name">{props.name}</p>
      <p className="person-designation">{props.designation}</p>
    </div>
    <div className="person-profiles" onMouseEnter={mouseEnterHandler}>
      <div className="profile"><a href='#'><SiLinkedin className="person-social-icon"/></a></div>
      <div className="profile"><a href='https://www.facebook.com/anupaatnivesh'><SiFacebook className="person-social-icon"/></a></div>
      <div className="profile"><a href='https://twitter.com/Anupaatnivesh'><SiTwitter className="person-social-icon"/></a></div>
    </div>
  </div>
};

export default TeamPersonCard;