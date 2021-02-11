const gql = require('graphql-tag');


// Define the Schema
// With gql, the schema (mutatation, query, object types) are written using string literals


const typeDefs = gql`

type Post {
    id:ID!
    body: String!
    username: String!
    createdAt: String
    comments:[Comment]!
    likes:[Like]!
    likesCount: Int!
    commentsCount: Int!

}

type Comment{
    id:ID!
    createdAt: String!
    username:String!
    body:String!
}

type Like{
    id:ID!
    createdAt:String!
    username:String!
}

type Query {
    welcome: String!
    getPosts: [Post]
    getPost(postId: ID!): Post
}


input RegisterInputs {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
}


type Mutation {
    register(registerInputs : RegisterInputs): User!
    login(username: String!, password: String): User!
    createPost(body: String!): Post!
    deletePost(postId: ID!): Boolean
    createComment(postId:ID!, body:String!): Post!
    deleteComment(postId:ID!, commentId:ID!): Post!
    likePost(postId:ID!): Post!
}

type User {
    id:ID!
    token: String!
    username: String!
    email: String!
}


type Subscription {
    newPost: Post!
}

`

module.exports = typeDefs