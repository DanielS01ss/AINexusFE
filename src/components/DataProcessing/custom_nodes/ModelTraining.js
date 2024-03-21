import React, { memo, useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import styles from "./Dataset.css";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { faDivide, faCircleNodes, faSquarePollVertical, faListCheck } from '@fortawesome/free-solid-svg-icons';
import { faDiagramProject } from '@fortawesome/free-solid-svg-icons';
import { faStopwatch } from '@fortawesome/free-solid-svg-icons';
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


function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}
export default memo(({ data, isConnectable }) => {
 
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const trainingStarted = useSelector((state)=> state.is_training_started);
  const modelParameters = useSelector((state)=>state.ml_algorithm_parameters);
  const trainedModel = useSelector((state)=> state.trainedModel);
  const [isTraining, setIsTraining] = React.useState(false);
  const [isDone, setIsDone] = React.useState(false);
  const [hasModelParameters, setHasModelParameters] = useState(false);

  const allNodes = useSelector((state)=>state.nodes);
  const rows = [
    createData('n_depth', 159),
    createData('max_depth', 237),
    createData('min_samples_split', 262)
  ];

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
      navigate();
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
            <h3>  </h3>
            <hr/>
              <div className='training-card-body'>
                {hasModelParameters && 
                <>
                  <h1>Model parameters</h1>
                 <p className='elapsed-time'>Random Forest</p>
                 <TableContainer component={Paper} sx={{ maxWidth: 550,backgroundColor:"#121212", padding:"10px" }} theme={darkTheme}>
                  <Table sx={{ maxWidth: 550}} aria-label="simple table" >
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{color:"#fff", fontSize:"1.4rem",fontWeight:"bold"}}>Parameter Name</TableCell>
                        <TableCell align="right" sx={{color:"#fff", fontSize:"1.4rem",fontWeight:"bold"}}>Value</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row) => (
                        <TableRow
                          key={row.name}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 },color:"#fff" }}
                        >
                          <TableCell component="th" scope="row" sx={{color:"#fff", fontSize:"1.3rem"}}>
                            {row.name}
                          </TableCell>
                          <TableCell align="right" sx={{color:"#fff", fontSize:"1.3rem"}}>{row.calories}</TableCell>
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
                <button className='dataset-toolbox-btn model-data-btn' style={{"color":"#fff", "borderColor":"#fff"}} > Parameters <FontAwesomeIcon icon={faListCheck}/></button>
                <button className='dataset-toolbox-btn model-data-btn' style={{"color":"#fff", "borderColor":"#fff"}} disabled={ !trainedModel || trainedModel.length==0} onClick={()=>{}} > Statistics <FontAwesomeIcon icon={faSquarePollVertical}/></button>
            </div>
        </div>
        <div className='dataset-node-bottom'>
        
        </div>
      </div>
   
    </div>
  );
});
