const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { makeExecutableSchema } = require('graphql-tools');
const { graphiqlExpress, graphqlExpress } = require('apollo-server-express');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://admin:hDhkpWaS1egQtqZ7@SG-zizera-13376.servers.mongodirector.com:45749,SG-zizera-13377.servers.mongodirector.com:45749,SG-zizera-13378.servers.mongodirector.com:45749/admin?replicaSet=RS-zizera-0&ssl=true', {
  useMongoClient: true,
});

mongoose.connection.on('connected', () => console.log('Connected to mongo'));
mongoose.connection.on('error', (e) => console.log(`Aw shoot mongo --> ${e}`));

const BookSchema = new mongoose.Schema({
  title: String,
  author: String,
  price: Number
});

mongoose.model('Book', BookSchema);

const typeDefs = require('./schema');
const resolvers = require('./resolver');

const app = express();
app.use('*', cors());

const PORT = process.env.PORT || 8080;


const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

app.use(
  '/graphql',
  express.json(),
  graphqlExpress(() => ({
    schema,
  })),
);

app.use(
  '/graphiql',
  graphiqlExpress({
    endpointURL: '/graphql',
  }),
);

app.listen(PORT, () => {
  console.log(`UP on --> http://localhost:${PORT}`);
});
