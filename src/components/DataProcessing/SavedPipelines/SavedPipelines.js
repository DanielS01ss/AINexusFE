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
import { GET_SAVED_PIPELINES, DELETE_PIPELINE } from "../../../utils/apiEndpoints";
import AreYouSure from "../dialogs/AreYouSure/AreYouSure";
import InputBase from '@mui/material/InputBase';
import styles from "./SavedPipelines.css";
import SearchIcon from '@mui/icons-material/Search';
import { v4 as uuidv4 } from 'uuid';
import Accordion from '@mui/material/Accordion';
import Alert from '@mui/material/Alert';
import MenuIcon from '@mui/icons-material/Menu';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Divider from '@mui/material/Divider';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PipelineImage from "../../../assets/images/pipeline-logo.png";
import IconButton from '@mui/material/IconButton';
import { setNodes, addDataset,setSelectedModelType, setSelectedDataFeaturingColumns,setNormalizationColumns,setStandardizationColumns,setImputationAlgs,setMappedNodes,setConstantValueImputationColumns,setStoredConstantValueImputationValues, setMappedEdges, setMLAlgorithmTarget,setMLAlgorithmParameters} from "../../../reducers/nodeSlice";
import { useDispatch } from "react-redux";

const SavedPipelines = ()=>{


    const [allPipelines, setAllPipelines] = useState([]);
    const [loading, setIsLoading] = useState(true);
    const [alertSuccessMessage, setAlertSuccessMessage] = useState("");
    const [alertSuccess, setAlertSuccess] = useState(false);
    const [snippet, setsnippet] = useState([]);
    const [areYouSure, setAreYouSure] = useState(false);
    const [pipelineToDelete, setPipelineToDelete] = useState("");
    const [filteredPipelines, setFilteredPipelines] = useState([]);
    const dispatch = useDispatch();

    const navigate = useNavigate();
    const darkTheme = createTheme({
      palette: {
        mode: 'dark',
      },
    });

    const [columns, setColumns] = useState([]);

    function createData(
      name,
      code,
      population,
      size
    ) {
      const density = population / size;
      return { name, code, population, size, density };
    }

    
    const [rows,setRows] = useState({"my-pipeline":[
      {"Number of Nodes":10 },
      {"Nodes": "Normalization, Standardization, Imputation"},
      {"Dataset": "heart_failure"},
      {"Constant Value Imputation Columns":"id, time"},
      {"Constant Value Imputation Values":"id, time"},
      {"Imputation Algorithms":"KNN Imputation"},
      {"Standardization Columns": "id, time"},
      {"Normalization Columns": "id, time"},
      {"ML Algorithm": "Random Forest"},
      {"ML Algorithm Parameters" : "{tree_depth:20}"},
    ]}
    );

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const searchListByPipelineName = (list, str)=> {
    
      const filteredList = list.filter(item => {
        const searchStr = str.toLowerCase();
        const datasetName = item[1].toLowerCase();
    
        return datasetName.includes(searchStr);
      });
    
      return filteredList;
    }

    const updateSearch = (evt)=>{
      
      const updatedPipelines = searchListByPipelineName(allPipelines,evt.target.value);
      setFilteredPipelines(updatedPipelines);
    }

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

      const populateColumns = ()=>{

        if(snippet.length != 0){
          const sampleObjectKeys = Object.keys(snippet[0]);
          const newColumnsList = sampleObjectKeys.map((id)=>{
            const newObj = {
              id:id,
              label:id,
              minWidth: 170,
              align: 'right',
              format: (value) => value,
            }
            return newObj;
          });
          setColumns(newColumnsList)
        }
          
      }
  
      const populateRows = () =>{
          // setRows(snippet);
      }
     
      const getTheNodes = (nodes)=>{
        const allNodes = [];
        for(const node of nodes){
          allNodes.push(node["nodeData"]["type"]);
        }
        return allNodes.join(" , ");
      }

      const getTheDataset = (the_dataset)=>{
        return the_dataset[0]["dataset_name"];
      }

    
      const getParsedVectorData = (val)=>{
        return val.join(" , ");
      }

      const parsePipelineData = (pipeline_data)=>{
    
        const parsedData = JSON.parse(pipeline_data);
        const allNodes = getTheNodes(parsedData["nodes"]);
        const theDataset = getTheDataset(parsedData["selectedDataset"]);
        const numberOfNodes = parsedData["nodes"].length;
        const constantValueImputationColumns = getParsedVectorData(parsedData["constant_value_imputation_columns"]);
        const constantValueImputationValues = getParsedVectorData(parsedData["constant_value_imputation_values"]);
        const imputationAlgorithms = getParsedVectorData(parsedData["imputationAlgs"]);
        const standardizationColumns = getParsedVectorData(parsedData["standardizationColumns"]);
        const normalizationColumns = getParsedVectorData(parsedData["normalizationColumns"]);
        const mlAlgorithm = parsedData["ml_algorithm_target"]["model_name"];
        const mlAlgorithmParameters = parsedData["ml_algorithm_parameters"];

        const pipelineData = [
          {"Nodes": allNodes},
          {"Dataset": theDataset},
          {"Number of Nodes":numberOfNodes},
          {"Constant Value Imputation Columns": constantValueImputationColumns},
          {"Constant Value Imputation Values": constantValueImputationValues},
          {"Imputation Algorithms": imputationAlgorithms},
          {"Standardization Columns": standardizationColumns},
          {"Normalization Columns": normalizationColumns},
          {"ML Algorithm": mlAlgorithm},
          {"ML Algorithm Parameters": JSON.stringify(mlAlgorithmParameters)},
       ];

        return pipelineData;       
      }

      const parseThePipelineData = (pipelineData)=>{
        
        const processedPipeline = {};

        for (const pipeline_instance of pipelineData){
          processedPipeline[pipeline_instance[1]] = parsePipelineData(pipeline_instance[2]);
        }
        setRows(processedPipeline);
       
      }
   
    const makeRequestsForUser = async()=>{
        const theToken = localStorage.getItem("token");
        const decodedToken = JSON.parse((jwtDecode(theToken).sub))["email"];
        setIsLoading(true);
        try{
         const resp = await axios.get(GET_SAVED_PIPELINES(decodedToken));
         parseThePipelineData(resp.data.data);
         console.log("all the pipelines:");
         console.log(resp.data.data);
         setAllPipelines(resp.data.data);
         setFilteredPipelines(resp.data.data);
         setIsLoading(false);
        } catch(err){   
            blockAlert("There was a problem while fetching the saved pipelines");
            console.log(err);
            setIsLoading(false);
        }
    }

    const delete_pipeline = async(pipeline_name)=>{
      try{
        const resp = await axios.delete(DELETE_PIPELINE(pipeline_name));
        setAlertSuccessMessage("The pipeline was successfully deleted!");
        setAlertSuccess(true);
        setTimeout(()=>{
          setIsLoading(true);
          makeRequestsForUser();
          setAlertSuccess(false);
        },2000)
       } catch(err){   
           blockAlert("There was a problem deleting the pipeline! Please come again later!");
           console.log(err);
           setIsLoading(false);
       }
    }

    const blockSuccess = (msg)=>{
      toast.success(msg,{
        duration:2000,
        position:'top-right',
      })
    }

    const instiantiateThePipeline = (pipeline_obj)=>{
        const parsedPipelineData = JSON.parse(pipeline_obj);
        console.log("parsedPipelineData:");
        console.log(parsedPipelineData);
        if(parsedPipelineData["nodes"]){
          dispatch(setNodes(parsedPipelineData["nodes"]));
        } 
        if(parsedPipelineData["selectedDataset"]){
          dispatch(addDataset(parsedPipelineData["selectedDataset"][0]));
        }
        if(parsedPipelineData["selectedModelType"]){
          dispatch(setSelectedModelType(parsedPipelineData["selectedModelType"]));
        }
        if(parsedPipelineData["selectedDataFeaturingColumns"]){
          dispatch(setSelectedDataFeaturingColumns(parsedPipelineData["selectedDataFeaturingColumns"]));
        }
        if(parsedPipelineData["normalizationColumns"]){
          dispatch(setNormalizationColumns(parsedPipelineData["normalizationColumns"]));
        }
        if(parsedPipelineData["standardizationColumns"]){
          dispatch(setStandardizationColumns(parsedPipelineData["standardizationColumns"]));
        }
        if(parsedPipelineData["imputationAlgs"]){
          dispatch(setImputationAlgs(parsedPipelineData["imputationAlgs"]));
        }
        if(parsedPipelineData["mappedNodes"]){
          dispatch(setMappedNodes(parsedPipelineData["mappedNodes"]));
        }
        if(parsedPipelineData["constant_value_imputation_columns"]){
          dispatch(setConstantValueImputationColumns(parsedPipelineData["constant_value_imputation_columns"]));
        }
        if(parsedPipelineData["constant_value_imputation_values"]){
          dispatch(setStoredConstantValueImputationValues(parsedPipelineData["constant_value_imputation_values"]));
        }
        if(parsedPipelineData["edges"]){
          dispatch(setMappedEdges(parsedPipelineData["edges"]));
        }
        if(parsedPipelineData["ml_algorithm_target"]){
          dispatch(setMLAlgorithmTarget(parsedPipelineData["ml_algorithm_target"]));
        }
        if(parsedPipelineData["ml_algorithm_parameters"]){
          dispatch(setMLAlgorithmParameters(parsedPipelineData["ml_algorithm_parameters"]));
        }
        blockSuccess("The pipeline was loaded successfully! Head to home to see it!");
    }

    useEffect(()=>{
        makeRequestsForUser();
    },[])

    useEffect(()=>{
      populateColumns();
      populateRows();
    },[])

    


    return(<div>
        <div className="back-arrow" onClick={()=>{navigate("/pipelines")}}>
            <FontAwesomeIcon icon={faCircleLeft} />
        </div>
        <div className="page-title"> Saved Pipelines</div>
        {allPipelines.length == 0 && !loading &&<div>
             <div className="no-models-trained">
                <FontAwesomeIcon icon={faCompass}/>
                <p>There are no pipelines saved!</p>
             </div>
        </div>
        }
        {allPipelines.length !== 0 && !loading && 
        <div className="cards-container">
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
                      placeholder="Search Pipeline"
                      inputProps={{ 'aria-label': 'search google maps' }}
                      onChange={(evt)=>{updateSearch(evt)}}
                      
                    />
                      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                    <IconButton onClick={()=>{}} type="button" sx={{ p: '10px' }} aria-label="search">
                      <SearchIcon />
                    </IconButton> 
              </Paper>
          </ThemeProvider>
       
            {
                filteredPipelines.map((model)=>{
                  const parsedModelData = model;
                  
                    return(
                        <div className="card" key={model}>
                        <div className="card-header">
                            <img src={PipelineImage} width="150px" style={{"padding":"10px"}}/>
                            <div className="saved-pipelines-card-title">{model[1]}</div>
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
                              {rows[model[1]]
                              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                              .map((row) => {
                                  
                                  return (
                                  <TableRow hover role="checkbox" tabIndex={-1} key={uuidv4()}>
                                      <TableCell key={uuidv4()} >
                                          {Object.keys(row)[0]}   
                                        </TableCell>
                                        <TableCell key={uuidv4()} >
                                          {row[Object.keys(row)[0]]}   
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
                            <Button variant="contained" onClick={()=>{instiantiateThePipeline(model[2])}}>Use This Pipeline</Button>
                            <Button variant="contained" style={{ backgroundColor: 'red', color: 'white' }} onClick={()=>{ setPipelineToDelete(model[1]); setAreYouSure(true)}}>Delete</Button>
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
        {
          alertSuccess &&
          <Alert variant="filled" severity="success" style={{ position: 'absolute', top: 10, right: 10, width:"400px", fontSize:"1.1rem" }}>
                  {alertSuccessMessage}
          </Alert>
        }
       { areYouSure && <AreYouSure yesAction={()=>{delete_pipeline(pipelineToDelete)}} open={areYouSure} handleClose={()=>{setAreYouSure(false)}} noAction={()=>{}} alertDialogTitle={"Delete Saved Pipeline"} dialogMessage={`Are you sure you want to delete ${pipelineToDelete} ?`}/>}
        <Toaster/>
    </div>
    )
}

export default SavedPipelines;