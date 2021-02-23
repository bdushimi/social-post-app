import React, {useState, useEffect} from 'react'
import { Button, Icon, Label } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { useMutation } from '@apollo/react-hooks'
import gql from "graphql-tag"

export default function LikeButton(props) {

    const [liked, setLiked] = useState(false);

    useEffect(() =>{
        if(props.user && props.likes.find(like => like.username === props.user.username)){
            setLiked(true)
        }else {
            setLiked(false)
        }

    }, [props.user, props.likes])

    const [likePost] = useMutation(LIKE_POST_MUTATION, {
        variables: {
            postId: props.id
        }
    })


    const likeButton = props.user ? (
        liked ? (
            <Button color='teal'>
                <Icon name='heart' />
              </Button>

        ) : (
            <Button color='teal' basic>
                <Icon name='heart' />
            </Button>
        )

    ) : (
        <Button as={Link} to="/login" color='teal' basic>
                <Icon name='heart' />
        </Button>
    )


    return (
          <Button as='div' labelPosition='right' onClick={likePost}>
              {likeButton}
              <Label basic color='teal' pointing='left'>
                {props.likesCount}
            </Label>
          </Button>
    )
}


const LIKE_POST_MUTATION = gql`
mutation likePost( $postId: ID!){
    likePost(postId: $postId){
        id
        username
        likes{
            id
            username
            createdAt  
        }
        likesCount
    }
}
`
