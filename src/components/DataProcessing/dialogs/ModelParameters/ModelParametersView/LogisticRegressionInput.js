import React, {useState, useEffect} from "react";
import {
    Unstable_NumberInput as BaseNumberInput,
    numberInputClasses,
  } from '@mui/base/Unstable_NumberInput';
import { styled } from '@mui/system';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useDispatch } from "react-redux";
import toast, { Toaster } from 'react-hot-toast';
import Button from '@mui/material/Button';
import { useSelector } from "react-redux";
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { NumericFormat  } from "react-number-format";
import { setMLAlgorithmParameters } from "../../../../../reducers/nodeSlice";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import style from "./ModelParametersView.css";

const CustomNumberInput = React.forwardRef(function CustomNumberInput(props, ref) {
    return (
      <BaseNumberInput
        slots={{
          root: StyledInputRoot,
          input: StyledInputElement,
          incrementButton: StyledButton,
          decrementButton: StyledButton,
        }}
        slotProps={{
          incrementButton: {
            children: '▴',
          },
          decrementButton: {
            children: '▾',
          },
        }}
        {...props}
        ref={ref}
      />
    );
  });

export default function LogisticRegressionInput (){
  const [allParameters, setAllParameters] = React.useState({
  })
  const ml_algorithm_parameters = useSelector((state)=> state.ml_algorithm_parameters);

  const dispatch = useDispatch();
  const handleChange = (value, element) => {
    const updatedParametersValues = {...allParameters};
    updatedParametersValues[element] = value;
    setAllParameters(updatedParametersValues);
  };

  const blockAlert = (msg)=>{
    toast.success(msg,{
      duration:2000,
      position:'top-right',
    })
  }

  const handleSave = ()=>{
    dispatch(setMLAlgorithmParameters(allParameters));
    blockAlert("The parameters were successfully saved!");
  }

  useEffect(()=>{

    if(Object.keys(ml_algorithm_parameters)!=0){
      setAllParameters(ml_algorithm_parameters);
    }
  },[ml_algorithm_parameters])


    return (
        <div>
            <div className="input-element">
                <p className="parameter-name">Penalty</p>
                <FormControl fullWidth sx={{width:"60%", mx:"auto"}}>
                    <InputLabel id="demo-simple-select-label">Penalty</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={allParameters["penalty"]?allParameters["penalty"]: "" }
                      label="penalty"
                      onChange={(event)=>{handleChange(event.target.value, "penalty")}}
                    >
                      <MenuItem value={"l1"}>l1</MenuItem>
                      <MenuItem value={"l2"}>l2</MenuItem>
                    </Select>
                </FormControl>
            </div> 
            <div className="input-element">
                <p className="parameter-name">C</p>
                <NumericFormat
                        className="numeric-format-input-custom"
                        value={allParameters["c"]}
                        isAllowed={(values) => {
                        const { floatValue } = values;
                        if(floatValue <= 1000 && floatValue >= 0.01)
                        {
                          handleChange(floatValue,"c");
                        }
                      return  floatValue <= 1000 && floatValue >= 0.01;
                      }}
                  />
                <p className="info-bullet-container"> <FontAwesomeIcon icon={faCircleInfo}/> Range: (0.01 , 1000) </p>
            </div>
            <div className="input-element">
                <p className="parameter-name">solver</p>
                <FormControl fullWidth sx={{width:"60%", mx:"auto"}}>
                    <InputLabel id="demo-simple-select-label">solver</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={allParameters["solver"]? allParameters["solver"]: ""}
                      label="Solver"
                      onChange={(event)=>{handleChange(event.target.value, "solver")}}
                    >
                      <MenuItem value={"liblinear"}>liblinear</MenuItem>
                      <MenuItem value={"newton-cg"}>newton-cg</MenuItem>
                      <MenuItem value={"lbfgs"}>lbfgs</MenuItem>
                      <MenuItem value={"sag"}>sag</MenuItem>
                      <MenuItem value={"saga"}>saga</MenuItem>
                    </Select>
                </FormControl>
            </div>

            <div className="input-element">
                <p className="parameter-name">max_iter</p>
                <CustomNumberInput value={allParameters["max_iter"]?allParameters["max_iter"] : "" } onChange={(event,value)=>{handleChange(value,"max_iter")}} sx={{width:"60%", mx:"auto"}} aria-label="Demo number input" placeholder="Type a number…" min={100} max={1000} />
                <p className="info-bullet-container"> <FontAwesomeIcon icon={faCircleInfo}/> Range: (100 , 1000) </p>
            </div>
            <div className="save-btn-variable-input">
              <Button onClick={()=>{handleSave()}} sx={{mb:"20px", color:"#fff", bgcolor:"blue", fontSize:"1.2rem"}} autoFocus>
                    Save
              </Button>
            </div>
        </div>
        
      );
}


