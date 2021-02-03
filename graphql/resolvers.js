
const Post = require('../models/Post');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError} =  require ('apollo-server');

module.exports = {

    // Grouping all queries implementation in a Query object
    Query : {
        welcome: () => "Welcome to Social-Post-App",
        async getPosts(){
            try {
                const posts = await Post.find();
                return posts;
            }catch (error){
                throw new Error(error);
            }
        }
    },

    Mutation: {
        async register(parent, args, context, info){
            let { registerInputs : { username, email, password, confirmPassword} } = args;

            // Validate inputs
            


            // Check if a user already exists
            const existingUsername = await User.findOne({ username })

            if(existingUsername) throw new UserInputError(" Username is taken", { 
                errors: {
                    username: "This username has been already taken"
                }
            });

            password  =  await bcrypt.hash(password, 12);
            const newUser = new User({
                email,
                username,
                password,
                createdAt: new Date().toISOString()
            });

            const res = await newUser.save();

            const token = jwt.sign({
                id: res.id,
                email:res.email,
                username: res.username
            }, process.env.TOKEN_SECRET, {expiresIn : "1h"});

            return {
               id: res._id,
               token,
               ...res._doc
            }

        }
    }

}