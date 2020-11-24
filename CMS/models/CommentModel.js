/*model will act as a blueprint, for database + post, this will be defined so that the schema is present inside mongoose*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    body:
        {
            type:String,
            required: true
        },
    user:{
        type:Schema.Types.ObjectId,
        ref:"user"
    },
    date:{
        type:Date,
        default: Date.now()
    },

    commentIsApproved:{
        type: Boolean,
        default:true
    }


});

module.exports= {Comment: mongoose.model('comment',CommentSchema)};