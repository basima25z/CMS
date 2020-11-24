const express= require('express')
const router = express.Router();

const adminController = require('../controllers/adminController');
const {isUserAuthenticated}=require("../config/customFunction")

//if the user has been authenticated, it has permission to access the backend
//isUserAuthenticated: passport method that verifies if user is logged in correctly
router.all('/*',isUserAuthenticated,(req,res, next)=>
    {
        req.app.locals.layout = 'admin';

        next();
    }
)

/*ADMIN POST ENDPOINTS*/
router.route('/')
    .get(adminController.index);

router.route('/posts')
    .get(adminController.getPosts);

router.route('/posts/create')
    .get(adminController.createPosts)
    .post(adminController.submitPosts);


router.route('/posts/edit/:id')
    .get(adminController.editPosts)
    .put(adminController.editPostSubmit);

router.route('/posts/delete/:id')
    .delete(adminController.deletePost);

/*ADMIN CATEGORY ROUTES*/
router.route('/category')
    .get(adminController.getCategories)
    .post(adminController.createCategories);

router.route('/comment')
    .get(adminController.getComments)
    .post(adminController.approveComments);

module.exports=router;