import React, { memo, useEffect, useState } from 'react';
import { Handle, Position } from 'reactflow';
import styles from "./Dataset.css";
import { styled } from '@mui/material/styles';
import { useSelector } from "react-redux/es/hooks/useSelector";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare, faBorderNone } from '@fortawesome/free-solid-svg-icons';
import { faExpand, faSquareRootVariable } from '@fortawesome/free-solid-svg-icons';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import LogTransformation from '../dialogs/LogTransformation/LogTransformation';
import { useDispatch } from 'react-redux';
import {setNodes} from "../../../reducers/nodeSlice";
import toast, { Toaster } from 'react-hot-toast';

export default memo(({ data, isConnectable }) => {

  const dataset = useSelector((state)=>state.selectedDataset);
  const dispatch = useDispatch();
  const allNodes = useSelector((state)=>state.nodes);
  const log_transformation_columns = useSelector((state)=>{return state.log_transformation_columns});
  const [rows, setRows] = useState([]);
  const [isLogTransformationOpen, setIsLogTransformationOpen] = useState(false);

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
 
  const deleteNode = ()=>{
    let newNodeList = [...allNodes];
    newNodeList = newNodeList.filter((node)=> node.nodeData.type!=="Log Transformation");
    dispatch(setNodes(newNodeList));
  }
  
 

  useEffect(()=>{
    if(log_transformation_columns.length == 0){
      setRows([]);
    } else {
      setRows([...log_transformation_columns])
    }
  },[log_transformation_columns])
 
  const isDatasetSelected = ()=>{
    if( !dataset || dataset.length == 0){
      return false;
    } else {
      return true;
    }
  } 

  const checkDatasetSelectedAndGo = ()=>{
    if(isDatasetSelected() == true){
      setIsLogTransformationOpen(true);
    } else {
      alert("There was no dataset selected!");
    }
  }

  return (
    <div style={{ width:"500px", borderRadius:"5%",padding:"10px",border:"1px solid #ff08f7" }}>
        <Handle
        type="target"
        position={Position.Left}
        id="a"
        style={{padding:"10px",border:"3px solid #ff08f7"}}
        isConnectable={1}
      />
      <div>
        <p className='remove-node-btn-container' onClick={()=>{deleteNode()}}><span className='remove-node-btn'>x</span></p>
        <div className='dataset-node-header node-header-filter'>
            <FontAwesomeIcon icon={faSquareRootVariable} /> Log Transformation
        </div>
        <div className='dataset-node-separator'>
        </div>
        <div className='dataset-node-info-section'>
            <h3> Log Transformation Columns </h3>
            <hr/>
            {rows.length != 0 &&
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 200 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Columns</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <StyledTableRow key={row.name}>
                      <StyledTableCell component="th" scope="row">
                        {row.column_name}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>  
          }

          {rows.length == 0 && 
          <div className="no-data-container">
              <FontAwesomeIcon icon={faExpand}/>
          </div>
          }
            
            <hr/>
            <div className='dataset-node-bottom-toolbox'>
                <button className='dataset-toolbox-btn imputation-algs' style={{"color":"#ff08f7", "borderColor":"#9600fa"}} onClick={()=>{checkDatasetSelectedAndGo()}}>Edit Log Transformation <FontAwesomeIcon icon={faArrowUpRightFromSquare}/></button>
            </div>
        </div> 
        <div className='dataset-node-bottom'>

        </div>
      </div>
        {isLogTransformationOpen && <LogTransformation open={isLogTransformationOpen} handleClose={()=>{setIsLogTransformationOpen(false)}} />} 
      <Handle
        type="source"
        position={Position.Right}
        id="b"
        style={{padding:"10px",border:"3px solid #ff08f7"}}
        isConnectable={isConnectable}
      />
     
    </div>
  );
});
