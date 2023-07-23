import express from "express";
import mongoose from "mongoose";
import companyRouter from "./routes/companyRoutes.js";
import hackathonRouter from "./routes/hackathonRoute.js";
import userRouter from "./routes/userRoutes.js";
import participantRouter from "./routes/participantRoutes.js"
import bodyParser from "body-parser";
import cors from "cors"


const app= express()

app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb+srv://username:XiHzba1lVneKkEuW@cluster0.vva96ak.mongodb.net/hackathonDB?retryWrites=true&w=majority').then(()=>{
    console.log("Connected to db");
}).catch((err)=>{
    console.log(err);
}
)

app.use("/company", companyRouter);
app.use("/hackathon", hackathonRouter);
app.use("/user", userRouter);
app.use("/participant", participantRouter);


export const server=app.listen(3000, async(req,res)=>{
    console.log("Listening on port 3000");

})

