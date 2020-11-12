const { ApolloServer } = require('apollo-server');
const jwt = require('jsonwebtoken');
const typeDefs = require('./schema/schema');
const resolvers = require('./resolvers/resolvers');

require('dotenv').config();

const { JWT_SECRET, PORT } = process.env;

const getUser = (token) => {
  try {
    if (token) {
      console.log("verified:")
      console.log(jwt.verify(token, JWT_SECRET))
      return jwt.verify(token, JWT_SECRET);
    }
    return null;
  } catch (error) {
    return null;
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.get('Authorization') || '';
    console.log(token.replace('Bearer', ''))
    return { user: getUser(token.replace('Bearer', '')) };
  },
  introspection: true,
  playground: true,
});

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
