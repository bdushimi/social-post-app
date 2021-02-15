import React from 'react'
import { Card, Icon, Label, Image, Button} from "semantic-ui-react"
import moment from 'moment';

export default function PostCard(props) {

    return (
        <Card>
        <Card.Content>
          <Image
            floated='right'
            size='mini'
            src='https://react.semantic-ui.com/images/avatar/large/molly.png'
          />
          <Card.Header>{props.post.username}</Card.Header>
          <Card.Meta>{moment(props.post.createdAt).fromNow()}</Card.Meta>
          <Card.Description>
            {props.post.body}
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
         <p>Buttons here</p>
        </Card.Content>
      </Card>
    )
}
