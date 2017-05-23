import download  from 'downloadjs';
import * as _  from 'lodash';
import moment from 'moment';


import { actionTypes } from '../constants';
import {
    update,
    deleteContainer,
    get,
    create} from 'absio-secured-container';

import {processEvents} from './../actions';



export const createNewContainer = (userId, headerContent, containerType, permissions, expirationDate, fileBlob) => {
    return async (dispatch) => {
        dispatch({type: actionTypes.START_LOADING});
        try{

            let options = {
                type:containerType,
                header:{
                    headerContent:headerContent,
                    contentFileName: fileBlob.file.name
                },
                access:{
                    [userId]:{
                        permissions:permissions
                    }
                }
            };

            if(expirationDate){
                options.access[userId].expiration = moment(expirationDate).toDate();
            }
            const data = await getArrayBufferFromBlob(fileBlob.file);
            await create(data,options);
        }
        catch(error) {
            console.log(error.message);
            dispatch({type: actionTypes.ERROR_OCCURRED, error: {message: error.message}});
        }
        dispatch(processEvents());
        dispatch({type: actionTypes.STOP_LOADING});
    }
};

const getArrayBufferFromBlob = async (blob) => {
    return new Promise((resolve, reject) => {

        const fileReader = new FileReader();

        fileReader.onload = function(e) {
            const arrayBuffer = e.target.result;
            resolve(new Buffer(arrayBuffer));
        };

        fileReader.readAsArrayBuffer(blob);
    });
};

export const updateContainerAccess = (containerId, userId, permissions, expirationDate) => {
    return async (dispatch) => {
        dispatch({type: actionTypes.START_LOADING});

        try{
            let options = {
                access:{
                    [userId]:{
                        permissions: permissions
                    }
                }
            };

            if(expirationDate){
                options.access[userId].expiration = moment(expirationDate).toDate();
            }
            else{
                options.access[userId].expiration = null;
            }
            await update(containerId, options);
        }
        catch(error) {
            console.log(error.message);
            dispatch({type: actionTypes.ERROR_OCCURRED, error: {message: error.message}});
        }
        dispatch(processEvents());
        dispatch({type: actionTypes.STOP_LOADING});
    }
};

export const deleteExistingContainer = (containerId) => {
    return async (dispatch) => {
        dispatch({type: actionTypes.START_LOADING});
        try{
           await deleteContainer(containerId);
        }
        catch(error) {
            console.log(error.message);
            dispatch({type: actionTypes.ERROR_OCCURRED, error: {message: error.message}});
        }
        dispatch(processEvents());
        dispatch({type: actionTypes.STOP_LOADING});
    }
};

export const updateExistingContainer = (containerId, headerContent, containerType, fileBlob) => {
    return async (dispatch) => {
        dispatch({type: actionTypes.START_LOADING});
        try{

            let options = {
                type:containerType,
                header:{
                    headerContent:headerContent,
                    contentFileName: fileBlob.file.name
                }
            };

            await update(containerId, options);

        }
        catch(error) {
            console.log(error.message);
            dispatch({type: actionTypes.ERROR_OCCURRED, error: {message: error.message}});
        }
        dispatch(processEvents());
        dispatch({type: actionTypes.STOP_LOADING});
    }
};

export const openFileInContainer = () => {
    return async (dispatch, getState) => {
        dispatch({type: actionTypes.START_LOADING});

        try{
            const state = getState();
            let container = state.container.container;
            console.log(container.access[state.user.userId]);
            if(container.access[state.user.userId].permissions.container.download){
                download(container.content.toString('binary'), container.header.contentFileName)
            }
            else {
                dispatch({type: actionTypes.ERROR_OCCURRED, error: {message:"Sorry, this file can't be opened due to permission restriction."}});
            }
        }
        catch(error) {
            console.log(error.message);
            dispatch({type: actionTypes.ERROR_OCCURRED, error: {message: error.message}});
        }

        dispatch({type: actionTypes.STOP_LOADING});
    }
};

const getContainerInfo = async (containerId, dispatch) => {
    try {
        const container  = await get(containerId);
        dispatch({type: containerActions.UPDATE_CONTAINER_INFO, container})
    }
    catch (error) {
        console.log(error.message);
        dispatch({type: actionTypes.ERROR_OCCURRED, error: {message: error.message}});
    }
};

export const clearModalState = () => {
    return async (dispatch) => {
        dispatch({type: containerActions.CLEAR_MODAL_STATE});
    };
};

export const updateDataAndCallModalIfNeeded = (type, containerId) => {
    return async (dispatch) => {
        try {

            dispatch({type: actionTypes.CLEAN_ERROR});

            if(type !==containerActions.SHOW_DELETE_MODAL) {
                await getContainerInfo(containerId, dispatch);
            }

            if( type === containerActions.SHOW_UPDATE_ACCESS_MODAL ||
                type === containerActions.SHOW_CONTAINER_INFO_MODAL ||
                type === containerActions.SHOW_UPDATE_CONTAINER_MODAL ||
                type ===containerActions.SHOW_DELETE_MODAL) {

                dispatch({ type, containerId, showModal: true })
            }
            else if(type === containerActions.OPEN_FILE_FROM_CONTAINER){
                dispatch(openFileInContainer())
            }

            console.log(type);
        }
        catch (error) {
            console.log(error.message);
            dispatch({type: actionTypes.ERROR_OCCURRED, error: { message: error.message}});
        }
    }
};

export const containerActions = {

    SHOW_UPDATE_ACCESS_MODAL:'SHOW_UPDATE_ACCESS_MODAL',
    SHOW_DELETE_MODAL: 'SHOW_DELETE_MODAL',
    SHOW_UPDATE_CONTAINER_MODAL: 'SHOW_UPDATE_CONTAINER_MODAL',
    SHOW_CONTAINER_INFO_MODAL: 'SHOW_CONTAINER_INFO_MODAL',
    SHOW_LOAD_NEW_FILE_MODAL: 'SHOW_LOAD_NEW_FILE_MODAL',
    CLEAR_MODAL_STATE: 'CLEAR_MODAL_STATE',
    UPDATE_CONTAINER: 'UPDATE_CONTAINER',
    OPEN_FILE_FROM_CONTAINER: 'OPEN_FILE_FROM_CONTAINER',
    UPDATE_CONTAINER_INFO: 'UPDATE_CONTAINER_INFO',

    UNDEFINED: 'UNDEFINED'
};

