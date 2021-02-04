//* Resolvers define the technique for fetching the types defined in the schema.
//* Resolver functions usually written as async for compatibility with live data sources.
const Query = {
  Query: {
    launches: (parent, args, ctx, info) => ctx.db,
    missionName(parent, args, ctx, info) {
      const launchesArr = ctx.db.filter((launch) => {
        return launch.mission_name === args.mission_name;
      });
      return launchesArr[0];
    },
    launchDate(parent, args, ctx, info) {
      const launchesArr = ctx.db.filter((launch) => {
        return launch.launch_date_unix === args.launch_date_unix;
      });
      return launchesArr;
    },
    noradId(parent, args, ctx, info) {
      const launchesArr = ctx.db.filter((launch) => {
        return launch.rocket.payloads.filter((payload) => {
          payload.norad_id === args.norad_id;
        });
      });
      return launchesArr;
    },
    readError: (parent, args, context) => {
      fs.readFileSync("/does/not/exist");
    },
    authenticationError: (parent, args, context) => {
      throw new AuthenticationError("must authenticate");
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

module.exports = Query;
