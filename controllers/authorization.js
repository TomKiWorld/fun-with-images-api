// JWT Token
const jwt = require('jsonwebtoken');
// Redis setup
const redis = require('redis');
console.log('redis', redis)
console.log('env', process.env)
const redisClient = redis.createClient(process.env.REDIS_URI);

// Require Auth Token
const requireAuth = (req, res, next) => {
  const { authorization } = req.headers;
  if(!authorization) {
    return res.status(401).json('Unauthorized');
  }
  return redisClient.get(authorization, (err, reply) => {
    if (err || !reply) {
      return res.status(401).json('Unauthorized');
    }
    return next();
  })
}

// Create JWT Token and send user data
const createSessions = (user) => {
  const { email, id } = user;
  const token = signToken(email);
  return setToken(token, id)
    .then(()=> {
      return { success: 'true', userId: id, token };
    })
    .catch(console.log)
}

// Sign Token
const signToken = (email) => {
  const jwtPayload= { email };
  return jwt.sign(jwtPayload, process.env.JWT_TOKEN_HASH, { expiresIn: '2 days'});
}

// Set Token
const setToken = (key, value) => {
  return Promise.resolve(redisClient.set(key, value));
}

// Remove Token
const removeToken = (key) => {
  redisClient.del(key);
}

// Get Token ID 
const getAuthTokenID = (req, res) => {
  const { authorization } = req.headers;
  return redisClient.get(authorization, (err, reply) => {
    if(err || !reply) {
      return res.status(400).json('Unauthorized');
    }
    return res.json({ id: reply })
  });
}

module.exports = {
  requireAuth,
  createSessions,
  getAuthTokenID,
  removeToken
}
