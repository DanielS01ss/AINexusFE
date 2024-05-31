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
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { GET_SAVED_PIPELINES } from "../../../utils/apiEndpoints";
import Box from '@mui/material/Box';
import styles from "./GeneratePipelines.css";
import {addNode, setFeatureEncodingColumns, addDataset, setNodes, clearDataset, resetSelectedModelType, removeDataFeaturingColumns, setNormalizationColumns, setStandardizationColumns, setImputationAlgs,setConstantValueImputationColumns, setStoredConstantValueImputationValues, setMappedEdges,setMLAlgorithmTarget, setEdgeToDelete, setMappedNodes, setMLAlgorithmParameters, setSelectedModelType, setSelectedDataFeaturingColumns, setLogTransformationColumns, setOutlierRemovalColumns } from "../../../reducers/nodeSlice";
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
import { setTargetEncodingColumns, setOneHotEncodingColumnsReducer, setLabelEncodingColumns} from "../../../reducers/nodeSlice";
import { v4 as uuidv4 } from 'uuid';

const GeneratePipelines = ()=>{

    const dispatch = useDispatch();
    const nodes = useSelector((state)=>state.nodes);
    const dataset = useSelector((state)=>state.selectedDataset);
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
    setChecked(newChecked);
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

    setCheckedDatasetRows(newChecked);
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
    }).catch(err => {console.log(err); setIsDataLoading(false)})
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

  const addCorespondingDataset = ()=>{
  

    if(dataset.length == 0){
      dispatch(addDataset(checked[0]));
      return;
    }
   
    if(dataset.length !=0 && dataset[0].dataset_name != checked[0].dataset_name)
    {
      dispatch(addDataset(checked[0]));
    }
       
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
  .catch(err => {console.log(err)})
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
  setWasPipelineGenerated(false);
  setIsPipelineGenerating(true);

  
  try{
    const resp = await axios.post(GENERATE_PIPELINE, {
      "dataset_name": checked[0].dataset_name,
      "problem_type": problemType,
      "target_column": checkedDatasetRows[0].column_name
    });
    
    const parsed_response = resp.data.generated_pipeline;
    
    setParsedResponse(parsed_response);

    setTimeout(()=>{
      setIsPipelineGenerating(false);
      setWasPipelineGenerated(true);
    },3000)
     
    const newPipelineViewObj = [];
    if(parsed_response["pre-processing-algorithm"]["Column Elimination"]){
      newPipelineViewObj.push({"Data Featuring": parsed_response["pre-processing-algorithm"]["Column Elimination"]});
    }
    if(parsed_response["pre-processing-algorithm"]["Standardization"]){
      newPipelineViewObj.push({"Standardization": parsed_response["pre-processing-algorithm"]["Standardization"]});
    }
    if(parsed_response["pre-processing-algorithm"]["Data Imputation"]){
      newPipelineViewObj.push({"Data Imputation": parsed_response["pre-processing-algorithm"]["Data Imputation"]});
    }
    if(parsed_response["pre-processing-algorithm"]["Normalization"]){
      newPipelineViewObj.push({"Normalization": parsed_response["pre-processing-algorithm"]["Normalization"]});
    } 
    if(parsed_response["pre-processing-algorithm"]["Outlier Removal"]){
      newPipelineViewObj.push({"Outlier Removal": parsed_response["pre-processing-algorithm"]["Outlier Removal"]});
    }
    if(parsed_response["pre-processing-algorithm"]["Log Transformation"]){
      newPipelineViewObj.push({"Log Transformation": parsed_response["pre-processing-algorithm"]["Log Transformation"]});
    }
    if(parsed_response["pre-processing-algorithm"]["Label Encoding"]){
      newPipelineViewObj.push({"Label Encoding": parsed_response["pre-processing-algorithm"]["Label Encoding"]});
    }
    if(parsed_response["pre-processing-algorithm"]["Target Encoding"]){
      newPipelineViewObj.push({"Target Encoding": parsed_response["pre-processing-algorithm"]["Target Encoding"]});
    }
    if(parsed_response["pre-processing-algorithm"]["One-hot Encoding"]){
      newPipelineViewObj.push({"One-hot Encoding": parsed_response["pre-processing-algorithm"]["One-hot Encoding"]});
    }
    if(parsed_response["ml-algorithm"]["name"]){
      newPipelineViewObj.push({"ML_Algorithm": parsed_response["ml-algorithm"]["name"]});
    }
    if(parsed_response["ml-algorithm"]["parameters"]){
      newPipelineViewObj.push({"ML_Algorithm": parsed_response["ml-algorithm"]["parameters"]});
    }
    
    setPipelineDataRows(newPipelineViewObj);
  } catch(err){
    setIsPipelineGenerating(false);
    console.log(err);
    blockAlert("There was an error while generating the pipeline!");
  }
  
}


