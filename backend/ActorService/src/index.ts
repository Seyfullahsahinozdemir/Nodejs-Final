import express from "express";
import actorRouter from "./router/actor.router";
import http from "http";
import { logError } from "./errorHandler/error.handler";
import cors from "cors";

const app = express();
app.use(cors());
app.use(logError);
app.use(express.json());

const server = http.createServer(app);

app.use("/actor", actorRouter);

export default server;
