import express, { Request, Response } from "express";
import { validationMiddleware } from "../middleware/validate-body";
import { EnableDto, RegisterDto } from "./interface/dto";
import cardService from "../service/card.service";
import { loggingMiddleware } from "../middleware/logger";
import { authMiddleware } from "../middleware/auth";
import { RegisterResponse } from "./interface/response.interface";

export const cardRouter = express.Router();

cardRouter.post(
  "/register",
  validationMiddleware(RegisterDto),
  loggingMiddleware(),
  authMiddleware(),
  async (req: Request, res: Response) => {
    const registerDto = res.locals["input"] as RegisterDto;
    let response: RegisterResponse;
    try {
      response = await cardService.register(registerDto);
    } catch (error) {
      if (error instanceof Error) {
        return res
          .status(400)
          .send({ error: error?.message || "An Error Occured" });
      }
      return res.status(400).send({ error: "An Error Occured" });
    }
    return res.status(201).send({ ids: response.ids });
  }
);

cardRouter.post(
  "/enable",
  validationMiddleware(EnableDto),
  loggingMiddleware(),
  authMiddleware(),
  async (req: Request, res: Response) => {
    const enableDto = res.locals["input"] as EnableDto;
    try {
      await cardService.enableCard(enableDto);
      return res.status(200).send({ message: "Card enabled successfully" });
    } catch (error) {
      if (error instanceof Error) {
        return res
          .status(400)
          .send({ error: error?.message || "An Error Occured" });
      }
      return res.status(400).send({ error: "An Error Occured" });
    }
  }
);

cardRouter.post(
  "/disable",
  validationMiddleware(EnableDto),
  loggingMiddleware(),
  authMiddleware(),
  async (req: Request, res: Response) => {
    const enableDto = res.locals["input"] as EnableDto;
    try {
      await cardService.disableCard(enableDto);
      return res.status(200).send({ message: "Card disabled successfully" });
    } catch (error) {
      if (error instanceof Error) {
        return res
          .status(400)
          .send({ error: error?.message || "An Error Occured" });
      }
      return res.status(400).send({ error: "An Error Occured" });
    }
  }
);
