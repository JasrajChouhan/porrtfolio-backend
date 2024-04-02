import mongoose from 'mongoose'

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URI)
        .then(() => console.log('MongoDB Connected...'))
    } catch (error) {
        console.log(`Error: monbodb connection error or failed ${error}`)
        
    }
}
 
export default dbConnection;