import ImagesManager from "../clients/ImagesManager";

export default async () => {
    await ImagesManager.fetchImagesList();
    await ImagesManager.saveAllImagesToCache();

    reloadData();
};

const reloadData = () => {
    setInterval(
        async () => {
            await ImagesManager.fetchImagesList();
            await ImagesManager.saveAllImagesToCache();
        },
        process.env.RELOAD_INTERVAL ? Number(process.env.RELOAD_INTERVAL) : 1000 * 60 * 5
    );
};
