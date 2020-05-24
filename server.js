const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const signin = require('./controllers/signin');
const register = require('./controllers/register');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

// Solve Heroku issue
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0; 

// All queries works with MySql client as well
const database = knex({
  client: 'pg',
  connection: {
    connectionString : process.env.DATABASE_URL,
    ssl: true
  }
});

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => { res.send('Server is running'); });
// Sign in
app.post('/signin', signin.handleSignIn(bcrypt, database));
// Register a new user
app.post('/register', register.handleRegister(bcrypt, database));
// Get profile
app.get('/profile/:id', profile.getProfile(database));
// Remove profile and images
app.post('/profile-removal/:id', profile.handleRemoval(database));
// Get previously submitted images
app.get('/profile-images/:id', profile.getProfileImages(database));
// Update image entries and add image to database
app.put('/image', image.increaseImages(database));
// Use Clarifai to find colors in image
app.post('/image-colors', image.handleColorApiCall);
// Use Clarifai to find faces in image
app.post('/image-faces', image.handleFacesApiCall);

app.listen(process.env.PORT || 3000, () => {
  console.log(`app is running on port ${process.env.PORT}`);
})
