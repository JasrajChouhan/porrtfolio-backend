import mongoose from 'mongoose'

const contactSchema = new mongoose.Schema({



} , 
{
    timestamps : true
})

const Contact = mongoose.model('Contact' , contactSchema)
export default Contact;