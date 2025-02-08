import express from "express";
import authroutes from "./routes/auth.js";
import postroutes from "./routes/posts.js";
import commentroutes from "./routes/comments.js";
import likeroutes from "./routes/likes.js";
import userroutes from "./routes/users.js";
import cookieParser from "cookie-parser";
// import relationships from "./routes/relationships.js"; 
import cors from "cors";

const app = express();

app.use((req,res,next) => {
    res.header("Access-Control-Allow-Credentials", true);

    next();
})

app.use(express.json()); // ✅ This enables JSON parsing
app.use(express.urlencoded({ extended: true })); // Optional for form data
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.use(cookieParser())

// Your routes here...


const port = 8800;

app.use(express.json()); // Enable JSON parsing
app.use("/api/auth", authroutes); 
app.use("/api/users", userroutes);  // Register routes
app.use("/api/posts", postroutes); 
app.use("/api/comments", commentroutes); 
app.use("/api/likes", likeroutes); 



app.listen(8800, () => {
    console.log(`Server is running on port ${port}`);
});
