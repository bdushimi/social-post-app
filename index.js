const { ApolloServer } = require("apollo-server");
const gql = require('graphql-tag');


// Define the Schema
// With gql, the schema (mutatation, query, object types) are written using string literals
const typeDefs = gql`

type Query {
    welcome: String!
}

`

// Contains the implementation of each query or mutatation
const resolvers = {

    // Grouping all queries implementation in a Query object
    Query : {
        welcome: () => "Welcome to Social-Post-App"
    }

}

const server = new ApolloServer({
    typeDefs,
    resolvers
});


server
.listen()
.then((res) => {
    console.log(`Server is running on ${res.url}`);
})