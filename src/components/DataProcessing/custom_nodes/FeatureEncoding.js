import React, { memo, useEffect, useState } from 'react';
import { Handle, Position } from 'reactflow';
import styles from "./Dataset.css";
import { styled } from '@mui/material/styles';
import { useSelector } from "react-redux/es/hooks/useSelector";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { faTag,  faExpand, faGroupArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import FeatureEncoding from '../dialogs/FeatureEncoding/FeatureEncoding';
import { useDispatch } from 'react-redux';
import {setNodes} from "../../../reducers/nodeSlice";
import toast, { Toaster } from 'react-hot-toast';

export default memo(({ data, isConnectable }) => {

  const dataset = useSelector((state)=>state.selectedDataset);
  const dispatch = useDispatch();
  const allNodes = useSelector((state)=>state.nodes);
  const feature_encoding_columns = useSelector((state)=>{return state.feature_encoding_columns});
  const [rows, setRows] = useState([]);
  const [isFeatureEncodingOpen, setIsFeatureEncodingOpen] = useState(false);
  const label_encoding_columns = useSelector((state)=> state.label_encoding_columns);
  const target_encoding_columns = useSelector((state)=> state.target_encoding_columns);
  const one_hot_encoding_columns = useSelector((state)=> state.one_hot_encoding_columns);

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
    newNodeList = newNodeList.filter((node)=> node.nodeData.type!=="Feature Encoding");
    dispatch(setNodes(newNodeList));
  }
  
 

  useEffect(()=>{
   
    const allEncoding = [];
    if(label_encoding_columns.length !=0 || target_encoding_columns.length!=0 || one_hot_encoding_columns.length !=0){
      for(const col of label_encoding_columns){
        allEncoding.push(col);
      }
      for(const col of target_encoding_columns){
        allEncoding.push(col);
      }
      for(const col of one_hot_encoding_columns){
        allEncoding.push(col);
      }
      setRows(allEncoding);
    } else{
      setRows([]);
    }
  },[label_encoding_columns, target_encoding_columns, one_hot_encoding_columns])
 
  const isDatasetSelected = ()=>{
    if( !dataset || dataset.length == 0){
      return false;
    } else {
      return true;
    }
  } 

  const checkDatasetSelectedAndGo = ()=>{
    if(isDatasetSelected() == true){
      setIsFeatureEncodingOpen(true);
    } else {
      alert("There was no dataset selected!");
    }
  }

  return (
    <div style={{ width:"500px", borderRadius:"5%",padding:"10px",border:"1px solid #4a71ff" }}>
        <Handle
        type="target"
        position={Position.Left}
        id="a"
        style={{padding:"10px",border:"3px solid #4a71ff"}}
        isConnectable={1}
      />
      <div>
        <p className='remove-node-btn-container' onClick={()=>{deleteNode()}}><span className='remove-node-btn'>x</span></p>
        <div className='dataset-node-header node-header-filter'>
            <FontAwesomeIcon icon={faTag} /> Feature Encoding
        </div>
        <div className='dataset-node-separator'>
        </div>
        <div className='dataset-node-info-section'>
            <h3> Feature Encoding Columns </h3>
            <hr/>
            {rows.length != 0 &&
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 200 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Columns</StyledTableCell>
                    <StyledTableCell>Encoding Type</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <StyledTableRow key={row.name}>
                      <StyledTableCell component="th" scope="row">
                        {row.column_name}
                      </StyledTableCell>
                      <StyledTableCell component="th" scope="row">
                        {row.type}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>  
          }

          {rows.length == 0 && 
          <div className="no-data-container">
              <FontAwesomeIcon icon={faGroupArrowsRotate}/>
          </div>
          }
            
            <hr/>
            <div className='dataset-node-bottom-toolbox'>
                <button className='dataset-toolbox-btn imputation-algs' style={{"color":"#fff", "borderColor":"#4a71ff"}} onClick={()=>{checkDatasetSelectedAndGo()}}>Edit Feature Encoding <FontAwesomeIcon icon={faArrowUpRightFromSquare}/></button>
            </div>
        </div> 
        <div className='dataset-node-bottom'>

        </div>
      </div>
         {isFeatureEncodingOpen && <FeatureEncoding open={isFeatureEncodingOpen} handleClose={()=>{setIsFeatureEncodingOpen(false)}} />} 
      <Handle
        type="source"
        position={Position.Right}
        id="b"
        style={{padding:"10px",border:"3px solid #4a71ff"}}
        isConnectable={isConnectable}
      />
     
    </div>
  );
});
