import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { createGlobalStyle, ThemeProvider } from 'styled-components';

import Profile from './pages/Profile';
import Login from './pages/Login';
import Survey from './pages/Survey';
import Styles from './styles';
import AuthenticatedRoute from './components/AuthenticatedRoute';

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
          <AuthenticatedRoute path="/profile">
            <Profile />
          </AuthenticatedRoute>
          <AuthenticatedRoute path="/survey">
            <Survey />
          </AuthenticatedRoute>
          <Redirect from="/" to="/profile" />
        </Switch>
      </BrowserRouter>
      <GlobalStyles />
    </ThemeProvider>
  );
}

export default App;
