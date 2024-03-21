import React from "react";
import style from "./ModelStatistics.css";
import {useState, useEffect} from "react"
import { useSearchParams } from "react-router-dom";
import { faCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { GET_PIPELINE_SUMMARY_PLOT, GET_PIPELINE_FORCE_PLOT } from "../../../utils/apiEndpoints";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Divider from '@mui/material/Divider';
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux/es/hooks/useSelector";
import axios from "axios";

const ModelStatistics = ()=>{

    const [searchParams, setSearchParams] = useSearchParams();
    const [summaryPlot, setSummaryPlot] = useState("");
    const [forcePlot, setForcePlot] = useState(""); 
    const [hasNoParameters, setHasNoParameters] = useState(false);

    const navigate = useNavigate();

    const fetchForcePlot = async(model_name)=>{
        const hardcoded_pipeline = "760a96de-29a5-41f1-b6ae-7f1cc9bf2e18";
        try{
            const resp = await axios.get(GET_PIPELINE_SUMMARY_PLOT(hardcoded_pipeline));
           
            setForcePlot(resp.data.message);
        } catch(err){
            console.log(err);
        }
    }

    const fetchSummaryPlot = async (model_name)=>{
        const hardcoded_pipeline = "760a96de-29a5-41f1-b6ae-7f1cc9bf2e18";
        try{
            const resp = await axios.get(GET_PIPELINE_FORCE_PLOT(hardcoded_pipeline));
            
            setSummaryPlot(resp.data.message);
        } catch(err){
            console.log(err);
        }
    }

    useEffect(()=>{
        const model_name = searchParams.get("model_name");
        if(!model_name || model_name.length == 0){
            navigate("/not-found");
        }
        fetchForcePlot(model_name);
        fetchSummaryPlot(model_name);
    },[searchParams])

    return(<div>
        <div className="back-arrow" >
            <FontAwesomeIcon icon={faCircleLeft} onClick={()=>{navigate("/pipelines")}}/>
           
        </div>
        <div className="model-statistics-page-title">
                Model Statistics After Training
        </div>
        <div className="model-info-card">
                <div className="model-info-card-container">
              
                    <h2>Model Details</h2>
                    <div className="model-info-card-body">
                        <p><span className="model-info-card-model-name">Model Name:</span> <span></span></p>     
                        <p><span className="model-info-card-model-name">Date:</span> <span>18/09/2023</span></p>
                    </div>    
                    <Divider/>
                    <div className="model-info-card-sections-container">
                        <div className="model-info-card-parameters-section">
                            <p>Force Plot</p>
                            <img src={`data:image/jpeg;base64,${forcePlot}`} alt="From API" />        
                        </div>
                        <Divider/>
                        <div className="model-info-card-parameters-section">
                            <p>Summary Plot</p>
                            {
                                summaryPlot.length!=0 &&  <iframe srcDoc={summaryPlot}
                                width="100%"
                                height="300px"
                               >

                            </iframe>
                            }
                        
                        </div>
                    </div>                    
                </div>
            </div>
    </div>
    );
}

export default ModelStatistics; 