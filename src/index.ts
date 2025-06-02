import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import Errorhandler from "./utils/errorHandler";
import AppError from "./utils/appError";
import { writeLogToFile, createLogFile, backupLogFile } from "./utils/logger";

// import { publisher} from "./utils/rabbit";

import UserRoutes from "./routes/user";
import SS10Routes from "./routes/ss10";
import SS01Routes from "./routes/ss01";
import FeedBackRoutes from "./routes/feedback";
import PresenceRoutes from "./routes/presence";
import SS04Routes from "./routes/ss04";
import TrainingRoutes from "./routes/training";
import SS03Routes from "./routes/ss03";

require("dotenv").config();

const app = express();

const PORT = process.env.PORT;
app.use(
  cors({
    origin: "*",
  })
);

let list_services: string[] = [];

app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ limit: "5mb", extended: true }));

const logInterval = 24 * 60 * 60 * 1000; // 24 jam dalam milidetik

setInterval(() => {
  if (list_services.length > 0) {
    list_services.forEach((element) => {
      backupLogFile(element);
    });
    console.log("create log file");
  }
}, logInterval);

// TODO: Routing aplikasi akan kita tulis di sini
app.get("/", (req: Request, res: Response) =>
  res.send({ message: "Welcome to NIS Your`s." })
);

app.use("/user", UserRoutes);

app.use("/ss10", SS10Routes);

app.use("/ss01", SS01Routes);

app.use("/ss03", SS03Routes);

// app.use("/ss04", SS04Routes);

app.use("/feedback", FeedBackRoutes);

app.use("/presence", PresenceRoutes);

app.use("/training", TrainingRoutes);

app.all("*", (req: Request, res: Response, next: any) => {
  next(new AppError(`The URL ${req.originalUrl} does not exists`, 404));
});

app.use(Errorhandler);

app.listen(PORT, () =>
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`)
);

// publisher({ id: 1, name: "Alan Turing" },"SS01","ROUTE:SS01");
