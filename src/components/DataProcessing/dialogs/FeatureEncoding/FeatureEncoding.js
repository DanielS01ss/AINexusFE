import React, {useState, useEffect} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import {setOneHotEncodingColumnsReducer, setOutlierRemovalColumns} from "../../../../reducers/nodeSlice";
import {useDispatch} from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useSelector } from "react-redux/es/hooks/useSelector";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Checkbox from '@mui/material/Checkbox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTableColumns } from '@fortawesome/free-solid-svg-icons';
import { Typography } from '@mui/material';
import {setLabelEncodingColumns, setTargetEncodingColumns, setOneHotEncodingColumns} from "../../../../reducers/nodeSlice";
import {DATASET_FETCH_DATASET_INFO , DATASET_FETCH_DATASET_SNIPPET, COLUMNS_FOR_ENCODING} from "../../../../utils/apiEndpoints";

import axios from "axios";
 
export default function FeatureEncoding(props){

    const dispatch = useDispatch();
    const label_encoding_columns = useSelector((state)=>state.label_encoding_columns);
    const target_encoding_columns = useSelector((state)=> state.target_encoding_columns);
    const one_hot_encoding_columns = useSelector((state)=> state.one_hot_encoding_columns);
    const selectedDataset = useSelector((state)=> state.selectedDataset);
    const [datasetName, setDatasetName] = useState("");
    const [isLoadingId , setIsLoadingId] = useState(true);
    const [datasetId, setDatasetId] = useState(0);
    const [fetchedDatasetInfo, setFetchedDatasetInfo] = useState({});
    const [snippet, setSnippet] = useState([]);
    const [oneHotEncodingColumns, setOneHotEncodingColumns] = useState([]);
    const [rows, setRows] = useState([]);
    const [selectedColumnsFeaturing,setSelectedColumnsFeaturing] = useState();
    const selectedRows = [1,2,3];
    const dataset = useSelector((state)=>state.selectedDataset);
    const [checked, setChecked] = React.useState([]);
    const [checkedLabelEncoding, setCheckedLabelEncoding] = React.useState([]);
    const [checkedTargetEncoding, setCheckedTargetEncoding] = React.useState([]);
    const [checkedOneHotEncoding, setCheckedOneHotEncoding] = React.useState([]);
    const darkTheme = createTheme({
      palette: {
        mode: 'dark',
      },
    });
    const columns = [{field:"id", headerName:"ID", width:60},{field:"column_name", headerName:"Column Name", width:320},{field:"sample_data", headerName:"Sample Data", width:230}]

    const parseAndSetData = (data)=>{
      setDatasetName(data[0].dataset_name);
      setDatasetId(data[0].id);
      fetchDatasetInfo(data[0].id);
      fetchDatasetSnippet(data[0].id);
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

    const handleToggle = (value, encodingType) => () => {
      if(encodingType == "Label Encoding"){
        const currentIndex = checkedLabelEncoding.findIndex((item,index) => {return item.column_name === value.column_name && item.sample_data === value.sample_data;});
        const newChecked = [...checkedLabelEncoding];
    
        if (currentIndex === -1) {
          newChecked.push(value);
        } else {
          newChecked.splice(currentIndex, 1);
        }
    
        setCheckedLabelEncoding(newChecked);

      } else if (encodingType == "Target Encoding"){
        const currentIndex = checkedTargetEncoding.findIndex((item,index) => {return item.column_name === value.column_name && item.sample_data === value.sample_data;});
        const newChecked = [...checkedTargetEncoding];
    
        if (currentIndex === -1) {
          newChecked.push(value);
        } else {
          newChecked.splice(currentIndex, 1);
        }
    
        setCheckedTargetEncoding(newChecked);
      } else if (encodingType == "One Hot Encoding"){
        const currentIndex = checkedOneHotEncoding.findIndex((item,index) => {return item.column_name === value.column_name && item.sample_data === value.sample_data;});
        const newChecked = [...checkedOneHotEncoding];
    
        if (currentIndex === -1) {
          newChecked.push(value);
        } else {
          newChecked.splice(currentIndex, 1);
        }
    
        setCheckedOneHotEncoding(newChecked);
      }
     
    };

    
    const fetchDatasetInfo = (datasetId)=>{
        axios.get(DATASET_FETCH_DATASET_INFO(datasetId))
        .then(resp => {  setFetchedDatasetInfo(resp.data)})
        .catch(err => {console.log(err)})
      }
  
      const fetchDatasetSnippet = (datasetId) =>{
        axios.get(DATASET_FETCH_DATASET_SNIPPET(datasetId))
        .then(resp => { setSnippet(resp.data); parseAndSetRows(resp.data);})
        .catch(err => {console.log(err)})
      }

    const handleSelection = (selection)=>{
      
      const selectedRows = [];
      for(let itemID of selection)
      {
        selectedRows.push(rows[itemID-1]);
      }
      setSelectedColumnsFeaturing(selectedRows);
    }

    const handleDone = ()=>{    
      const allLabelEncodingColumns = [];
      const allTargetEncodingColumns = [];
      const allOneHotEncodingColumns = [];

      console.log("Before Debugger:");
      debugger;
      console.log("checkedLabelEncoding");
      console.log(checkedLabelEncoding);
      
      for(const col of checkedLabelEncoding){
        if(col["type"] == "Label Encoding"){
          allLabelEncodingColumns.push(col);  
        } else {
          col["type"] = "Label Encoding";
          allLabelEncodingColumns.push(col);
        }
        
      }

      
      for(const col of checkedTargetEncoding){
        if(col["type"] == "Target Encoding"){
          allTargetEncodingColumns.push(col);  
        } else{
          col["type"] = "Target Encoding";
          allTargetEncodingColumns.push(col);
        }
      }

      for(const col of checkedOneHotEncoding){
          if(col["type"] == "One Hot Encoding"){
              allOneHotEncodingColumns.push(col);
          } else {
                col["type"] = "One Hot Encoding";
                allOneHotEncodingColumns.push(col);
          }
      }
        

        dispatch(setLabelEncodingColumns(allLabelEncodingColumns));
        dispatch(setTargetEncodingColumns(allTargetEncodingColumns));
        dispatch(setOneHotEncodingColumnsReducer(allOneHotEncodingColumns));
    
        props.handleClose();
    }

    useEffect(()=>{
        parseAndSetData(dataset)
    },[dataset])

  

    const getAndParseOneHotEncoding = async()=>{

      try{
        const resp = await axios.get(COLUMNS_FOR_ENCODING(selectedDataset[0]["dataset_name"]));
        setOneHotEncodingColumns(resp.data.columns);
      } catch(err){
        console.log(err);
      }
    } 

    useEffect(()=>{
      getAndParseOneHotEncoding();
    },[])

    useEffect(()=>{
      setCheckedLabelEncoding(label_encoding_columns);
    },[label_encoding_columns])

    useEffect(()=>{
      setCheckedTargetEncoding(target_encoding_columns);
    },[target_encoding_columns])

    useEffect(()=>{
      setOneHotEncodingColumns(one_hot_encoding_columns);
    },[one_hot_encoding_columns])

    return (
    <div>
        <ThemeProvider theme={darkTheme}>
          <Dialog open={props.open} onClose={props.handleClose} sx={{textAlign:"center", backgroundColor:""}} maxWidth="300" fullWidth="true" >
               <DialogTitle> Select columns to apply Feature Encoding </DialogTitle>
                <DialogContent sx={{textAlign:'center'}}>   

                 <div > Label Encoding </div>
                 {
                   <Box sx={{ height: 400, width: '90%', margin:"auto",borderRadius:"5px", marginBottom:"400px" }}  bgcolor="black" >
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
                                   onChange={handleToggle(value, "Label Encoding")}
                                   checked={checkedLabelEncoding.find(item => {return item.column_name === value.column_name && item.sample_data === value.sample_data;})}
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
                 }

                <div> Target Encoding </div>
                 {
                   <Box sx={{ height: 400, width: '90%', margin:"auto",borderRadius:"5px", marginBottom:"400px" }}  bgcolor="black" >
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
                                   onChange={handleToggle(value, "Target Encoding")}
                                   checked={checkedTargetEncoding.find(item => {return item.column_name === value.column_name && item.sample_data === value.sample_data;})}
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
                 }

                <div> One Hot Encoding </div>
                 {
                   <Box sx={{ maxHeight: 400, width: '90%', margin:"auto",borderRadius:"5px" }}  bgcolor="black" >
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
                        if(oneHotEncodingColumns.includes(value.column_name)){
                          return (
                            <ListItem
                              key={value.id}
                              secondaryAction={
                                <div className='dataset-select-toolbox'>
                                  <Checkbox
                                    edge="end"
                                    onChange={handleToggle(value, "One Hot Encoding")}
                                    checked={checkedOneHotEncoding.find(item => {return item.column_name === value.column_name && item.sample_data === value.sample_data;})}
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
                        }
                        
                      })}
                    </List>
                    </Box>
                 }
                </DialogContent>
                <DialogActions>
                  <Button onClick={props.handleClose}>Close</Button>
                  <Button onClick={()=>{handleDone()}}>Done</Button>
                </DialogActions>
              
          </Dialog>
          </ThemeProvider>
        </div> 
      );
}