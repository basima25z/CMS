/*model will act as a blueprint, for database + post, this will be defined so that the schema is present inside mongoose*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title:
        {
            type:String,
            required: true
        },
    status:
        {
            type:String,
            default: 'public'
        },
    description:
        {
            type:String,
            required: true
        },
    creationDate:
        {
            type:Date,
            default: Date.now()
        },
    user: //creates link between user and post with ID from mongoose
        {
            type: Schema.Types.ObjectId,
            ref: "user"
        },
    //one post to one category
    category:{
        type:Schema.Types.ObjectId,
        ref:"category"
    },
    comments: [ //array of comments
        {
            type:Schema.Types.ObjectId,
            ref:"comment"
        }
    ],
    allowComments:{
        type:Boolean,
        default: false
    },
    file:{
        type:String,
        default:``
    }
});

module.exports= {Post: mongoose.model('post',PostSchema)};