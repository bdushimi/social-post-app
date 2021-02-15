import React from 'react'
import { Card, Icon, Label, Image, Button} from "semantic-ui-react"
import moment from 'moment';
import {Link} from "react-router-dom"

export default function PostCard(props) {


  const likePost = () => {

  }

  const commentOnPost = () => {

  }

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
            <Button as='div' labelPosition='right' onClick={likePost}>
              <Button color='teal' basic>
                <Icon name='heart' />
              </Button>
              <Label basic color='teal' pointing='left'>
                {props.post.likesCount}
            </Label>
            </Button>

            <Button as='div' labelPosition='right' onClick={commentOnPost}>
              <Button color='teal' basic>
                <Icon name='comments' />
              </Button>
              <Label basic color='teal' pointing='left'>
                {props.post.commentsCount}
              </Label>
            </Button>

         </div>
        </Card.Content>
      </Card>
    )
}
