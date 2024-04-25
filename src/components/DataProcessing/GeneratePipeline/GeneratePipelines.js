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
import {addNode, addDataset, setNodes, clearDataset} from "../../../reducers/nodeSlice";
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
        setSelectedDatasetName(foundDataset[0].dataset_name);;
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

    axios.get(DATASET_FETCH_ALL_DATASETS()).then((resp)=>{
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
 
  const addCorespondingNode = () =>{
    
   if(checked.length != 0){
      for(let node of nodes){
        if(node.nodeData.type == "Dataset"){
          return;
        } 
      }
      const newNode = {type:"Dataset"}
      dispatch(addNode(newNode))  
   } else if(checked.length == 0) {
    dispatch(clearDataset({}))
     const newNodeList = [];
     for(let node of nodes){
      if(node.nodeData.type !== "Dataset"){
        newNodeList.push(node);
      } 
    }
    dispatch(setNodes(newNodeList));
   }
   
  }
  
  React.useEffect(()=>{
    fetchAllData();
  },[])

  
  useEffect(()=>{
    makeRequestsForUser();
},[])

      


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
                              <Button variant="outlined" onClick={()=>{}}>Info</Button>
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
                        >
                          <FormControlLabel value="female" control={<Radio />} label="Classification" />
                          <FormControlLabel value="male" control={<Radio />} label="Regression" />
                          <FormControlLabel value="other" control={<Radio />} label="Clustering" />
                        </RadioGroup>
                    </FormControl>
              </div>
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
              !isPipelineGenerating &&  <Button onClick={()=>{setIsPipelineGenerating(true )}} variant="contained" style={{"marginBottom":"50px", "marginTop":"50px"}}>Generate</Button>
             }
              
         
        <Toaster/>  
    </div>
    )
}

export default GeneratePipelines;