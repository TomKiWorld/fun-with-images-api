const Auth = require('./authorization');

/**
 * Handle sigining in
 * Required body param 
 * - email
 * - password
 * 
 * @param bcrypt 
 * @param database 
 * 
 * @return user profile
 */
const handleSignIn = (bcrypt, database) => (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return Promise.reject('Insufficient information - Please make sure all fields are entered');
  }
   return database
    .select('email', 'hash')
    .from('login')
    .where('email', '=', email)
    .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return database
          .select('*')
          .from('users')
          .where('email', '=', email)
          .then(user => user[0])
          .catch(err => Promise.reject('Unable to sign in'))
      } else {
        throw new Error;
      }
    })
    .catch(err => Promise.reject('Wrong credentials'))
}

/**
 * Sign a new user and set session authentication 
 * * Required header param 
 * - authorization 
 * 
 * @param bcrypt 
 * @param database 
 * @returns session JWT
 */
const signinAuthentication = (bcrypt, database) => (req, res) => {
  const { authorization } = req.headers;
  return authorization ? 
    Auth.getAuthTokenID(req, res) : 
    handleSignIn(bcrypt, database)(req, res)
      .then(data => {
        return data.id && data.email ? 
          Auth.createSessions(data) : 
          Promise.reject(data)
      })
      .then(session => res.json(session))
      .catch(err => res.status(400).json(err))
}

module.exports = {
  signinAuthentication
};
