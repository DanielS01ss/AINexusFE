import React from "react";
import { useEffect,useState } from "react";
import {GET_MODELS_FOR_USER} from "../../../utils/apiEndpoints";
import { faCircleLeft, faCubes, faCompass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { jwtDecode } from "jwt-decode";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import SearchIcon from '@mui/icons-material/Search';
import AreYouSure from "../../DataProcessing/dialogs/AreYouSure/AreYouSure";
import PredictInfoDialog from "../../DataProcessing/dialogs/PredictInfoDialog/PredictInfoDialog";
import style from "./MyModelsPage.css";
import {DELETE_MODEL} from "../../../utils/apiEndpoints";
import { useDispatch, useSelector } from "react-redux";
import { setTrainedModel } from "../../../reducers/nodeSlice";
import axios from "axios";

const MyModelsPage = ()=>{


    const trainedModel = useSelector((state)=> state.trainedModel);
    const [modelSelectPredict, setModelSelectPredict] = useState("");
    const [predictInfoOpen, setPredictInfoOpen] = useState(false);
    const [allModels, setAllModels] = useState([]);
    const [filteredModels, setFilteredModels] = useState([]);
    const [loading, setIsLoading] = useState(true);
    const [selectedModel, setSelectedModel] = useState("");
    const [modelToDelete, setModelToDelete] = useState("");
    const [isAreYouSureOpen, setIsAreYouSureOpen] = useState(false);
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const darkTheme = createTheme({
        palette: {
          mode: 'dark',
        },
    });
  
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
        setFilteredModels(modelList);
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

    const searchListByModelName = (list, str)=> {
    
        const filteredList = list.filter(item => {
          const searchStr = str.toLowerCase();
          const datasetName = item.toLowerCase();
      
          return datasetName.includes(searchStr);
        });
      
        return filteredList;
      }

      const blockSuccess = (msg)=>{
        toast.success(msg,{
          duration:2000,
          position:'top-right',
        })
      }
  
      const updateSearch = (evt)=>{
        const updatedModels = searchListByModelName(allModels,evt.target.value);
        setFilteredModels(updatedModels);
      }

      const deleteModelFromFrontEnd = (to_delete)=>{
        const updatedModels = [];
        for(const model of allModels){
            
            if(model == to_delete){
                continue;
            } else {
                updatedModels.push(model);
            }
        }
        
        setAllModels(updatedModels);
        setFilteredModels(updatedModels);
      }

      const deleteTheModel = async()=>{

        if(modelToDelete == trainedModel){
            dispatch(setTrainedModel(""));
        }
        try{
            
            const resp = await axios.delete(DELETE_MODEL(modelToDelete));
            deleteModelFromFrontEnd(modelToDelete);
            blockSuccess("The model was successfully deleted!");
        } catch(err){
            blockAlert("There was a problem while deleting the model");
            console.log(err);
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
        <>  
        <ThemeProvider theme={darkTheme}>
                <Paper
                        component="form"
                        onSubmit={(evt)=>{evt.preventDefault()}}
                        sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: "90%", margin:"auto" }}
                    >
                        <IconButton sx={{ p: '10px' }} aria-label="menu">
                        <MenuIcon />
                        </IconButton>
                        <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="Search Model"
                        inputProps={{ 'aria-label': 'search google maps' }}
                        onChange={(evt)=>{updateSearch(evt)}}
                        
                        />
                        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                        <IconButton onClick={()=>{}} type="button" sx={{ p: '10px' }} aria-label="search">
                        <SearchIcon />
                        </IconButton> 
                </Paper>
            </ThemeProvider>
            <div className="cards-container">
                {
                    filteredModels.map((model)=>{

                        return(
                            <div className="card" key={model}>
                            <div className="card-header">
                                <FontAwesomeIcon icon={faCubes} className="card-icon" />
                                <div className="card-header-model-info">{model}</div>
                            </div>
                            <div className="card-model-footer">
                                <Button variant="contained" onClick={()=>{navigate(`/model-details?model_name=${model}`)}}>More Info</Button>
                                <Button variant="contained"  style={{ backgroundColor: 'green', color: 'white' }} onClick={()=>{setModelSelectPredict(model); setPredictInfoOpen(true)}}>Predict</Button>
                                <Button variant="contained" style={{ backgroundColor: 'red', color: 'white' }} onClick={()=>{setModelToDelete(model); setIsAreYouSureOpen(true);}}>Delete</Button>
                            </div>
                        </div>    
                        )
                    })
                }
            
            </div>
        </>
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
        {isAreYouSureOpen && <AreYouSure yesAction={()=>{deleteTheModel()}} noAction={()=>{}} handleClose={()=>{setIsAreYouSureOpen(false)}} open={isAreYouSureOpen} dialogTitle={"Delete Model"} dialogMessage={`Are you sure you want to delete ${modelToDelete}?`} />}
        <Toaster/>
        {predictInfoOpen && <PredictInfoDialog  selectedModel={modelSelectPredict} open={predictInfoOpen} handleClose={()=>{setPredictInfoOpen(false)}} />}
    </div>
    )
}

export default MyModelsPage;