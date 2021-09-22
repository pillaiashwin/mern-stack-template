const defaultHeaders = {
  'Content-Type': 'application/json',
};

const fetchClient = async (url, options = {}) => {
  const response = await fetch(url, {
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
    credentials: 'include',
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (response.status < 200 || response.status > 299) {
    throw response;
  }

  try {
    const responseJson = await response.json();

    return responseJson;
  } catch (error) {

  }

  return null;
};

export default fetchClient;
