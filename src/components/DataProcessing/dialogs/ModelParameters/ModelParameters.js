import * as React from 'react';
import style from "./ModelParameters.css";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';


export default function ModelParameters(props) {
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  const handleInteractionYes = ()=>{
   
  }

  const handleInteractionNo = ()=>{
    
  }

  return (
    
    <ThemeProvider theme={darkTheme}>
            <Dialog
            open={props.open}
            onClose={props.handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth="xs"
            fullWidth
        >
            <DialogTitle id="alert-dialog-title">
            {props.alertDialogTitle}
            </DialogTitle>
            <DialogContent>
            </DialogContent>
            <DialogActions>
            <Button onClick={()=>{}}>Cancel</Button>
            <Button onClick={()=>{}} autoFocus>
                Save
            </Button>
            </DialogActions>
        </Dialog>
        </ThemeProvider>
    );

}
