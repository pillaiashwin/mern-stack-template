import './configureAmplify';
import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { createGlobalStyle, ThemeProvider } from 'styled-components';

import Profile from './pages/Profile';
import Login from './pages/Login';
import Survey from './pages/Survey';
import Styles from './styles';

import { withAuthenticator } from '@aws-amplify/ui-react';

const GlobalStyles = createGlobalStyle({
  '*': {
    boxSizing: 'border-box',
    margin: 0,
    padding: 0,
  },

  
  'html, body, #root': {
    height: '100%',
    width: '100%',
  }
});

const App = () => {

  return (
    <ThemeProvider theme={Styles}>
      <BrowserRouter>
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/profile">
            <Profile />
          </Route>
          <Route path="/survey">
            <Survey />
          </Route>
          <Redirect from="/" to="/profile" />
        </Switch>
      </BrowserRouter>
      <GlobalStyles />
    </ThemeProvider>
  );
}

export default withAuthenticator(App);
