import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";

import { AuthContext } from "../utils/context"


const AuthRoute = ({component: Component, ...rest}) => {

    const { user } = useContext(AuthContext);

    return (
        <Route
        {...rest}
        render={props => (
            user ? <Redirect to="/"/> : <Component {...props} />
        )}
        />
    )

}


export default AuthRoute;