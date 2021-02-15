import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from "graphql-tag"
import {Grid } from "semantic-ui-react"
import PostCard from "../components/PostCard";

export default function Home() {

    const {loading, data } = useQuery(FETCH_POSTS_QUERY);
    
    return (
        <Grid columns={3}>
            <Grid.Row className="page-title">
                <h1>Recent Posts</h1>
            </Grid.Row>

            <Grid.Row>
            {
                loading ? (
                    <h1>Loading Posts...</h1>
                ) : (
                    data.getPosts && data.getPosts.map(post => (
                        <Grid.Column key={post.id}>
                            <PostCard post={post}/>
                        </Grid.Column>
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
