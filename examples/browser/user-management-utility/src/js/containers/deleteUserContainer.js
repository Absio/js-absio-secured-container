import { connect } from 'react-redux';

import  DeleteUserComponentView from './../components/deleteUserViewComponent';
import { deleteUserAccount } from './../actions';

const mapStateToProps = (state) => {
    return {

    }
};

const mapDispatchToProps = (dispatch) => {

    return {
        deleteUser: () => dispatch(deleteUserAccount())
    }
};


const DeleteUserContainer = connect(mapStateToProps, mapDispatchToProps)(DeleteUserComponentView);

export default DeleteUserContainer;