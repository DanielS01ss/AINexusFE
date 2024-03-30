export const DATASET_FETCH_ALL_DATASETS = "http://localhost:8089/api/dataset/all-datasets";
export const DATASET_FETCH_DATASET_INFO = (id)=>`http://localhost:8089/api/dataset/dataset-info?id=${id}`;
export const DATASET_FETCH_DATASET_SNIPPET = (id)=>`http://localhost:8089/api/dataset/fetch-snippet?id=${id}`;
export const START_PIPELINE = `http://localhost:8081/start_pipeline`;
export const AUTHENTICATION_LOGIN = `http://localhost:8088/api/v1/auth/authenticate`;
export const AUTHENTICATION_REGISTER = `http://localhost:8088/api/v1/auth/register`;
export const GET_MODELS_FOR_USER = (email)=>`http://localhost:8081/models?email=${email}`;
export const GET_MODEL_DETAILS = (model_name)=>`http://localhost:8081/model/details?model_name=${model_name}`;
export const POST_PIPELINE_LOGS = `http://localhost:8081/logs`;
export const GET_PIPELINE_LOGS = (email) =>  `http://localhost:8081/logs?email=${email}`;
export const DELETE_LOGS = (email) => `http://localhost:8081/logs?email=${email}`;
export const GET_PIPELINE_SUMMARY_PLOT = (model_name)=> `http://localhost:8081/model/summary_plot?model_name=${model_name}`;
export const GET_PIPELINE_FORCE_PLOT = (model_name)=> `http://localhost:8081/model/force_plot?model_name=${model_name}`;
export const SAVE_PIPELINE = `http://localhost:8081/save/pipeline`;
export const GET_SAVED_PIPELINES = (email_name)=>`http://localhost:8081/saved-pipelines?user_email=${email_name}`;
export const DELETE_PIPELINE = (pipeline_name) => `http://localhost:8081/pipeline?pipeline_name=${pipeline_name}`;
export const DELETE_MODEL = (model_name) => `http://localhost:8081/model?model_name=${model_name}`;