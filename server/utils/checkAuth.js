const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server');
require('dotenv').config();

module.exports = (context) => {
    const authHeader = context.req.headers.authorization;
    if(authHeader){
        const token = authHeader.split("Bearer ")[1];
        if(token){
            try {
                const user = jwt.verify(token, process.env.TOKEN_SECRET);
                return user;
            }catch (error){
                throw new AuthenticationError("Invalid/Expired token");
            }
        }

        throw new Error('Authentication token is not provided/invalid');
    }

    throw new Error('Authorization header must be provided');
}