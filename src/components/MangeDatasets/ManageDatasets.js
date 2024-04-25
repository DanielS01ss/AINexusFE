import React, {useEffect, useState} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Paper from '@mui/material/Paper';
import MenuIcon from '@mui/icons-material/Menu';
import Divider from '@mui/material/Divider';
import toast, { Toaster } from 'react-hot-toast';
import SearchIcon from '@mui/icons-material/Search';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import UploadDataset from "../DataProcessing/dialogs/UploadDataset/UploadDataset";
import { DATASET_FETCH_ALL_DATASETS , DELETE_DATASET} from "../../utils/apiEndpoints";
import AreYouSure from "../DataProcessing/dialogs/AreYouSure/AreYouSure";
import CloudOffIcon from '@mui/icons-material/CloudOff';
import axios from "axios";
import style from "./ManageDatasets.css";
import { Button } from "@mui/material";
import {getToken} from "../../utils/getTokens";
import { jwtDecode } from "jwt-decode";


export default function ManageDatasets () {

    const navigate = useNavigate();
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [allDatasets,setAllDatasets] = useState([]);
    const [filteredDatasets, setFilteredDatasets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [datasetToDelete, setDatasetToDelete] = useState(0);
    const [isAreYouSureOpen, setIsAreYouSureOpen] = useState(false);
    const [datasetToDeleteName, setDatasetToDeleteName] = useState("");

    const searchListByDatasetName = (list, str)=> {
    
        const filteredList = list.filter(item => {
          const searchStr = str.toLowerCase();
          const datasetName = item["dataset_name"].toLowerCase();
          return datasetName.includes(searchStr);
        });
      
        return filteredList;
      }

      const blockAlert = (msg)=>{
        toast.error(msg,{
          duration:2000,
          position:'top-right',
        })
      }

      const blockSuccess = (msg)=>{
        toast.success(msg,{
          duration:2000,
          position:'top-right',
        })
      }
  

    const darkTheme = createTheme({
        palette: {
          mode: 'dark',
        },
    });
  
    const updateSearch = (evt)=>{
        const updatedDatasets = searchListByDatasetName(allDatasets,evt.target.value);
        setFilteredDatasets(updatedDatasets);
    }

    const fetchAllDatasets = ()=>{ 
    
        const token = getToken();
        const email = JSON.parse(jwtDecode(token).sub).email;

        axios.get(DATASET_FETCH_ALL_DATASETS(email)).then((resp)=>{
        setAllDatasets(resp.data);
        setFilteredDatasets(resp.data);
        setIsLoading(false);
        setHasError(false);
      }).catch(err => {
        setIsLoading(false);
        console.log(err);
        setHasError(true);
    })

    }


    const deleteTheDataset = async(dataset_id)=>{
        try{
            const resp = await axios.delete(DELETE_DATASET(dataset_id));
            console.log(resp);
            blockSuccess("The dataset was successfully deleted!");
            setTimeout(()=>{
                setIsLoading(true)
                fetchAllDatasets();
            },1500)
        } catch(err){
            blockAlert("There was an error while trying to delete the dataset!")
            console.log(err);
        }
    }

    useEffect(()=>{
     fetchAllDatasets();
    },[])


    return(
    <div>
        <div className="back-arrow" onClick={()=>{navigate("/pipelines")}}>
            <FontAwesomeIcon icon={faCircleLeft} />
        </div>
        <div className="manage-datasets-title">
            All Datasets
        </div>
        {
            hasError && !isLoading &&
            <div className="error-message" style={{"padding":"20px", fontSize:"1.5rem"}}>
                <div> There was an error while fetching the data!</div>
                <div>Please try again later</div>
                <CloudOffIcon style={{fontSize:"2.9rem"}}/>
            </div>
        }
        {isLoading && 
              <>
                <div className="loading-spinner"></div>
                <div>Loading...</div>
              </>
        }
        {
            !isLoading && !hasError &&
            <>
                     <div>
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
                                        placeholder="Search Dataset"
                                        inputProps={{ 'aria-label': 'search google maps' }}
                                        onChange={(evt)=>{updateSearch(evt)}}
                                        
                                        />
                                        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                                        <IconButton onClick={()=>{}} type="button" sx={{ p: '10px' }} aria-label="search">
                                        <SearchIcon />
                                        </IconButton> 
                                </Paper>
                            </ThemeProvider>
                        <Toaster/>
                    </div>
                    <div className="cards-container">
                    <div className="card-container" style={{width:"400px"}}>
                            <div className="card-container-dataset-name">Upload a dataset!</div>
                            <Button variant="contained"  sx={{marginRight:"20px", marginTop:"20px"}} onClick={()=>{setIsUploadOpen(true)}} >Upload <CloudUploadIcon sx={{marginLeft:"10px"}} /> </Button>
                        </div>
                        {filteredDatasets.map((dataset)=>{
                    
                            return(
                            <div className="card-container">
                                <div className="card-container-dataset-name">{dataset.dataset_name}</div>
                                <div className="card-container-controls">
                                    <Button variant="contained"  sx={{marginRight:"20px"}} onClick={()=>{navigate(`/dataset-info?dataset_id=${dataset.id}`)}}>More Info</Button>
                                    
                                {dataset.database_type!=="admin" && <Button variant="contained"  style={{ backgroundColor: 'red', color: 'white' }} onClick={()=>{setDatasetToDelete(dataset.id); setDatasetToDeleteName(dataset.dataset_name); setIsAreYouSureOpen(true)}} >Delete</Button>} 
                                </div>
                            </div>
                            );
                        })}
                    
                    {isUploadOpen && <UploadDataset open={isUploadOpen} handleClose={(wasUploaded)=>{setIsUploadOpen(false); if(wasUploaded){setIsLoading(true); fetchAllDatasets();}}} dialogMessage={""} alertDialogTitle={"Upload a dataset"}/> }
                    {isAreYouSureOpen && <AreYouSure  open={isAreYouSureOpen} dialogTitle={"Delete dataset"} dialogMessage={`Are you sure you want to delete ${datasetToDeleteName}?`}  handleClose={()=>{setIsAreYouSureOpen(false)}}  yesAction={()=>{deleteTheDataset(datasetToDelete)}} noAction={()=>{}} />}
                </div>
            </>

        }
   
    </div>
    );
}