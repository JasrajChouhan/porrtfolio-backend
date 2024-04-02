import cookieParser from 'cookie-parser';
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import fileUpload from 'express-fileupload'


dotenv.config();

const app = express();
app.use(cors({
    origin: [process.env.FRONTEND_URL],
    methods : ['GET' , 'POST' , 'PUT' , 'DELETE'],
    credentials : true
}))
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded( { extended : true }))
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : "/tmp/",

}))

app.use(express.static("public"))





export default app;