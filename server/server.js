import express from "express";
import cors from "cors";
import morgan from "morgan";
import connect from "./database/conn.js";
import router from "./router/route.js";

const app = express();

/** middleware */
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.disable("x-powered-by"); // less hacker know about server

const port = 8080;

/** routes */
app.get("/", (req, res) => {
  res.status(200).json("Server is running");
});

/** api routes */

app.use("/api", router);

/** start server only we have valid connection */

connect().then(() => {
  try {
    app.listen(port, () => {
      console.log(`Server connected to http://localhost:${port}`);
    });
  } catch (error) {
    console.log("Cannot connect to server");
    console.log(error);
  }
}).catch((error) => {
  console.log("Invalid database connection");
});
