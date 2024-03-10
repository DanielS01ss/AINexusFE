import React from "react";
import { useEffect,useState } from "react";
import {GET_MODELS_FOR_USER} from "../../../utils/apiEndpoints";
import { faCircleLeft, faCubes, faCompass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';
import { jwtDecode } from "jwt-decode";
import style from "./MyModelsPage.css";

const MyModelsPage = ()=>{


    const [allModels, setAllModels] = useState([]);
    const [loading, setIsLoading] = useState(true);
    const [selectedModel, setSelectedModel] = useState("");
    const navigate = useNavigate();

    
    const blockAlert = (msg)=>{
        toast.error(msg,{
          duration:2000,
          position:'top-right',
        })
      }
    
    const parseTheModels = (models) =>{
        const modelList = [];
        for(const model of models){
            modelList.push(model[1]);
        }
        setAllModels(modelList);
    }

    const makeRequestsForUser = async()=>{
        const theToken = localStorage.getItem("token");
        const decodedToken = JSON.parse((jwtDecode(theToken).sub))["email"];
        setIsLoading(true);
        try{
         const resp = await axios.get(GET_MODELS_FOR_USER(decodedToken));
         const models = JSON.parse(resp.data.models);
         if(models.length!==0){
            parseTheModels(models);
         } 
         setIsLoading(false);
        } catch(err){   
            blockAlert("There was a problem while fetching models!");
            console.log(err);
            setIsLoading(false);
        }
    }

    useEffect(()=>{
        makeRequestsForUser();
    },[])

    


    return(<div>
        <div className="back-arrow" onClick={()=>{navigate("/pipelines")}}>
            <FontAwesomeIcon icon={faCircleLeft} />
        </div>
        <div className="page-title"> Models Page</div>
        {allModels.length == 0 && !loading &&<div>
             <div className="no-models-trained">
                <FontAwesomeIcon icon={faCompass}/>
                <p>There are no models trained!</p>
             </div>
        </div>
        }
        {allModels.length !== 0 && !loading && 
        <div className="cards-container">
            {
                allModels.map((model)=>{

                    return(
                        <div className="card" key={model}>
                        <div className="card-header">
                            <FontAwesomeIcon icon={faCubes} className="card-icon" />
                            <div className="card-header-model-info">{model}</div>
                        </div>
                        <div className="card-model-footer">
                            <Button variant="contained" onClick={()=>{navigate(`/model-details?model_name=${model}`)}}>More Info</Button>
                            <Button variant="contained"  style={{ backgroundColor: 'green', color: 'white' }}>Predict</Button>
                            <Button variant="contained" style={{ backgroundColor: 'red', color: 'white' }}>Delete</Button>
                        </div>
                    </div>    
                    )
                })
            }
           
        </div>
        }
        {
         loading && 
         <div className="loading-container">
            <div class="spinner-container">
                <div class="spinner"></div>    
             </div>
             <div className="loading-text-for-spinner">
                <p>Loading...</p>
             </div>
         </div>
        }
        <Toaster/>
    </div>
    )
}

export default MyModelsPage;