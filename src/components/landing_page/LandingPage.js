import React from "react";
import Divider from '@mui/material/Divider';
import style from "./LandingPage.css";
import image from "../../assets/images/ai-chipsvg.svg";
import graphImage from "../../assets/images/graph.svg";
import algorithmImage from "../../assets/images/algorithm.svg";
import magnifyingGlassImage from "../../assets/images/magnifying-glass.svg";
import { useNavigate } from 'react-router-dom';

export const LandingPage = ()=>{

    const navigate = useNavigate();
    const handleClick = () => {
        navigate('/login');
      };
     
    return(
    <div className="landing-page-container">
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.4)', // Adjust opacity here
            }}>
                <div className="lading-page-content-container">
                    <img src={image} className="landing-page-logo" />
                </div>
                <div>
                    <div className="lading-page-main-text-container">
                        <p className="lading-page-main-text-title">AI NEXUS</p>
                        <p>Experience the future of AI!</p>
                        <button onClick={()=>{handleClick()}} className="landing-page-button">Try it out!</button>
                    </div>
                </div>
                 <div className="landing-page-cards-container">
                   <div className="landing-page-card">
                         <div className="landing-page-card-title">
                            Custom pipelines
                        </div>
                        <Divider/>
                        <div className="landing-page-card-icon-container">
                            <img src={graphImage} className="landing-page-logo" />
                        </div>
                        <div className="landing-page-card-text">
                            You can create custom pipelines for your usecase
                        </div>
                        <Divider/>
                    </div>

                    <div className="landing-page-card">
                        <div className="landing-page-card-title">
                            Auto ML
                        </div>
                        <Divider/>
                        <div className="landing-page-card-icon-container">
                            <img src={algorithmImage} className="landing-page-logo" />
                        </div>
                        <div className="landing-page-card-text">
                            Auto ML algorithms to find the best fit for your data
                        </div>
                        <Divider/>
                    </div>

                    <div className="landing-page-card">
                        <div className="landing-page-card-title">
                            Explainability
                        </div>
                        <Divider/>
                        <div className="landing-page-card-icon-container">
                            <img src={
                                magnifyingGlassImage
                            } className="landing-page-logo" />
                        </div>
                        <div className="landing-page-card-text">
                            We offer explainability so you can interpret the results
                        </div>
                        <Divider/>
                        
                    </div>
                    
                </div> 
            </div>
    </div>
    );
}