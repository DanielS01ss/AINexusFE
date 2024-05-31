import React, { useEffect, useState } from "react";
import { DATASET_FETCH_ALL_DATASETS, DATASET_FETCH_DATASET_INFO, DATASET_FETCH_DATASET_SNIPPET } from "../../../utils/apiEndpoints";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { convertStringToInt } from "../../../utils/convertStringToInt";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faAnglesLeft } from '@fortawesome/free-solid-svg-icons';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import toast, { Toaster } from 'react-hot-toast';
import axios from "axios";
import { Button } from "@mui/material";
import {getToken} from "../../../utils/apiEndpoints";
import { jwtDecode } from "jwt-decode";

import style from "./DatasetInformation.css";


export default function DatasetInformation () {

    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = React.useState(true);
    const [fetchedDatasetInfo, setFetchedDatasetInfo] = useState({});
    const [snippet, setsnippet] = useState([]);
    const [backBtnDisplayed, setBackBtnDisplayed] = useState(true);

    const [columns, setColumns] = useState([]);

      function createData(
        name,
        code,
        population,
        size
      ) {
        const density = population / size;
        return { name, code, population, size, density };
      }

      
    const [rows,setRows] = useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
  
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };


    const fetchDatasetInfo = (datasetId)=>{
      axios.get(DATASET_FETCH_DATASET_INFO(datasetId))
      .then(resp => { setFetchedDatasetInfo(resp.data);  console.log(resp.data); setIsLoading(false)})
      .catch(err => {console.log(err)})
    }

    const fetchDatasetSnippet = (datasetId) =>{
      axios.get(DATASET_FETCH_DATASET_SNIPPET(datasetId))
      .then(resp => { console.log("resp.data:"); console.log(resp.data); setsnippet(resp.data); setIsLoading(false) })
      .catch(err => {console.log(err)})
    }

    const populateColumns = ()=>{

      
      
      if(snippet.length != 0){
        const sampleObjectKeys = Object.keys(snippet[0]);
        const newColumnsList = sampleObjectKeys.map((id)=>{
          const newObj = {
            id:id,
            label:id,
            minWidth: 170,
            align: 'right',
            format: (value) => value,
          }
          return newObj;
        });

        setColumns(newColumnsList)
      }
        
    }


    const darkTheme = createTheme({
        palette: {
        mode: 'dark',
        },
    });

    const populateRows = () =>{
        setRows(snippet);
    }

    useEffect(()=>{
      populateColumns();
      populateRows();
    },[snippet])

    useEffect(()=>{
     
      
    },[])

    useEffect(()=>{
  
      if(snippet.length !=0 && Object.keys(fetchedDatasetInfo).length!=0){
        setIsLoading(false);
      }
      
    },[snippet,fetchedDatasetInfo])

    useEffect(()=>{
        const dataset_id = searchParams.get("dataset_id");
        if(!dataset_id){
            navigate("/not-found");
        } else{
            const numberConverted = convertStringToInt(dataset_id);
            if(!numberConverted){
                navigate("/not-found");
            } else {
                fetchDatasetInfo(numberConverted);
                fetchDatasetSnippet(numberConverted);          
            }
        }

    },[searchParams])

    return(
        <div className="big-dataset-info-container">
             {backBtnDisplayed && <p className="back-btn" onClick={()=>{navigate(-1);}}><FontAwesomeIcon icon={faAnglesLeft}/></p> }
            <h1>{}</h1>
            {isLoading && 
              <>
                <div className="loading-spinner"></div>
                <div>Loading...</div>
              </>
            }
            {!isLoading &&  
                <div className="data-set-info-section" style={{padding:"10px"}}>
                  <p className="about-dataset-text">About Dataset</p>
                  <p> &nbsp; &nbsp;  {fetchedDatasetInfo.about}</p>
                  <Divider/>
                  <p className="about-dataset-text">Authors</p>
                  {fetchedDatasetInfo.authors.map((value,index)=>{
                     return <p key={index}> &nbsp; &nbsp;  {value}</p>
                  })}
                  <Divider/>
                  <p className="about-dataset-text">Keywords</p>
                  <div className="keywords-container">
                  {fetchedDatasetInfo.keywords.map((value,index)=>{
                    return <div className="keywords-bubble" key={index}>{value}</div>
                  })}
            
                  </div>
                  <Divider/>
                  <ThemeProvider theme={darkTheme}>
                    <Paper sx={{ width: '100%',marginTop:"30px", overflow: 'hidden' }}>
                        <TableContainer sx={{ maxHeight: 940 }}>
                            <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth }}
                                    >
                                    {column.label}
                                    </TableCell>
                                ))} 
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                 {rows
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row) => {
                                    return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                        {columns.map((column) => {
                                        const value = row[column.id];
                                        return (
                                            <TableCell key={column.id} align={column.align}>
                                            {column.format && typeof value === 'number'
                                                ? column.format(value)
                                                : value}
                                            </TableCell>
                                        );
                                        })}
                                    </TableRow>
                                    );
                                })} 
                            </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[10, 25, 100]}
                            component="div"
                            count={rows.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Paper>
                  </ThemeProvider>
                
                  <div className="dataset-info-toolbox">
                      
                  </div>
              </div>
            } 
        </div>
    )
}