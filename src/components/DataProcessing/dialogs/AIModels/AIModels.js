import React, {useEffect} from "react";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Box from '@mui/material/Box';
import DialogTitle from '@mui/material/DialogTitle';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Checkbox from '@mui/material/Checkbox';
import style from "./AIModels.css";
import { faChartLine } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Typography } from '@mui/material';
import {useDispatch} from 'react-redux';
import { useSelector } from "react-redux/es/hooks/useSelector";
import AIModelDialogInfo from "../AIModelsDialogInfo/AIModelDialogInfo";
import { faTableColumns } from '@fortawesome/free-solid-svg-icons';
import {addNode, setSelectedModelType, setNodes, resetSelectedModelType, setMLAlgorithmTarget, setMLAlgorithmParameters} from "../../../../reducers/nodeSlice";
import {DATASET_FETCH_DATASET_SNIPPET} from "../../../../utils/apiEndpoints";
import axios from "axios";

export default function AIModels (props) {

    const dispatch = useDispatch();
    const allNodes = useSelector((state)=>state.nodes);
    const storedNodes = useSelector((state)=>state.nodes);
    const selectedModel = useSelector((state)=>state.selectedModelType);
    const selectMLAlgorithmsTarget = useSelector((state)=> state.ml_algorithm_target);
    const [selectedColumns, setSelectedColumns] = React.useState({});
    const [checked, setChecked] = React.useState([]);
    const [dataSetSearch,setDatasetSearch] = React.useState(true);
    const [displayMoreInfo, setDisplayMoreInfo] = React.useState(false);
    const [selectedMLAlgorithm , setSelectedMLAlgorithm] = React.useState("");
    const [selectTargetMenu, setSelectTargetMenu] = React.useState(false);
    const [snippet, setSnippet] = React.useState([]);
    const [datasetName, setDatasetName] = React.useState("");
    const [rows, setRows] = React.useState([]);
    const [datasetId, setDatasetId] = React.useState("");
    const dataset = useSelector((state)=>state.selectedDataset);
    const [checkedTargetedColumns, setCheckedTargetedColumns] = React.useState([]);

    const handleDisplayDataSetInfo = () =>{
      setDatasetSearch(!dataSetSearch);
      setDisplayMoreInfo(true);
    }

    const deleteNode = ()=>{
      let newNodeList = [...allNodes];
      newNodeList = newNodeList.filter((node)=> node.nodeData.type!=="Model Training");
      setTimeout(()=>{
        dispatch(setNodes(newNodeList));
      },200)
      
      setTimeout(()=>{
        dispatch(resetSelectedModelType());
      },100)
  
    }
 
    const handleDisplayAlgInfo = ()=>{
      setDisplayMoreInfo(false);
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

      if(newChecked.length == 0){
        setSelectTargetMenu(false);
      } else {
        setSelectTargetMenu(true);
      }

      setChecked(newChecked);
    };

    const handleToggleCheckedTargetedColumns = (value) => () => {
     
      const currentIndex = checkedTargetedColumns.indexOf(value);
      const newChecked = [...checkedTargetedColumns];
      
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
      const selectedOption = {
        algorithm_name:checked[0],
        selected:newChecked[0]
      }
      
      setCheckedTargetedColumns(newChecked);
    };
    
   
  
    const darkTheme = createTheme({
      palette: {
        mode: 'dark',
      },
    });
  
    const allAlgorithms = ['Procedure name','Random Forest','SVM', 'Linear Regression', 'Logistic Regression', 'Decision Trees', 'Gradient Boosting Machine', 'KNN' , 'DBSCAN']
   
    const appliedMLModels = ()=>{
      
      if(checked.length!=0){
          for(const node of storedNodes){
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

    const setModel = ()=>{
    
      dispatch(setSelectedModelType(checked[0]));
      
      dispatch(setMLAlgorithmTarget({
        "model_name":checked[0],
        "target_column":checkedTargetedColumns[0]
      }))
      dispatch(setMLAlgorithmParameters({}));
    }

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

    const parseAndSetData = (data)=>{
      setDatasetName(data[0].dataset_name);
      setDatasetId(data[0].id);
      fetchDatasetSnippet(data[0].id);
    }

    const fetchDatasetSnippet = (datasetId) =>{
      axios.get(DATASET_FETCH_DATASET_SNIPPET(datasetId))
      .then(resp => { setSnippet(resp.data); parseAndSetRows(resp.data);})
      .catch(err => {console.log(err)})
    }

    useEffect(()=>{
      setChecked([selectedModel]);
    },[selectedModel])

    useEffect(()=>{
      parseAndSetData(dataset)
    },[dataset])


    return(
        <div>

    <ThemeProvider theme={darkTheme}>
      <Dialog open={props.open} onClose={props.handleClose} sx={{textAlign:"center", backgroundColor:""}} maxWidth="600" fullWidth="true" >
           <DialogTitle> ML Models </DialogTitle>
          {!displayMoreInfo && 
                <DialogContent>   
                    <List dense sx={{ width: '100%', bgcolor: 'background.paper', marginTop:"10px" }}>
                    {allAlgorithms.map((value,index) => {
                      const labelId = `checkbox-list-secondary-label-${value}`;
                      if(index == 0){
                          return(
                            <ListItem
                            key={value}
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
                              
                              <ListItemText  id={labelId}  disableTypography
                              primary={<Typography variant="body2" style={{ color: '#FFFFFF',fontSize:"1.3rem" }}>Procedure Name</Typography>} />
                            </ListItemButton>
                          </ListItem>
                          );
                      } else {
                      return (
                        <ListItem
                          key={value}
                          secondaryAction={
                            <div className='dataset-select-toolbox'>
                              <Checkbox
                                edge="end"
                                onChange={handleToggle(value)}
                                checked={checked.indexOf(value) !== -1}
                                inputProps={{ 'aria-labelledby': labelId }}
                              />
                              <Button variant="outlined" onClick={()=>{handleDisplayDataSetInfo(); setSelectedMLAlgorithm(allAlgorithms[index])}}>Info</Button>
                            </div>
                          }
                          disablePadding
                          sx={{
                            padding:"15px"
                          }}
                        >
                          <ListItemButton>
                            <ListItemAvatar>
                              <p className='select-dialog-list'><FontAwesomeIcon icon={faChartLine}/></p> 
                            </ListItemAvatar>
                            <ListItemText  id={labelId}  disableTypography
                            primary={<Typography variant="body2" style={{ color: '#FFFFFF',fontSize:"1.3rem" }}>{value}</Typography>} />
                          </ListItemButton>
                        </ListItem>
                      );
                      } 
                    })}
                  </List>
                  {
                  selectTargetMenu &&
                  <>
                  <p className="target-column-section-title">Select Target Column</p>
                  <Box sx={{ height: 400, width: '90%', margin:"auto",borderRadius:"5px" }}  bgcolor="black" >
                    <List dense sx={{ width: '100%', bgcolor: 'background.paper', marginTop:"10px",borderRadius:"5px", padding:"10px" }}>
                        <ListItem
                            key={"my-key"}
                            secondaryAction={
                              <div className='dataset-select-toolbox'>
                                <p>Select</p>
                              
                              </div>
                            }
                            disablePadding
                            sx={{
                            padding:"5px",
                            pointerEvents:"none"
                            }}
                          >
                            <ListItemButton>
                              
                              <ListItemText  id={'fd3432'}  disableTypography
                              primary={<Typography variant="body2" style={{ color: '#FFFFFF',fontSize:"1.3rem" }}>Column Name</Typography>} />
                            </ListItemButton>
                          </ListItem>
                      {rows.map((value) => {
                        const labelId = `checkbox-list-secondary-label-${value}`;           
                          return (
                            <ListItem
                              key={value.id}
                              secondaryAction={
                                <div className='dataset-select-toolbox'>
                                  <Checkbox
                                    edge="end"
                                    onChange={handleToggleCheckedTargetedColumns(value)}
                                    checked={checkedTargetedColumns.indexOf(value) !== -1}
                                    inputProps={{ 'aria-labelledby': labelId }}
                                  />
                                  
                                </div>
                              }
                              disablePadding
                            > 
                              <ListItemButton>
                                <ListItemAvatar>
                                  <p className='select-dialog-list'><FontAwesomeIcon icon={faTableColumns}/></p> 
                                </ListItemAvatar>
                                <ListItemText  id={labelId}  disableTypography
                                primary={<Typography variant="body2" style={{ color: '#FFFFFF',fontSize:"1.3rem" }}>{value.column_name}</Typography>} />
                              </ListItemButton>
                            </ListItem>
                          );
                        
                      })}
                    </List>
                    </Box>

                  </>
                }
            </DialogContent> 
           }

         

           {displayMoreInfo && <AIModelDialogInfo handleClose={handleDisplayAlgInfo} selectedMLAlgorithm={selectedMLAlgorithm} />}
          
            <DialogActions>
              <Button onClick={props.handleClose}>Close</Button>
              <Button onClick={()=>{props.handleClose(); appliedMLModels(); setModel()}}>Apply</Button>
            </DialogActions>

          
      </Dialog>
      </ThemeProvider>
    </div>
    );
}