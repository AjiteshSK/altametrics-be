import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import Database from "./db";

//Routes 
import userRouter from "./routes/user.routes";
import reviewRouter from "./routes/reviews.routes";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

var corsOptions = {
  origin: `http://localhost:${port}`,
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use("/user", userRouter);
app.use("/review", reviewRouter);

const start = async (): Promise<void> => {
  try {
    new Database();
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Initialization error", error);
    process.exit(1);
  }
};

void start();
