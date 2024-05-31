import * as React from 'react';
import { useState, useEffect } from 'react';
import style from "./ModelParameters.css";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import RandomForestInput from "./ModelParametersView/RandomForestInput.js";
import SVMInput from './ModelParametersView/SVMInput.js';
import LinearRegressionInput from './ModelParametersView/LinearRegressionInput.js';
import LogisticRegressionInput from './ModelParametersView/LogisticRegressionInput.js';
import DecisionTreesInput from './ModelParametersView/DecisionTrees.js';
import GradientBoostingMachineInput from './ModelParametersView/GradientBoostingMachineInput.js';
import Box from '@mui/material/Box';
import DBSCANInput from './ModelParametersView/DBSCANInput.js';
import KNNInput from './ModelParametersView/KNNInput.js';
import { useDispatch } from 'react-redux';

export default function ModelParameters(props) {
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
            <DialogTitle id="alert-dialog-title" sx={{textAlign:"center"}}>
            {props.alertDialogTitle}
              </DialogTitle>
                <DialogContent>
                    <Box sx={{ minHeight: 400, width: '90%', margin:"auto",borderRadius:"5px" }}  bgcolor="black" >
                        {
                          props.modelType == "Random Forest" &&
                          <RandomForestInput  />
                        }
                        {
                          props.modelType == "SVM" &&
                          <SVMInput/>
                        } 
                        {
                          props.modelType == "Linear Regression" &&
                          <LinearRegressionInput />
                        }
                        {
                          props.modelType == "Logistic Regression" &&
                          <LogisticRegressionInput />
                        }
                        {
                          props.modelType == "Decision Trees" &&
                          <DecisionTreesInput />
                        }
                        {
                          props.modelType == "Gradient Boosting Machine" &&
                          <GradientBoostingMachineInput />
                        }
                        {
                          props.modelType == "KNN" &&
                          <KNNInput/>
                        }
                        {
                          props.modelType == "DBSCAN" &&
                          <DBSCANInput/>
                        }
                    </Box>
                </DialogContent>
              <DialogActions>
                 <Button onClick={()=>{props.handleClose()}}>Close</Button>
                
              </DialogActions>
        </Dialog>
    </ThemeProvider>
    );

}
