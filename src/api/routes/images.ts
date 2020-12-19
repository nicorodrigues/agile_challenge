import * as express from "express";
import * as ImagesController from "../controllers/ImagesController";

const r = express.Router();

r.get("/", ImagesController.listAll);

r.get("/id/:id", ImagesController.fetchImageFromCache);

r.get("/:searchterm", ImagesController.fetchImages);


export default r;
