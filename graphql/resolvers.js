
const Post = require('../models/Post');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError, AuthenticationError} =  require ('apollo-server');
const checkAuth = require('../utils/checkAuth');



const { validateRegisterInputs, validateLoginInputs } = require ('../utils/validators')

module.exports = {

    // Field resolvers
    Post: {
        likesCount : (parent) => parent.likes.length,
        commentsCount : (parent) => parent.comments.length,
    },
    // Grouping all queries implementation in a Query object
    Query : {
        welcome: () => "Welcome to Social-Post-App",
        async getPosts(){
            try {
                const posts = await Post.find().sort({createdAt: -1});
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

            if(body.trim() === ""){
                throw new Error("Post body must not be empty");
            }

            const user = checkAuth(context);

            const newPost = await new Post({
                body,
                user: user.id,
                username: user.username,
                createdAt: new Date().toISOString()
            })

            const post = await newPost.save();

            context.pubSub.publish("NEW_POST", { 
                newPost: post
            });

            return post;
        }, 

        async deletePost(parent, args, context, info) {
            const { postId } = args;

            const user = checkAuth(context);

            try{

                const post = await Post.findById(postId);
                if(user.username === post.username){
                    await post.delete();
                    return true
                }else {
                    throw new AuthenticationError("You do not own this post!")
                }
            }catch(error){
                throw new Error(error);
            }
             
        },

        async createComment(parent, args, context, info){
            const { postId, body } = args;

            const { username } = checkAuth(context);

            if(body.trim() === "") throw new UserInputError("Empty comment", {
                errors: {
                    body: " Comment body must not be empty"
                }
            })


            const post = await Post.findById(postId)
            if(post){
                post.comments.unshift({
                    body,
                    username,
                    createdAt: new Date().toISOString()
                })

                return await post.save();
            }else {
                throw new UserInputError("Post not found")
            }
        },

        async likePost(parent, args, context, info){

            const { postId } = args;
            const { username, id } = checkAuth(context);

            const post = await Post.findById(postId);

            if(post){
                if(post.likes.find(like => like.username === username)){
                    // Post already likes, unlike it
                    post.likes = post.likes.filter(like => like.username !== username);

                }else {
                    post.likes.push({
                        username,
                        createdAt: new Date().toISOString()
                    })
                }

                await post.save();
                return post;
            }else throw new UserInputError("Post not found");
        },

        async deleteComment(parent, args, context, info){
            const {username} = checkAuth(context);
            const { commentId, postId } = args;
            const post = await Post.findById(postId)

            if(post){
                const commentIndex = post.comments.findIndex( c => c.id === commentId);
                if(post.comments[commentIndex].username === username){
                    post.comments.splice(commentIndex,1);
                    await post.save();
                    return post;
                }else {
                    throw new AuthenticationError('Action not allowed')
                }
            }
        }

    },

    Subscription: {
        newPost: {
            subscribe: (parent, args, context, info) => context.pubSub.asyncIterator("NEW_POST")
        }
    }

 } 