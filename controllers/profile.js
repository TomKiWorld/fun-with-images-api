/**
 * Get User profile from Database
 * Required query param 
 * - id
 * 
 * @param database
 * @return user
 */
const getProfile = (database) => (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json('Insufficient information - User not found');
  }

  return database('users')
    .where('id', '=', id)
    .then(user => {
      if (user.length) {
        res.json(user[0]);
      } else {
        throw new Error;
      }      
    })
    .catch(err => res.status(400).json('User not found'))
}

/**
 * Remove User profile and images from Databases
 * Required body param 
 * - id 
 * - email
 * 
 * @param database
 * @return string
 */
const handleRemoval = (database) => (req, res) => {
  const { id, email } = req.body;

  if (!id || !email) {
    res.status(400).json('Insufficient information - Unable to remove profile')
  }

  if ((id !== '1') || (id !== 1) ) {
    database.transaction(trx => {
      trx('users')
      .where('id', id)
      .del()
      .then(data => {
        return trx('images')
        .where('userid', id)
        .del()
      })
      .then(data => {
        return trx('login')
        .where('email', email)
        .del()
        .then(data => {
          res.json('Profile removed');
        })
      })
      .then(trx.commit)
      .catch(trx.rollback)
    })
    .catch(err => res.status(400).json('Unable to remove profile'))
  } else {
    res.status(400).json('You do not have permission to delete this user')
  }
}

/**
 * Get images submitted by a user from Database
 * Required body param 
 * - id
 * 
 * @param database
 * @return user
 */
const getProfileImages = (database) => (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json('Insufficient information - Unable to get images');
  }

  return database('images')
    .where('userid', '=', id)
    .then(data => {
      res.json(data);
    })
    .catch(err => res.status(400).json('No images found'))
}

module.exports = {
  getProfile,
  handleRemoval,
  getProfileImages
};
