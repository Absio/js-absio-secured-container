import { actionTypes } from './constants';
import * as _  from 'lodash';

import {
    logIn,
    logOut,
    getBackupReminder,
    getEvents } from 'absio-secured-container';

export const searchById = (value) => {
    return async (dispatch, getState) => {
        dispatch({type: actionTypes.START_LOADING});
        try {
            if(searchById.length){
                const events = await getEvents({startingEventId: 0});
                const containers = filterEventsId(events);
                let filteredContainers = containers.filter((elem, index, array) => {
                    return elem.containerId.includes(value);
                });
                dispatch({type: actionTypes.CONTAINERS_ARRAY_UPDATED, containers: filteredContainers })
            }
            else{
                dispatch(processEvents());
            }
        }
        catch (error) {
            console.log(error.message);
            dispatch({type: actionTypes.ERROR_OCCURRED, error: {message: error.message}});
        }

        dispatch({type: actionTypes.STOP_LOADING});
    }

};

const filterEventsId = (events) => {
    // available actions for events 'all', 'accessed', 'added', 'deleted', or 'updated'

    let deletedEvents = events.filter((elem, index, array) => {
        return elem.action === 'deleted';
    });

    let arrayWithoutDeleted = _.differenceBy(events, deletedEvents, 'containerId');
    let sortedEventsByDate = _.sortBy(arrayWithoutDeleted, function (val) {return new Date(val.date);});

    return _.uniqBy(_.reverse(sortedEventsByDate), function(val){ return val.containerId});
};


export const processEvents = () => {
    return async (dispatch, getState) => {
        dispatch({type: actionTypes.START_LOADING});
        try {
            const events = await getEvents({startingEventId: 0});
            let filteredEvents = filterEventsId(events);
            dispatch({type: actionTypes.CONTAINERS_ARRAY_UPDATED, containers: filteredEvents })
        }
        catch (error) {
            console.log(error.message);
            dispatch({type: actionTypes.ERROR_OCCURRED, error: {message: error.message}});
        }

        dispatch({type: actionTypes.STOP_LOADING});
    }
};

export const login = (id, password, passphrase)=>{
    return async (dispatch, getState) => {

        dispatch({type:actionTypes.START_LOADING});
        try{

            await logIn(id.trim(), password, passphrase, { cacheLocal : false });
            const reminder = await getBackupReminder(id);
            dispatch({ type:actionTypes.LOGIN_COMPLETED, reminder, id});
            dispatch(processEvents());

        }
        catch(error) {
            console.log(error.message);
            dispatch({type: actionTypes.ERROR_OCCURRED, error:{ message: error.message}});
        }
        dispatch({type:actionTypes.STOP_LOADING});
    };
};

export const logout = () => {
    return async (dispatch, getState) => {
        dispatch({ type: actionTypes.START_LOADING });
        try {
            await logOut();
            dispatch({ type: actionTypes.LOGGED_OUT});
            dispatch(showLoginView());
        }
        catch(error){
            console.log(error.message);
            dispatch({type: actionTypes.ERROR_OCCURRED, error:{ message: error.message}});
        }
        dispatch({ type: actionTypes.STOP_LOADING });
    }
};

export const showLoginView = ()=> {
    return async (dispatch, getState) => {
        dispatch({ type: actionTypes.SHOW_LOGIN_VIEW });
    }
};

export const loadNewFile = () =>{
    return async (dispatch, getState) => {

    };
};

export const searchContainerById = (containerId) => {
    return async (dispatch, getState) => {

    };
};