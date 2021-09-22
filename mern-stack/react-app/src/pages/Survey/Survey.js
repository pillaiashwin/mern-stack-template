import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import map from 'lodash/map';

import { defaultProps, propTypes } from './props';
import Button from '../../components/Button';
import config from '../../config';
import fetchClient from '../../utils/fetch';
import Input from '../../components/Input';

import {
  Container,
  QuestionContainer,
} from './styled';

const QUESTIONS = [
  "What's your favorite color?",
  "What's your favorite food?",
  "What's your favorite car?"
];

const Profile = ({
  ...props
}) => {
  const [data, setData] = useState({});
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
      await fetchClient(`${config.gatewayUrl}/v1/surveys`, {
        method: 'POST',
        body: data,
      });

      history.push("/profile");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container {...props}>
       {map(QUESTIONS, (question) => (
        <QuestionContainer>
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
