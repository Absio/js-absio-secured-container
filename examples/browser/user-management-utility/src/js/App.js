import React, {Component} from 'react';
import '../css/App.css';
import '../css/styles.min.css';
import MainContainer from './containers/mainContainer';


class App extends Component {
    render() {
        return (
            <div className="App">
                <MainContainer/>
            </div>
        );
    }
}

export default App;
