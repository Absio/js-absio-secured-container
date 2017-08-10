
import { containerActions } from '../actions/containerActions';

const initialState = {
    modal:{
        show: false,
        modalType: containerActions.UNDEFINED,
        containerId: ''
    },
    container: {},
    UPDATE_CONTAINER_INFO:{}
};

const container = (state, action) => {
    if (typeof state === 'undefined') {
        return initialState;
    }
    switch (action.type) {

        case containerActions.SHOW_CONTAINER_INFO_MODAL:
        case containerActions.SHOW_DELETE_MODAL:
        case containerActions.SHOW_UPDATE_ACCESS_MODAL:
        case containerActions.SHOW_UPDATE_CONTAINER_MODAL:
        case containerActions.SHOW_LOAD_NEW_FILE_MODAL:
            return Object.assign({}, state, { modal:{ show: action.showModal, modalType: action.type, containerId: action.containerId}});
        case containerActions.UPDATE_CONTAINER_INFO:
            return Object.assign({}, state, { container: action.container });
        case containerActions.CLEAR_MODAL_STATE:
            return Object.assign({}, state, { modal:{ show: false }});
        case containerActions.UNDEFINED:
            return initialState;
        default:
            return state;
    }
};

export default container;