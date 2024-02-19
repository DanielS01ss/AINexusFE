import React, { useEffect, useState } from "react";
import Flow from "./Flow";
import styles from './DataProcessing.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCirclePlay, faCircleStop } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from "react-redux/es/hooks/useSelector";
import LeftMenu from "./LeftMenu";
import { Dropdown } from '@mui/base/Dropdown';
import { Menu } from '@mui/base/Menu';
import { MenuButton as BaseMenuButton } from '@mui/base/MenuButton';
import { MenuItem as BaseMenuItem, menuItemClasses } from '@mui/base/MenuItem';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';


import toast, { Toaster } from 'react-hot-toast';




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
  const circles = document.querySelectorAll(".circle"),
  progressBar = document.querySelector(".indicator");
  const [isPipelineStarted, setIsPipelineStarted] = useState(false);
  const [displayPipelineSteps, setDisplayPipelineSteps] = useState(false);
  const [pipelineBubbles, setPipelineBubbles] = useState([]);
  const [areNodesSelected , setAreNodesSelected] = useState(false);
  const socket = new WebSocket("ws://localhost:8081/ws");


  let pipelineSteps = 0;


  let currentStep = 1;
  const resetSteps = () => {
    circles.forEach((circle)=>{
      circle.classList.remove("active");
    })
    progressBar.style.width = "0%";
    currentStep = 0;
  }

  const colorCircleForNextStep = ()=>{
    circles.forEach((circle, index) => {
      circle.classList[`${index < currentStep ? "add" : "remove"}`]("active");
    });
  }

  const updateSteps = () => {
    currentStep++;
    progressBar.style.width = `${((currentStep - 1) / (circles.length - 1)) * 100}%`;
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

  const makeRequestForPipeline = (operationsList)=>{
    const datasetSignature = selectedDataset[0].database_name;
    const requestObject = {
      dataset_name: datasetSignature,
      operations:[...operationsList]
    }
      
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(requestObject));
    } else{
      blockAlert("There was a problem when connecting to the server! Please try again later")
    }

  }

  const populatePipelineBubbles = (nr)=>{
    const arr = [];
    for(let i=0; i<nr; i++){
      arr.push(<span className="circle" key={i}>{i+1}</span>);
    }
    setPipelineBubbles(arr);
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

  const startPipelineAndMakeRequests = ()=>{
      resetSteps();
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
      pipelineSteps = orderOfOperations.length;
      handlePipelineSteps(1,true);
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
      
      makeRequestForPipeline(operationsList);
  }

  const handlePipelineSteps = (step, isFirst=false)=>{
    console.log(`step = ${step}`)

    if(pipelineSteps == 2){
      if(step == 1){ 
        updateSteps();
        colorCircleForNextStep();      
      } else {
        updateSteps();
        colorCircleForNextStep(); 
      }

    } else {
      if(step == 1){ 
        updateSteps();
        colorCircleForNextStep();      
      } else if(step == pipelineSteps){
        
      
        setIsPipelineStarted(false);
      } else {
        
        updateSteps();
        colorCircleForNextStep();
      }
    }
  
  }

  const handleSocketMessages = (socket_message)=>{
    
    try{
      socket_message = JSON.parse(socket_message);
    } catch(err){
      console.log(err);
      return;
    }
    
    if(socket_message.type == "Error"){
      blockAlert(socket_message.message);
      console.log("Pipeline started was turned off from Error");
      setIsPipelineStarted(false);
    } else {
      handlePipelineSteps(socket_message.stage_num+2, false);
      const message_to_send = `${socket_message.operation_name.operation_name} was completed successfully!`
      blockSuccess(message_to_send);
    }

  }

  socket.addEventListener("open", event => {
    // socket.send("Connection established")
    // socket.send() -> aceasta functie este folosita pentru a trimite date la websocket
    console.log("The connection to the websocket was established!")
    
  });
  
  socket.addEventListener("message", event => {
    //pe event.data se afla datele pe care le primesti de la websocket
    // handleSocketMessages(event.data);
    handleSocketMessages(event.data);
  });

  socket.addEventListener("error", (event) => {
    console.error("WebSocket encountered an error:", event);

  });

  useEffect(()=>{
    
    if(nodes.length > 0){
      setDisplayPipelineSteps(true);
      setAreNodesSelected(true);
    } else {
      setDisplayPipelineSteps(false);
      setAreNodesSelected(false);
    }   

  },[nodes])

  useEffect(()=>{
    if(pipelineEdges!=0){
      resetSteps();
      populatePipelineBubbles(pipelineEdges.length+1);
    }
  },[pipelineEdges])


  

    return (
      <div style={{ height: '100%' }}>        
        <div className="flow-container">
          {
                areNodesSelected &&
                <div class="container">
                {isPipelineStarted ? <div className="pipeline-controller pipeline-started">
                  <p className="play-btn" onClick={()=>{setIsPipelineStarted(false)}}><FontAwesomeIcon icon={faCircleStop} /></p>
                  <p>Running...</p>
                </div>
                 : 
              <div className="pipeline-controller">
                 <p className="play-btn" onClick={()=>{startPipelineAndMakeRequests()}}><FontAwesomeIcon icon={faCirclePlay} /></p>
                 <p>Start Pipeline</p>
               </div>
               }     
               {
                displayPipelineSteps &&
                <div className="steps">
                  {pipelineBubbles}
                <div className="progress-bar">
                 <span className="indicator" style={{width:"10%",marginLeft:"-200px"}}></span>
                 </div>
                </div>
               }
              </div>
         }
           
            <Toaster/>
             <LeftMenu/>
             <Flow/> 
        </div>
      </div>
    );
  }
  
  export default DataProcessing;