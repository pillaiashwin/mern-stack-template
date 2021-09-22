import React from 'react';
import { useHistory } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import { AmplifyAuthenticator, AmplifySignIn } from '@aws-amplify/ui-react';
import { AuthState } from '@aws-amplify/ui-components';

import { defaultProps, propTypes } from './props';
const Home = ({
}) => {

  const history = useHistory();

  const handleAuthStateChange = (state) => {
    if (state === AuthState.SignedIn) {
      history.push('/profile');
    }
  }

  React.useEffect(() => {
    const onMount = async () => {
      try {
        await Auth.currentSession();
        history.push('/profile')
      } catch (err) {
        console.error(err);
      }
    }
    onMount();
  }, []);

  return (
    <AmplifyAuthenticator>
      <AmplifySignIn handleAuthStateChange={handleAuthStateChange} slot="sign-in"></AmplifySignIn>       
    </AmplifyAuthenticator>
  )
};

Home.propTypes = propTypes;
Home.defaultProps = defaultProps;

export default Home;
