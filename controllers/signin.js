/**
 * Sign a new user
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
  const {email, password} = req.body;
  
  if (!email || !password) {
    return res.status(400).json('Insufficient information - Please make sure all fields are entered');
  }
  database
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
          .then(user => {
            res.json(user[0])
          })
          .catch(err => res.status(400).json('Unable to sign in', err))
      } else {
        throw new Error;
      }
    })
    .catch(err => res.status(400).json('Wrong credentials', err))
}

module.exports = {
  handleSignIn: handleSignIn
};
