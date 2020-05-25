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
  const { email, name, password } = req.body;

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
          joined: new Date()
        })
        .then(user => {
          res.json(user[0])
        })
    })
    .then(trx.commit)
    .catch(trx.rollback)
  })
  .catch(err => res.status(400).json('Unable to register'))
}

module.exports = {
  handleRegister: handleRegister
};
