import express, { RequestHandler } from "express";
import graphqlHTTP from "express-graphql";
import { GraphQLObjectType, GraphQLString, GraphQLSchema } from "graphql";

interface IUser {
  id: string;
  name: string;
}

// Maps id to User object
var fakeDatabase: { [id: string]: IUser } = {
  a: {
    id: "a",
    name: "alice"
  },
  b: {
    id: "b",
    name: "bob"
  }
};

// Define the User type
var userType = new GraphQLObjectType({
  name: "User",
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString }
  }
});

// Define the Query type
var queryType = new GraphQLObjectType({
  name: "Query",
  fields: {
    user: {
      type: userType,
      // `args` describes the arguments that the `user` query accepts
      args: {
        id: { type: GraphQLString }
      },
      resolve: function(_, { id }) {
        return fakeDatabase[id];
      }
    }
  }
});

var schema = new GraphQLSchema({ query: queryType });

var app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true
  })
);
app.listen(4000);
console.log("Running a GraphQL API server at localhost:4000/graphql");
