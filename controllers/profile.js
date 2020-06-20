const removeToken = require('./authorization').removeToken;

/**
 * Get User profile from Database
 * Required query param 
 * - id
 * 
 * @param database
 * @return user
 */
const handleProfileGet = (database) => (req, res) => {
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
 * Update User profile
 * Required query param 
 * - id
 * Required body param 
 * - id
 * - avatar
 * 
 * @param database
 * @return user
 */
const handleProfileUpdate = (database) => (req, res) => {
  const { id } = req.params;
  const { name, avatar } = req.body;

  if (!id) {
    return res.status(400).json('Insufficient information - User not found');
  }

  if ( (id !== '1') && (id !== '2') ) {
    database.select('*')
    .from('users')
    .where('id', '=', id)
    .then(data => {
      if(data.length) {
        database('users')
        .where('id', '=', id)
        .update({ 
          name: name,
          avatar: avatar
        }, [ 'id', 'name', 'joined', 'entries', 'email', 'avatar'])
        .then(user => {
          if (user.length) {
            res.json(user[0]);
          } else {
            throw new Error;
          }
        })
      } 
    })
    .catch(err => {
      console.log(err); 
      res.status(400).json('Could not update profile')
    })
  } else {
    res.status(400).json('This profile is protected');
  }
}

/**
 * Remove User profile and images from Databases
 * Required body param 
 * - id 
 * - email
 * Required header param 
 * - authorization 
 * 
 * @param database
 * @returns string
 */
const handleRemoval = (database) => (req, res) => {
  const { id, email } = req.body;
  const { authorization } = req.headers;

  if (!id || !email) {
    res.status(400).json('Insufficient information - Unable to remove profile')
  }

  if ((email !== 'visitor@gmail.com') && (email !== 'tester@gmail.com') ) {
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
          removeToken(authorization);
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
  handleProfileGet,
  handleProfileUpdate,
  handleRemoval,
  getProfileImages
};
