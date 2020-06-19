const Auth = require('./authorization');

/**
 * Register a new user
 * Required body param 
 * - email
 * - name 
 * - password
 * 
 * @param bcrypt 
 * @param database 
 * 
 * @return user profile
 */
const handleRegister = (bcrypt, database) => (req, res) => {
  const { email, name, avatar, password } = req.body;

  if (!email || !name || !password) {
    return res.status(400).json('Insufficient information - Please make sure all fields are entered')
  }

  const hash = bcrypt.hashSync(password);

  database.transaction(trx => {
    trx.insert({
      hash: hash,
      email: email
    })
    .into('login')
    .returning('email')
    .then(loginEmail => {
      return trx('users')
        .returning('*')
        .insert({
          email: loginEmail[0],
          name: name,
          avatar: avatar,
          joined: new Date()
        })
        .then(data => {
          return data[0].id && data[0].email ?
            Auth.createSessions(data[0]) : 
            Promise.reject(data)
          }) 
        .then(session => res.json(session))
        .catch(err => res.status(400).json(err));
    })
    .then(trx.commit)
    .catch(trx.rollback)
  })
  .catch(err => res.status(400).json('Unable to register'))
}

module.exports = {
  handleRegister
};
