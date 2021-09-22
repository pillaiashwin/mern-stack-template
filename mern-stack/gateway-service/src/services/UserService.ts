import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';

class UserService {
  url: string;
  secret: string;

  constructor(options) {
    this.url = options.url;
    this.secret = options.secret;
  }

  async checkPassword(email: string, password: string): Promise<string> {
    const response = await fetch(`${this.url}/v1/users/authorize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: jwt.sign({ method: 'password', email, password }, this.secret),
      }),
    });

    if (response.status === 200) {
      const responseJson = await response.json();

      return responseJson.data._id;
    }

    return null;
  }
}

export default UserService;
