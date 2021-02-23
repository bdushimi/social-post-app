import React, {useState} from 'react'
import { Button,Icon,Confirm } from "semantic-ui-react"
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks"

export default function DeleteButton(props) {

    const [confirmOpen, setConfimOpen] = useState(false)

    const [deletePost] = useMutation(DELETE_POST_MUTATION, {

        update(proxy, result) {
            setConfimOpen(false)

            const data = proxy.readQuery({
                query: FETCH_POSTS_QUERY
            })


            const newData = data.getPosts.filter(post => post.id !== props.postId)
            proxy.writeQuery({
                query: FETCH_POSTS_QUERY,
                data : {
                    ...data,
                    getPosts: {
                        newData,
                    },
                }
            })


            if(props.callback) props.callback();
        },

        variables:{
            postId: props.postId
        }
    })


    return (
        <>
        <Button 
            as='div' 
            color='red' 
            floated='right'
            onClick={() => setConfimOpen(true)}
        >
            <Icon 
                name='trash' 
                style={{ margin : 0 }}
            />
        </Button>
        <Confirm 
            open={confirmOpen}
            onCancel={()=> setConfimOpen(false)}
            onConfirm={deletePost}
        />
        </>
    )
}


const DELETE_POST_MUTATION = gql`
mutation deletePost($postId: ID!){
    deletePost(postId: $postId)
}

`


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
