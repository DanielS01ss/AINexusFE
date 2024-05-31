import * as React from 'react';
import style from "./Tools.css";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import {getToken} from "../../../../utils/getTokens";
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { Divider } from '@mui/material';
import { useSelector } from "react-redux/es/hooks/useSelector";
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import InsertName from '../InsertName/InsertName';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SAVE_PIPELINE } from '../../../../utils/apiEndpoints';
import { truncateString } from '../../../../utils/truncateString';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

export default function Tools(props) {

  const dispatch = useDispatch();
  const [pipelineName, setPipelineName] = React.useState("");
  const nodes = useSelector((state)=>state.nodes);
  const allNodes = useSelector((state)=>state.mappedNodes);
  const trainedModel = useSelector((state)=> state.trainedModel);
  const edges = useSelector((state)=> state.edges);
  const selectedDataset = useSelector((state)=> state.selectedDataset);
  const selectedModelType = useSelector((state)=> state.selectedModelType);
  const selectedDataFeaturingColumns = useSelector((state)=> state.selectedDataFeaturingColumns);
  const normalizationColumns = useSelector((state)=> state.normalizationColumns);
  const standardizationColumns = useSelector((state)=> state.standardizationColumns);
  const imputationAlgs = useSelector((state)=> state.imputationAlgs);
  const mappedNodes = useSelector((state)=> state.mappedNodes);
  const constant_value_imputation_columns = useSelector((state)=> state.constant_value_imputation_columns);
  const constant_value_imputation_values = useSelector((state)=> state.constant_value_imputation_values);
  const ml_algorithm_parameters = useSelector((state)=> state.ml_algorithm_parameters);
  const ml_algorithm_target = useSelector((state)=> state.ml_algorithm_target);
 
  const [isInsertNameOpen, setIsInsertNameOpen] = React.useState(false);
  const [wasDataCopiedPipelineName, setWasDataCopiedPipelineName] = React.useState(false);
  const [wasDataLastModelTrainedCopy, setWasDataLastModelTrainedCopy] = React.useState(false);
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });
  const navigate = useNavigate();

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


  const copyToClipboard = async (text) => {
    try {
        const permissions = await navigator.permissions.query({name: "clipboard-write"})
        if (permissions.state === "granted" || permissions.state === "prompt") {
            await navigator.clipboard.writeText(text);
            blockSuccess("Copied to clipboard");
        } else {
            throw new Error("Can't access the clipboard. Check your browser permissions.")
        }
    } catch (error) {
        blockAlert('Error copying to clipboard!');
    }
};

  const navigateToModelPage = ()=>{
    if(trainedModel.length!=0){
        navigate(`/model-statistics?model_name=${trainedModel}`);
    } else {
        blockAlert("There was no model last trained!");
    }
    
  }

  const collectAndSavePipeline = async(the_pipeline_name)=>{

    if(the_pipeline_name.length == 0 ){
        return;
    }

    const collectedPipelineData = {
        nodes:[],
        selectedDataset:[],
        selectedModelType:"",
        selectedDataFeaturingColumns:[],
        normalizationColumns:[],
        standardizationColumns:[],
        imputationAlgs:[],
        mappedNodes:[],
        constant_value_imputation_columns:[],
        constant_value_imputation_values:[],
        edges:[],
        ml_algorithm_target:{},
        ml_algorithm_parameters:{}
    };

    collectedPipelineData["nodes"] = nodes;
    collectedPipelineData["selectedDataset"] = selectedDataset;
    collectedPipelineData["selectedModelType"] = selectedModelType;
    collectedPipelineData["selectedDataFeaturingColumns"] = selectedDataFeaturingColumns;
    collectedPipelineData["normalizationColumns"] = normalizationColumns;
    collectedPipelineData["standardizationColumns"] = standardizationColumns;
    collectedPipelineData["imputationAlgs"] = imputationAlgs;
    collectedPipelineData["mappedNodes"] = mappedNodes;
    collectedPipelineData["constant_value_imputation_columns"] = constant_value_imputation_columns;
    collectedPipelineData["constant_value_imputation_values"] = constant_value_imputation_values;
    collectedPipelineData["edges"] = edges;
    collectedPipelineData["ml_algorithm_target"] = ml_algorithm_target;
    collectedPipelineData["ml_algorithm_parameters"] = ml_algorithm_parameters;

    const token = getToken();
    const email = JSON.parse(jwtDecode(token).sub).email;

    const reqObj = {
        user_email: email,
        pipeline_name:pipelineName,
        pipeline_data:collectedPipelineData
    }
    
    
    try{
        const resp = await axios.post(SAVE_PIPELINE,{
            user_email: email,
            pipeline_name:the_pipeline_name,
            pipeline_data:JSON.stringify(collectedPipelineData)
        });
        blockSuccess("Pipeline was succesfully saved!");
        setPipelineName(the_pipeline_name);
    } catch(err){
        console.log(err);
        blockAlert("There was an error while saving the pipeline!");
    }
  }




  return (
    
    <ThemeProvider theme={darkTheme}>
            <Dialog
            open={props.open}
            onClose={props.handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth="lg"
            sx={{textAlign:"center", backgroundColor:""}}  
            fullWidth
        >
            <DialogTitle id="alert-dialog-title">
                Tools Dialog
            </DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-description">
                
            </DialogContentText>

                <Box sx={{ height: 400, width: '100%', margin:"auto",borderRadius:"5px" }}  bgcolor="black" >
                    <h1 className="options-page-title">Pipeline Tools</h1>
                    <Divider/>
                <div className='options-page-columns-container'>
                    <div className="options-page-container">
                            <div className='options-page-container-item'>   
                                <p className="options-page-container-title">Save Pipeline</p>
                                <div className='options-page-btn'>
                                    <Button variant="contained" sx={{backgroundColor:"green",
                                    "&:hover": {
                                        backgroundColor: '#63f285',
                                        color: '#fff',
                                    },
                                     color:"#fff"}} onClick={()=>{setIsInsertNameOpen(true)}}>Save</Button>
                                </div>
                                <div className='options-page-container-item'>
                                    <p className="options-page-container-title">See explainability</p>
                                    <div className='options-page-btn'>
                                        <Button variant="contained" disabled={trainedModel.length == 0 || selectedModelType == "DBSCAN"} sx={{backgroundColor:"blue", color:"#fff"}} onClick={()=>{navigateToModelPage();}}>Explore</Button>
                                    </div>
                                </div>
                            </div>
                            
                            
                        </div>
                        <div className="options-page-container-right-side">
                            <div className='options-page-info-section'>
                                <div className='options-page-info-section-title'>
                                    <p> <FontAwesomeIcon icon={faCircleInfo} className="options-page-info-section-icon" />  Info</p>
                                </div>
                                <div>
                                    <p className="options-page-info-section-title-item">Pipeline Name </p>
                                        {pipelineName.length!=0 &&   <div className='options-page-name-container' title={pipelineName} >{truncateString(pipelineName)} {wasDataCopiedPipelineName? <CheckIcon className='copy-icon' style={{"color":"green" , "fontSize":"1.4rem", "fontWeight":"bold"}} /> : <ContentCopyIcon className='copy-icon' onClick={()=>{copyToClipboard(pipelineName); setWasDataCopiedPipelineName(true); setTimeout(()=>{setWasDataCopiedPipelineName(false)},1000)}}/> } </div> } 
                                       {pipelineName.length == 0 &&  <p className='options-page-no-name'>Pipeline does not have a name set</p>} 
                                    <p className="options-page-info-section-title-item">Last Model Trained</p>
                                    {
                                        trainedModel.length!=0 && <div className='options-page-name-container' title={trainedModel}>{truncateString(trainedModel)} {wasDataLastModelTrainedCopy? <CheckIcon className='copy-icon' style={{"color":"green", "fontSize":"1.4rem", "fontWeight":"bold"}}/> : <ContentCopyIcon className='copy-icon' onClick={()=>{ copyToClipboard(trainedModel); setWasDataLastModelTrainedCopy(true); setTimeout(()=>{setWasDataLastModelTrainedCopy(false)},1000)}} /> }</div>
                                    }
                                    {trainedModel.length == 0 && <p className='options-page-no-name'>No model trained with this pipeline</p>} 
                                </div>
                            </div>
                        </div> 
                </div>
                    
                </Box>

            </DialogContent>

              
            <DialogActions>
            <Button onClick={()=>{props.handleClose()}} autoFocus>
                Ok
            </Button>
            </DialogActions>
            {isInsertNameOpen && <InsertName open={isInsertNameOpen} handleClose={()=>{setIsInsertNameOpen(false)}} alertDialogTitle={"Set a name for this pipeline"} noAction={()=>{}} yesAction={(value)=>{collectAndSavePipeline(value)}} /> }
        </Dialog>
        </ThemeProvider>
    );

}
