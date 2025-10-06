import React from "react";
import { OrbitProgress } from "react-loading-indicators";
import "./loading.css"

function Loading() {
  <div className="container">
    <OrbitProgress 
      variant="dotted" 
      color="#000000" 
      size="medium" 
      text="loading" 
      textColor="#000000" 
      style={{ fontSize: "8px" }} 
    />
  </div>
}
export default Loading;