import app from "./app.js";
import dbConnection from "./db/databaseConnection.js";
import userRoute from './route/user.route.js'
import { ErrorMiddleware } from "./middlewares/error.js";
import contactUsRouter from './route/contactUs.route.js'
import blogRouter from './route/blog.route.js'

import cloudinary from  'cloudinary';
import dotenv from 'dotenv'
dotenv.config();
const port  = process.env.PORT || 5000;





          
cloudinary.v2.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key:  process.env.CLOUDINARY_API_KEY,
  api_secret: process.env. CLOUDINARY_API_SECRET
});

app.use('/api/v1/user' , userRoute);
app.use('/api/v1/contactus' , contactUsRouter)
app.use('/api/v1/blog' , blogRouter)







dbConnection();
app.use(ErrorMiddleware)
app.listen(port || 5000 , () => {
    console.log( `Server is running on port ${port}`);
})

