import React, {useContext} from 'react'
import { Card, Icon, Label, Image, Button} from "semantic-ui-react"
import moment from 'moment';
import {Link} from "react-router-dom"
import { AuthContext } from "../utils/context"
import LikeButton from "./LikeButton"

export default function PostCard(props) {


  const { user } = useContext(AuthContext);


    return (
        <Card className="card">
        <Card.Content>
          <Image
            floated='right'
            size='mini'
            src='https://react.semantic-ui.com/images/avatar/large/molly.png'
          />
          <Card.Header>{props.post.username}</Card.Header>
          <Card.Meta as={Link} to={`/posts/${props.post.id}`}>{moment(props.post.createdAt).fromNow()}</Card.Meta>
          <Card.Description>
            {props.post.body}
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
          <div>

            <LikeButton
            user = {user}
            id = {props.post.id}
            likes = { props.post.likes}
            likesCount={props.post.likesCount}
            />

            <Button  labelPosition='right' as={Link} to={`/posts/${props.post.id}`}>
              <Button color='teal' basic>
                <Icon name='comments' />
              </Button>
              <Label basic color='teal' pointing='left'>
                {props.post.commentsCount}
              </Label>
            </Button>

            {
              user && user.username === props.post.username && (
                <Button 
                as='div' 
                color='red' 
                floated='right'
                onClick={()=>{}}>
                  <Icon name='trash' style={{ margin : 0 }}/>
                </Button>
              )
            }

         </div>
        </Card.Content>
      </Card>
    )
}
