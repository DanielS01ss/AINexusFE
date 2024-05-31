import React, { memo, useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import styles from "./Dataset.css";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDivide, faCircleNodes, faSquarePollVertical, faListCheck } from '@fortawesome/free-solid-svg-icons';
import { faDiagramProject } from '@fortawesome/free-solid-svg-icons';
import toast, { Toaster } from 'react-hot-toast';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useSelector } from "react-redux/es/hooks/useSelector";
import {setNodes, resetSelectedModelType, setIsTrainingStarted} from "../../../reducers/nodeSlice";
import ModelParameters from '../dialogs/ModelParameters/ModelParameters';


export default memo(({ data, isConnectable }) => {
 
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const trainingStarted = useSelector((state)=> state.is_training_started);
  const modelParameters = useSelector((state)=>state.ml_algorithm_parameters);
  const trainedModel = useSelector((state)=> state.trainedModel);
  const selectedModel = useSelector((state)=> state.selectedModelType);
  const [modelParametersWindowOpen, setModelParametersWindowOpen] = useState(false);
  const [isTraining, setIsTraining] = React.useState(false);
  const [isDone, setIsDone] = React.useState(false);
  const [hasModelParameters, setHasModelParameters] = useState(false);
  const [rows, setRows] = useState([]);

  const allNodes = useSelector((state)=>state.nodes);
  
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  const deleteNode = ()=>{
    let newNodeList = [...allNodes];
    newNodeList = newNodeList.filter((node)=> node.nodeData.type!=="Model Training");
    dispatch(setNodes(newNodeList));
    setTimeout(()=>{
      dispatch(resetSelectedModelType());
    },100)

  }

  const navigateToStatistics = ()=>{
    if(trainedModel.length != 0){
      navigate(`/model-details?model_name=${trainedModel}`);
    }
    
  }

  const parseModelParameters = (model_params)=>{
    let parsedModelKeys = Object.keys(model_params);
    let parsedModelValues = Object.values(model_params);
    let result = [];

    if(modelParameters && Object.entries(modelParameters).length!=0){
      parsedModelKeys.map((item, index)=>{
        const newObj = {};
        newObj["name"] = item;
        newObj["value"] = parsedModelValues[index];
        result.push(newObj);
      });
      setRows(result);
    } else {
      setRows([]);
    }
    
  }

  React.useEffect(()=>{
    setIsTraining(isTraining);
  },[setIsTrainingStarted])

  useEffect(()=>{
    
    if(modelParameters){

      if(Object.keys(modelParameters).length == 0){
        setHasModelParameters(false);
      } else {
        setHasModelParameters(true);
        parseModelParameters(modelParameters);
      }
    }
   
  },[modelParameters])

  

 
  return (
    <div style={{ width:"600px", borderRadius:"5%",padding:"10px",border:"3px solid #fff" }}>
        <Handle
        type="target"
        position={Position.Left}
        id="a"
        style={{padding:"10px",border:"4px solid #fff"}}
        isConnectable={isConnectable}
      />
      <div>
        <div className='dataset-node-header node-header-filter model-training-card-header'>
            <FontAwesomeIcon icon={faDiagramProject} /> Model training
        </div>
        <div className='dataset-node-separator'>
        <p className='remove-node-btn-container' onClick={()=>{deleteNode()}} ><span className='remove-node-btn'>x</span></p>
        </div>
        <div className='dataset-node-info-section'>
             <h3> {selectedModel} </h3>
            <hr/>
              <div className='training-card-body'>
                {hasModelParameters && 
                <>
                  <h1>Model parameters</h1>
                 
                 <TableContainer component={Paper} sx={{ maxWidth: 550,backgroundColor:"#121212", padding:"10px" }} theme={darkTheme}>
                  <Table sx={{ maxWidth: 550}} aria-label="simple table" >
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{color:"#fff", fontSize:"1.4rem",fontWeight:"bold"}}>Parameter Name</TableCell>
                        <TableCell align="right" sx={{color:"#fff", fontSize:"1.4rem",fontWeight:"bold"}}>Value</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows && rows.length !==0 && rows.map((row) => (
                        <TableRow
                          key={row.name}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 },color:"#fff" }}
                        >
                          <TableCell component="th" scope="row" sx={{color:"#fff", fontSize:"1.3rem"}}>
                            {row.name}
                          </TableCell>
                          <TableCell align="right" sx={{color:"#fff", fontSize:"1.3rem"}}>{row.value}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
               </TableContainer>
                </>
                }
                {
                  !hasModelParameters &&
                  <div className='model-training-no-params'>
                    <p className="model-training-no-params-text">There are no parameters for the model!</p>
                    <div className="no-data-container">
                      <FontAwesomeIcon icon={faCircleNodes} />
                    </div>
                    
                  </div>
                }
               {isTraining &&    
               <div className='model-status-container'> 
                  <p>Model status:<span>Processing..</span></p>
                  <div class="loading-spinner">
                    <div class="dot1"></div>
                    <div class="dot2"></div>
                    <div class="dot3"></div>
                  </div>
                  
                </div>
             }
             {
              isDone && 
              <div className='done-container'>
                ✨🎉🎉Done!! 🎉🎉✨
              </div>
             }
              </div>
            <hr/>
            <div className='dataset-node-bottom-toolbox'>
                <button className='dataset-toolbox-btn model-data-btn' style={{"color":"#fff", "borderColor":"#fff"}} onClick={()=>{setModelParametersWindowOpen(true)}}> Parameters <FontAwesomeIcon icon={faListCheck}/></button>
                <button className='dataset-toolbox-btn model-data-btn' style={{"color":"#fff", "borderColor":"#fff"}} onClick={()=>{navigateToStatistics()}} disabled={ !trainedModel || trainedModel.length==0} > Statistics <FontAwesomeIcon icon={faSquarePollVertical}/></button>
            </div>
        </div>
        <div className='dataset-node-bottom'>
             {modelParametersWindowOpen && <ModelParameters open={modelParametersWindowOpen} handleClose={()=>{setModelParametersWindowOpen(false);}}  alertDialogTitle={"Set Model Parameters"} modelType={selectedModel} />}
        </div>
      </div>
   
    </div>
  );
});
