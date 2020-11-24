module.exports= {
    //check if the file is empty or not
    //sends an object, if it has a property key --> not empty
    isEmpty: function (obj) {
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                return false;
            }
        }
        return true;
    },

    //checks if use is authenticated
    //isAuthenticated() will return true if user is logged in
    isUserAuthenticated:(req,res,next)=> {
        if (req.isAuthenticated()) {
            next();
        } else {
            res.redirect('/login');
        }
    }
};