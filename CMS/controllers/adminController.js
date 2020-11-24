const Post = require('../models/postModel').Post;
const Category = require('../models/CategoryModel').Category;
const {isEmpty}=require('../config/customFunction');
const Comment = require('../models/CommentModel').Comment;

module.exports= {
    index: (req, res) => {
        res.render('admin/index');
    },

    //find: mongodb method to fetch posts --> as we are fetching posts, we are rendering them
    // object of posts
    getPosts: (req, res) => {
        Post.find().lean().populate('category').then(posts=>{
            res.render('admin/posts/index',{posts:posts});
        });

    },

    submitPosts: (req,res) => {
        //to handle check box on allow comments, if it has comment -> true, otherwise false
        const commentsAllowed = req.body.allowComments ? true:false;

        //check for any input file
        let filename='';

        if(!isEmpty(req.files))
        {
            let file = req.files.uploadedFile;
            filename=file.name;
            //upload directory
            let uploadDir = './public/uploads/';

            //move function that comes with package imported
            file.mv(uploadDir+filename, (err)=>
            {
                if(err)
                    throw err;

            });
        }

        //receives data stored in body and store in a Post variable
        const newPost = new Post({
            // all of these are getting fetched from html (id=title)
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
            allowComments:commentsAllowed,
            category:req.body.category, // will have id of category
            file:`/uploads/${filename}`
        });
        //used to save post on newPost object then promise
        newPost.save().then(post=>{
            console.log(post); //output the text to webpage
            req.flash('success-message','Post Created Successfully.'); //flash message
            res.redirect('/admin/posts'); //redirect user to admin post section
        });
    },

    //find: mongodb method to fetch posts --> as we are fetching cats, we are rendering them
    // object of posts
    createPosts:(req,res)=>{
        //fetch categories and send to view
        Category.find().lean().then(cats=>{
            res.render('admin/posts/create',{categories: cats});

        });

    },

    editPosts:(req,res)=>{
        //find post from Post object and stores ID in variable
        //send ID parameter that you are attempting to edit
        //render and send post as an Object to view
        const id = req.params.id;
        Post.findById(id).then(post=>{
            res.render('admin/posts/edit', {post:post})
        });
    },

    editPostSubmit:(req,res)=>
    {
        const commentsAllowed = req.body.allowComments ? true:false;

        const id = req.params.id;

        Post.findById(id).then(post=>{
            post.title=req.body.title;
            post.status=req.body.status;
            post.allowComments=commentsAllowed;
            post.description=req.body.description;

            post.save().then(updatePost=>{
                req.flash('success-message', `The Post of ${updatePost.title} has been updated`);
                res.redirect('/admin/posts');
            })
        });

    },
    deletePost:(req,res)=>
    {
        //findByIDandDelete: Mongoose Method
        // if found by id, then delete and send message
        Post.findByIdAndDelete(req.params.id)
            .then(deletedPost =>{
                req.flash('success-message', `The post ${deletedPost.title} has been deleted.`);
                res.redirect('/admin/posts');
            })
    },

    /*ALL CATEGORY METHODS*/
    getCategories:(req,res)=>{
        Category.find().lean().then(cats => {
            //sends cats object to view
            res.render('admin/category/index',{categories:cats} )
        })
    },

    //from admin view point, this allows you to create categories and save them
    createCategories:(req,res)=>{
      var categoryName=req.body.name;

      if(categoryName){
          const newCategory = new Category({
              title:categoryName
          });
          newCategory.save().then(category=>{
              res.status(200).json(category);
          })
      }
    },

    /*comment route*/
    //finds the comments, and populates them by user
    getComments:(req,res)=>{
        Comment.find().lean()
            .populate('user')
            .then(comments=>{
                res.render('./admin/comments/index', {comments:comments});
            })

    },

    approveComments:(req,res)=>
    {
        var data = req.body.data;
        var commentId=req.body.id;

        console.log(data,commentId);
        Comment.findById(commentId).then(comment=>{
            comment.commentIsApproved=data;
            comment.save().then(saved=>{
                res.status(200).send('OK');
            }).catch(err =>{
                res.status(201).send('FAIL');
            });


        });

    }



};