const blue = {
    100: '#DAECFF',
    200: '#80BFFF',
    400: '#3399FF',
    500: '#007FFF',
    600: '#0072E5',
    700: '#0059B2',
  };
  
  const grey = {
    50: '#F3F6F9',
    100: '#E5EAF2',
    200: '#DAE2ED',
    300: '#C7D0DD',
    400: '#B0B8C4',
    500: '#9DA8B7',
    600: '#6B7A90',
    700: '#434D5B',
    800: '#303740',
    900: '#1C2025',
  };
  
  const StyledInputRoot = styled('div')(
    ({ theme }) => `
    font-family: 'IBM Plex Sans', sans-serif;
    font-weight: 400;
    border-radius: 8px;
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
    background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
    box-shadow: 0px 2px 4px ${
      theme.palette.mode === 'dark' ? 'rgba(0,0,0, 0.5)' : 'rgba(0,0,0, 0.05)'
    };
    display: grid;
    grid-template-columns: 1fr 19px;
    grid-template-rows: 1fr 1fr;
    overflow: hidden;
    column-gap: 8px;
    padding: 4px;
  
    &.${numberInputClasses.focused} {
      border-color: ${blue[400]};
      box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[700] : blue[200]};
    }
  
    &:hover {
      border-color: ${blue[400]};
    }
  
    // firefox
    &:focus-visible {
      outline: 0;
    }
  `,
  );
  
  const StyledInputElement = styled('input')(
    ({ theme }) => `
    font-size: 0.875rem;
    font-family: inherit;
    font-weight: 400;
    line-height: 1.5;
    grid-column: 1/2;
    grid-row: 1/3;
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
    background: inherit;
    border: none;
    border-radius: inherit;
    padding: 8px 12px;
    outline: 0;
  `,
  );
  
  const StyledButton = styled('button')(
    ({ theme }) => `
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    appearance: none;
    padding: 0;
    width: 19px;
    height: 19px;
    font-family: system-ui, sans-serif;
    font-size: 0.875rem;
    line-height: 1;
    box-sizing: border-box;
    background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
    border: 0;
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 120ms;
  
    &:hover {
      background: ${theme.palette.mode === 'dark' ? grey[800] : grey[50]};
      border-color: ${theme.palette.mode === 'dark' ? grey[600] : grey[300]};
      cursor: pointer;
    }
  
    &.${numberInputClasses.incrementButton} {
      grid-column: 2/3;
      grid-row: 1/2;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
      border: 1px solid;
      border-bottom: 0;
      border-color: ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
      background: ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};
      color: ${theme.palette.mode === 'dark' ? grey[200] : grey[900]};
  
      &:hover {
        cursor: pointer;
        color: #FFF;
        background: ${theme.palette.mode === 'dark' ? blue[600] : blue[500]};
        border-color: ${theme.palette.mode === 'dark' ? blue[400] : blue[600]};
      }
    }
  
    &.${numberInputClasses.decrementButton} {
      grid-column: 2/3;
      grid-row: 2/3;
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
      border: 1px solid;
      border-color: ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
      background: ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};
      color: ${theme.palette.mode === 'dark' ? grey[200] : grey[900]};
    }
  
    &:hover {
      cursor: pointer;
      color: #FFF;
      background: ${theme.palette.mode === 'dark' ? blue[600] : blue[500]};
      border-color: ${theme.palette.mode === 'dark' ? blue[400] : blue[600]};
    }
  
    & .arrow {
      transform: translateY(-1px);
    }
  
    & .arrow {
      transform: translateY(-1px);
    }
  `,
  );