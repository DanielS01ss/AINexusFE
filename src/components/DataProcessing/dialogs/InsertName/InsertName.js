import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

export default function InsertName(props) {

  const [pipelineName,setPipelineName] = React.useState("");
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  const handleInteractionYes = ()=>{
    props.yesAction(pipelineName);
    props.handleClose();
  }

  const handleInteractionNo = ()=>{
    props.noAction();
    props.handleClose();
  }

  const handleChange = (event) =>{
    setPipelineName(event.target.value);
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
            <DialogContent style={{"padding-top":"10px","width":"100%"}}>
              <TextField style={{"width":"100%"}} onChange={handleChange} id="outlined-basic" label="Pipeline Name" variant="standard" />
            </DialogContent>
            <DialogActions>
            <Button onClick={handleInteractionNo}>Cancel</Button>
            <Button onClick={handleInteractionYes} disabled={pipelineName.length == 0} autoFocus>
                Save
            </Button>
            </DialogActions>
        </Dialog>
        </ThemeProvider>
    );

}
