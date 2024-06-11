import React from "react";
import { useEffect,useState } from "react";
import {GET_MODELS_FOR_USER} from "../../../utils/apiEndpoints";
import { faCircleLeft, faCubes, faCompass } from '@fortawesome/free-solid-svg-icons';
import {
  Unstable_NumberInput as BaseNumberInput,
  numberInputClasses,
} from '@mui/base/Unstable_NumberInput';
import { styled } from '@mui/system';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';
import { jwtDecode } from "jwt-decode";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { GET_SAVED_PIPELINES } from "../../../utils/apiEndpoints";
import Box from '@mui/material/Box';
import styles from "./GeneratePipelines.css";
import {addNode, setStoredModeSelected, setFeatureEncodingColumns, setIsStoredFeedbackOpen, addDataset, setNodes, clearDataset, resetSelectedModelType, removeDataFeaturingColumns, setNormalizationColumns, setStandardizationColumns, setImputationAlgs,setConstantValueImputationColumns, setStoredConstantValueImputationValues, setMappedEdges,setMLAlgorithmTarget, setEdgeToDelete, setMappedNodes, setMLAlgorithmParameters, setSelectedModelType, setSelectedDataFeaturingColumns, setLogTransformationColumns, setOutlierRemovalColumns } from "../../../reducers/nodeSlice";
import {useDispatch} from 'react-redux';
import {DATASET_FETCH_ALL_DATASETS} from "../../../utils/apiEndpoints";
import { faDatabase } from '@fortawesome/free-solid-svg-icons';
import { Typography } from '@mui/material';
import Paper from '@mui/material/Paper'; 
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Checkbox from '@mui/material/Checkbox';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { getToken } from "../../../utils/getTokens";
import { getCurrentTimestamp } from "../../../utils/getCurrentTimestamp";
import { useSelector } from "react-redux/es/hooks/useSelector";
import AILogo from "../../../assets/images/DALL·E 2024-03-23 18.03.15 - Create an image illustrating the concept of automatic generation of AI pipelines, symbolized by blocks similar to those in V.webp";
import LoadingPipeline from "../../../assets/images/pipeline-generating.gif";
import DataSetInfo from "../dialogs/DataSelectDialog/DataSetInfo";
import {GENERATE_PIPELINE,  DATASET_FETCH_DATASET_SNIPPET} from "../../../utils/apiEndpoints";
import PipelineImage from "../../../assets/images/pipeline-logo.png";
import Accordion from '@mui/material/Accordion';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TextField from '@mui/material/TextField';
import InfoIcon from '@mui/icons-material/Info';
import { setNumberOfPipelinesToGenerate, setSelectedDatasetGeneration, setSelectedProblemTypeGeneration, setGeneratedPipelines, setSelectedTargetColumnGeneration, setSpawnedPipelineEdges, setTargetEncodingColumns, setOneHotEncodingColumnsReducer, setLabelEncodingColumns} from "../../../reducers/nodeSlice";
import { v4 as uuidv4 } from 'uuid';
import { capitalizeFirstLetter } from "../../../utils/capitalizeFirstLetter";


const CustomNumberInput = React.forwardRef(function CustomNumberInput(props, ref) {
  return (
    <BaseNumberInput
      slots={{
        root: StyledInputRoot,
        input: StyledInputElement,
        incrementButton: StyledButton,
        decrementButton: StyledButton,
      }}
      slotProps={{
        incrementButton: {
          children: '▴',
        },
        decrementButton: {
          children: '▾',
        },
      }}
      {...props}
      ref={ref}
    />
  );
});



