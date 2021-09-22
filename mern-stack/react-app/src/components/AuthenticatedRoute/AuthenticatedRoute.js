import React, { useEffect, useState } from 'react';
import { Route, useHistory } from 'react-router-dom';

import config from '../../config';
import fetchClient from '../../utils/fetch';
import { defaultProps, propTypes } from './props';

const AuthenticatedRoute = ({
  ...props
}) => {
  const history = useHistory();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const onMount = async () => {
      try {
        await fetchClient(`${config.gatewayUrl}/v1/users/current`);
  
        setIsAuthorized(true);
      } catch (error) {
        history.push("/login");
      }
    };

    onMount();
  }, [history]);

  return isAuthorized && (
    <Route {...props} />
  );
};

AuthenticatedRoute.propTypes = propTypes;
AuthenticatedRoute.defaultProps = defaultProps;

export default AuthenticatedRoute;
