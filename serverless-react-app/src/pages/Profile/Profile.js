import { useHistory } from 'react-router-dom';
import { API } from 'aws-amplify';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import React, { useEffect, useState } from 'react';
import { AmplifySignOut } from '@aws-amplify/ui-react';
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
import { Auth } from 'aws-amplify';
import { defaultProps, propTypes } from './props';
import getAuthToken from '../../utils/getAuthToken';

import {
  Container,
  SurveyButton,
  SurveyContainer,
  Title,
} from './styled';

const Profile = ({
  ...props
}) => {
  const [user, setUser] = useState({});
  const [surveys, setSurveys] = useState({});
  const history = useHistory();

  const onClickTakeSurvey = () => {
    history.push("/survey");
  };

  useEffect(() => {
    const onMount = async () => {
      try {
        const data = await Auth.currentSession();
        setUser(data.accessToken.payload);
      } catch (err) {
        console.error(err);
        history.push('/login')
      }
    }
    onMount();
    return onAuthUIStateChange((nextAuthState, authData) => {
      if (nextAuthState === AuthState.SignedOut) {
        history.push('/login');
      }
    });
  }, []);

  useEffect(() => {
    const getSurveys = async () => {
      const token = await getAuthToken();
      const surveysResponse = await API.get("surveysrestapi", `/surveys/${user.sub}`, {
        headers: { Authorization: token }
      });

      console.log(surveysResponse);
      setSurveys(surveysResponse);
    }
    if (!isEmpty(user)) {
      getSurveys();
    }
  }, [user])

  return (
    <Container {...props}>
      {isEmpty(user) ? (
        <div>Loading...</div>
      ) : (
        <>
          <Title>Welcome, {user.username}</Title>
          <SurveyButton onClick={onClickTakeSurvey}>Take Survey</SurveyButton>
          {map(surveys, (survey) => (
            <SurveyContainer key={survey.id}>
              <span>{survey.id}</span>
              <ul>
                {Object.keys(survey.data).sort().map((key) => (
                  <li key={key}>{key}: {survey.data[key]}</li>
                ))}
              </ul>
            </SurveyContainer>
          ))}
          <AmplifySignOut />
        </>
      )}
    </Container>
  );
};

Profile.propTypes = propTypes;
Profile.defaultProps = defaultProps;

export default Profile;
