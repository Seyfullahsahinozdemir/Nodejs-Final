import express from "express";
import movieRouter from "./router/movie.router";
import categoryRouter from "./router/category.router";
import http from "http";
import { logError } from "./errorHandler/error.handler";
import cors from "cors";

const app = express();
app.use(cors());
app.use(logError);
app.use(express.json());

const server = http.createServer(app);

app.use("/movie", movieRouter);
app.use("/category", categoryRouter);

export default server;
