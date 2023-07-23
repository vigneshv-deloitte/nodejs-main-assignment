import express from "express";
import mongoose from "mongoose";
import companyRouter from "./routes/companyRoutes.js";
import hackathonRouter from "./routes/hackathonRoute.js";
import userRouter from "./routes/userRoutes.js";
import participantRouter from "./routes/participantRoutes.js";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv"; 

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(cors());

const mongoURI = process.env.MONGODB_URI;

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB:", err);
  });

app.use("/company", companyRouter);
app.use("/hackathon", hackathonRouter);
app.use("/user", userRouter);
app.use("/participant", participantRouter);

export const server = app.listen(process.env.PORT || 3000, () => {
  console.log("Listening on port " + (process.env.PORT || 3000));
});
