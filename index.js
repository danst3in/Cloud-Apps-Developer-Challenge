const express = require("express");
const path = require("path");
const fs = require("fs");
const { ApolloServer, gql } = require("apollo-server-express");
// const { GraphQLScalarType } = require("graphql");
const spacex_launches_data = require("./data/spacex_launches.json");

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
 */

const typeDefs = gql`
  ${fs.readFileSync(__dirname.concat("/schema.graphql"), "utf8")}
`;

// Resolvers define the technique for fetching the types defined in the schema.
// Resolvers were not moved to a separate file to avoid chances of trying to import any large json file multiple times.
// Resolver functions written as async for compatibility with live data sources.
const resolvers = {
  Query: {
    launches: () => spacex_launches_data,
    async missionName(parent, args, ctx, info) {
      const launchesArr = spacex_launches_data.filter((launch) => {
        return launch.mission_name === args.mission_name;
      });
      return launchesArr[0];
    },
    async launchDate(parent, args, ctx, info) {
      const launchesArr = spacex_launches_data.filter((launch) => {
        return launch.launch_date_unix === args.launch_date_unix;
      });
      return launchesArr;
    },
    async noradId(parent, args, ctx, info) {
      const launchesArr = spacex_launches_data.filter((launch) => {
        return launch.rocket.payloads.filter((payload) => {
          payload.norad_id === args.norad_id;
        });
      });
      return launchesArr;
    },
  },
  // DateTime: new GraphQLScalarType({
  //   name: "DateTime",
  //   description: "A date and time, represented as an ISO-8601 string",
  //   serialize: (value) => value.toISOString(),
  //   parseValue: (value) => new Date(value),
  //   parseLiteral: (ast) => new Date(ast.value),
  // }),
};

// create express server via middleware
const app = express();
const server = new ApolloServer({ typeDefs, resolvers });
server.applyMiddleware({ app });

const PORT = 4000;

app.use((req, res) => {
  res.status(200);
  res.send("Hello!");
  res.end();
});

// The `listen` method launches a web server.
app.listen({ port: PORT }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
