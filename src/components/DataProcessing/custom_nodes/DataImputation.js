import React, { memo, useEffect, useState } from 'react';
import { Handle, Position } from 'reactflow';
import styles from "./Dataset.css";
import { styled } from '@mui/material/styles';
import { useSelector } from "react-redux/es/hooks/useSelector";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { faDivide } from '@fortawesome/free-solid-svg-icons';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Imputation from '../dialogs/Imputation/Imputation';


export default memo(({ data, isConnectable }) => {
  const imputationAlgs = useSelector((state)=>{return state.imputationAlgs});
  const [rows, setRows] = useState([]);
  const [isImputationModalOpen, setIsImputationModalOpen] = useState(false);
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
  
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

 

  useEffect(()=>{
    if(imputationAlgs.length == 0){
      setRows([]);
    } else {
      setRows([{
        name:imputationAlgs[0]
      }])
    }
  },[imputationAlgs])

  return (
    <div style={{ width:"500px", borderRadius:"5%",padding:"10px",border:"1px solid #fc0324" }}>
        <Handle
        type="target"
        position={Position.Left}
        id="a"
        style={{padding:"10px",border:"3px solid #fc0324"}}
        isConnectable={isConnectable}
      />
      <div>
        <div className='dataset-node-header node-header-filter'>
            <FontAwesomeIcon icon={faDivide} /> Data imputation
        </div>
        <div className='dataset-node-separator'>

        </div>
        <div className='dataset-node-info-section'>
            <h3>  </h3>
            <hr/>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 200 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Column Name</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <StyledTableRow key={row.name}>
                      <StyledTableCell component="th" scope="row">
                        {row.name}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <hr/>
            <div className='dataset-node-bottom-toolbox'>
                <button className='dataset-toolbox-btn imputation-algs' onClick={()=>{setIsImputationModalOpen(true);}}>Edit imputation algs <FontAwesomeIcon icon={faArrowUpRightFromSquare}/></button>
            </div>
        </div>
        <div className='dataset-node-bottom'>

        </div>
      </div>
        {isImputationModalOpen && <Imputation open={isImputationModalOpen} handleClose={()=>{setIsImputationModalOpen(false)}} />}
      <Handle
        type="source"
        position={Position.Right}
        id="b"
        style={{padding:"10px",border:"3px solid #fc0324"}}
        isConnectable={isConnectable}
      />
     
    </div>
  );
});
