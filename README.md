# 🥳 Fun with images API 🥳

Server configuration to manage the database for my [Fun with images](https://github.com/TomKiWorld/fun-with-images) project.

Run `npm install` to download all packages

## Important notes

Before you start, make sure to set up your local database, you can follow the steps below to set it up with brew.

In **server.js** make sure to set `const productionEnv = false;` to connect to your local database during development, and deploy to master with the vaue `true` in order to connect to Heroku database.

Once connection with heroku is done, make to sure to run the command `git push heroku master` after each commit to Git (You may replace master with a branch name `git push heroku branchName:master`).

### Handy links:

[Heroku Deploying with Git](https://devcenter.heroku.com/articles/git)

[Heroku Connecting in Node.js](https://devcenter.heroku.com/articles/heroku-postgresql#connecting-in-node-js)

[Heroku Deploying from a branch besides master](https://devcenter.heroku.com/articles/git#deploying-from-a-branch-besides-master)

## Available Scripts

In the project directory, you can run:

### `npm start`
To run the app on node

### `npm run-script dev`
To run the app in development mode with nodemon, the server will listen to changes and restart every time changes are save.

## Local database
Since we use free hosting from Heroku we will use postgreSQL

1. `brew install postgresql` to install postgreSQL via brew.
2. `brew services start postgresql` to start the service.
3. `createdb 'fun-with-images'` to create the database.
4. `psql 'fun-with-images'` to start creating tables.
5. Users table: 

`CREATE TABLE users (id serial PRIMARY KEY UNIQUE NOT NULL, name VARCHAR(100) NOT NULL, email VARCHAR(255) UNIQUE NOT NULL, entries bigint DEFAULT 0, joined TIMESTAMP NOT NULL );`

6. Login table: 

`CREATE TABLE login (id serial PRIMARY KEY UNIQUE NOT NULL, hash VARCHAR(100) NOT NULL, email VARCHAR(255) UNIQUE NOT NULL);`

7. Images table:

`CREATE TABLE images (id serial PRIMARY KEY UNIQUE NOT NULL, url TEXT NOT NULL, userid int NOT NULL);`

8. Other commands: 

`\d` to see all table; `\q` to quit the service;

`brew services start postgresql` to start the serviceand then `brew services stop postgresql` to stop the service.

**Most importent**: Once you have established a databse connection, create the visitor account which is mendetory for the 'Log in as visitor' Button on the login page!

Name: 'Visitor'

Email: 'visitor@gmail.com'

Password: 'visit'

## Heroku database setup

Once you are dne setting up your app in heroku and added the add-on for postgreSQL run `heroku addons` to make sure the add-on is available

`heroku pg:info` to see connection info.

`heroku pg:psql` to enter edit mode, from here follow steps 5 to 7 from local setup.

Other commands:

`heroku logs --tail` to connect to Heroku server and see logs.

**Don't forget to add the Visitor profile!!**


## 🤗Most important - Have fun!!🤗