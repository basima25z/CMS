/*model will act as a blueprint, for database + post, this will be defined so that the schema is present inside mongoose*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    title:
        {
            type:String,
            required: true
        },


});

module.exports= {Category: mongoose.model('category',CategorySchema)};