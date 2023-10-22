import React, { useEffect } from "react";
import Flow from "./Flow";
import styles from './DataProcessing.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCirclePlay } from '@fortawesome/free-solid-svg-icons';
import LeftMenu from "./LeftMenu";

function DataProcessing() {

  const circles = document.querySelectorAll(".circle"),
  progressBar = document.querySelector(".indicator");

  let currentStep = 1;
  const updateSteps = () => {
    currentStep++;
    circles.forEach((circle, index) => {
      circle.classList[`${index < currentStep ? "add" : "remove"}`]("active");
    });
    
    progressBar.style.width = `${((currentStep - 1) / (circles.length - 1)) * 100}%`;
    
  };

  useEffect(()=>{
    
    
  },[]);
  
    return (
      <div style={{ height: '100%' }}>        
        <div className="flow-container">
            <div class="container">
              <div className="pipeline-controller">
                <p className="play-btn"><FontAwesomeIcon icon={faCirclePlay} /></p>
                <p>Running...</p>
              </div>
              <div className="steps">
                <span className="circle active">1</span>
                <span className="circle active">2</span>
                <span className="circle active">3</span>
                <span className="circle active">4</span>
                <span className="circle active">5</span>
                <div className="progress-bar">
                  <span className="indicator" style={{width:"10%",marginLeft:"-200px"}}></span>
                </div>
              </div>
            </div>
             <LeftMenu/>
             <Flow/> 
        </div>
      </div>
    );
  }
  
  export default DataProcessing;