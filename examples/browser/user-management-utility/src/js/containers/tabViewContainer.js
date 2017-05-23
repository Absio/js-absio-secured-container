import { connect } from 'react-redux';

import TabViewComponentView from './../components/tabViewComponent';
import { tabChanged,logout } from './../actions';

const mapStateToProps = (state) => {
    return {
        userId : state.user.userId
    }
};

const mapDispatchToProps = (dispatch) => {

    return {
        tabChanged: () => dispatch(tabChanged()),
        logOut:() => dispatch(logout())
    }
};


const TabViewContainer = connect(mapStateToProps, mapDispatchToProps)(TabViewComponentView);

export default TabViewContainer;