const addCorespondingNodeDataset = () =>{
    
  if(checked.length != 0){
     for(let node of nodes){
       if(node.nodeData.type == "Dataset"){
         return;
       } 
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
        if(node.nodeData.type == "Model Training")
        {
          return;
        }
      }
  } else {
  
    deleteNode();
  }
  const newNodePayload = {
    type:"Model Training"
  }

  dispatch(addNode(newNodePayload));
 
}


const loadUpPipelineValues = ()=>{

  const listOfNodes = [];

  if(parsed_response["pre-processing-algorithm"]["Column Elimination"] && parsed_response["pre-processing-algorithm"]["Column Elimination"].length!=0){
    
    const theResponse = parsed_response["pre-processing-algorithm"]["Column Elimination"].map((resp)=>{
      return {
        "column_name":resp,
        "sample_data":""
      }
    })
    dispatch(setSelectedDataFeaturingColumns(theResponse));
    listOfNodes.push({type:"Data featuring"});
  }
  
  if(parsed_response["pre-processing-algorithm"]["Standardization"] && parsed_response["pre-processing-algorithm"]["Standardization"].length!=0){
    const theResponse = parsed_response["pre-processing-algorithm"]["Standardization"].map((resp,index)=>{
      return {
        "column_name":resp,
        "id": index,
        "sample_data":""
      }
    })
    dispatch(setStandardizationColumns(theResponse));
    listOfNodes.push({type:"Standardization"});
  }
  

  if(parsed_response["pre-processing-algorithm"]["Normalization"] && parsed_response["pre-processing-algorithm"]["Normalization"].length!=0){
    const theResponse = parsed_response["pre-processing-algorithm"]["Normalization"].map((resp,index)=>{
      return {
        "column_name":resp,
        "id": index,
        "sample_data":""
      }
    })
    dispatch(setNormalizationColumns(theResponse));
    listOfNodes.push({type:"Normalization"});
  }
  
  if(parsed_response["pre-processing-algorithm"]["Data Imputation"] && parsed_response["pre-processing-algorithm"]["Data Imputation"].length!=0){
    dispatch(setImputationAlgs(["KNN Imputation"]));
    listOfNodes.push({type:"Data Imputation"});
  }

  if(parsed_response["pre-processing-algorithm"]["Target Encoding"] && parsed_response["pre-processing-algorithm"]["Target Encoding"].length!=0){
    const theResponse = parsed_response["pre-processing-algorithm"]["Target Encoding"].map((resp,index)=>{
      return {
        "column_name":resp,
        "id": index,
        "type":"target"
      }
    })
    dispatch(setTargetEncodingColumns(theResponse));
    listOfNodes.push({type:"Feature Encoding"});
  }
  
  if(parsed_response["pre-processing-algorithm"]["Label Encoding"] && parsed_response["pre-processing-algorithm"]["Label Encoding"].length!=0){
    const theResponse = parsed_response["pre-processing-algorithm"]["Label Encoding"].map((resp,index)=>{
      return {
        "column_name":resp,
        "id": index,
        "type":"label"
      }
    })
    dispatch(setLabelEncodingColumns(theResponse));

    listOfNodes.push({type:"Feature Encoding"});
  }

  if(parsed_response["pre-processing-algorithm"]["One-hot Encoding"] && parsed_response["pre-processing-algorithm"]["One-hot Encoding"].length!=0){
    const theResponse = parsed_response["pre-processing-algorithm"]["One-hot Encoding"].map((resp,index)=>{
      return {
        "column_name":resp,
        "id": index,
        "type":"target"
      }
    })
    dispatch(setOneHotEncodingColumnsReducer(theResponse));
    listOfNodes.push({type:"Feature Encoding"});
  }
  
  if(parsed_response["pre-processing-algorithm"]["Log Transformation"] && parsed_response["pre-processing-algorithm"]["Log Transformation"].length != 0){
    dispatch(setLogTransformationColumns(parsed_response["pre-processing-algorithm"]["Log Transformation"]));
    listOfNodes.push({type:"Log Transformation"});
  }
  
  if(parsed_response["pre-processing-algorithm"]["Outlier Removal"] && parsed_response["pre-processing-algorithm"]["Outlier Removal"].length!=0){

    const theResponse = parsed_response["pre-processing-algorithm"]["Outlier Removal"].map((resp,index)=>{
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

 addCorespondingNodeDataset();
 dispatch(addDataset(checked[0]));
 dispatch(setMLAlgorithmTarget({
  model_name: parsed_response["ml-algorithm"]["name"],
  target_column : {"column_name": checkedDatasetRows[0].column_name}
 }));
 dispatch(setMLAlgorithmParameters(parsed_response["ml-algorithm"]["parameters"]));
 dispatch(setSelectedModelType(parsed_response["ml-algorithm"]["name"]));
 appliedMLModels();
 blockSuccess("The pipeline was successfully loaded!");
}

const loadUpThePipeline = ()=>{

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
   
    loadUpPipelineValues();
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
                                checked={checked.indexOf(value) !== -1}
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
                            onChange={(evt)=>{setProblemType(evt.target.value)}}
                          >
                            <FormControlLabel value="classification" control={<Radio />} label="Classification" />
                            <FormControlLabel value="regression" control={<Radio />} label="Regression" />
                            <FormControlLabel value="clustering" control={<Radio />} label="Clustering" />
                          </RadioGroup>
                      </FormControl>
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
                                          checked={checkedDatasetRows.indexOf(value) !== -1}
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
        
              {/* {isDataLoading && 
                <div class="spinner-container">
                    <div class="spinner"></div>
                </div>
              } */}
             {
               isPipelineGenerating &&
               <div className="pipeline-generating-img">
                <img src={LoadingPipeline} style={{"borderRadius":"10px"}} />
                <div className="overlay">Generating pipeline...</div>
              </div>
             } 

             {
              !isPipelineGenerating &&  <Button disabled={!displayGenerationOptions || checkedDatasetRows.length == 0 || problemType.length == 0} onClick={()=>{ handlePipelineGeneration();}} variant="contained" style={{"marginBottom":"50px", "marginTop":"50px"}}>Generate</Button>
             }

             {
              wasPipelineGenerated && 
            <div className="card" key={'i912'}>
              <div className="card-header">
                  <img src={PipelineImage} width="150px" style={{"padding":"10px"}}/>
                  <div className="saved-pipelines-card-title">{'The generated pipeline'}</div>
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
                              {pipelineDataRows
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
                            <Button variant="contained" onClick={()=>{loadUpThePipeline() }}>Use This Pipeline</Button>
                          
                        </div>
                    </div>   
             }
            
        <Toaster/>  
    </div>
    )
}

export default GeneratePipelines;