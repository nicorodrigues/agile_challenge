import Axios from "axios";
import { wait } from "../helpers";

let token: Token = null;

export const auth = (): Promise<Token> => {
    const key: EnvVar = process.env.API_KEY;

    return Axios({
        method: "POST",
        url: process.env.MAIN_API_URL + "/auth",
        data: {
            apiKey: key,
        },
    })
        .then(({ data }) => {
            if (data.token) {
                token = data.token;

                return data.token;
            } else {
                throw new Error(`Couldn't authenticate with api, check credentials`);
            }
        })
        .catch((err: Error) => {
            console.log(err);
            console.error(err.message);
        });
};

export const getImages = async (page: number = 1, limit: number = 0): Promise<AgileApiResponse> => {
    let url = `${process.env.MAIN_API_URL}/images?page=${page}`;

    if (!isNaN(limit) && limit > 0) {
        url += `&limit=${limit}`;
    }

    while (token === null) {
        await auth();
        await wait(300);
    }

    return Axios({
        method: "GET",
        url,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then(({ data }) => {
            return data;
        })
        .catch((err: Error) => {
            console.log(err);
            console.error(err.message);
            return null;
        });
};

export const getImageData = async (id: string): Promise<ImageData> => {
    while (token === null) {
        await auth();
        await wait(300);
    }

    return Axios({
        method: "GET",
        url: `${process.env.MAIN_API_URL}/images/${id}`,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then(({ data }) => data)
        .catch((err: Error) => {
            console.log(err);
            console.error(err.message);
            return "error";
        });
};

export const getToken = (): Token => {
    return token;
};
