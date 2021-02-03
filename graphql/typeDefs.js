const gql = require('graphql-tag');


// Define the Schema
// With gql, the schema (mutatation, query, object types) are written using string literals


const typeDefs = gql`

type Post {
    id:ID!
    body: String!
    username: String!
    createdAt: String

}

type Query {
    welcome: String!
    getPosts: [Post]
}


input RegisterInputs {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
}


type Mutation {
    register(registerInputs : RegisterInputs): User!
}

type User {
    id:ID!
    token: String!
    username: String!
    email: String!
}

`

module.exports = typeDefs