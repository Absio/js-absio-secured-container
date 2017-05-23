import { connect } from 'react-redux';
import { logout } from './../actions';

import HeaderView from './../components/headerComponentView';

const mapStateToProps = (state) => {
    return {
        userId: state.user.userId
    }
};

const mapDispatchToProps = (dispatch) => {

    return {
        logout: () => dispatch(logout())
    }

};

const HeaderContainer = connect(mapStateToProps, mapDispatchToProps)(HeaderView);

export default HeaderContainer;