import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AppNavBar from './components/AppNavBar';
import ShoppingList from './components/ShoppingList';
import {Provider} from 'react-redux';
import {Container} from 'reactstrap';
import store from './store';
import ItemModal from './components/ItemModal';
import {loadUser} from './actions/authActions';
class App extends React.Component {
    componentDidMount() {
        store.dispatch(loadUser());
    }
    render() {
        return (<Provider store={store}>
            <div className="App">
                <AppNavBar></AppNavBar>
                <Container>
                    <ItemModal/>
                </Container>
                <ShoppingList></ShoppingList>
            </div>
        </Provider>);
    }
}


export default App;
