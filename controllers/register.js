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
  const hash = bcrypt.hashSync(password);

  if (!email || !name || !password) {
    return res.status(400).json('Insufficient information - Please make sure all fields are entered')
  }

  database.transaction(trx => {
    trx.insert({
      hash: hash,
      email: email
    })
    .into('login')
    .then(data => {
      return trx('users')
        .insert({
          email: email,
          name: name,
          joined: new Date()
        })
        .then(user => {
          return user[0];
        })
    })
    .then(trx.commit)
    .catch(trx.rollback)
  })
  .then(id => {
    return database.select('*')
      .from('users')
      .where('id', '=', id)
      .then(user => {
        res.json(user[0])
      })
      .catch(err => res.status(400).json('Could not fetch the user'))
  })
  .catch(err => res.status(400).json('Unable to register', err))
}

module.exports = {
  handleRegister: handleRegister
};
