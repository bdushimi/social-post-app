
const Post = require('../models/Post');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError} =  require ('apollo-server');
const checkAuth = require('../utils/checkAuth');



const { validateRegisterInputs, validateLoginInputs } = require ('../utils/validators')

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
        },
        async getPost(parent, args, context, info){
            const { postId } = args;

            try{

                const post = await Post.findById(postId);
                if(post) return post;
                else throw new Error("Post not found");

            }catch(error){
                throw new Error(error.message);
            }
        }
    },

    Mutation: {
        async register(parent, args, context, info){
            let { registerInputs : { username, email, password, confirmPassword} } = args;

            // Validate inputs
             const { errors, valid } = validateRegisterInputs(username, email, password, confirmPassword);
             if(!valid){
                 throw new UserInputError(" UserInputError", {
                     errors
                 })
             }


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

        },

        async login(parent, args, context, info){
            
            let {username, password } = args;
            
            // Validate inputs
             const { errors, valid } = validateLoginInputs(username, password);
             if(!valid){
                 throw new UserInputError(" UserInputError", {
                     errors
                 })
             }

              // Check if a user already exists
            const user = await User.findOne({ username });

            if(!user){
                errors.general = "User not found";
                throw new UserInputError("User not found", {errors});
            }

            const match = await bcrypt.compare(password, user.password);

            if(!match){
                errors.general = "Wrong credentials";
                throw new UserInputError("Wrong credentials", {errors})
            }

            const token = jwt.sign({
                id: user.id,
                email:user.email,
                username: user.username
            }, process.env.TOKEN_SECRET, {expiresIn : "1h"});

            return {
               id: user._id,
               token,
               ...user._doc
            }

        },

        async createPost(parent, args, context, info){
            const { body } = args;

            const user = checkAuth(context);

            const newPost = await new Post({
                body,
                user: user.id,
                username: user.username,
                createdAt: new Date().toISOString()
            })

            return await newPost.save();
        }
    }

 }