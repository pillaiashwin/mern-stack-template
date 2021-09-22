import cors from "cors";
import includes from "lodash/includes";
import split from "lodash/split";

import config from '../config';

const corsMiddleware = () => {
  const allowedCorsOrigins = split(config.corsOrigins, ",");

  const options = {
    credentials: true,
    methods: ["DELETE", "GET", "OPTIONS", "PATCH", "POST"],
    origin: (origin: string, callback: Function) => {
      if (!origin || includes(allowedCorsOrigins, origin)) {
        callback(null, true)
      } else {
        callback(new Error('Origin not allowed by CORS'))
      }
    },
  };

  return cors(options);
};

export default corsMiddleware;
