import { connect } from 'react-redux';
import MainGridView from './../components/mainGridView';

const mapStateToProps = (state) => {
    return {
        loading: state.user.loading,
        error: state.user.error
    }
};

const mapDispatchToProps = (dispatch) => {

    return { }

};

const MainGridContainer = connect(mapStateToProps, mapDispatchToProps)(MainGridView);

export default MainGridContainer;