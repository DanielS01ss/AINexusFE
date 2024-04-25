import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CheckIcon from '@mui/icons-material/Check';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import toast, { Toaster } from 'react-hot-toast';
import { truncateString } from '../../../../utils/truncateString';
import style from "./PredictInfoDialog.css";

export default function PredictInfoDialog(props) {
  const [wasModelCopied, setWasModelCopied] = React.useState(false);
  const data = {
    "model_name": `${props.selectedModel}`,
    "parameters": `{\"param_array\":[60,1,96,1,60,1,271000,1,136,0,0,94]}`,
    "api_key": "<YOUR-API-KEY>"
  }; 
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  
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

const blockSuccess = (msg)=>{
    toast.success(msg,{
      duration:2000,
      position:'top-right',
    })
  }

  const blockAlert = (msg)=>{
    toast.error(msg,{
      duration:2000,
      position:'top-right',
    })
  }


  const getURL = ()=>{
    return "http://localhost:8086/predict"
  }


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
                Predict Info
            </DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-description">
                <div className='model-name-predict-dialog-title'>Model Name</div>
                <div>{props.selectedModel}</div>
                <div>
                    <div className='predict-dialog-informative-message'>
                        To predict please use the following endpoint:
                    </div>
                    <div className='options-page-name-container' title={"http://localhost:8086/predict"} > {truncateString("http://localhost:8086/predict")} {wasModelCopied? <CheckIcon className='copy-icon' style={{"color":"green" , "fontSize":"1.4rem", "fontWeight":"bold"}} /> : <ContentCopyIcon className='copy-icon' onClick={()=>{copyToClipboard(props.selectedModel); setWasModelCopied(true); setTimeout(()=>{setWasModelCopied(false)},1000)}}/> }</div> 
                    <div style={{"padding":"20px"}}>With the following body</div>
                     <div className='predict-dialog-body-example'>
                     METHOD : POST
                     <pre><code>{`${JSON.stringify(data, null, 2)}`}</code></pre>
                    
                     </div>
                    <div>

                    </div>
                </div>

            </DialogContentText>
            </DialogContent>
            <DialogActions>
            
            <Button onClick={()=>{props.handleClose()}} autoFocus>
                OK
            </Button>
            </DialogActions>
            <Toaster/>
        </Dialog>
        </ThemeProvider>
    );

}
