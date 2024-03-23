import * as React from 'react';
import { useState, useEffect } from 'react';
import style from "./Logs.css";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Accordion from '@mui/material/Accordion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faCircleXmark, faTrashCan} from '@fortawesome/free-solid-svg-icons';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import AreYouSure from "../../dialogs/AreYouSure/AreYouSure";
import axios from "axios";
import { GET_PIPELINE_LOGS, DELETE_PIPELINE } from '../../../../utils/apiEndpoints';
import {getToken} from "../../../../utils/getTokens";
import { Divider } from '@mui/material';
import { jwtDecode } from "jwt-decode";


export default function Logs(props) {
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  const [isLoading, setIsLoading] = useState(true);
  const [pipelineLogs, setPipelineLogs] = useState([]);
  const [isAreYouSureOpen, setIsAreYouSureOpen] = useState(false);

  const fetchAllLogsForUser = async()=>{

    setIsLoading(true);

    const token = getToken();
    const email = JSON.parse(jwtDecode(token).sub).email;

    try{
        const resp = await axios.get(GET_PIPELINE_LOGS(email));  
        const theLogs = resp.data.content;
        theLogs.reverse();
        setPipelineLogs(resp.data.content);
        setIsLoading(false);
    } catch(err){
        console.log(err);
    }
  }

  const findIfPipelineHasSucceded = (pipelineObj)=>{
    
    const parsedPipelineObject = JSON.parse(pipelineObj);

    if(parsedPipelineObject.pipeline_succes == "True")
        return true;
    else
        return false;
  }

  const parsePipelineObject = (pipelineObj)=>{
    
    const parsedPipelineObject = JSON.parse(pipelineObj);
    const parsedObj = [];

    for(const pipObj of Object.keys(parsedPipelineObject["step_details"])){
        const obj = {
            "message": parsedPipelineObject["step_details"][pipObj]["message"],
            "name":pipObj,
            "success":parsedPipelineObject["step_details"][pipObj]["code"] === 200 ? true: false
        }
        parsedObj.push(obj);
    }

    return parsedObj;
  }

  const clearRuns = async()=>{

    const token = getToken();
    const email = JSON.parse(jwtDecode(token).sub).email;

    try{
      const resp = axios.delete(DELETE_PIPELINE(email));
      console.log("the response from clear runs!");
      console.log(resp);
      setPipelineLogs([]);
    } catch(err){
        console.log(err);
    }
  }

  useEffect(()=>{
    
    fetchAllLogsForUser();
  },[])

  return (
    
    <ThemeProvider theme={darkTheme}>
            <Dialog
            open={props.open}
            onClose={props.handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth="lg"
            sx={{textAlign:"center", backgroundColor:""}}  
            fullWidth
        >
            <DialogTitle id="alert-dialog-title">
                Logs
            </DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-description">
                
            </DialogContentText>

                <Box sx={{ height: 500, width: '100%', margin:"auto",borderRadius:"5px", overflowY:"scroll" }}  bgcolor="black" >
                    <h1 className="options-page-title">Runs</h1>
                    <Divider/>
            {isLoading &&
              <>
                <div className="loading-spinner"></div>
                <div>Loading...</div>
               </>
            }
            {!isLoading &&
            <>
                 <Button variant='contained' sx={{backgroundColor:"red","&:hover": {
                                          backgroundColor: 'rgb(255, 116, 116)',
                                          color: '#fff',
                                      } ,marginTop:"10px", color:"#fff"}} onClick={()=>{setIsAreYouSureOpen(true)}}>
                        <FontAwesomeIcon icon={faTrashCan} style={{"margin-right":"8px"}} />
                        Clear Runs
                </Button>

                <div className="all-logs-container">
                { pipelineLogs && pipelineLogs.length != 0 && pipelineLogs.map((log)=>{
                        
                        return(
                        <Accordion>
                            <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1-content"
                            id="panel1-header"
                            >
                            <div className='pipeline-run-title'>
                                <div className='pipeline-run-success-status'>
                                    {findIfPipelineHasSucceded(log[2])?
                                        <>
                                             <FontAwesomeIcon icon={faCircleCheck} className='success-icon' />
                                                Success
                                        </>
                                        :
                                        <>
                                            <FontAwesomeIcon icon={faCircleXmark} style={{paddingRight:"95px"}} className='failed-icon' />
                                                <span style={{marginRight:"10px"}}>Failed</span>
                                        </>
                                        
                                    }
                               
                                </div>
                                <div>
                                    {log[1]}
                                </div>
                            </div>
                            </AccordionSummary>
                            <AccordionDetails>                                
                            <div>
                                  
                          
                                {parsePipelineObject(log[2]) && parsePipelineObject(log[2]).length != 0 && parsePipelineObject(log[2]).map((pip_obj)=>{
                             
                                    return(
                                  <div className='step-logs-container'>
                                    
                                      <div className='logs-bullet-point-success'>
                                        {pip_obj["success"]? <FontAwesomeIcon icon={faCircleCheck}  style={{color:"rgb(17, 209, 17)"}} className='failed-icon' /> : <FontAwesomeIcon icon={faCircleXmark}  style={{color:"red"}} className='failed-icon' />}
                                          
                                          
                                          <div>
                                              {pip_obj["name"]}
                                          </div>
                                      </div>
                                      {
                                        pip_obj["success"] == false && <div className='step-logs-container-msg'>
                                            <span className='step-logs-msg-title'>Message:</span> {pip_obj["message"]}
                                        </div>  
                                      }
                                        
                                  </div>
                                    );

                                })}
                                
                                
                            </div>
                            </AccordionDetails>
                    </Accordion>
                    )
                            
                        })}
                  
                   
                   
                </div>
            </>
            }
               
                </Box>
            </DialogContent>

              
            <DialogActions>
            <Button onClick={()=>{props.handleClose()}} autoFocus>
                Ok
            </Button>
            </DialogActions>

            <AreYouSure open={isAreYouSureOpen} handleClose={()=>{setIsAreYouSureOpen(false)}} alertDialogTitle={"Clear Runs"}  dialogMessage={"Are you sure you want to clear all the logs?"} yesAction={clearRuns} noAction={()=>{}}/>
        </Dialog>
        </ThemeProvider>
    );

}
