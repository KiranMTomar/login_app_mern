import express from "express";
import cors from "cors";
import morgan from "morgan";

const app = express();

/** middleware */
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

/** routes */
app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});