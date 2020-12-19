import { rejects } from "assert";
import redis from "../clients/Redis";

export const save = (key: string, original_value: any) => {
    return new Promise((resolve: any, reject: any) => {
        const parsed_value = typeof original_value === "string" ? original_value : JSON.stringify(original_value);

        redis.set(key, parsed_value, (error: any) => {
            redis.persist(key);
            if (!error) {
                resolve(original_value);
            }

            reject(error);
        });
    });
};

export const get = (key: string): Promise<ImageData | null> => {
    return new Promise((resolve, reject) => {
        redis.get(key, (error: any, data: any) => {
            if (!error) {
                if (data === null) {
                    resolve(null);
                } else {
                    if (data.startsWith("{") || data.startsWith("[")) {
                        resolve(JSON.parse(data));
                    } else {
                        resolve(data);
                    }
                }
            }

            reject(error);
        });
    });
};
