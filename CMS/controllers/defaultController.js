const Post = require('../models/postModel').Post;
const Category = require('../models/CategoryModel').Category;
//const bcrypt = require('../node_modules/bcryptjs');
const bcrypt = require('bcrypt');
const User = require('../models/UserModel').User;
const Comment = require('../models/CommentModel').Comment;

module.exports={
    index: async(req,res) => {
        const posts= await Post.find();
        res.render('default/index',{posts:posts});
        const categories = await Category.find();
    },

    //once press login -->render this page
    loginGet:(req,res) => {
        res.render('default/login')
    },
    loginPost:(req,res) =>{


    },
    //one you press register, renders to register page
    registerGet:(req,res) =>{
        res.render('default/register');
    },

    registerPost:(req,res) =>{
        //if any errors display --> errors in an array

        let errors =[];

        //if statements to check if field is missing and pushes a message
        if(!req.body.firstName)
        {
            errors.push({message: 'First name is required'});
        }

        if(!req.body.lastName)
        {
            errors.push({message: 'Last name is required'});
        }
        if(!req.body.email)
        {
            errors.push({message: 'Email is required'});
        }
        if(req.body.password !==req.body.passwordConfirm)
        {
            errors.push({message: 'Passwords do not match'});
        }

        //attempting to prompt to fill in missing information by auto
        //reloading what information was already inputted
        if(errors.length>0)
        {
            res.render('default/register',{
                errors:errors,
                firstName: req.body.firstName,
                lastName:req.body.lastName,
                email:req.body.email
            });
        }

        //attempting to check if email already exists
        else{
            User.findOne({email:req.body.email}).exec().then(user=>{
                if(user){
                    req.flash('error-message', 'Email already exists, try logging in');
                    res.redirect('/login');

                }
                else {
                    //if no errors, genSalt is used to add randomness to password
                    const newUser = new User(req.body);
                    bcrypt.genSalt(10,(err,salt)=> {
                        //hash is predictable, because plain text is the same length as hash text, so you have to add salt on top
                        bcrypt.hash(newUser.password,salt, (err,hash)=> {
                            newUser.password = hash;
                            newUser.save().then(user => {
                                req.flash('success-message','You have successfully registered');
                                res.redirect('/login');
                            });
                        });
                    });


                }
            })
        }
    },

    //find post from Post object and stores ID in variable
    //find the ID and populates the comments and user
    singlePost: (req,res)=>{
        const id = req.params.id;

        Post.findById(id)
            .populate({path:'comments', populate:{path: 'user', model:'user'}})
            .then(post=>{
            if(!post)
            {
                //if post isn't found --> send message
                res.status(404).json({message: 'No Post Found'});
            }
            else{
                //renders while sending post info and comment info
                res.render('default/singlePost',{post:post, comments:post.comments});
            }


        })
    },

    submitComment:(req,res)=>
    {
        //want comment only if user is logged in
        if(req.user)
        {
            //find the id of the post then created a newComment variable
            //which stores user and body of comment
            Post.findById(req.body.id).then(post=>{
                const newComment=new Comment({
                    user:req.user.id, //stores object ID of user
                    body:req.body.comment_body // stores comment body

                });

                //pushes the newComments to the post and saves ot
                post.comments.push(newComment); //pushes array of comments
                post.save().then(savePost =>{
                    newComment.save().then(saveComment =>{
                        req.flash('success-message', 'You comment was submitted for review');
                        res.redirect(`/post/${post._id}`);
                    });//save comment in comment secetion
                });
            })
        }

        else{
            req.flash('error-message', 'Login first to comment');
            res.redirect('/login');
        }

    }

};