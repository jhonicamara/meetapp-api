import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../config/auth';

export default async (require, response, next) => {
  const authHeader = require.headers.authorization;

  if (!authHeader) {
    return response.status(401).json({ error: 'Token not provided' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    require.userId = decoded.id;

    return next();
  } catch (error) {
    return response.status(401).json({ erro: 'Token invalid' });
  }
};
