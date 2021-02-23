import React, {useContext} from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from "graphql-tag"
import {Grid, Transition} from "semantic-ui-react"

import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";


import { AuthContext } from "../utils/context";

export default function Home() {

    const {  user} = useContext(AuthContext);
    const {loading, data } = useQuery(FETCH_POSTS_QUERY);
    
    return (
        <Grid columns={3}>
            <Grid.Row className="page-title">
                <h1>Recent Posts</h1>
            </Grid.Row>
            <Grid.Row>
                {user && (
                    <Grid.Column>
                        <PostForm />
                    </Grid.Column>
                )}
            {
                loading ? (
                    <h1>Loading Posts...</h1>
                ) : (
                    <Transition.Group>
                        {
                            data.getPosts && data.getPosts.map(post => (
                                <Grid.Column key={post.id}>
                                    <PostCard post={post}/>
                                </Grid.Column>
                            ))
                        }
                    </Transition.Group>
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
