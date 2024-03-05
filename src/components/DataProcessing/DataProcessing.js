import React, { useEffect, useState } from "react";
import Flow from "./Flow";
import styles from './DataProcessing.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCirclePlay, faCircleStop, faScroll, faToolbox } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from "react-redux/es/hooks/useSelector";
import LeftMenu from "./LeftMenu";
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { faCircleInfo, faTrashCan, faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import { styled } from '@mui/material/styles';
import { START_PIPELINE } from "../../utils/apiEndpoints";
import { setIsTrainingStarted, setNodes,clearDataset, resetSelectedModelType, removeDataFeaturingColumns, setNormalizationColumns, setStandardizationColumns, setImputationAlgs,setConstantValueImputationColumns, setStoredConstantValueImputationValues, setMappedEdges,setMLAlgorithmTarget, setEdgeToDelete, setMappedNodes } from "../../reducers/nodeSlice";
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import {getToken} from "../../utils/getTokens";
import axios from "axios";
import AreYouSure from "./dialogs/AreYouSure/AreYouSure";



function DataProcessing() {

  const nodes = useSelector((state)=> state.nodes);
  const constant_value_imputation_columns = useSelector((state)=>state.constant_value_imputation_columns);
  const constant_value_imputation_values = useSelector((state)=>state.constant_value_imputation_values);
  const pipelineNodes = useSelector((state)=>state.mappedNodes);
  const pipelineEdges = useSelector((state)=>state.edges);
  const selectedDataset = useSelector((state)=> state.selectedDataset);
  const selectedDataFeaturingColumns = useSelector((state)=> state.selectedDataFeaturingColumns);
  const normalizationColumns = useSelector((state)=> state.normalizationColumns);
  const standardizationColumns = useSelector((state)=> state.standardizationColumns);
  const imputationAlgs = useSelector((state)=> state.imputationAlgs);
  const storedMLAlgorithmTarget = useSelector((state)=>state.ml_algorithm_target);
  const [isPipelineStarted, setIsPipelineStarted] = useState(false);
  const [displayPipelineSteps, setDisplayPipelineSteps] = useState(false);
  const [areNodesSelected , setAreNodesSelected] = useState(false);
  const [pipelineFailed, setPipelineFailed] = useState(false);
  const [areYouSureOpen, setAreYouSureOpen] = useState(false);
  const [pipelineMeetRequirements, setPipelineMeetRequirements] = useState(true);
  const steps = ['Start', 'Pipeline steps', 'Finish'];
  const [activeSteps, setActiveSteps] = useState([]);
  const dispatch = useDispatch();

  const isStepFailed = (step) => {
    if(pipelineFailed){
      return step === 1;
    } else if( step === 2 && !pipelineMeetRequirements){
      return true;
    } else {
      return false;
    }
    
  };
  
 
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

  const searchInNextNode = (source, vector)=>{
    for(const elem of vector){
      if(elem.source == source)
          return elem.target;
    }
     return null;
  }

  const parsePipelineResponse = (pipelineStepsStatus)=>{
    pipelineStepsStatus = JSON.parse(pipelineStepsStatus);
    
    if(pipelineStepsStatus["pipeline_succes"] == false){
       setPipelineFailed(true);
    } else {
      setActiveSteps([0,1,2])
    }
  }

  const makeRequestForPipeline = async(operationsList)=>{
    const datasetSignature = selectedDataset[0].database_name;
    const requestObject = {
      dataset_name: datasetSignature,
      operations:[...operationsList]
    }

    const token = getToken();
    dispatch(setIsTrainingStarted(true));

    try{
      const resp = await axios.post(START_PIPELINE, requestObject);
      parsePipelineResponse(resp.data);
      setIsPipelineStarted(false);
      dispatch(setIsTrainingStarted(false));
    } catch(err){
      console.log(err);
      setIsPipelineStarted(false);
      dispatch(setIsTrainingStarted(false));
    }
  }


  const getColumnsNameAsArray = (allColumns)=>{
    const columns = [];
    for(const col of allColumns){
      if(col.column_name)
      {
        columns.push(col.column_name);
      }
    }
    return columns;
  }

  const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({  
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#f5f5f9',
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 420,
      fontSize: theme.typography.pxToRem(15),
      border: '1px solid #dadde9',
    },
  }));

  const startPipelineAndMakeRequests = ()=>{
      
    setPipelineFailed(false);

      const isDatasetBlock = pipelineNodes.find(nd => nd.id === "node-1");
      if(!isDatasetBlock){
        blockAlert("The pipeline does not meet the requirements!");
        return;
      }
      if(pipelineNodes.length == 1){
        blockAlert("The pipeline does not meet the requirements!");
        return;
      }
      if(pipelineEdges.length == 0){
        blockAlert("The pipeline does not meet the requirements!");
        return;
      }
      setIsPipelineStarted(true);
      const orderOfOperations = []; 
      let resultSearch = 'node-1';
      orderOfOperations.push(resultSearch);
      while(resultSearch != null){
        resultSearch = searchInNextNode(resultSearch,pipelineEdges);
        if(resultSearch != null){
          orderOfOperations.push(resultSearch);
        }
      }

      const operationsList = [];
      let operationObj;
      for(const operation of orderOfOperations){
        if(operation == "node-2"){
          operationObj = {
            operation_name:"Data featuring",
            columns:getColumnsNameAsArray(selectedDataFeaturingColumns)
          }
          operationsList.push(operationObj);
        } else if(operation == "node-3"){

            operationObj = {
            operation_name:"Normalization",
            columns:getColumnsNameAsArray(normalizationColumns)
          }
            
          operationsList.push(operationObj);
   
          operationObj = {
              operation_name:"Standardization",
              columns:getColumnsNameAsArray(standardizationColumns)
          }
          operationsList.push(operationObj);

        } else if(operation == "node-4"){
          if(imputationAlgs[0] == "KNN Imputation") {
              operationObj = {
                operation_name:"Data imputation",
                knn_imputation:true
              }
            operationsList.push(operationObj);
          } else if(imputationAlgs[0] == "Constant Value Imputation"){
            operationObj = {
              operation_name:"Data imputation",
              constant_value_imputation_columns:getColumnsNameAsArray(constant_value_imputation_columns),
              constant_value_imputation_values:[...constant_value_imputation_values]
            }
          operationsList.push(operationObj);

          } else {
            operationObj = {
              operation_name:"Data imputation",
              knn_imputation:false
            }
          operationsList.push(operationObj);
          }
        } else if(operation == "node-5"){ 
            operationObj = {
              operation_name:"Model Training",
              ml_algorithm: storedMLAlgorithmTarget.model_name,
              target:storedMLAlgorithmTarget.target_column.column_name
            }
            operationsList.push(operationObj);
        }
      }
      setTimeout(()=>{
        setActiveSteps([0,1]);
      },300)

      makeRequestForPipeline(operationsList);
  }

  const handleDeletePipeline = ()=>{
    dispatch(setNodes([]));
    dispatch(clearDataset());
    dispatch(resetSelectedModelType());
    dispatch(removeDataFeaturingColumns());
    dispatch(setNormalizationColumns([]));    
    dispatch(setStandardizationColumns([]));
    dispatch(setImputationAlgs([]));
    dispatch(setMappedNodes([]));
    dispatch(setConstantValueImputationColumns([]));
    dispatch(setStoredConstantValueImputationValues([]));
    dispatch(setEdgeToDelete(""));
    dispatch(setMappedEdges([]));
    dispatch(setMLAlgorithmTarget({}));
  }


  useEffect(()=>{
    
    if(nodes.length > 0){
      setDisplayPipelineSteps(true);
      setAreNodesSelected(true);
    } else {
      setDisplayPipelineSteps(false);
      setAreNodesSelected(false);
    }   

  },[nodes])

 
    return (
      <div style={{ height: '100%' }}>        
        <div className="flow-container">
          {
                areNodesSelected &&
                <>
                <div class="container">
                {isPipelineStarted ? <div className="pipeline-controller pipeline-started">
                  
                  <p>Running...</p>
                </div>
                 : 
              <div className="pipeline-controller">
                 <p className="play-btn" onClick={()=>{  setTimeout(()=>{ setActiveSteps([0]) ;startPipelineAndMakeRequests()},500) }}><FontAwesomeIcon icon={faCirclePlay} /></p>
                 <p>Start Pipeline</p>
               </div>
               }     
                <Box sx={{ width: '150%', marginLeft:"50px" , backgroundColor:"rgb(255,255,255,0.8)", borderRadius:"10px", padding:"10px" }}>
                    <Stepper activeStep={activeSteps}>
                      {steps.map((label, index) => {
                        const labelProps = {};
                        if (isStepFailed(index)) {
                          labelProps.optional = (
                            <Typography variant="caption" color="error">
                              
                            </Typography>
                          );

                          labelProps.error = true;
                        } 
                      
                        return (
                          <Step key={label} sx={{
                            "& .MuiStepLabel-label": { fontSize: "24px", fontWeight:"bold" }, // Increase label font size
                            "& .MuiStepLabel-iconContainer": { fontSize: "30px",  fontWeight:"bold" }, // Increase icon font size
                            "& .MuiStepIcon": {
                              width: "46px", // Use px or rem for font-size consistency
                              height: "46px",
                            },
                          }}
                            active={activeSteps.includes(index)}
                          >
                            <StepLabel {...labelProps}>{label}</StepLabel>
                          </Step>
                        );
                      })}
                    </Stepper>
              </Box>
              </div>
               <div className="side-info-container">
                <HtmlTooltip title="Delete pipeline">
                    <FontAwesomeIcon icon={faTrashCan}  onClick={()=>{setAreYouSureOpen(true)}} className="trash-icon-side"/>
                </HtmlTooltip>
               <HtmlTooltip
                   title="Pipeline details and settings"
               >
                   <Button><FontAwesomeIcon icon={faToolbox}  className="info-icon-side"/>   </Button>
               </HtmlTooltip>
               <HtmlTooltip title="Logs">
                   <FontAwesomeIcon icon={faScroll} onClick={() => {}} className="info-icon-side"/>
               </HtmlTooltip>
           </div>
           </>
         }
          <AreYouSure handleClose={()=>{setAreYouSureOpen(false)}}  open={areYouSureOpen} yesAction={handleDeletePipeline} noAction={()=>{}}  alertDialogTitle={"Pipeline delete"}  dialogMessage={"Are you sure you want to delete the pipeline?"}/>
            <Toaster/>
             <LeftMenu/>
             <Flow/> 
        </div>
      </div>
    );
  }
  
  export default DataProcessing;