const express = require("express");
const path = require("path");
const { ApolloServer, gql } = require("apollo-server-express");
const { GraphQLScalarType } = require("graphql");
const spacex_launches_data = require("../public/spacex_launches.json");

/**
 * //TODO:Build Schema types
 * //TODO: Build types
 * TODO: Build Query types
 * //TODO: Build Mission Name Query types
 * //TODO: Build Mission Name Query resolvers
 * TODO: Build Launch Date Query types
 * TODO: Build Launch Date Query resolvers
 * TODO: Build Norad Id Query types
 * TODO: Build Norad Id Query resolvers
 */

// This is the definition of the GraphQL schema
// How you structure this schema to fit the spacex_launches_data below
// along with how you write the code is the primary assessment
const typeDefs = gql`
  # scalar DateTime

  type Payload {
    payload_id: String!
    norad_id: [Int]!
  }

  type Rocket {
    rocket_id: String!
    payloads: [Payload!]! #Provided data seems to indicate a Payload must exist for a Launch
  }

  type LaunchSite {
    site_id: String!
    site_name: String!
    site_name_long: String!
  }

  type Launch {
    id: ID!
    flight_number: Int!
    mission_name: String!
    launch_date_unix: Int!
    # launch_date_unix: DateTime!
    rocket: Rocket
    launch_site: LaunchSite
    launch_success: Boolean
  }

  type Query {
    launches: [Launch]! #Should always return an array, but Launch may not exist
    missionName(mission_name: String!): Launch #Will return a Launch if it exists
    launchDate(launch_date_unix: Int!): [Launch]! #Should always return an array, but Launch may not exist
  }
`;

// Resolvers define the technique for fetching the types defined in the schema.
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

app.use("/static", express.static(path.join(__dirname, "public")));

app.use((req, res) => {
  res.status(200);
  res.send("Hello!");
  res.end();
});

// The `listen` method launches a web server.
app.listen({ port: PORT }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);

// Copied from spacex_launches.json
// const spacex_launches_data = [
//   {
//     flight_number: 90,
//     mission_name: "Starlink 4",
//     launch_date_unix: 1581951955,
//     rocket: {
//       rocket_id: "falcon9",
//       payloads: [
//         {
//           payload_id: "Starlink 4",
//           norad_id: [],
//         },
//       ],
//     },
//     launch_site: {
//       site_id: "ccafs_slc_40",
//       site_name: "CCAFS SLC 40",
//       site_name_long:
//         "Cape Canaveral Air Force Station Space Launch Complex 40",
//     },
//     launch_success: true,
//   },
//   {
//     flight_number: 91,
//     mission_name: "CRS-20",
//     launch_date_unix: 1583556631,
//     rocket: {
//       rocket_id: "falcon9",
//       payloads: [
//         {
//           payload_id: "CRS-20",
//           norad_id: [45341],
//         },
//       ],
//     },
//     launch_site: {
//       site_id: "ccafs_slc_40",
//       site_name: "CCAFS SLC 40",
//       site_name_long:
//         "Cape Canaveral Air Force Station Space Launch Complex 40",
//     },
//     launch_success: true,
//   },
//   {
//     flight_number: 92,
//     mission_name: "Starlink 5",
//     launch_date_unix: 1584533760,
//     rocket: {
//       rocket_id: "falcon9",
//       payloads: [
//         {
//           payload_id: "Starlink 5",
//           norad_id: [
//             45178,
//             45179,
//             45180,
//             45181,
//             45182,
//             45183,
//             45184,
//             45185,
//             45186,
//             45187,
//             45188,
//             45189,
//             45190,
//             45191,
//             45192,
//             45193,
//             45194,
//             45195,
//             45196,
//             45197,
//             45198,
//             45199,
//             45200,
//             45201,
//             45202,
//             45203,
//             45204,
//             45205,
//             45206,
//             45207,
//             45208,
//             45209,
//             45210,
//             45211,
//             45212,
//             45213,
//             45214,
//             45215,
//             45216,
//             45217,
//             45218,
//             45219,
//             45220,
//             45221,
//             45222,
//             45223,
//             45224,
//             45225,
//             45226,
//             45227,
//             45228,
//             45229,
//             45230,
//             45231,
//             45232,
//             45233,
//             45234,
//             45235,
//             45236,
//             45237,
//           ],
//         },
//       ],
//     },
//     launch_site: {
//       site_id: "ksc_lc_39a",
//       site_name: "KSC LC 39A",
//       site_name_long: "Kennedy Space Center Historic Launch Complex 39A",
//     },
//     launch_success: true,
//   },
//   {
//     flight_number: 93,
//     mission_name: "Starlink 6",
//     launch_date_unix: 1587583800,
//     rocket: {
//       rocket_id: "falcon9",
//       payloads: [
//         {
//           payload_id: "Starlink 6",
//           norad_id: [72000],
//         },
//       ],
//     },
//     launch_site: {
//       site_id: "ksc_lc_39a",
//       site_name: "KSC LC 39A",
//       site_name_long: "Kennedy Space Center Historic Launch Complex 39A",
//     },
//     launch_success: true,
//   },
// ];
