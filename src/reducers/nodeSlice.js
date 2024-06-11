import {createSlice, nanoid} from '@reduxjs/toolkit'
import { act } from 'react-dom/test-utils';


const initialState = {
    nodes:[],
    selectedDataset:[],
    selectedModelType:"",
    selectedDataFeaturingColumns:[],
    normalizationColumns:[],
    standardizationColumns:[],
    imputationAlgs:[],
    edgeToDelete:"",
    mappedNodes:[],
    constant_value_imputation_columns:[],
    constant_value_imputation_values:[],
    outlier_removal_columns:[],
    log_transformation_columns:[],
    feature_encoding_columns:[],
    label_encoding_columns:[],
    target_encoding_columns:[],
    one_hot_encoding_columns:[],
    edges:[],
    spawned_pipeline_edges:[],
    trainedModel:"",
    ml_algorithm_target:{},
    ml_algorithm_parameters:{},
    is_training_started:false,
    selectedDatasetGeneration:[],
    selectedProblemTypeGeneration:"",
    selectedTargetColumnGeneration:[],
    generatedPipelines:[],
    storedModeSelected:"",
    numberOfPipelinesToGenerate:0,
    isFeedbackOpen: false
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
            const containsID = state.nodes.filter(obj => obj.nodeData.type == action.payload.type );
            if(containsID.length == 0)
            {
                state.nodes.push(newNode);
            }
            
        },
        setIsStoredFeedbackOpen:(state, action)=>{
            state.isFeedbackOpen = action.payload;
        },
        setNumberOfPipelinesToGenerate:(state, action)=>{
            state.numberOfPipelinesToGenerate = action.payload;
        },
        setStoredModeSelected:(state, action)=>{
            state.storedModeSelected = action.payload;
        },
        setSelectedDatasetGeneration:(state, action)=>{
            state.selectedDatasetGeneration = action.payload;
        },
        setSelectedProblemTypeGeneration:(state, action)=>{
            state.selectedProblemTypeGeneration = action.payload;
        },
        setGeneratedPipelines: (state, action)=>{
            state.generatedPipelines = action.payload;
        },
        setSelectedTargetColumnGeneration: (state, action) =>{
            state.selectedTargetColumnGeneration = action.payload;
        },
        setSpawnedPipelineEdges:(state, action)=>{
            state.spawned_pipeline_edges = action.payload;
        },
        setLabelEncodingColumns:(state,action)=>{
            state.label_encoding_columns = action.payload;
        },
        setTargetEncodingColumns:(state, action)=>{
            state.target_encoding_columns = action.payload;
        },
        setOneHotEncodingColumnsReducer:(state, action)=>{
            state.one_hot_encoding_columns = action.payload;
        },
        setOutlierRemovalColumns:(state,action)=>{
            state.outlier_removal_columns = action.payload;
        },
        setLogTransformationColumns:(state, action)=>{
            state.log_transformation_columns = action.payload;
        },
        setFeatureEncodingColumns:(state,action)=>{
            state.feature_encoding_columns = action.payload;
        },
        setMLAlgorithmTarget:(state, action)=>{
            state.ml_algorithm_target = action.payload;
        },
        setConstantValueImputationColumns:(state,action)=>{
            state.constant_value_imputation_columns = action.payload
        },
        setStoredConstantValueImputationValues:(state,action)=>{
            state.constant_value_imputation_values = action.payload
        },
        setMappedNodes:(state, action)=>{
            state.mappedNodes = action.payload;
        },
        setMappedEdges:(state, action)=>{
            state.edges = action.payload
        },
        setNodes:(state, action)=>{
            state.nodes = action.payload
        },
        removeNode:(state, action) =>{
            state.nodes = state.nodes.filter((node)=> node.id !== action.payload)
        }, 
        removePreProcessingNodes:(state, action)=>{
           
        },
        resetSelectedModelType:(state, action)=>{
            state.selectedModelType = "";
        },
        clearDataset:(state,action)=>{
            state.selectedDataset = [];
        },
        addDataset:(state,action) =>{
            state.selectedDataset = [];
            state.selectedDataset = [action.payload]
        },
        removeDataset:(state,action) =>{
            state.selectedDataset = [];
        },
        removeDataFeaturingColumns:(state,action)=>{
            state.selectedDataFeaturingColumns = [];
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
        resetNormalizationAndStandardization:(state) =>{
            state.normalizationColumns = [];
            state.standardizationColumns = [];
        },
        setIsTrainingStarted:(state, action) =>{
            state.is_training_started = action.payload
        },
        setTrainedModel:(state, action)=>{
            state.trainedModel = action.payload;
        },
        setMLAlgorithmParameters:(state, action)=>{
            state.ml_algorithm_parameters = action.payload;
        }
         
    }
});


export const { setStoredModeSelected, setIsStoredFeedbackOpen, setNumberOfPipelinesToGenerate,  setGeneratedPipelines, setSelectedTargetColumnGeneration ,setSelectedProblemTypeGeneration, setSelectedDatasetGeneration, setSpawnedPipelineEdges, setFeatureEncodingColumns, setOneHotEncodingColumnsReducer, setTargetEncodingColumns, setLabelEncodingColumns, setLogTransformationColumns, setOutlierRemovalColumns, setMLAlgorithmParameters, setTrainedModel, setIsTrainingStarted, setMLAlgorithmTarget,setStoredConstantValueImputationValues, setConstantValueImputationColumns,setMappedNodes, setMappedEdges, resetSelectedModelType, resetNormalizationAndStandardization, removeDataFeaturingColumns, addNode,setNodes,removeDataset,removeNode , addDataset, addAlgorithm, setSelectedModelType, setSelectedDataFeaturingColumns,setNormalizationColumns,setStandardizationColumns,setImputationAlgs, setEdgeToDelete, clearDataset, removePreProcessingNodes} = nodeSlice.actions

export default nodeSlice.reducer;