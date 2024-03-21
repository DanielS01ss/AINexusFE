import * as React from 'react';
import style from "./Tools.css";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import { Divider } from '@mui/material';


export default function Tools(props) {


  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });


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
                Tools Dialog
            </DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-description">
                
            </DialogContentText>

                <Box sx={{ height: 400, width: '100%', margin:"auto",borderRadius:"5px" }}  bgcolor="black" >
                    <h1 className="options-page-title">Pipeline Tools</h1>
                    <Divider/>
                <div className='options-page-columns-container'>
                    <div className="options-page-container">
                            <div className='options-page-container-item'>   
                                <p className="options-page-container-title">Save Pipeline</p>
                                <div className='options-page-btn'>
                                    <Button variant="contained" sx={{backgroundColor:"green",
                                    "&:hover": {
                                        backgroundColor: '#63f285',
                                        color: '#fff',
                                    },
                                     color:"#fff"}}>Save</Button>
                                </div>
                            </div>
                            
                            <div className='options-page-container-item'>
                                <p className="options-page-container-title">Reset all the variables</p>
                                <div className='options-page-btn'>
                                    <Button variant="contained" sx={{backgroundColor:"blue", color:"#fff"}}>Reset</Button>
                                </div>
                            </div>
                        </div>
                        <div className="options-page-container-right-side">
                                <div className='options-page-container-item'>
                                    <p className="options-page-container-title">See explainability</p>
                                    <div className='options-page-btn'>
                                        <Button variant="contained" sx={{backgroundColor:"blue", color:"#fff"}}>Explore</Button>
                                    </div>
                                </div>
                        </div>
                </div>
                    
                </Box>

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
