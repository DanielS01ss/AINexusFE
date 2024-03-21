import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


export default function AreYouSure(props) {
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  const handleInteractionYes = ()=>{
    props.yesAction();
    props.handleClose();
  }

  const handleInteractionNo = ()=>{
    props.noAction();
    props.handleClose();
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
            <DialogContentText id="alert-dialog-description">
                {props.dialogMessage}
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleInteractionNo}>No</Button>
            <Button onClick={handleInteractionYes} autoFocus>
                Yes
            </Button>
            </DialogActions>
        </Dialog>
        </ThemeProvider>
    );

}
