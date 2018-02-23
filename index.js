const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');

// Some fake data
const books = [
  {
    id: 1,
    title: "Harry Potter and the Sorcerer's stone",
    author: 'J.K. Rowling',
  },
  {
    id: 2,
    title: 'Jurassic Park',
    author: 'Michael Crichton',
  },
];

const users = [
  { id: 1, username: 'Ryan' },
  { id: 2, username: 'User 2' },
  { id: 3, username: 'User 3' },
];

// The GraphQL schema in string form
const typeDefs = `
  type Book { id: ID!, title: String, author: String }
  type User { id: ID!, username: String }
  type Query {
    books: [Book]
    users: [User]
    user(id: ID!): User
  }
  type Mutation {
    createUser(
      username: String!
      password: String!
    ): User
  }
`;

const mockFetchUser = (id) => {
  return new Promise((resolve, reject) => {
    try {
      setTimeout(() => {
        const user = users.find(user => parseInt(user.id) === parseInt(id));

        resolve(user);
      }, 1000);

    } catch (e) {
      reject(e);
    }
  });
}

// The resolvers connects queries with db and backend services - usually in the form of a promise
const resolvers = {
  Query: {
    books: () => books,
    users: () => users,
    user: (root, { id }) => mockFetchUser(id),
  },
  Mutation: {
    createUser: (root, { username, password }, context, info) => {
      console.log('in createUser resolver: ', username, password);
      const id = users.length;

      const user = { id, username, password }

      users.push(user);

      return user;
    }
  },
};

// Put together a schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// Initialize the app
const app = express();

app.use(cors());

// The GraphQL endpoint
app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));

// GraphiQL, a visual editor for queries
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

// Start the server
const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
  console.log(`Go to http://localhost:${PORT}/graphiql to run queries!`);
});
