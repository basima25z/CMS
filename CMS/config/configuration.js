// port defined in configuration file
//process.env.PORT --> if you you run on a live server
// if line of code isn't defined use port #3000
module.exports={
    mongoDbUrl: "mongodb://localhost:27017/cms",
    PORT: process.env.PORT || 3000,
    globalVariables: (req,res,next) => {
        //middleware used to access messages globally
        res.locals.success_message = req.flash('success-message');
        res.locals.error_message = req.flash('error-message');
        res.locals.user=req.user || null;

        //next() executes the next function
        next();
    }
}