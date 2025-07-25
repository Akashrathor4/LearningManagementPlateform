const express = require("express")
const app = express();

require('dotenv').config();

const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/profile");
const paymentRoutes = require("./routes/Payment");
const courseRoutes = require("./routes/Course");
const contactUsRoute = require("./routes/Contact");

const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const {cloudinaryConnect} = require("./config/cloudinary");
const fileUpload = require("express-fileupload");


const PORT = process.env.PORT || 4000;

//datebase connect
database.connect();
//middleware
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin:"http://localhost:3002",
        credentials:true, 
    })
)
// upper wali cors bhut imp hai agar front end ko entertain karn HAi to 
app.use(
    fileUpload({
        useTempFiles:true,
        tempFileDir:"/tmp",
    })
)


//cloudinary connect
cloudinaryConnect();

//routes
app.use("/api/v1/auth",userRoutes);
app.use("/api/v1/profile",profileRoutes);
app.use("/api/v1/course",courseRoutes);
app.use("/api/v1/payment",paymentRoutes);
app.use("/api/v1/reach", contactUsRoute);

//def route

app.get("/",(req,res)=>{
    return res.json({
        success:false,
        message:"Your server is up and running ..."
    })
});


app.listen(PORT,()=>{
    console.log(`App is running at ${PORT}`)
} )


