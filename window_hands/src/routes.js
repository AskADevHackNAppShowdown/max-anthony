import React from 'react';
import {Route, Switch, Redirect} from 'react-router-dom';
import FirstStep from './containers/FirstStep';
import Controller from './containers/Controller';

class Routes extends React.Component {
    render() {
        return(
            <div id ='routingcontainer'>
                <Switch>
                    <Route exact path="/" component={FirstStep}/>
                    <Route path="/controller" component={Controller}/>
                    <Redirect to="/"/>
                </Switch>
            </div>
        )
    }
}

export default Routes;