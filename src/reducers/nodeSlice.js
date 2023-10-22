import {createSlice, nanoid} from '@reduxjs/toolkit'

const initialState = {
    nodes:[],
    selectedDataset:[],
    selectedModelType:"",
    selectedDataFeaturingColumns:[],
    normalizationColumns:[],
    standardizationColumns:[],
    imputationAlgs:[],
    edgeToDelete:""
}

export const nodeSlice = createSlice({
    name:'nodes',
    initialState,
    reducers:{
        addNode: (state,action) => {
            
            const newNode = {
                id:nanoid(),
                nodeData:action.payload
            }
            
            state.nodes.push(newNode);
        } ,
        removeNode:(state, action) =>{
            state.nodes = state.nodes.filter((node)=> node.id !== action.payload)
        }, 
        addDataset:(state,action) =>{
            state.selectedDataset = [];
            state.selectedDataset = [action.payload]
        },
        setSelectedModelType:(state,action)=>{
            state.selectedModelType = action.payload;
        },
        setSelectedDataFeaturingColumns:(state,action) =>{
            state.selectedDataFeaturingColumns = action.payload
        },
        setNormalizationColumns:(state, action)=>{
            state.normalizationColumns = action.payload;
        },
        setStandardizationColumns:(state,action)=>{
            state.standardizationColumns = action.payload;
        },
        setImputationAlgs:(state,action) =>{
            state.imputationAlgs = action.payload;
        },
        setEdgeToDelete:(state,action)=>{
            state.edgeToDelete = action.payload;
        },
        
    }
});


export const {addNode, removeNode , addDataset, addAlgorithm, setSelectedModelType, setSelectedDataFeaturingColumns,setNormalizationColumns,setStandardizationColumns,setImputationAlgs, setEdgeToDelete} = nodeSlice.actions

export default nodeSlice.reducer;