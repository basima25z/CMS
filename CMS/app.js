const {globalVariables} = require('./config/configuration');


const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const hbs = require('express-handlebars');
const {mongoDbUrl, PORT} = require('./config/configuration');
const app = express(); // when app is used --> calling function express to use framework
const flash = require('connect-flash'); // flash ensures that messages are stored and is displayed when page is rendered
const session = require('express-session');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const Handlebars = require('handlebars');
const methodOverride = require('method-override'); //used to delete posts from database, this allows us to use delete, patch

const fileUpload = require('express-fileupload');
const passport = require('passport');




// Configure Mongoose to Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/cms', {useNewUrlParser:true})
    .then(response => {
        console.log("Mongodb Connect Successfully");
    }).catch(err=> {
        console.log("Database connection failed.");
});


/*Configure express*/
//use defines middleware (plug in)
app.use(express.json());
app.use(express.urlencoded({extended:true}));
//joins paths together,
app.use(express.static(path.join(__dirname,'public')));


/*flash and session*/
app.use(session({
    secret: 'anysecret',
    saveUninitialized: true, //saveUnitialized: checks if modification and saves a sesion, true saves session even if no modifcation
    resave: true
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use(globalVariables);

//file upload middleware//
app.use(fileUpload());


/*Setup view Engine to Use Handlebars */
app.engine('handlebars', hbs({defaultLayout: 'default', handlebars: allowInsecurePrototypeAccess(Handlebars)}));
app.set('view engine', 'handlebars');

/*Method Override Middleware*/
app.use(methodOverride('newMethod')); //put name of newMethod and then set it equal to action in html


/*Routes*/
const defaultRoutes = require('./routes/defaultRoutes');
const adminRoutes = require('./routes/adminRoutes');

//When I get anything --> call defaultRoutes
//When I get admin --> call adminRoutes
app.use('/', defaultRoutes)
app.use('/admin', adminRoutes);






//creates server and starts it
app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`)
})