import React from "react";
import "./App.css"


export default function Card(props){

  return (
    <div
      className="box"
      style={{
        backgroundColor: props.on ? "#000000" : "#ffffff",
        border: "4px solid #3399ff",
        visibility: props.visible ? "visible" :"hidden"  // Hides matched cards
      }}
      onClick={() => props.visible && props.handleClick(props.cardIndex)}
    >
      {props.value}
    </div>
  );
  

}