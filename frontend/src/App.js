import React, {Fragment} from 'react';
import {Container} from "reactstrap";
import {Route, Switch} from "react-router-dom";
import Register from "./containers/Register/Register";
import Login from "./containers/Login/Login";
import ButtonAppBar from "./components/UI/Toolbar/ButtonAppBar";
import Main from "./containers/Main/Main";


function App() {
    return (
        <Fragment>
            <header>
                <ButtonAppBar/>
            </header>
            <Container style={{marginTop: '20px'}}>
                <Switch>
                    <Route path="/register" exact component={Register}/>
                    <Route path="/login" exact component={Login}/>
                    <Route path="/" exact component={Main}/>
                </Switch>
            </Container>
        </Fragment>
    );
}

export default App;
