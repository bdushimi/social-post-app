import React, { useState, useContext } from 'react'
import { Form, Button } from "semantic-ui-react"
import gql from "graphql-tag"
import { useMutation } from "@apollo/react-hooks"
import { AuthContext } from "../utils/context"

const Signup = (props) => {

    const context = useContext(AuthContext);
    const [values, setValues] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });


    const [errors, setErrors] = useState({})

    const [registerUser, { loading }] = useMutation(REGISTER_USER, {
        update(proxy, result) {
            context.login(result.data.register)
            props.history.push("/");
        },
        onError(err) {
            setErrors(err.graphQLErrors[0].extensions.exception.errors);
        },
        variables : values
    });

    const onSubmit = (event) => {
        event.preventDefault();
        registerUser() 
    }

    const onChange = (event) => {
        setValues({
            ...values,
            [event.target.name]: event.target.value
        })
    }


    return (
        <div className="form-container">
            <Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''}>
                <h1>Sign up</h1>
                <Form.Input
                    label="Username"
                    placeholder="Username..."
                    type="text"
                    name="username"
                    error={errors.username ? true : false}
                    value={values.username}
                    onChange={onChange}
                />

                <Form.Input
                    label="Email"
                    placeholder="Email..."
                    name="email"
                    type="email"
                    value={values.email}
                    error={errors.email ? true : false}
                    onChange={onChange}
                />


                <Form.Input
                    label="Password"
                    placeholder="Password..."
                    name="password"
                    type="password"
                    value={values.password}
                    error={errors.password ? true : false}
                    onChange={onChange}
                />


                <Form.Input
                    label="Confirm Password"
                    placeholder="Confirm Password..."
                    name="confirmPassword"
                    type="password"
                    value={values.confirmPassword}
                    error={errors.confirmPassword ? true : false}
                    onChange={onChange}
                />

                <Button type="submit" primary>
                    Sign up
                </Button>

            </Form>
            {Object.keys(errors).length > 0 && (
                <div className=" ui error message">
                    <ul className="list">
                        {
                            Object.values(errors).map(value => (
                                <li key={value}>{ value } </li>
                            ))
                        }
                    </ul>
                </div>
            )}
        </div>
    )
} 


const REGISTER_USER = gql`

mutation register (
    $username: String!
    $password: String!
    $confirmPassword: String!
    $email: String!
){
    register(
        registerInputs: {
            username: $username,
            password: $password
            confirmPassword: $confirmPassword
            email: $email
        }
    ){
        token 
        id 
        username 
        email
    }
}
`;

export default Signup
