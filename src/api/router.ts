import * as express from "express";
import ImagesRoutes from "./routes/images";

const r = express.Router();

r.use("/images", ImagesRoutes);

export default r;
