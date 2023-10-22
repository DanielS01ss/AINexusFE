export const DATASET_FETCH_ALL_DATASETS = "http://localhost:8089/api/dataset/all-datasets";
export const DATASET_FETCH_DATASET_INFO = (id)=>`http://localhost:8089/api/dataset/dataset-info?id=${id}`;
export const DATASET_FETCH_DATASET_SNIPPET = (id)=>`http://localhost:8089/api/dataset/fetch-snippet?id=${id}`;