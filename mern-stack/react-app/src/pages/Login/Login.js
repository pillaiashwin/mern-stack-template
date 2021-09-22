import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { defaultProps, propTypes } from './props';
import Button from '../../components/Button';
import Card from '../../components/Card';
import config from '../../config';
import fetchClient from '../../utils/fetch';
import Input from '../../components/Input';

import {
  Container,
} from './styled';

const Home = ({
  ...props
}) => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const history = useHistory();

  const onClickLogin = async () => {
    try {
      await fetchClient(`${config.gatewayUrl}/v1/authorization/login`, {
        method: 'POST',
        body: {
          email,
          password,
        },
      });

      history.push("/profile");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const onMount = async () => {
      const user = await fetchClient(`${config.gatewayUrl}/v1/users/current`);
  
      if (user.data) {
        history.push("/profile");
      }
    };

    onMount();
  }, [history]);

  return (
    <Container {...props}>
      <Card>
        <Input onChange={(value) => setEmail(value)} />
        <Input onChange={(value) => setPassword(value)} type="password" />
        <Button onClick={onClickLogin}>Log In</Button>
      </Card>
    </Container>
  );
};

Home.propTypes = propTypes;
Home.defaultProps = defaultProps;

export default Home;
