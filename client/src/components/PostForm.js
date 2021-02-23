import React, { useState } from 'react'
import { Form, Button } from "semantic-ui-react"
import gql from "graphql-tag"
import { useMutation } from "@apollo/react-hooks"

export default function PostForm() {

    const [values, setValues] = useState({
        body: ""
    })

   // const [errors, setErrors] = useState({})


   const [createPost, { error }] = useMutation(CREATE_POST, {
    variables: values,
    update(proxy, result) {

      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY,
      });

      let newData = [...data.getPosts];
      newData = [result.data.createPost, ...newData];
      proxy.writeQuery({
        query: FETCH_POSTS_QUERY,
        data: {
          ...data,
          getPosts: {
            newData,
          },
        },
      });
      
      values.body = '';
    }
  });

    const onSubmit = (event) => {
        event.preventDefault();
        createPost();
    }

    const onChange = (event) => {
        setValues({
            ...values,
            [event.target.name]: event.target.value
        });
    }

    return (
        <>
        <Form onSubmit={onSubmit}>
            <h2>Create a post</h2>
            <Form.Field>
                <Form.Input 
                placeholder="Hi World"
                name="body"
                onChange={onChange}
                value={values.body}
                error={error ? true : false}
                />
                <Button type="submit" color="teal">
                    Submit
                </Button>
            </Form.Field>
        </Form>
        {error && 
         <div className="ui error message">
           <ul className="list">
             <li>{error.graphQLErrors[0].message}</li>
           </ul>
         </div>
        }
        </>
    )
}

const CREATE_POST = gql`

mutation createPost(
    $body: String!
){
    createPost(
        body: $body
    ){
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
            id 
            username 
            createdAt
        }
    }
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
