import express, { Request } from "express";
import { Response } from "express";
import accountService from "../service/account.service";
import {
  CheckBalanceDto,
  CreateDto,
  DepositDto,
  VerifyDto,
  WithdrawDto,
} from "./interface/dto";
import { validationMiddleware } from "../middleware/validate-body";
import { loggingMiddleware } from "../middleware/logger";
import { authMiddleware } from "../middleware/auth";

export const accountRouter = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Account:
 *       type: object
 *       required:
 *         - userName
 *         - phoneNumber
 *         - password
 *         - firstName
 *         - lastName
 *       properties:
 *         userName:
 *           type: string
 *           description: The user name
 *         phoneNumber:
 *           type: string
 *           description: The user's phone number
 *         password:
 *           type: string
 *           description: The user's password
 *         firstName:
 *           type: string
 *           description: The user's first name
 *         lastName:
 *           type: string
 *           description: The user's last name
 *       example:
 *           userName: testtest
 *           phoneNumber: "821012345678"
 *           password: test1234!@#
 *           firstName: John
 *           lastName: Doe
 */

accountRouter.post(
  "/create",
  validationMiddleware(CreateDto),
  loggingMiddleware(),
  async (req: Request, res: Response) => {
    let token: string;
    let id: string;
    const createDto = res.locals["input"] as CreateDto;
    try {
      const res = await accountService.create(createDto);
      token = res.token;
      id = res.id;
    } catch (error) {
      if (error instanceof Error) {
        return res
          .status(400)
          .send({ error: error?.message || "An Error Occured" });
      }
      return res.status(400).send({ error: "An Error Occured" });
    }
    return res.status(201).send({ token, id });
  }
);

accountRouter.post(
  "/verify",
  validationMiddleware(VerifyDto),
  loggingMiddleware(),
  async (req: Request, res: Response) => {
    let token: string;
    let id: string;
    const verifyDto = res.locals["input"] as VerifyDto;
    try {
      const res = await accountService.verify(verifyDto);
      token = res.token;
      id = res.id;
    } catch (error) {
      if (error instanceof Error) {
        return res
          .status(400)
          .send({ error: error?.message || "An Error Occured" });
      }
      return res.status(400).send({ error: "An Error Occured" });
    }
    return res.status(200).send({ token, id });
  }
);

accountRouter.get(
  "/balance",
  validationMiddleware(CheckBalanceDto),
  loggingMiddleware(),
  authMiddleware(),
  async (req: Request, res: Response) => {
    const checkBalanceDto = res.locals["input"] as CheckBalanceDto;
    try {
      const balance = await accountService.checkBalance(checkBalanceDto);
      return res.status(200).send({ balance });
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

accountRouter.post(
  "/withdraw",
  validationMiddleware(WithdrawDto),
  loggingMiddleware(),
  authMiddleware(),
  async (req: Request, res: Response) => {
    const withdrawDto = res.locals["input"] as WithdrawDto;
    try {
      await accountService.withdraw(withdrawDto);
      return res.status(200).send({ message: "Withdrawal is successful" });
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

accountRouter.post(
  "/deposit",
  validationMiddleware(DepositDto),
  loggingMiddleware(),
  authMiddleware(),
  async (req: Request, res: Response) => {
    const depositDto = res.locals["input"] as DepositDto;
    try {
      await accountService.deposit(depositDto);
      return res.status(200).send({ message: "Deposit is successful" });
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
