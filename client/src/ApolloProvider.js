import React from 'react';
import App from './App';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { createHttpLink } from "apollo-link-http";
import { ApolloProvider } from "@apollo/react-hooks";
import { setContext } from "apollo-link-context";

const httpLink = createHttpLink({
    uri: process.env.REACT_APP_BACKEND_URL 
})

const authLink = setContext(() => {
    const token = localStorage.getItem('token');
    return{
        headers: { 
            authorization: token ? `Bearer ${token}` : ""
        }
    }
})


const client = new ApolloClient({
    link:authLink.concat(httpLink),
    cache: new InMemoryCache()
})

export default (
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>
)