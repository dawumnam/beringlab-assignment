import express from "express";
import { accountRouter } from "./controller/account.controller";
import { specs } from "./config/swagger-config";
import swaggerUi from "swagger-ui-express";
import logger from "./logger/winston";
import { dataSource } from "./config/sqlite-config";
import { cardRouter } from "./controller/card.controller";

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/account", accountRouter);
app.use("/api/v1/card", cardRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

(async () => {
  try {
    await dataSource.initialize();
  } catch (error) {
    console.log(JSON.stringify(error, null, 2));
  }
})();

app.listen(3000, () => {
  logger.info("Server is listening on port 3000!");
});
