import React , {useContext} from 'react'
import gql from "graphql-tag"
import { useQuery } from "@apollo/react-hooks"
import { Button, Card, Grid, Image, Icon, Label } from 'semantic-ui-react'
import moment from "moment"


import { AuthContext } from "../utils/context";
import LikeButton from "../components/LikeButton";
import DeleteButton from "../components/DeleteButton"

export default function Post(props) {

    const postId = props.match.params.postId

    const { user } = useContext(AuthContext);

    const { data } = useQuery(FETCH_POST_QUERY, {
        variables: { 
            postId
        }
    })

    const deletePostCallback = () => {
        props.history.push("/")
    }

    let postMarkup;

    if(!data){
        postMarkup = <p>Loading....</p>
    }else{
        postMarkup = (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={2}>
                        <Image
                        floated='right'
                        size='mini'
                        src='https://react.semantic-ui.com/images/avatar/large/molly.png'
                        />
                    </Grid.Column>

                    <Grid.Column width={10}>
                        <Card fluid>
                           <Card.Content>
                                <Card.Header>{data.getPost.username}</Card.Header>
                                <Card.Meta>{moment(data.getPost.createdAt).fromNow()}</Card.Meta>
                                <Card.Description>{data.getPost.body}</Card.Description>
                           </Card.Content>
                           <hr/>
                           <Card.Content>
                               <LikeButton
                                    user={user}
                                    id = {data.getPost.id}
                                    likes = {data.getPost.likes}
                                    likesCount={data.getPost.likesCount}
                               />

                               <Button
                               as="div"
                               labelPosition="right"
                               onClick={() => console.log("Comment Button Clicked")}
                               >
                                   <Button
                                   basic 
                                   color="blue"
                                   >
                                       <Icon name="comments"/>
                                   </Button>
                                   <Label basic color="blue" pointing="left">
                                       {data.getPost.commentsCount}
                                   </Label>
                               </Button>

                                {
                                      user && user.username === data.getPost.username && 
                                      <DeleteButton postId={data.getPost.id} callback={deletePostCallback}/>
                                }

                           </Card.Content>
                        </Card>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
    return postMarkup
}


const FETCH_POST_QUERY = gql`

query ($postId: ID!){
    getPost(postId : $postId){
        id
        body
        createdAt
        username
        comments {
            id
            createdAt
            username
            body
        }
        commentsCount
        likes {
            id
            createdAt
            username
        }
        likesCount
    }
}
`
