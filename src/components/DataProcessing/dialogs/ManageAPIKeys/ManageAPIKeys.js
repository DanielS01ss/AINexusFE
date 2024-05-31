import * as React from 'react';
import { useEffect, useState } from 'react';
import style from "./ManageAPIKeys.css";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import Paper from '@mui/material/Paper';
import DoneIcon from '@mui/icons-material/Done';
import toast, { Toaster } from 'react-hot-toast';
import { truncateString } from '../../../../utils/truncateString';
import axios from 'axios';
import { GENERATE_PIPELINE, GET_GENERATED_KEYS } from '../../../../utils/apiEndpoints';
import { DELETE_GENERATE_KEY, GENERATE_KEY } from '../../../../utils/apiEndpoints';

export default function ManageAPIKeys(props) {

  const [rows, setRows] = useState([]);
  const [wasDataCopied, setWasDataCopied] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  function createData(
    name,
    calories,
    fat,
    carbs,
    protein,
  ) {
    return { name, calories, fat, carbs, protein };
  }

  const parseTheData = ( the_data )=>{
    const dataArray = [];
    for(const data of the_data){
      dataArray.push(data[1]);
    }

    setRows(dataArray);
  }
  
  const fetchAllKeys = async()=>{
    try{
      const email = localStorage.getItem("user-email");
      const resp = await axios.get(GET_GENERATED_KEYS(email));
      parseTheData(resp.data.keys);
      const wasIconClickedArr = [];
      for(const data of resp.data.keys){
        wasIconClickedArr.push(false);
      }
      setIsLoading(false);
      setWasDataCopied(wasIconClickedArr);
    } catch (err){
      console.log(err);
    }
  }

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

  const copyToClipboard = async (text) => {
    try {
        const permissions = await navigator.permissions.query({name: "clipboard-write"})
        if (permissions.state === "granted" || permissions.state === "prompt") {
            await navigator.clipboard.writeText(text);
            blockSuccess("Copied to clipboard");
        } else {
            throw new Error("Can't access the clipboard. Check your browser permissions.")
        }
    } catch (error) {
        blockAlert('Error copying to clipboard!');
    }
  };

  const handleCopyIconClicked = (index,data)=>{
    
    const wasDataCopiedCopy = wasDataCopied.map((elem)=> elem);
    wasDataCopiedCopy[index] = true;
    copyToClipboard(data);
    setWasDataCopied(wasDataCopiedCopy);

    setTimeout(()=>{
      const wasDataCopiedCopy = wasDataCopied.map((elem)=> elem);
      wasDataCopiedCopy[index] = false;
      setWasDataCopied(wasDataCopiedCopy);
    },2000)
  }

  const deleteKey = async(key)=>{
    try{
      const resp = await axios.delete(DELETE_GENERATE_KEY(key));
      blockSuccess("The key was successfully deleted!");
      fetchAllKeys();
    } catch(err){
      blockAlert("There was an error while deleting the key!");
      console.log(err);
    }
  }

  const generateTheKey = async()=>{
    try{
      const email = localStorage.getItem("user-email");
      const resp = await axios.post( GENERATE_KEY,{
        user_email: email
      });
      blockSuccess("The key was successfully deleted!");
      fetchAllKeys();
    } catch(err){
      blockAlert("There was an error while deleting the key!");
      console.log(err);
    }
  }
 
  useEffect(()=>{
    fetchAllKeys();
  },[])



  return (
    
    <ThemeProvider theme={darkTheme}>
            <Dialog
            open={props.open}
            onClose={props.handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth="xl"
            fullWidth
        >
            <DialogTitle id="alert-dialog-title">
            Manage API Keys
            </DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {rows.length !=0 && <span>Your keys</span>}  
            </DialogContentText>
            
            {isLoading && 
              <>
                <div className="loading-spinner"></div>
                <div className='loading-text'>Loading...</div>
              </>
            }

            {
              !isLoading && rows.length!=0 &&
              <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead style={{backgroundColor:"#000"}}>
                  <TableRow>
                      <TableCell>Key</TableCell>
                      <TableCell align="center">Copy</TableCell>
                      <TableCell align="right">Delete</TableCell>
                  </TableRow>
                  </TableHead>
                  <TableBody>
                 
                  { rows.map((row, index) => (
                      <TableRow
                      key={row.name}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                      <TableCell component="th" scope="row">
                          {truncateString(row)}
                      </TableCell>
                      <TableCell align="center"> { wasDataCopied[index] ? <DoneIcon sx={{color:"green", fontSize:"1.9rem"}} className='action-icon'/> : <ContentCopyIcon className='action-icon' onClick={()=>{ handleCopyIconClicked(index , row)}} /> }   </TableCell>
                      <TableCell align="right"> <DeleteIcon sx={{"color":"red", fontSize:"1.9rem"}} className='action-icon' onClick={()=>{deleteKey(row)}} /> </TableCell>
                      </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
            
            }

            {rows.length == 0 && !isLoading &&
              <div className='no-key-container'>
                <p>There are no keys for this user!</p>
              </div>
            }
            
                <div className="card-model-footer">
                    <Button variant="contained" onClick={()=>{generateTheKey()}}> Generate Key </Button>      
                </div>
            </DialogContent>
            <DialogActions>
            <Button onClick={()=>{props.handleClose()}} autoFocus>
                Ok
            </Button>
            </DialogActions>
        </Dialog>
        </ThemeProvider>
    );

}
