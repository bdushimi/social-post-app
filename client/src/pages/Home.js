import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from "graphql-tag"
import {Grid } from "semantic-ui-react"

import PostCard from "../components/PostCard";

export default function Home() {

    const {loading, data } = useQuery(FETCH_POSTS_QUERY);

    if(data){
        console.log(data.getPosts);
    }
    return (
        <Grid columns={3}>
            <Grid.Row>
                <h1>Recent Posts</h1>
            </Grid.Row>

            <Grid.Row>
            {
                loading ? (
                    <h1>Loading Posts...</h1>
                ) : (
                    data.getPosts && data.getPosts.map(post => (
                        <Grid.Row key={post.id}>
                            <PostCard post={post}/>
                        </Grid.Row>
                    ))
                )
            }
            </Grid.Row>
        </Grid>
    )
}

const FETCH_POSTS_QUERY = gql`
{
  getPosts {
    id
    body
    username
    likesCount
    commentsCount
    createdAt
    comments {
      id
      username
      body
      createdAt
    }
    likes {
      username
      createdAt
    }
  }
}
`
