const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./graphql/schema/schema');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const keys = require('./config/keys');
require('./mongoose/models/User');
require('./services/passport');

mongoose.connect(keys.mongoURI);
mongoose.connection.once('open', () => {
	console.log('connected to the db');
});

const app = express();

app.use(
	cookieSession({
		maxAge: 30 * 24 * 60 * 60 * 1000,
		keys: [ keys.cookieKey ]
	})
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
	'/graphql',
	graphqlHTTP({
		schema,
		graphiql: true
	})
);

require('./routes/authRoutes')(app);

module.exports = app;
