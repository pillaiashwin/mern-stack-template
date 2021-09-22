import { useHistory } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import React, { useEffect, useState } from 'react';

import { defaultProps, propTypes } from './props';
import config from '../../config';
import fetchClient from '../../utils/fetch';

import {
  Container,
  LogoutButton,
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

  const onClickLogout = async () => {
    try {
      await fetchClient(`${config.gatewayUrl}/v1/authorization/logout`, {
        method: 'POST',
      });

      history.push("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const onClickTakeSurvey = () => {
    history.push("/survey");
  };

  const onMount = async () => {
    try {
      const userResponse = await fetchClient(`${config.gatewayUrl}/v1/users/current`);

      setUser(userResponse.data);
    } catch (error) {
      console.log(error);
    }

    try {
      const surveysResponse = await fetchClient(`${config.gatewayUrl}/v1/surveys`);

      setSurveys(surveysResponse.data);
    } catch(error) {
      console.log(error);
    }
  };

  useEffect(() => {
    onMount();
  }, []);

  return (
    <Container {...props}>
      {isEmpty(user) ? (
        <div>Loading...</div>
      ) : (
        <>
          <Title>Welcome {user.email}</Title>
          <LogoutButton onClick={onClickLogout}>Logout</LogoutButton>
          <SurveyButton onClick={onClickTakeSurvey}>Take Survey</SurveyButton>
          {map(surveys, (survey) => (
            <SurveyContainer>
              <span>{survey._id}</span>
              <ul>
                {map(survey.data, (answer, question) => (
                  <li>{question}: {answer}</li>
                ))}
              </ul>
            </SurveyContainer>
          ))}
        </>
      )}
    </Container>
  );
};

Profile.propTypes = propTypes;
Profile.defaultProps = defaultProps;

export default Profile;
