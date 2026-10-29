import express from "express";
import "dotenv/config";
import imagesRouter from "./routes/images.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json())
app.use("/images",imagesRouter);


app.listen(PORT, () => {
    console.log("Server runnin on port: ",PORT)
})