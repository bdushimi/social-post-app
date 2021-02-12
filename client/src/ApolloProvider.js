import React from 'react';
import App from './App';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { createHttpLink } from "apollo-link-http";
import { ApolloProvider } from "@apollo/react-hooks";


const httpLink = createHttpLink({
    uri: process.env.REACT_APP_BACKEND_URL 
})


const client = new ApolloClient({
    link:httpLink,
    cache: new InMemoryCache()
})

export default (
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>
)