import {configureStore} from "@reduxjs/toolkit";
import nodeReducer from "../reducers/nodeSlice";


const persistentState = localStorage.getItem('state') ? JSON.parse(localStorage.getItem('state')) : {}

export const store = configureStore({
    reducer:nodeReducer,
    persistentState
});


store.subscribe(() => {
    const state = store.getState();
    const serializedState = JSON.stringify(state);
    localStorage.setItem('state', serializedState);
})