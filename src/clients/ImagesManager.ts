import * as Agile from "./agile";
import * as Redis from "../services/redis";
import { wait } from "../helpers";

class ImagesManager {
    images_list: ImageIndexer[] = [];

    addImage(data: ImageIndexer) {
        if (!this.images_list.find((image_data: ImageIndexer) => image_data.id === data.id)) {
            this.images_list.push(data);
        }
    }

    addImagesBatch(images_data: ImageIndexer[]) {
        for (let i = 0; i < images_data.length; i++) {
            const image_data: ImageIndexer = images_data[i];

            this.addImage({ ...image_data, search_text: "" });
        }
    }

    async saveImageToCache(id: string) {
        const new_image_data: ImageData = await Agile.getImageData(id);
        let current_data: number = this.findIndexBy("id", id);

        const search_string = Object.values(new_image_data)
            .reduce((a, b) => a + b)
            .toLowerCase()
            .replace(/\s/g, "");

        if (current_data !== -1) {
            this.images_list[current_data] = { id: id, search_text: search_string };
            return Redis.save(id, new_image_data).then((data: any) => {
                return data;
            });
        } else {
            throw new Error(`Error fetching image with id: ${id}`);
        }
    }

    removeImage(id: string) {
        const index: number = this.findIndexBy("id", id);

        if (index !== -1) {
            this.images_list.splice(index, 1);
        }
    }

    findBy(key: string, value: string) {
        return this.images_list.find((image_data: ImageIndexer) => image_data[key] === value);
    }

    findIndexBy(key: string, value: string) {
        return this.images_list.findIndex((image_data: ImageIndexer) => image_data[key] === value);
    }

    findWithAnyKey(value: string) {
        return Promise.all(
            this.images_list
                .filter((image_data: ImageIndexer) => {
                    return image_data.search_text.includes(value.toLowerCase().replace(/\s/g, ""));
                })
                .map(async (index_data: ImageIndexer) => await this.fetchFromCache(index_data.id))
        );
    }

    async fetchFromCache(id: string): Promise<ImageData | null> {
        return Redis.get(id);
    }

    async fetchImagesList() {
        this.images_list = [];

        console.log("Fetching images data list...");
        const initial_info: AgileApiResponse = await this.fetchImagesFromPage(1);

        console.log(`Received ${initial_info.pictures.length * initial_info.pageCount} images aprox..`);
        const errored_pages: number[] = [];

        if (initial_info.hasMore) {
            for (let i = 2; i <= initial_info.pageCount; i++) {
                try {
                    await this.fetchImagesFromPage(i);
                } catch (error) {
                    console.log(error.message);
                    errored_pages.push(i);
                }
            }

            while (errored_pages.length > 0) {
                console.log(`Fetching ${errored_pages.length} missing images data...`);

                await this.fetchMissingPages(errored_pages);
                await wait(300);
            }
        }
    }

    async fetchMissingPages(pages: number[]) {
        const pages_still_missing: number[] = [];

        for (let i = 0; i < pages.length; i++) {
            const page: number = pages[i];

            try {
                await this.fetchImagesFromPage(page);
            } catch (error) {
                pages_still_missing.push(page);
            }
        }

        pages = pages_still_missing;
    }

    async fetchImagesFromPage(page: number) {
        console.log(`Fetching page ${page}`);
        const api_response: AgileApiResponse = await Agile.getImages(page);

        if (api_response === null) {
            throw new Error(`Error receiving images from page ${page} API`);
        }

        if (api_response.pictures.length > 0) {
            this.addImagesBatch(api_response.pictures);
        }

        return api_response;
    }

    async saveAllImagesToCache() {
        console.log(`Downloading ${this.images_list.length} images`);
        const images_to_fetch: string[] = [];

        for (let i = 0; i < this.images_list.length; i++) {
            console.log(`Downloading image ${i} of ${this.images_list.length}`);
            const image_data: ImageIndexer = this.images_list[i];

            try {
                await this.saveImageToCache(image_data.id);
            } catch (error) {
                console.log(error.message);
                images_to_fetch.push(image_data.id);
            }
        }

        while (images_to_fetch.length > 0) {
            console.log(`Fetching missing images`);
            await this.fetchMissingImages(images_to_fetch);
            await wait(300);
        }
    }

    async fetchMissingImages(images_to_fetch: string[]) {
        const images_still_missing: string[] = [];

        for (let i = 0; i < images_to_fetch.length; i++) {
            const image: string = images_to_fetch[i];

            try {
                await this.saveImageToCache(image);
            } catch (error) {
                images_still_missing.push(image);
            }
        }

        images_to_fetch = images_still_missing;
    }
}

export default new ImagesManager();
