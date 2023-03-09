import React from "react";

const AppDecription = (props)=>{
  return (
    props.appDescription.map((description)=>(<li key={description.item} style={{listStyle:"disc",listStylePosition:"inside",padding:"0.5rem 0rem",color:"var(--color-subtext)"}}>{description.item} </li>))
  );
};

export default AppDecription;