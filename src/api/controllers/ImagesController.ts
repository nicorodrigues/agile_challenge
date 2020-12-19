import { Request, Response } from "express";
import ImagesManager from "../../clients/ImagesManager";

export const fetchImages = async (req: Request, res: Response) => {
    if (req.params.searchterm) {
        const images = await ImagesManager.findWithAnyKey(req.params.searchterm);
        console.log(images);
        res.send(images);
    } else {
        res.status(409);
        res.send("Search string not correctly formatted");
    }
};

export const fetchImageFromCache = async (req: Request, res: Response) => {
    if (req.params.id) {
        const image_buffer_from_cache: ImageData | null = await ImagesManager.fetchFromCache(req.params.id);
        if (!image_buffer_from_cache) {
            res.status(404);
            res.send("ID not found");
        } else {
            res.send(image_buffer_from_cache);
        }
    } else {
        res.status(409);
        res.send("Search string not correctly formatted");
    }
};

export const listAll = async (req: Request, res: Response) => {
    res.send(ImagesManager.images_list);
};
