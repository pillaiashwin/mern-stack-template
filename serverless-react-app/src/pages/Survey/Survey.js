import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { API } from 'aws-amplify';
import map from 'lodash/map';
import { v4 as uuidv4 } from 'uuid';
import { Auth } from 'aws-amplify';
import getAuthToken from '../../utils/getAuthToken';

import { defaultProps, propTypes } from './props';
import Button from '../../components/Button';
import Input from '../../components/Input';

import {
  Container,
  QuestionContainer,
} from './styled';

const QUESTIONS = [
  'Question 1',
  'Question 2',
  'Question 3',
  'What is the meaning of life?'
];

const Profile = ({
  ...props
}) => {
  const [data, setData] = useState({});
  const [user, setUser] = useState({});
  const history = useHistory();

  const onChangeHandler = (question) => (value) => {
    const newData = {
      ...data,
      [question]: value,
    };

    setData(newData);
  };

  const onClickSubmit = async () => {
    try {
      await Auth.currentSession();
      const token = await getAuthToken();
      API.post("surveysrestapi", "/surveys", {
        body: {
          id: uuidv4(),
          userId: user.sub,
          createdAt: new Date().toISOString(),
          data
        },
        headers: {
          Authorization: token
        }
      })
        .then(response => {
          history.push("/profile");
        })
        .catch(error => {
          history.push('/login');
        })
    } catch (err) {
      console.error(err);
      history.push('/login');
    }
  }

  useEffect(() => {
    const onMount = async () => {
      try {
        const data = await Auth.currentSession();
        setUser(data.accessToken.payload);
      } catch (err) {
        console.error(err);
        history.push('/login');
      }
    }
    onMount();
  }, []);
  
  return (
    <Container {...props}>
       {map(QUESTIONS, (question) => (
        <QuestionContainer key={question}>
          <span>{question}</span>
          <Input onChange={onChangeHandler(question)} />
        </QuestionContainer>
      ))}
      <Button onClick={onClickSubmit}>Submit Survey</Button>
    </Container>
  );
};

Profile.propTypes = propTypes;
Profile.defaultProps = defaultProps;

export default Profile;
