import * as React  from 'react';
import {useRef} from "react";
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UPLOAD_FILE , FILE_METADATA } from '../../../../utils/apiEndpoints';
import TextField from '@mui/material/TextField';
import { getDataCurenta } from '../../../../utils/getCurrentDate';
import {getToken} from "../../../../utils/getTokens";
import { jwtDecode } from "jwt-decode";
import style from "./UploadDataset.css";
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

export default function UploadDataset(props) {

   // Crează o referință pentru inputul de tip file
  const fileInputRef = useRef(null);
  const [allTags, setAllTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [hoveredTag, setHoveredTag] = useState(null);
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [fileError, setFileError] = useState(false);
  const [wasUploaded, setWasUploaded] = useState(false);
  const [fileInfo, setFileInfo] = useState({
    name: '',
    isValid: false,
  });

  
  const blockAlert = (msg)=>{
    toast.error(msg,{
      duration:2000,
      position:'top-right',
    })
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileName = file.name;
      const isValid = fileName.endsWith('.csv'); // Verifică dacă fișierul este CSV

      setFileInfo({
        name: fileName,
        isValid: isValid,
      });

      if (file) {
        const isValid = file.name.endsWith('.csv');
        setFileError(!isValid);    
        if (isValid) {
          parseFileData(event.target.files[0]); 
          setFile(file);
        } else {
          blockAlert("Upload an csv file!");
          return;
        }
      }

    }
  };

  const blockSuccess = (msg)=>{
    toast.success(msg,{
      duration:2000,
      position:'top-right',
    })
  }

  const addMetadata = async ()=>{ 
  
    const token = getToken();
    const email = JSON.parse(jwtDecode(token).sub).email;
    const fileMetadata = {
      "user_email": email,
      "file_name":fileName,
      "authors":[author],
      "description":description,
      "tags": allTags,
      "publish": getDataCurenta()
    };

  

    try{
      const resp = await axios.post(FILE_METADATA,{
        "user_email": email,
        "file_name":fileName,
        "authors":[author],
        "description":description,
        "tags": allTags,
        "publish": getDataCurenta()
      });
      blockSuccess("The file was uploaded successfully!");
      setAuthor("");
      setFileName("");
      setDescription("");
      setAllTags([]);
      setWasUploaded(true);
    } catch(err){
      blockAlert("There was a problem while saving file metadata!")
    }

  }

    const handleSubmit = async () => {
    
        const formData = new FormData();
        formData.append('file', file);

        try {
        const response = await fetch(UPLOAD_FILE, {
            method: 'POST',
            body: formData,
        });
        if (response.ok) {
            addMetadata();
        } else {
          blockAlert('Upload failed');
        }
        } catch (error) {
          blockAlert('There was an error! Please come again later!');
        }
    };

    const parseFileData = (file_data)=>{
      if(file_data){
        setFileName(file_data.name);
      } else {
        setFileName("");
      }
      
    }


  const handleAddTag = ()=>{
    const updatedTags = [...allTags];
    updatedTags.push(tagInput);
    setAllTags(updatedTags);
    setTagInput("");
  }

  const removeFromTagList = (the_tag)=>{
    const newTags = [];
    for(const tag of allTags){
        if(tag != the_tag){
            newTags.push(tag);
        }
    }   
    setAllTags(newTags);
  }

  const handleButtonClick = () => {
    
    if(fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

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
            maxWidth="xl"
            fullWidth
        >
            <DialogTitle id="alert-dialog-title">
            {props.alertDialogTitle}
            </DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-description">
                <div>
                    <div> <FontAwesomeIcon icon={faCircleInfo} /> Files uploaded must be csv!</div>
                </div>
            </DialogContentText>
              <div className='upload-section'>
              <input
                  type="file"
                  style={{ display: 'none' }} // Ascunde inputul
                  ref={fileInputRef} // Asociază referința
                  onChange={(event) => {
                      
                      handleFileChange(event);
                  }}
                />

                <Button variant="contained" onClick={handleButtonClick}  sx={{ marginTop:"20px", marginBottom:"20px", marginLeft:"10px", backgroundColor: 'green', color:"#fff", "&:hover": {
                                          backgroundColor: 'rgb(36, 255, 131)',
                                          color: '#fff',
                                      }}}>Select File</Button>
                 {fileName.length!=0 && <div style={{"padding":"5px", "paddingBottom":"5px"}}><span style={{"color":"yellow"}}> File uploaded: </span>  {fileName}</div> }
                  <div>
                    <TextField id="outlined-basic" label="Tags" variant="outlined" value={tagInput} onChange={(evt)=>{setTagInput(evt.target.value)}} /><Button variant="contained"  sx={{backgroundColor:"green","&:hover": {
                                          backgroundColor: '#64ff4d',
                                          color: '#fff',
                                      } ,marginTop:"10px",marginLeft:"20px", color:"#fff"}} className='add-btn' disabled={tagInput.length == 0} onClick={()=>{handleAddTag()}}>Add Tag</Button>
                    
                  </div>
                  <div style={{"marginTop":"10px"}}>
                    <TextField id="outlined-basic" label="Author" variant="outlined" value={author}  onChange={(evt)=>{setAuthor(evt.target.value)}} />
                  </div>
                  <div style={{"marginTop":"10px"}}>
                    <TextField id="outlined-basic" style={{width:"500px"}} label="Description" variant="outlined" value={description} onChange={(evt)=>{setDescription(evt.target.value)}} />
                  </div>
                  <div className='bubble-items'>
                    {allTags.map((tag)=>{
                        return(
                            <div>
                                <div className='bubble-items-instance'
                                      onMouseEnter={() => setHoveredTag(tag)} 
                                      onMouseLeave={() => setHoveredTag(null)}
                                > {tag} 
                                { hoveredTag === tag && 
                                    <span
                                    onClick={()=>{removeFromTagList(tag)}}
                                    style={{
                                        marginLeft: '10px',
                                        cursor: 'pointer',
                                        color: 'red',
                                        fontSize:"1.3rem"
                                    }}
                                    >
                                    x
                                    </span>
                                } 
                            </div>
                          </div>
                        );
                    })}

                  </div>

                  <Button variant="contained" onClick={()=>{handleSubmit()}}  sx={{ marginTop:"20px", marginBottom:"20px", marginLeft:"10px", backgroundColor: 'blue', color:"#fff"}} disabled={ fileName.length == 0 || allTags.length == 0 || author.length == 0 || description.length == 0}> Upload </Button>
                </div>
            </DialogContent>
            <DialogActions>
            <Button  autoFocus onClick={()=>{props.handleClose(wasUploaded)}}>
               Cancel
            </Button>
            <Button  autoFocus onClick={()=>{props.handleClose(wasUploaded)}}>
                OK
            </Button>
            </DialogActions>
            <Toaster/>
        </Dialog>
        </ThemeProvider>
    );

}
