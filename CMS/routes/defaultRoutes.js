<!--all defaults routes on front page are stored here -->
const express= require('express');
const router = express.Router(); /*helps to create different routes*/
const defaultController = require('../controllers/defaultController');
const passport = require('passport');
const LocalStrategy=require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User=require('../models/UserModel').User;

/*route function specifies a path and then chain protocals*/
/*get request looks in default to look for index method*/
/*sets default as subroute*/

router.all('/*',(req,res, next)=>
    {
        req.app.locals.layout = 'default';

        next();
    }
)
router.route('/')
    .get(defaultController.index);

//Defining local strategy
passport.use(new LocalStrategy({
    usernameField:`email`,
    passReqToCallback: true
}, (req, email,password,done)=>{
    User.findOne({email:email}).then(user=>{
        if(!user){
            return done(null, false,req.flash('error-message', 'User not found'));
        }

        bcrypt.compare(password,user.password,(err, passwordMatched)=>
        {
            if(err){
                return err;
            }
            if(!passwordMatched){
                return done(null,false,req.flash('error-message', 'Invalid Username or Password'));
            }

            return done(null,user,req.flash('success-message','Login Successful'));
        });
    });

}));

//serializing and deserialize: when the user is authenticated, passport will save the user's id
//to the session and later when the user object is needed, it will grab the user object from the database
passport.serializeUser(function(user,done)
{
    done(null,user.id);
});

passport.deserializeUser(function (id,done){
    User.findById(id, function (err,user){
        done(err,user);
    })
});


router.route('/login')
    .get(defaultController.loginGet)
    .post(passport.authenticate('local',{
        successRedirect: '/admin',
        failureRedirect:'/login',
        failureFlash:true,
        successFlash: true,
        session:true
    }),defaultController.loginPost);

router.route('/register')
    .get(defaultController.registerGet)
    .post(defaultController.registerPost);

router.route('/post/:id')
    .get(defaultController.singlePost)
    .post(defaultController.submitComment);


router.get('/logout',(req,res)=>{
   req.logOut(); //call logout on req object then redirect to home page
   req.flash('success-message', 'Logout was successful');
   res.redirect('/');
});
module.exports=router;