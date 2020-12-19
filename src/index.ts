import * as dotenv from "dotenv";
dotenv.config();

import * as express from "express";
import init from "./jobs/init";

import router from "./api/router";

const app = express();

app.use(router);

app.listen(process.env.PORT, () => console.log(`App listening on port: ${process.env.PORT}`));

init();
