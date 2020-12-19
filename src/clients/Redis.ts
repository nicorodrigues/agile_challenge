import * as redis from "redis";

const pass: string = process.env.REDIS_PASS || "";

const redis_options: { [key: string]: any } = {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
};

if (typeof process.env.REDIS_PASS === "string" && process.env.REDIS_PASS.length > 0) {
    redis_options.password = process.env.REDIS_PASS;
}

const client = redis.createClient(redis_options);

client.on("connect", () => {
    console.log("Connected to redis");
});

client.on("error", (err: Error) => {
    console.log(err.message);
});

export default client;
