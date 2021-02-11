const { ApolloServer, PubSub } = require("apollo-server");
const gql = require('graphql-tag');
const mongoose = require('mongoose');
require('dotenv').config();


const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const Post = require('./models/Post')


const pubSub = new PubSub();
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req}) => ({req, pubSub})
});


// Connecting to the database
mongoose
.connect(process.env.DB_URL, {useNewUrlParser: true})
.then(() =>{
    console.log('Database connected... :)');
    return server
    .listen()
}).then((res) => {
    console.log(`Server is running on ${res.url}`);
})