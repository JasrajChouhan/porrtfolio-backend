import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        minLength: [30, "Title should be greater than 30 characters"],
        required: true
    },
    content: {
        type: String,
        minLength: [100, "Minimum content should contain 100 characters"],
        maxLength: [50000, "Maximum length of content is 50000 characters"],
        required: true
    },
    image : {
        public_id : {
            type : String,
            required : true 

        },
        url: {
            type : String,
            required : true,
        }
        
    }

}, { timestamps: true });

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;