const GeneratePipelines = ()=>{

    const dispatch = useDispatch();
    const nodes = useSelector((state)=>state.nodes);
    const dataset = useSelector((state)=>state.selectedDataset);
    const [userFeedback, setUserFeedback] = useState("");
    const [allPipelines, setAllPipelines] = useState([]);
    const [loading, setIsLoading] = useState(true);
    const [selectedModel, setSelectedModel] = useState("");
    const [checked, setChecked] = React.useState([]);
    const [dataSetSearch,setDatasetSearch] = React.useState(true);
    const [dataSets, setDataSets] = React.useState([]);
    const [selectedDatasetId,setSelectedDatasetId] = React.useState("");
    const [selectedDatasetName, setSelectedDatasetName] = React.useState("");
    const [filteredDatasets,setFilteredDatasets] = React.useState([]);
    const [searchedString, setSearchedString] = React.useState("");
    const [isDataLoading, setIsDataLoading] = React.useState(true);
    const [isPipelineGenerating, setIsPipelineGenerating] = React.useState(false);
    const [checkedDatasetRows, setCheckedDatasetRows] = React.useState([]);
    const [displayGenerationOptions, setDisplayGenerationOptions] = React.useState(false);
    const [problemType, setProblemType] = React.useState("");
    const [generatedPipeline, setGeneratedPipeline] = React.useState({});
    const [wasPipelineGenerated, setWasPipelineGenerated] = React.useState(false);
    const [rows, setRows] = useState([]);
    const [columns, setColumns] = useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [isAreYouSureOpen, setIsAreYouSureOpen] = React.useState(false);
    const [pipelineDataRows, setPipelineDataRows] = React.useState([]);
    const [parsed_response, setParsedResponse] = React.useState();
    const [nrOfPipelinesSuggestions, setNumberOfPipelineSuggestions] = useState(1);
    const [generatedPipelines, setGeneratedPipelinesData] = useState([]);
    const [isFeedBackOpen, setIsFeedbackOpen] = useState(false);
    const [interactionHistory, setInteractionHistory] = useState({});
    const [value, setValue] = React.useState('Controlled');
    const [customMode, setCustomMode] = React.useState(false);
    const [selectedMode, setSelectedMode] = React.useState("guided");
    const [areSuggestionsGenerating, setAreSuggestionsGenerating] = React.useState(false);
    const [wereSuggestionsGenerated, setWereSuggestionGenerated] = React.useState(true);
    const [suggestions, setSuggestions] = React.useState([]);
    const [suggestedTargetColumn, setSuggestedTargetColumn] = React.useState();
    const storedNumberOfPipelinesToGenerate = useSelector((state)=> state.numberOfPipelinesToGenerate);
    const storedGeneratedPipelines = useSelector((state)=> state.generatedPipelines);
    const selectedTargetColumnGeneration = useSelector((state)=> state.selectedTargetColumnGeneration);
    const selectedProblemTypeGeneration = useSelector((state)=> state.selectedProblemTypeGeneration);
    const selectedDatasetGeneration = useSelector((state)=> state.selectedDatasetGeneration);

    const navigate = useNavigate();
    const theme = createTheme({
        components: {
          // Style overrides for Accordion
          MuiAccordion: {
            styleOverrides: {
              root: {
                backgroundColor: '#1e1e1e', // Custom background color
                color: '#fff', // Custom text color
                '&:before': { // Remove the default underline
                  backgroundColor: 'transparent',
                },
              },
            },
          },
        },
      });


    const blockAlert = (msg)=>{
        toast.error(msg,{
          duration:2000,
          position:'top-right',
        })
      }
     
   
    const makeRequestsForUser = async()=>{
        const theToken = localStorage.getItem("token");
        const decodedToken = JSON.parse((jwtDecode(theToken).sub))["email"];
        setIsLoading(true);
        try{
         const resp = await axios.get(GET_SAVED_PIPELINES(decodedToken));
         setAllPipelines(resp.data.data);
         setIsLoading(false);
        } catch(err){   
            blockAlert("There was a problem while fetching models!");
            console.log(err);
            setIsLoading(false);
        }
    }

  const handleChange = (event) => {
      setValue(event.target.value);
  };

  const handleDisplayDataSetInfo = (datasetId) =>{
    if(datasetId){
      setSelectedDatasetId(datasetId);
      const  foundDataset = dataSets.filter(dt => dt.id === datasetId);
      if(foundDataset.length !=0){
        setSelectedDatasetName(foundDataset[0].dataset_name);
      }
    }
    setDatasetSearch(!dataSetSearch);
  }

  const handleToggle = (value) => () => {
    
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    
    if(newChecked.length == 1){
      if(currentIndex != -1){
        newChecked.pop();
      } else {
        newChecked.pop();
        newChecked.push(value);
      }
    } else {
      if (currentIndex === -1) {
        newChecked.push(value);
      } 
    }
    dispatch(setSelectedDatasetGeneration(newChecked));
    setChecked(newChecked);
    setProblemType("");
    setNumberOfPipelineSuggestions(1);
    setPipelineDataRows([]);
    dispatch(setIsStoredFeedbackOpen(false));
    setIsFeedbackOpen(false);
    setSuggestions([]);

    dispatch(setNumberOfPipelinesToGenerate(1));
    dispatch(setSelectedTargetColumnGeneration([]));
    dispatch(setSelectedProblemTypeGeneration(""));
    setInteractionHistory({});
  };


   const handleToggleTargetCol = (value) => () =>{
    const currentIndex = checkedDatasetRows.indexOf(value);
    const newChecked = [...checkedDatasetRows];
    
    if(newChecked.length == 1){
      if(currentIndex != -1){
        newChecked.pop();
       
      } else {
        newChecked.pop();
        newChecked.push(value);
      }
    } else {
      if (currentIndex === -1) {
        newChecked.push(value);
      } 
    }

    dispatch(setSelectedTargetColumnGeneration(newChecked));
    setCheckedDatasetRows(newChecked);
    setInteractionHistory({});
   }

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  const restoreChecksBasedOnStoredData = (data)=>{
    
    if(data.length == 0 || dataset.length == 0){
      return;
    }
    const filteredDataset = data.filter((dt)=> {
      return  dt.dataset_name == dataset[0].dataset_name
    });
    if(filteredDataset.length !=0){
      setChecked(filteredDataset);
    }

  }

  
  const fetchAllData = () =>{
    const token = getToken();
    const theCurrentDate = getCurrentTimestamp();
    const email = JSON.parse(jwtDecode(token).sub).email;
 
    axios.get(DATASET_FETCH_ALL_DATASETS(email)).then((resp)=>{
      const fetchedData = resp.data;
      setFilteredDatasets(resp.data); 
      setDataSets(fetchedData);
      setDatasetSearch(fetchedData);
      restoreChecksBasedOnStoredData(fetchedData);
      setIsDataLoading(false);
    }).catch(err => {console.log(err); setIsDataLoading(false); blockAlert("There was a problem while fetching all the datasets");})
  }
  

 
  const searchListByDatasetName = (list, str)=> {
    
    const filteredList = list.filter(item => {
      const searchStr = str.toLowerCase();
      const datasetName = item.dataset_name.toLowerCase();
  
      return datasetName.includes(searchStr);
    });
  
    return filteredList;
  }

  const updateSearch = (evt)=>{
    setSearchedString(evt.target.value);
    const updatedDataset = searchListByDatasetName(dataSets,evt.target.value);
    setFilteredDatasets(updatedDataset);
  }
 
  
  React.useEffect(()=>{
    fetchAllData();
  },[])

  
  useEffect(()=>{
    makeRequestsForUser();
},[])

const parseAndSetRows = (data)=>{
      
  const sampleObj = data[0];
  const allColumns = Object.keys(sampleObj);
  const rowsData = [];
  let i = 1;
  for(const columnName of allColumns){
      const newObj = {
        id:i,
        column_name:columnName,
        sample_data:data[0][columnName]
      }
      i++;
      rowsData.push(newObj);
  }

  setRows(rowsData);
} 

const fetchDatasetSnippet = (datasetId) =>{
  axios.get(DATASET_FETCH_DATASET_SNIPPET(datasetId))
  .then(resp => { parseAndSetRows(resp.data);})
  .catch(err => {console.log(err); blockAlert("There was a problem while fetching the snippet");})
}

const blockSuccess = (msg)=>{
  toast.success(msg,{
    duration:2000,
    position:'top-right',
  })
}


const parseAndSetData = (data)=>{
  fetchDatasetSnippet(data[0].id);
}

const handlePipelineGeneration = async()=>{
  dispatch(setIsStoredFeedbackOpen(false));
  setIsFeedbackOpen(false);
  setWasPipelineGenerated(false);
  setIsPipelineGenerating(true);
  
 
  try{
    const token = getToken();
    const email = JSON.parse(jwtDecode(token).sub).email;
    const requestObject = {
      "email" : email,
      "dataset_name": checked[0].dataset_name,
      "problem_type": problemType,
      "target_column": checkedDatasetRows[0].column_name,
      "number_of_pipelines": nrOfPipelinesSuggestions,
      "mode":"custom"
    };
    
    let resp;
    if(userFeedback.length == 0){
      resp = await axios.post(GENERATE_PIPELINE, {
        "email" : email,
        "dataset_name": checked[0].dataset_name,
        "problem_type": problemType,
        "target_column": checkedDatasetRows[0].column_name,
        "number_of_pipelines": nrOfPipelinesSuggestions,
        "with_history": "false",
        "history":"[]",
        "mode":"custom"
      });
    } else if(Object.keys(interactionHistory).length!=0) {
      const oldInteractionHistory = interactionHistory;
      oldInteractionHistory.feedback.push({
        "role": "user",
        "content": userFeedback
      });

      setInteractionHistory(oldInteractionHistory);
      resp = await axios.post(GENERATE_PIPELINE, {
        "email" : email,
        "dataset_name": checked[0].dataset_name,
        "problem_type": problemType,
        "target_column": checkedDatasetRows[0].column_name,
        "number_of_pipelines": nrOfPipelinesSuggestions,
        "with_history": "true",
        "history":JSON.stringify(oldInteractionHistory),
        "mode":"custom"
      });
       
      setUserFeedback("");
    }
     
    
    //aici trecem istoria la chat
    const parsed_response = resp.data.generated_pipeline;
    setParsedResponse(parsed_response);

    let interactionHistoryObject;
    if(Object.keys(interactionHistory).length == 0){
       interactionHistoryObject = {
        initialRequest: requestObject,
        feedback: [
          {
            "role": "assistant",
            "content" : parsed_response
          }
        ]
      } 
    } else {
      interactionHistoryObject =  interactionHistory;
      interactionHistoryObject["feedback"].push( {
        "role": "assistant",
        "content" : parsed_response
      });
    }
  
    setInteractionHistory(interactionHistoryObject);

    setTimeout(()=>{
      setIsPipelineGenerating(false);
      setWasPipelineGenerated(true);
      dispatch(setIsStoredFeedbackOpen(true));
      setIsFeedbackOpen(true);
    },3000)
    setUserFeedback("");
    const newPipelineViewResult = [];
    for(let i=0; i < parsed_response.length; i++){
      const newPipelineViewObj = [];
      if(parsed_response[i]["pre-processing-algorithm"]["Column Elimination"]){
        newPipelineViewObj.push({"Data Featuring": parsed_response[i]["pre-processing-algorithm"]["Column Elimination"]});
      }
      if(parsed_response[i]["pre-processing-algorithm"]["Standardization"]){
        newPipelineViewObj.push({"Standardization": parsed_response[i]["pre-processing-algorithm"]["Standardization"]});
      }
      if(parsed_response[i]["pre-processing-algorithm"]["Data Imputation"]){
        newPipelineViewObj.push({"Data Imputation": parsed_response[i]["pre-processing-algorithm"]["Data Imputation"]});
      }
      if(parsed_response[i]["pre-processing-algorithm"]["Normalization"]){
        newPipelineViewObj.push({"Normalization": parsed_response[i]["pre-processing-algorithm"]["Normalization"]});
      } 
      if(parsed_response[i]["pre-processing-algorithm"]["Outlier Removal"]){
        newPipelineViewObj.push({"Outlier Removal": parsed_response[i]["pre-processing-algorithm"]["Outlier Removal"]});
      }
      if(parsed_response[i]["pre-processing-algorithm"]["Log Transformation"]){
        newPipelineViewObj.push({"Log Transformation": parsed_response[i]["pre-processing-algorithm"]["Log Transformation"]});
      }
      if(parsed_response[i]["pre-processing-algorithm"]["Label Encoding"]){
        newPipelineViewObj.push({"Label Encoding": parsed_response[i]["pre-processing-algorithm"]["Label Encoding"]});
      }
      if(parsed_response[i]["pre-processing-algorithm"]["Target Encoding"]){
        newPipelineViewObj.push({"Target Encoding": parsed_response[i]["pre-processing-algorithm"]["Target Encoding"]});
      }
      if(parsed_response[i]["pre-processing-algorithm"]["One-hot Encoding"]){
        newPipelineViewObj.push({"One-hot Encoding": parsed_response[i]["pre-processing-algorithm"]["One-hot Encoding"]});
      }
      if(parsed_response[i]["ml-algorithm"]["name"]){
        newPipelineViewObj.push({"ML_Algorithm": parsed_response[i]["ml-algorithm"]["name"]});
      }
      if(parsed_response[i]["ml-algorithm"]["parameters"]){
        newPipelineViewObj.push({"ML_Algorithm": parsed_response[i]["ml-algorithm"]["parameters"]});
      }
      newPipelineViewResult.push(newPipelineViewObj); 
    }
    
    
    setPipelineDataRows(newPipelineViewResult);
    dispatch(setGeneratedPipelines(newPipelineViewResult));
  } catch(err){
    setIsPipelineGenerating(false);
    console.log(err);
    blockAlert("There was an error while generating the pipeline!");
  }
  
}


const addCorespondingNodeDataset = () =>{
    
  if(checked.length != 0){
     for(let node of nodes){
      //  if(node.nodeData.type == "Dataset"){
      //    return;
      //  } 
     }
     const newNode = {type:"Dataset"}
     dispatch(addNode(newNode))  
  } else if(checked.length == 0) {
   
    const newNodeList = [];
    for(let node of nodes){
     if(node.nodeData.type !== "Dataset"){
       newNodeList.push(node);
     } 
   }
   dispatch(setNodes(newNodeList));

  }
  
 }

 const deleteNode = ()=>{
  let newNodeList = [...nodes];
  newNodeList = newNodeList.filter((node)=> node.nodeData.type!=="Model Training");
  setTimeout(()=>{
    dispatch(setNodes(newNodeList));
  },200)
  
  setTimeout(()=>{
    dispatch(resetSelectedModelType());
  },100)

}

 const appliedMLModels = ()=>{
      
  if(checked.length!=0){
      for(const node of nodes){
        // if(node.nodeData.type == "Model Training")
        // {
        //   return;
        // }
      }
  } else {
  
    deleteNode();
  }
  const newNodePayload = {
    type:"Model Training"
  }

  dispatch(addNode(newNodePayload));
 
}


const loadUpPipelineValues = (i)=>{

  const listOfNodes = [];
  
  addCorespondingNodeDataset();
  dispatch(addDataset(checked[0]));
  
  if(parsed_response[i]["pre-processing-algorithm"]["Column Elimination"] && parsed_response[i]["pre-processing-algorithm"]["Column Elimination"].length!=0){
    
    const theResponse = parsed_response[i]["pre-processing-algorithm"]["Column Elimination"].map((resp)=>{
      return {
        "column_name":resp,
        "sample_data":""
      }
    })
    dispatch(setSelectedDataFeaturingColumns(theResponse));
    listOfNodes.push({type:"Data featuring"});
  }
  
  if(parsed_response[i]["pre-processing-algorithm"]["Standardization"] && parsed_response[i]["pre-processing-algorithm"]["Standardization"].length!=0){
    const theResponse = parsed_response[i]["pre-processing-algorithm"]["Standardization"].map((resp,index)=>{
      return {
        "column_name":resp,
        "id": index,
        "sample_data":""
      }
    })
    dispatch(setStandardizationColumns(theResponse));
    listOfNodes.push({type:"Standardization"});
  }
  

  if(parsed_response[i]["pre-processing-algorithm"]["Normalization"] && parsed_response[i]["pre-processing-algorithm"]["Normalization"].length!=0){
    const theResponse = parsed_response[i]["pre-processing-algorithm"]["Normalization"].map((resp,index)=>{
      return {
        "column_name":resp,
        "id": index,
        "sample_data":""
      }
    })
    dispatch(setNormalizationColumns(theResponse));
    listOfNodes.push({type:"Normalization"});
  }
  
  if(parsed_response[i]["pre-processing-algorithm"]["Data Imputation"] && parsed_response[i]["pre-processing-algorithm"]["Data Imputation"].length!=0){
    dispatch(setImputationAlgs(["KNN Imputation"]));
    listOfNodes.push({type:"Data Imputation"});
  }

  if(parsed_response[i]["pre-processing-algorithm"]["Target Encoding"] && parsed_response[i]["pre-processing-algorithm"]["Target Encoding"].length!=0){
    const theResponse = parsed_response[i]["pre-processing-algorithm"]["Target Encoding"].map((resp,index)=>{
      return {
        "column_name":resp,
        "id": index,
        "type":"target"
      }
    })
    dispatch(setTargetEncodingColumns(theResponse));
    listOfNodes.push({type:"Feature Encoding"});
  }
  
  if(parsed_response[i]["pre-processing-algorithm"]["Label Encoding"] && parsed_response[i]["pre-processing-algorithm"]["Label Encoding"].length!=0){
    const theResponse = parsed_response[i]["pre-processing-algorithm"]["Label Encoding"].map((resp,index)=>{
      return {
        "column_name":resp,
        "id": index,
        "type":"label"
      }
    })
    dispatch(setLabelEncodingColumns(theResponse));

    listOfNodes.push({type:"Feature Encoding"});
  }

  if(parsed_response[i]["pre-processing-algorithm"]["One-hot Encoding"] && parsed_response[i]["pre-processing-algorithm"]["One-hot Encoding"].length!=0){
    const theResponse = parsed_response[i]["pre-processing-algorithm"]["One-hot Encoding"].map((resp,index)=>{
      return {
        "column_name":resp,
        "id": index,
        "type":"target"
      }
    })
    dispatch(setOneHotEncodingColumnsReducer(theResponse));
    listOfNodes.push({type:"Feature Encoding"});
  }
  
  if(parsed_response[i]["pre-processing-algorithm"]["Log Transformation"] && parsed_response[i]["pre-processing-algorithm"]["Log Transformation"].length != 0){

    const theResponse = parsed_response[i]["pre-processing-algorithm"]["Log Transformation"].map((resp,index)=>{
      return {
        "column_name":resp,
        "id": index,
        "type":"target"
      }
    })
    
    dispatch(setLogTransformationColumns(theResponse));
    listOfNodes.push({type:"Log Transformation"});
  }
  
  if(parsed_response[i]["pre-processing-algorithm"]["Outlier Removal"] && parsed_response[i]["pre-processing-algorithm"]["Outlier Removal"].length!=0){

    const theResponse = parsed_response[i]["pre-processing-algorithm"]["Outlier Removal"].map((resp,index)=>{
      return {
        "column_name":resp,
        "id": index,
        "sample_data":""
      }
    })

    dispatch(setOutlierRemovalColumns(theResponse));
    listOfNodes.push({type:"Outlier Removal"});

    

  }

 for(let node of listOfNodes){
    dispatch(addNode(node));
 }


  dispatch(setMLAlgorithmParameters(parsed_response[i]["ml-algorithm"]["parameters"]));
  dispatch(setSelectedModelType(parsed_response[i]["ml-algorithm"]["name"]));
  appliedMLModels();
  
  dispatch(setMLAlgorithmTarget({
    model_name: parsed_response[i]["ml-algorithm"]["name"],
    target_column : {"column_name": checkedDatasetRows[0].column_name}
  }));
  

  blockSuccess("The pipeline was successfully loaded!");

  setTimeout(()=>{
    parseAndSetEdges(i);
  },500)

}

const returnIndexOfAlg = (algType)=>{

  if(algType === "Column Elimination"){
    return 'node-2';
  } else if(algType === "Normalization"){
    return 'node-3';
  } else if(algType === "Standardization"){
    return 'node-3';
  } else if(algType === "Data Imputation"){
    return 'node-4';
  } else if(algType === "Outlier Removal"){
    return 'node-6';
  } else if(algType === "Log Transformation"){
    return 'node-7';
  } else if (algType === "Label Encoding" || algType === "Target Encoding" || algType === "One-hot Encoding"){
    return 'node-8';
  }

}

const parseAndSetEdges = (i)=>{


   const allEdgesToSet = [];
   let initialLength = 2;
   initialLength+= Object.keys(parsed_response[i]["pre-processing-algorithm"]).length;

  const allPreProcesingAlgs = Object.keys(parsed_response[i]["pre-processing-algorithm"]);

  let lastNode = '';
  const nodesSet = new Set([]);
  allPreProcesingAlgs.forEach((value, index)=>{
    if(index == 0){
      allEdgesToSet.push({source: 'node-1', sourceHandle: 'b', target: returnIndexOfAlg(value), targetHandle: 'a'});
      nodesSet.add(returnIndexOfAlg(value));
      lastNode = returnIndexOfAlg(value);
    } else {
      if(nodesSet.has(returnIndexOfAlg(value))){
        return;
      } else {
        allEdgesToSet.push({source: lastNode, sourceHandle: 'b', target: returnIndexOfAlg(value), targetHandle: 'a'});          
        nodesSet.add(returnIndexOfAlg(value));
        lastNode = returnIndexOfAlg(value);
      }
    }
  });
   
  allEdgesToSet.push({source: lastNode, sourceHandle: 'b', target: 'node-5', targetHandle: 'a'});
 
  dispatch(setSpawnedPipelineEdges(allEdgesToSet));

}

const generateProblemsSuggestions = async()=>{
  let resp;
  const token = getToken();
  const email = JSON.parse(jwtDecode(token).sub).email;
  try{  
    resp = await axios.post(GENERATE_PIPELINE, {
      "email" : email,
      "dataset_name": checked[0].dataset_name,
      "problem_type": "",
      "target_column": "",
      "number_of_pipelines": nrOfPipelinesSuggestions,
      "with_history": "false",
      "history":"[]",
      "mode":"guided"
    });
  
    setTimeout(()=>{
      setAreSuggestionsGenerating(false);
    },1000)
    console.log("resp:");
    console.log(resp);
    setSuggestions(resp["data"]["generated_pipeline"])

  } catch(err){
    console.log(err);
    setTimeout(()=>{
      blockAlert("There was a problem while generating suggestions");
      setAreSuggestionsGenerating(false);
    },1000)
  }

  
}


const loadUpThePipeline = (index)=>{

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

  setTimeout(()=>{
   
    loadUpPipelineValues(index);
  },500)

} 

useEffect(()=>{
  if(checked.length != 0){
    parseAndSetData(checked);
    setDisplayGenerationOptions(true);
  } else {
    setDisplayGenerationOptions(false);
  }

},[checked])


// in acest useEffect ce facem este ca daca avem ceva stocat legat de ceea ce tine de
// partea de selectie a unui dataset plus de ce fel de problema vrem sa rezolvam sau
// ce coloana de target am folosit
useEffect(()=>{
  if(storedNumberOfPipelinesToGenerate!=0){
    setNumberOfPipelineSuggestions(storedNumberOfPipelinesToGenerate);
  }
  if(storedGeneratedPipelines && storedGeneratedPipelines.length != 0){
    setWasPipelineGenerated(true);
    setPipelineDataRows(storedGeneratedPipelines);
  }
  if(selectedTargetColumnGeneration){
    
    setCheckedDatasetRows(selectedTargetColumnGeneration);
  }   
  if(selectedProblemTypeGeneration.length != 0){
    
    setProblemType(selectedProblemTypeGeneration);
  }


  if(selectedDatasetGeneration.length!=0){
    setChecked(selectedDatasetGeneration);
  }

},[storedNumberOfPipelinesToGenerate, storedGeneratedPipelines,selectedProblemTypeGeneration, selectedDatasetGeneration])
      

 const handleGeneratedSuggestedPipeline = async(the_target_columns, suggested_problem_type)=>{
  if(the_target_columns.includes(suggestedTargetColumn) || suggested_problem_type == "clustering"){
    if(suggestedTargetColumn){
      const selectSuggestedTargetColumn = {
        column_name: suggestedTargetColumn
      };
      
      const findTheRow = rows.find((the_row)=> the_row.column_name === suggestedTargetColumn);

      setNumberOfPipelinesToGenerate(1);
      setCustomMode(true);
      setProblemType(suggested_problem_type);
      setSelectedMode("custom");
      setCheckedDatasetRows([findTheRow]);
      setInteractionHistory({});
      setPipelineDataRows([]);

      setWasPipelineGenerated(false);
      dispatch(setGeneratedPipelines([]));
      dispatch(setNumberOfPipelinesToGenerate(1));
      dispatch(setSelectedProblemTypeGeneration(suggested_problem_type));
      dispatch(setSelectedTargetColumnGeneration([findTheRow]));
      dispatch(setStoredModeSelected("custom"))
    }
  } else {
    blockAlert("Please select a target column for the dataset");
  }
 }

    return(<div>
        <div className="back-arrow" onClick={()=>{navigate("/pipelines")}}>
            <FontAwesomeIcon icon={faCircleLeft} />
        </div>
        <div className="page-title-generate-pipeline"> Automatic Pipeline Generation</div>
      
        <img src={AILogo} className="generate-pipeline-logo"/>
        <h2>Select a dataset</h2>
        <ThemeProvider theme={darkTheme}>

      <Box width="95%" style={{"margin":"auto"}}>
            
        {
                dataSetSearch &&
                <Paper
                  component="form"
                  onSubmit={(evt)=>{evt.preventDefault()}}
                  sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: "100%" }}
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
              
              } 
              { !isDataLoading &&
                dataSetSearch &&
                   <List dense sx={{ width: '100%', color:"#fff", bgcolor: '#242424', marginTop:"10px", borderRadius:"10px", marginBottom:"10px" }}>
                     <ListItem
                        key={"my-key"}
                        secondaryAction={
                          <div className='dataset-select-toolbox'>
                            <p>Select</p>
                            <p>More Info</p>
                          </div>
                        }
                        disablePadding
                        sx={{
                         padding:"15px",
                         pointerEvents:"none"
                        }}
                      >
                        <ListItemButton>
                          
                          <ListItemText  id={'fd3432'}  disableTypography
                          primary={<Typography variant="body2" style={{ color: '#FFFFFF',fontSize:"1.3rem" }}>Dataset Name</Typography>} />
                        </ListItemButton>
                      </ListItem>
                  

                   { filteredDatasets.map((value,index) => {
                     const labelId = `checkbox-list-secondary-label-${value}`;
                      return (
                        <ListItem
                          key={value.id}
                          secondaryAction={
                            <div className='dataset-select-toolbox'>
                              <Checkbox
                                edge="end"
                                onChange={handleToggle(value)}
                                checked={checked.some(item => item.dataset_name === value.dataset_name)}
                                inputProps={{ 'aria-labelledby': labelId }}
                              />
                              <Button variant="outlined" onClick={()=>{navigate(`/dataset-info?dataset_id=${value.id}`)}}>Info</Button>
                            </div>
                          } 
                          disablePadding
                        > 
                          <ListItemButton>
                            <ListItemAvatar>
                              <p className='select-dialog-list'><FontAwesomeIcon style={{"color":"#fff"}} icon={faDatabase}/></p> 
                            </ListItemAvatar>
                            <ListItemText  id={labelId}  disableTypography
                            primary={<Typography variant="body2" style={{ color: '#FFF',fontSize:"1.3rem" }}>{value.dataset_name}</Typography>} />
                          </ListItemButton>
                        </ListItem>
                      );
                     
                    
                   })}
                 </List>
              }

              { 
                !dataSetSearch &&
                <DataSetInfo handleDisplayDataSetInfo={handleDisplayDataSetInfo} selectedDatasetId={selectedDatasetId} selectedDatasetName={selectedDatasetName}/>
              }
             
             
            </Box>    
          </ThemeProvider>
          
          <div className="mode-selection-container">
             <p className="mode-selection-container-title">Mode Selection</p>
             <FormControl>
                  <FormLabel id="mode-radio-buttons-group-label">Select Mode</FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="mode-radio-buttons-group-label"
                    defaultValue="guided"
                    name="radio-buttons-group"
                    value={selectedMode}
                    onChange={(evt)=>{ if(evt.target.value == "custom") { dispatch(setStoredModeSelected("custom")); setCustomMode(true)} else { dispatch(setStoredModeSelected("guided")); setCustomMode(false)} setSelectedMode(evt.target.value);}}
                  >
                    <FormControlLabel value="custom" control={<Radio />} label="Custom" />
                    <FormControlLabel value="guided" control={<Radio />} label="Guided" />
                    
                  </RadioGroup>
              </FormControl>
              <div className="pipeline-generate-info-box">
                    <div className="feedback-box-container-info-title"><InfoIcon sx={{mt:"20px", fontSize:"1.6rem"}}/></div> <span style={{"color":"blue", fontWeight:"bold"}}>Custom Mode:</span> The user has full control over the pipeline generation ( the target column, problem type and number of pipelines are selected by user)
                    <br/>
                    <br/>
                    <span style={{"color":"green", fontWeight:"bold"}}>Guided Mode:</span> The user selects the dataset and the LLM presents what can you do with the data and suggests a pipeline.
              </div>
          </div>

        {
            customMode ? 
            <>
               {displayGenerationOptions &&
          <>
                <div 
                className="problem-type-pipeline"
                >
                    <FormControl>
                          <FormLabel id="demo-radio-buttons-group-label">Problem type</FormLabel>
                          <RadioGroup
                            row
                            aria-labelledby="demo-radio-buttons-group-label"
                            defaultValue="female"
                            name="radio-buttons-group"
                            value={problemType}
                            onChange={(evt)=>{ setInteractionHistory({}); setProblemType(evt.target.value); dispatch(setSelectedProblemTypeGeneration(evt.target.value))}}
                          >
                            <FormControlLabel value="classification" control={<Radio />} label="Classification" />
                            <FormControlLabel value="regression" control={<Radio />} label="Regression" />
                            <FormControlLabel value="clustering" control={<Radio />} label="Clustering" />
                          </RadioGroup>
                      </FormControl>
                </div>
                
                <div className="number-of-pipelines-section-title">
                          Select Number of Pipeline Suggestions
                    <div>
                      <CustomNumberInput  value={nrOfPipelinesSuggestions} onChange={(event,value)=>{ setInteractionHistory({}); setNumberOfPipelineSuggestions(value); dispatch(setNumberOfPipelinesToGenerate(value))}} sx={{width:"30%", mx:"auto", mt:"20px", mb:"10px"}} aria-label="Demo number input" placeholder="Type a number…" min={1} max={5} />
                    </div>
                </div>
              
                <div className="target-column-select-section-title-container">
                    <p className="target-column-select-section-title"> Select Target Column </p>
                  
                </div>
                <ThemeProvider theme={darkTheme}>
              
                <Box sx={{ minHeight: 400, width: '90%', margin:"auto",borderRadius:"5px" }}  bgcolor="black" >
                <List>
                {rows.map((value) => {
                              const labelId = `checkbox-list-secondary-label-${value}`;
                              
                                return (
                                  <ListItem
                                    key={value.id}
                                    secondaryAction={
                                      <div className='dataset-select-toolbox'>
                                        <Checkbox
                                          edge="end"
                                          onChange={handleToggleTargetCol(value)}
                                          checked={checkedDatasetRows.some(item => item.column_name === value.column_name)}
                                          inputProps={{ 'aria-labelledby': labelId }}
                                        />
                                        
                                      </div>
                                    }
                                    disablePadding
                                  > 
                                    <ListItemButton>
                                      <ListItemText  id={labelId}  disableTypography
                                      primary={<Typography variant="body2" style={{ color: '#FFFFFF',fontSize:"1.3rem", padding:"10px" }}>{value.column_name}</Typography>} />
                                    </ListItemButton>
                                  </ListItem>
                                );
                              
                            })}
                            </List>
                </Box>
                      
                      
                </ThemeProvider>
            
            
          </> }
        
             {
               isPipelineGenerating &&
               <div className="pipeline-generating-img">
                <img src={LoadingPipeline} style={{"borderRadius":"10px", width:"100%"}} />
                <div className="overlay">Generating pipeline(s)...</div>
              </div>
             } 
             {isFeedBackOpen &&
             <div className="feedback-box-container">
              <div className="feedback-box-container-title">Re-generate pipeline with feedback</div>
                <TextField
                    id="outlined-multiline-static"
                    label="Feedback"
                    multiline
                    rows={4}
                    defaultValue=""
                    variant="outlined"
                    onChange={(evt)=>{ setUserFeedback(evt.target.value)}}
                    sx={{mt:"20px", mb:"20px", width:"60%", bgcolor:"#fff"}}
                  />
                  <div className="pipeline-generate-info-box">
                    <div className="feedback-box-container-info-title"><InfoIcon sx={{mt:"20px", fontSize:"1.6rem"}}/></div> In the textbox above you can specify some suggestions that will be feed
                    into the LLM for the next pipeline generation. Plase be specific and provide clear instructions
                    for the results to be accurate!
                  </div>
             </div>    
             }
            
             {
              !isPipelineGenerating && <div>
                 <Button disabled={!displayGenerationOptions || checkedDatasetRows.length == 0 || problemType.length == 0} onClick={()=>{ handlePipelineGeneration();}} variant="contained" style={{ "marginLeft":"20px", "marginBottom":"50px", "marginTop":"50px"}}>Generate</Button>
                 </div>
             }

             {
              wasPipelineGenerated && !isPipelineGenerating &&
          <div className="generated-pipelines-cards-container">
            <h1>Generated Pipelines</h1>  
            {  pipelineDataRows.map((pipeline, index)=>{
              return(
                <div className="card" key={'i912'}>
                      <div className="card-header">
                          <img src={PipelineImage} width="150px" style={{"padding":"10px"}}/>
                          <div className="saved-pipelines-card-title">{`Generated pipeline no #${index+1}`}</div>
                      </div>
                      <ThemeProvider theme={theme}>
                        <Accordion  style={{"width":"80%", "margin":"auto" ,"borderRadius":"10px"}}>
                                <AccordionSummary
                                expandIcon={<ExpandMoreIcon style={{"color":"#fff"}} />}
                                aria-controls="panel1-content"
                                id="panel1-header"
                                >
                                Details
                                </AccordionSummary>
                                <AccordionDetails>
                              
                              <Paper sx={{ width: '100%',marginTop:"30px", overflow: 'hidden' }}>
                                <TableContainer sx={{ maxHeight: 940 }}>
                                    <Table stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        <TableRow>
                                        {columns.map((column) => (
                                            <TableCell
                                            key={column.id}
                                            align={column.align}
                                            style={{ minWidth: column.minWidth }}
                                            >
                                            {column.label}
                                            </TableCell>
                                        ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {pipeline
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row) => {
                                            
                                            return (
                                            <TableRow hover role="checkbox" tabIndex={-1} key={uuidv4()}>
                                                <TableCell key={uuidv4()} >
                                                    {Object.keys(row)[0]}   
                                                  </TableCell>
                                                  <TableCell key={uuidv4()} >
                                                    {JSON.stringify(row[Object.keys(row)[0]])}   
                                                  </TableCell>
                                            </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>

                                    </AccordionDetails>
                                </Accordion>
                          </ThemeProvider>
                      
              
                          
                        <div className="card-model-footer">
                            <Button variant="contained" onClick={()=>{loadUpThePipeline(index) }}>Use This Pipeline</Button>
                          
                        </div>
                    </div>  
              );
            })}
              
              </div> 
             }
            
            </> :
            <div>
              {!areSuggestionsGenerating &&
                <div className="card-model-footer">
                  <Button variant="contained" onClick={()=>{generateProblemsSuggestions(); setAreSuggestionsGenerating(true)}}  disabled={checked.length == 0} >Generate  Suggestions</Button>
                </div>
              }
               
              {areSuggestionsGenerating && 
                <div className="pipeline-generating-img">
                  <img src={LoadingPipeline} style={{"borderRadius":"10px", width:"100%"}} />
                  <div className="overlay">Generating suggestions...</div>
                </div>
              }
              
              {
                wereSuggestionsGenerated && !areSuggestionsGenerating &&
                <>
                {
                  suggestions.map((sugestion , index)=>{
                    return(
                    <div className="suggestions-box-container">
                      <div className="suggestions-box-container-title"> Possible actions </div>
                          <div className="suggestions-box-card">
                              <div className="suggestions-box-card-title"> {capitalizeFirstLetter(sugestion["problem_type"])} </div>
                              <div className="suggestions-box-card-body">
                                { sugestion["clusters"] && sugestion["clusters"].length!=0 ?
                                  <div>
                                       <p className="target-columns-title"> Possible target columns </p>
                                          {sugestion["clusters"].map((col)=>{
                                            return(
                                              <p className="generated-col-element">{col}</p>
                                            )
                                          })}
                                  </div>
                                  :
                                  <>
                                    <p className="target-columns-title"> Possible target columns </p>
                                         
                                    <FormControl sx={{marginBottom:"20px"}}>
                                            <RadioGroup
                                              aria-labelledby="demo-radio-buttons-group-label"
                                              defaultValue=""
                                              name={`radio-buttons-group-${index}`}
                                              value={suggestedTargetColumn}
                                              className=""
                                              onChange={(evt)=>{ setSuggestedTargetColumn(evt.target.value) }}
                                            >
                                              {sugestion["target_columns"].map((col)=>{
                                                  return(
                                                    <FormControlLabel value={col} control={<Radio />} label={col} />
                                                  )
                                                })}
                                            </RadioGroup>
                                    </FormControl> 
                                  </>
                                
                                }
                                  
                              </div>
                                  <div className="suggestions-box-card-footer">
                                      <Button variant="contained" style={{marginBottom:"20px"}} onClick={()=>{ handleGeneratedSuggestedPipeline(sugestion["target_columns"], sugestion["problem_type"]) }}>Generate Pipeline</Button>                                   
                                  </div>
                          </div>
                      </div>
                    );
                  })
                }
                
                </>
                
              }

            </div>

        }
         
        <Toaster/>  
    </div>
    )
}


const blue = {
  100: '#DAECFF',
  200: '#80BFFF',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E5',
  700: '#0059B2',
};

const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025',
};

const StyledInputRoot = styled('div')(
  ({ theme }) => `
  font-family: 'IBM Plex Sans', sans-serif;
  font-weight: 400;
  border-radius: 8px;
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
  box-shadow: 0px 2px 4px ${
    theme.palette.mode === 'dark' ? 'rgba(0,0,0, 0.5)' : 'rgba(0,0,0, 0.05)'
  };
  display: grid;
  grid-template-columns: 1fr 19px;
  grid-template-rows: 1fr 1fr;
  overflow: hidden;
  column-gap: 8px;
  padding: 4px;

  &.${numberInputClasses.focused} {
    border-color: ${blue[400]};
    box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[700] : blue[200]};
  }

  &:hover {
    border-color: ${blue[400]};
  }

  // firefox
  &:focus-visible {
    outline: 0;
  }
`,
);

const StyledInputElement = styled('input')(
  ({ theme }) => `
  font-size: 0.875rem;
  font-family: inherit;
  font-weight: 400;
  line-height: 1.5;
  grid-column: 1/2;
  grid-row: 1/3;
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  background: inherit;
  border: none;
  border-radius: inherit;
  padding: 8px 12px;
  outline: 0;
`,
);

const StyledButton = styled('button')(
  ({ theme }) => `
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  appearance: none;
  padding: 0;
  width: 19px;
  height: 19px;
  font-family: system-ui, sans-serif;
  font-size: 0.875rem;
  line-height: 1;
  box-sizing: border-box;
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border: 0;
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 120ms;

  &:hover {
    background: ${theme.palette.mode === 'dark' ? grey[800] : grey[50]};
    border-color: ${theme.palette.mode === 'dark' ? grey[600] : grey[300]};
    cursor: pointer;
  }

  &.${numberInputClasses.incrementButton} {
    grid-column: 2/3;
    grid-row: 1/2;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    border: 1px solid;
    border-bottom: 0;
    border-color: ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
    background: ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};
    color: ${theme.palette.mode === 'dark' ? grey[200] : grey[900]};

    &:hover {
      cursor: pointer;
      color: #FFF;
      background: ${theme.palette.mode === 'dark' ? blue[600] : blue[500]};
      border-color: ${theme.palette.mode === 'dark' ? blue[400] : blue[600]};
    }
  }

  &.${numberInputClasses.decrementButton} {
    grid-column: 2/3;
    grid-row: 2/3;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    border: 1px solid;
    border-color: ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
    background: ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};
    color: ${theme.palette.mode === 'dark' ? grey[200] : grey[900]};
  }

  &:hover {
    cursor: pointer;
    color: #FFF;
    background: ${theme.palette.mode === 'dark' ? blue[600] : blue[500]};
    border-color: ${theme.palette.mode === 'dark' ? blue[400] : blue[600]};
  }

  & .arrow {
    transform: translateY(-1px);
  }

  & .arrow {
    transform: translateY(-1px);
  }
`,
);

export default GeneratePipelines;