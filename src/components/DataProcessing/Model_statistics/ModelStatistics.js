import React from "react";
import style from "./ModelStatistics.css";
import {useState, useEffect} from "react"
import { useSearchParams } from "react-router-dom";
import { faCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { GET_PIPELINE_SUMMARY_PLOT, GET_PIPELINE_FORCE_PLOT } from "../../../utils/apiEndpoints";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Divider from '@mui/material/Divider';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import {extractBeforeUnderscore} from "../../../utils/parseModelName";
import axios from "axios";

const ModelStatistics = ()=>{

    const [searchParams, setSearchParams] = useSearchParams();
    const [summaryPlot, setSummaryPlot] = useState("");
    const [forcePlot, setForcePlot] = useState(""); 
    const [hasNoParameters, setHasNoParameters] = useState(false);
    const [modelName , setModelName] = useState("");

    const navigate = useNavigate();

    const blockAlert = (msg)=>{
        toast.error(msg,{
          duration:2000,
          position:'top-right',
        })
    }

    const fetchForcePlot = async(model_name)=>{
        const parsedPipeline = extractBeforeUnderscore(model_name);
        try{
            const resp = await axios.get(GET_PIPELINE_SUMMARY_PLOT(parsedPipeline));
           
            setForcePlot(resp.data.message);
        } catch(err){
            console.log(err);
            blockAlert("Statistics could not be fetched!");
        }
    }

    const fetchSummaryPlot = async (model_name)=>{
        const parsedPipeline = extractBeforeUnderscore(model_name);
        try{
            const resp = await axios.get(GET_PIPELINE_FORCE_PLOT(parsedPipeline));
            
            setSummaryPlot(resp.data.message);
        } catch(err){
            console.log(err);
            blockAlert("Statistics could not be fetched!");
            
        }
    }

 

    useEffect(()=>{
        const model_name = searchParams.get("model_name");
        if(!model_name || model_name.length == 0){
            navigate("/not-found");
        }
        fetchForcePlot(model_name);
        fetchSummaryPlot(model_name);
        setModelName(model_name);
    },[searchParams])

    return(<div>
        <div className="back-arrow" >
            <FontAwesomeIcon icon={faCircleLeft} onClick={()=>{navigate("/pipelines")}}/>
           
        </div>
        <div className="model-statistics-page-title">
                Model Statistics After Training
        </div>
        <div className="model-info-card info-card-statistics">
                <div className="model-info-card-container">
              
                    <h2>Model Details</h2>
                    <div className="model-info-card-body">
                        <p><span className="model-info-card-model-name">Model Name:</span> <span>{modelName}</span></p>     
                        
                    </div>    
                    <Divider/>
                    <div className="model-info-card-sections-container">
                        <div className="model-info-card-parameters-section">
                            <p>Force Plot</p>
                            {
                                forcePlot.length !=0 &&
                                <img src={`data:image/jpeg;base64,${forcePlot}`} alt="From API" />
                            }
                            {
                                forcePlot.length == 0 &&
                                <div class="spinner-container">
                                     <div class="spinner"></div>
                                </div>
                            }
                            
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
                            {
                                summaryPlot.length == 0 &&
                                <div class="spinner-container">
                                     <div class="spinner"></div>
                                </div>
                            }
                        
                        </div>
                    </div>                    
                </div>
                <Toaster/>
            </div>
    </div>
    );
}

export default ModelStatistics; 