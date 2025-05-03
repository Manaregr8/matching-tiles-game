import React from "react";
import "./App.css"


export default function Card(props){

  return (
    <div
      className="box"
      style={{
        backgroundColor: props.on ? "#FFFFFF" : "#000000",
        visibility: props.visible ? "visible" :"hidden"  // Hides matched cards
      }}
      onClick={() => props.visible && props.handleClick(props.cardIndex)}
    >
      {props.value}
    </div>
  );
  

}