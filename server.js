const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const morgan = require('morgan');
const dotenv = require('dotenv');
dotenv.config();

const signin = require('./controllers/signin');
const register = require('./controllers/register');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const localDB = knex({
  client: 'pg',
  connection: {
  host : process.env.LOCAL_DATABASE_HOST,
  user : process.env.LOCAL_DATABASE_USER,
  password : process.env.LOCAL_DATABASE_PASSWORD,
  database : process.env.LOCAL_DATABASE_DB
  }
});

const dockerDB = knex({
  client: 'pg',
  connection: {
    connectionString : process.env.DATABASE_URL
    }
});

const prodDB = knex({
  client: 'pg',
  connection: {
    connectionString : process.env.DATABASE_URL,
    ssl: true
  }
});

// Set to environment to docker or local when needed
const productionEnv = '';

let database = prodDB;
if (productionEnv === 'docker') {
  database = dockerDB;
} else if (productionEnv === 'local') {
  database = localDB;
}
// Solve Heroku issue during local development not to be used on production
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

const app = express();
app.use(morgan('combined'));
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => { res.send('<h1>The fun with images server is running</h1><p>Made with <span>&hearts;</span> by <a href=\'https://github.com/TomKiWorld\' target=\'_blank\' rel=\'noopener noreferrer\'>TomKiWorld</a></p>'); });
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
