import React from "react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { GET_MODEL_DETAILS } from "../../../utils/apiEndpoints";
import { useNavigate } from 'react-router-dom';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import style from "./ModelDetails.css";
import axios from "axios";


function TablePaginationActions(props) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;
  
    const handleFirstPageButtonClick = (event) => {
      onPageChange(event, 0);
    };
  
    const handleBackButtonClick = (event) => {
      onPageChange(event, page - 1);
    };
  
    const handleNextButtonClick = (event) => {
      onPageChange(event, page + 1);
    };
  
    const handleLastPageButtonClick = (event) => {
      onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };
  
    return (
      <Box sx={{ flexShrink: 0, ml: 2.5 }}>
        <IconButton
          onClick={handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="first page"
        >
          {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          onClick={handleBackButtonClick}
          disabled={page === 0}
          aria-label="previous page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="next page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="last page"
        >
          {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </Box>
    );
  }

  TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
  };
  
  function createData(name, calories, fat) {
    return { name, calories, fat };
  }
  
  


const ModelDetails = ()=>{
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [modelName, setModelName] = useState("");
    const [allParametersNames, setAllParameterNames] = useState([]);
    const [allParametersValues, setAllParametersValues] = useState([]);
    const [allMetricsNames, setAllMetricsNames] = useState([]);
    const [allMetricsValues, setAllMetricsValues] = useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    
    const rows = [
        createData('Cupcake', 305, 3.7),
        createData('Donut', 452, 25.0),
        createData('Eclair', 262, 16.0),
        createData('Frozen yoghurt', 159, 6.0),
        createData('Gingerbread', 356, 16.0),
        createData('Honeycomb', 408, 3.2),
        createData('Ice cream sandwich', 237, 9.0),
        createData('Jelly Bean', 375, 0.0),
        createData('KitKat', 518, 26.0),
        createData('Lollipop', 392, 0.2),
        createData('Marshmallow', 318, 0),
        createData('Nougat', 360, 19.0),
        createData('Oreo', 437, 18.0),
      ];


    const darkTheme = createTheme({
        palette: {
          mode: 'dark',
        },
      });
    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
      page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
  
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };

    const parseParametricsAndMetrics = async(model_data)=>{
        const parameters = model_data["parameters"];
        const metrics = model_data["metrics"];
    

        const parametersNames = [];
        const parametersValues = [];
        const metricsNames = [];
        const metricsValues = [];
        for (const key in parameters) {
            if (parameters.hasOwnProperty(key)) {
                const value = parameters[key];
                parametersNames.push(key);
                parametersValues.push(value);
            }
        }

        for (const key in metrics) {
            if (metrics.hasOwnProperty(key)) {
                const value = metrics[key];
                metricsNames.push(key);
                metricsValues.push(value);
            }
        }

        setAllParameterNames(parametersNames);
        setAllParametersValues(parametersValues);
        setAllMetricsValues(metricsValues);
        setAllMetricsNames(metricsNames);

    }

    const fetchModelDetails = async(model_name)=>{
        try{
            const resp = await axios.get(GET_MODEL_DETAILS(model_name));
            const model_details = JSON.parse(resp.data.content.content);
            parseParametricsAndMetrics(model_details);
        } catch(err){
            console.log(err);
        }
    }


    useEffect(()=>{
        const model_name = searchParams.get("model_name");
        if(!model_name || model_name.length == 0){
            navigate("/not-found");
        }
        setModelName(model_name);
        fetchModelDetails(model_name);
    },[searchParams])

    return(
        <div>
            <div className="model-info-card">
                <div className="model-info-card-container">
                    <h2>Model Details</h2>
                    <div className="model-info-card-body">
                        <p><span className="model-info-card-model-name">Model Name:</span> <span>{modelName}</span></p>     
                        <p><span className="model-info-card-model-name">Date:</span> <span>18/09/2023</span></p>
                    </div>    
                    <Divider/>
                    <div className="model-info-card-parameters-section">
                        <p>Parameters</p>
                    <ThemeProvider theme={darkTheme}>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 1000 }} aria-label="custom pagination table">
                                <TableBody>
                                {(rowsPerPage > 0
                                    ? allParametersNames.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    : allParametersNames
                                ).map((row, index) => (
                                    <TableRow key={row}>
                                    <TableCell component="th" scope="row">
                                        {row}
                                    </TableCell>
                                    <TableCell style={{ width: 160 }} align="right">
                                        {allParametersValues[index]}
                                    </TableCell>
                                    </TableRow>
                                ))}
                                {emptyRows > 0 && (
                                    <TableRow style={{ height: 53 * emptyRows }}>
                                    <TableCell colSpan={6} />
                                    </TableRow>
                                )}
                                </TableBody>
                                <TableFooter>
                                <TableRow>
                                    <TablePagination
                                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                    colSpan={3}
                                    count={allParametersNames.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    slotProps={{
                                        select: {
                                        inputProps: {
                                            'aria-label': 'rows per page',
                                        },
                                        native: true,
                                        },
                                    }}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    ActionsComponent={TablePaginationActions}
                                    />
                                        </TableRow>
                                    </TableFooter>
                                </Table>
                            </TableContainer>

                    </ThemeProvider>
                       
                    </div>
                </div>
            </div>
        </div>
    );

};

export default ModelDetails;