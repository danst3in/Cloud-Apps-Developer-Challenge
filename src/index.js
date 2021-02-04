const express = require("express");
const fs = require("fs");
const {
  ApolloServer,
  gql,
  addMockFunctionsToSchema,
  makeExecutableSchema,
} = require("apollo-server-express");
const winston = require("winston");
const expressWinston = require("express-winston");
// const { GraphQLScalarType } = require("graphql");
const spacex_launches_data = require("../data/spacex_launches.json");

/**
 * //TODO:Build Schema types
 * //TODO: Build types
 * //TODO: Build Query types
 * //TODO: Build Mission Name Query types
 * //TODO: Build Mission Name Query resolvers
 * //TODO: Build Launch Date Query types
 * //TODO: Build Launch Date Query resolvers
 * //TODO: Build Norad Id Query types
 * //TODO: Build Norad Id Query resolvers
 * //TODO: Add tests for resolvers
 */

//* import GraphQL schema
const typeDefs = gql`
  ${fs.readFileSync(__dirname.concat("/schema.graphql"), "utf8")}
`;
//* import GraphQL resolvers
const resolvers = require("./Query");

// * For Testing with graphql-tools ...
// *
// const executableSchema = makeExecutableSchema({
//   typeDefs,
//   resolvers,
//   logger: { log: (e) => console.log("Error from makeExecutableSchema: ", e) },
// });
// addMockFunctionsToSchema({
//   schema: executableSchema,
//   mocks: {
// Mocks the `Int` scalar type to always return `12345`.
//     Int: () => 12345,

// Mocks the `LaunchSite` type to always return specific {object}.
//     LaunchSite: () => ({
//       site_id: "ccafs_slc_40",
//       site_name: "CCAFS SLC 40",
//       site_name_long:
//         "Cape Canaveral Air Force Station Space Launch Complex 40",
//     }),
//   },
//   preserveResolvers: false,
// });

// *
// *
// * create express server via middleware

const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: (req) => ({
    db: spacex_launches_data,
  }),
});
server.applyMiddleware({ app });

const PORT = 4000;

//? experimenting with Winston for logging
app.use(
  expressWinston.logger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json()
    ),
    meta: true, // optional: control whether you want to log the meta data about the request (default to true)
    msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
    expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
    colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
    ignoreRoute: function (req, res) {
      return false;
    }, // optional: allows to skip some log messages based on request and/or response
  })
);

//* Express routing
app.use((req, res) => {
  res.status(200);
  res.send("Hello!");
  res.end();
});

//? Experimenting with Winston for error logging
app.use(
  expressWinston.errorLogger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json()
    ),
  })
);

//*
//* My boilerplate error-handler
app.use((err, req, res, next) => {
  const defaultErr = {
    log: "Express error handler caught unknown middleware error",
    status: 400,
    message: { err: "An error occurred" },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

// The `listen` method launches a web server.
app.listen({ port: PORT }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
