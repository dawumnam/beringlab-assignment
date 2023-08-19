import { app } from "../src/index";
import supertest from "supertest";
import { dataSource } from "../src/config/sqlite-config";
import { Account } from "../src/model/accounts";

const request = supertest(app);
const userCreadentials = {
  phoneNumber: "+821012341234",
  userName: "testtest",
  firstName: "John",
  lastName: "Doe",
  password: "!@#test1234",
};
const ids: string[] = [];

describe("bering-bank-api", () => {
  describe("POST /api/v1/account/create", () => {
    it("should return 400 if missing fields", async () => {
      await request
        .post("/api/v1/account/create")
        .set("Accept", "application/json")
        .expect(400);
    });

    it("should return 400 if missing phoneNumber", async () => {
      await request
        .post("/api/v1/account/create")
        .send({ userName: "test", password: "test" })
        .set("Accept", "application/json")
        .expect(400);
    });

    it("should return 400 if missing userName", async () => {
      await request
        .post("/api/v1/account/create")
        .send({ phoneNumber: "821012341234", password: "test" })
        .set("Accept", "application/json")
        .expect(400);
    });

    it("should return 400 if missing password", async () => {
      await request
        .post("/api/v1/account/create")
        .send({ phoneNumber: "821012341234", userName: "test" })
        .set("Accept", "application/json")
        .expect(400);
    });

    it("should successfully register user", async () => {
      const existing = await dataSource.manager.findOne(Account, {
        where: { userName: "testtest" },
      });
      if (!existing) {
        const res = await request
          .post("/api/v1/account/create")
          .send(userCreadentials)
          .set("Accept", "application/json")
          .expect(201);

        expect(res.body.token).toBeDefined();
      }
    });

    it("should return 400 if the phone number is already registered", async () => {
      await request
        .post("/api/v1/account/create")
        .send({
          phoneNumber: "+821012341234",
          userName: "testtesttest",
          passwrod: "!@#test1234",
        })
        .set("Accept", "application/json")
        .expect(400);
    });

    it("should return 400 if the userName is already registered", async () => {
      await request
        .post("/api/v1/account/create")
        .send({
          phoneNumber: "+821012341235",
          userName: "testtest",
          password: "!@#test1234",
        })
        .set("Accept", "application/json")
        .expect(400);
    });

    it("should return 400 if phoneNumber is not a valid phone number", async () => {
      const data = { userName: "testtesttest", password: "!@#test1234" };
      await request
        .post("/api/v1/account/create")
        .send({ ...data, phoneNumber: "++82101234123" })
        .set("Accept", "application/json")
        .expect(400);

      await request
        .post("/api/v1/account/create")
        .send({ ...data, phoneNumber: "8210123412345" })
        .set("Accept", "application/json")
        .expect(400);

      await request
        .post("/api/v1/account/create")
        .send({ ...data, phoneNumber: "8210123412341234" })
        .set("Accept", "application/json")
        .expect(400);
    });

    it("should return 400 if userName is not a valid userName", async () => {
      const data = { phoneNumber: "+821012341235", password: "!@#test1234" };
      await request
        .post("/api/v1/account/create")
        .send({ ...data, userName: "test" })
        .set("Accept", "application/json")
        .expect(400);

      await request
        .post("/api/v1/account/create")
        .send({ ...data, userName: "testtesttesttesttesttesttesttesttesttest" })
        .set("Accept", "application/json")
        .expect(400);
    });
  });

  it("shoud return 400 if password is not a valid password", async () => {
    await request
      .post("/api/v1/account/create")
      .send({ ...userCreadentials, password: "test" })
      .set("Accept", "application/json")
      .expect(400);

    await request
      .post("/api/v1/account/create")
      .send({
        ...userCreadentials,
        password:
          "sdfhjsjkhfdjahdjkfhajkdhfkahsjdfhklashdlfkhakdhfkahfdlkhnklasjfhkajshdf",
      })
      .set("Accept", "application/json")
      .expect(400);

    await request
      .post("/api/v1/account/create")
      .send({ ...userCreadentials, password: "qweqweesttest!" })
      .set("Accept", "application/json")
      .expect(400);

    await request
      .post("/api/v1/account/create")
      .send({ ...userCreadentials, password: "T1231241234" })
      .set("Accept", "application/json")
      .expect(400);

    await request
      .post("/api/v1/account/create")
      .send({ ...userCreadentials, password: "T!@#$!@#$!@#$" })
      .set("Accept", "application/json")
      .expect(400);
  });

  describe("POST /api/v1/account/verify", () => {
    it("should return 400 if missing fields", async () => {
      await request
        .post("/api/v1/account/verify")
        .set("Accept", "application/json")
        .expect(400);
    });

    it("should return 400 if missing user name", async () => {
      await request
        .post("/api/v1/account/verify")
        .send({ password: "test" })
        .set("Accept", "application/json")
        .expect(400);
    });

    it("should return 400 if missing password", async () => {
      await request
        .post("/api/v1/account/verify")
        .send({ userName: "testtest" })
        .set("Accept", "application/json")
        .expect(400);
    });

    it("should return 400 if the user name is not registered", async () => {
      await request
        .post("/api/v1/account/verify")
        .send({ userName: "testtesttest", password: "!@#test1234" })
        .set("Accept", "application/json")
        .expect(400);
    });

    it("should return 400 if the password is incorrect", async () => {
      await request
        .post("/api/v1/account/verify")
        .send({ ...userCreadentials, password: "test" })
        .set("Accept", "application/json")
        .expect(400);
    });

    it("should return 200 if the user name and password are correct", async () => {
      await request
        .post("/api/v1/account/verify")
        .send(userCreadentials)
        .set("Accept", "application/json")
        .expect(200);
    });
  });

  describe("GET /api/v1/account/balance", () => {
    let account: Account;
    beforeAll(async () => {
      account = await dataSource.manager.findOneOrFail(Account, {
        where: { userName: "testtest" },
      });
    });

    it("should return 400 if missing fields", async () => {
      await request
        .get("/api/v1/account/balance")
        .set("Accept", "application/json")
        .expect(400);
    });

    it("should check balance", async () => {
      await request
        .get("/api/v1/account/balance")
        .send({ id: account.id })
        .set("Accept", "application/json")
        .expect(200);
    });
  });

  describe("POST /api/v1/account/deposit", () => {
    let account: Account;
    beforeAll(async () => {
      account = await dataSource.manager.findOneOrFail(Account, {
        where: { userName: "testtest" },
      });
    });

    it("should return 400 if missing fields", async () => {
      await request
        .post("/api/v1/account/deposit")
        .set("Accept", "application/json")
        .expect(400);
    });

    it("should return 400 if missing id", async () => {
      await request
        .post("/api/v1/account/deposit")
        .send({ amount: 100 })
        .set("Accept", "application/json")
        .expect(400);
    });

    it("should return 400 if missing amount", async () => {
      await request
        .post("/api/v1/account/deposit")
        .send({ id: account.id })
        .set("Accept", "application/json")
        .expect(400);
    });

    it("should return 400 if amount is not a valid amount", async () => {
      await request
        .post("/api/v1/account/deposit")
        .send({ id: account.id, amount: -100 })
        .set("Accept", "application/json")
        .expect(400);
    });

    it("should return 200 if amount is valid", async () => {
      await request
        .post("/api/v1/account/deposit")
        .send({ id: account.id, amount: 100 })
        .set("Accept", "application/json")
        .expect(200);
    });

    it("should check balance and get right amount", async () => {
      await request
        .get("/api/v1/account/balance")
        .send({ id: account.id })
        .set("Accept", "application/json")
        .expect(200);
    });
  });

  describe("POST /api/v1/account/withdraw", () => {
    let account: Account;
    beforeAll(async () => {
      account = await dataSource.manager.findOneOrFail(Account, {
        where: { userName: "testtest" },
      });
    });

    it("should return 400 if missing fields", async () => {
      await request
        .post("/api/v1/account/withdraw")
        .set("Accept", "application/json")
        .expect(400);
    });

    it("should return 400 if missing id", async () => {
      await request
        .post("/api/v1/account/withdraw")
        .send({ amount: 100 })
        .set("Accept", "application/json")
        .expect(400);
    });

    it("should return 400 if missing amount", async () => {
      await request
        .post("/api/v1/account/withdraw")
        .send({ id: account.id })
        .set("Accept", "application/json")
        .expect(400);
    });

    it("should return 400 if amount is not a valid amount", async () => {
      await request
        .post("/api/v1/account/withdraw")
        .send({ id: account.id, amount: -100 })
        .set("Accept", "application/json")
        .expect(400);
    });

    it("should return 400 if amount is greater than balance", async () => {
      await request
        .post("/api/v1/account/withdraw")
        .send({ id: account.id, amount: 1000000 })
        .set("Accept", "application/json")
        .expect(400);
    });

    it("should return 200 if amount is valid", async () => {
      await request
        .post("/api/v1/account/withdraw")
        .send({ id: account.id, amount: 100 })
        .set("Accept", "application/json")
        .expect(200);
    });

    it("should check balance and get right amount", async () => {
      await request
        .get("/api/v1/account/balance")
        .send({ id: account.id })
        .set("Accept", "application/json")
        .expect(200);
    });
  });

  describe("POST /api/v1/card/register", () => {
    let account: Account;
    beforeAll(async () => {
      account = await dataSource.manager.findOneOrFail(Account, {
        where: { userName: "testtest" },
      });
    });

    it("should return 400 if missing fields", async () => {
      await request
        .post("/api/v1/card/register")
        .set("Accept", "application/json")
        .expect(400);
    });

    it("should return 400 if missing accountId", async () => {
      await request
        .post("/api/v1/card/register")
        .send({ count: 1 })
        .set("Accept", "application/json")
        .expect(400);
    });

    it("should return 400 if missing count", async () => {
      await request
        .post("/api/v1/card/register")
        .send({ accountId: account.id })
        .set("Accept", "application/json")
        .expect(400);
    });

    it("should successfully register card", async () => {
      const res = await request
        .post("/api/v1/card/register")
        .send({ accountId: account.id, count: 1 })
        .set("Accept", "application/json")
        .expect(201);
      res.body.ids.forEach((id: string) => ids.push(id));
    });
  });

  describe("POST /api/v1/card/enable", () => {
    let account: Account;

    beforeAll(async () => {
      account = await dataSource.manager.findOneOrFail(Account, {
        where: { userName: "testtest" },
      });
    });

    it("should return 400 if missing fields", async () => {
      await request
        .post("/api/v1/card/enable")
        .set("Accept", "application/json")
        .expect(400);
    });

    it("should return 400 if missing cardId", async () => {
      await request
        .post("/api/v1/card/enable")
        .send({ accountId: account.id })
        .set("Accept", "application/json")
        .expect(400);
    });

    it("should return 400 if missing accountId", async () => {
      await request
        .post("/api/v1/card/enable")
        .send({ cardId: ids[0] })
        .set("Accept", "application/json")
        .expect(400);
    });

    it("should return 400 if card does not belong to given account", async () => {
      await request
        .post("/api/v1/card/enable")
        .send({ cardId: ids[0], accountId: "1234" })
        .set("Accept", "application/json")
        .expect(400);
    });

    it("should successfully enable card", async () => {
      await request
        .post("/api/v1/card/enable")
        .send({ cardId: ids[0], accountId: account.id })
        .set("Accept", "application/json")
        .expect(200);
    });
  });

  describe("POST /api/v1/card/disable", () => {
    let account: Account;

    beforeAll(async () => {
      account = await dataSource.manager.findOneOrFail(Account, {
        where: { userName: "testtest" },
      });
    });

    it("should return 400 if missing fields", async () => {
      await request
        .post("/api/v1/card/disable")
        .set("Accept", "application/json")
        .expect(400);
    });

    it("should return 400 if missing cardId", async () => {
      await request
        .post("/api/v1/card/disable")
        .send({ accountId: account.id })
        .set("Accept", "application/json")
        .expect(400);
    });

    it("should return 400 if missing accountId", async () => {
      await request
        .post("/api/v1/card/disable")
        .send({ cardId: ids[0] })
        .set("Accept", "application/json")
        .expect(400);
    });

    it("should return 400 if card does not belong to given account", async () => {
      await request
        .post("/api/v1/card/disable")
        .send({ cardId: ids[0], accountId: "1234" })
        .set("Accept", "application/json")
        .expect(400);
    });

    it("should successfully disable card", async () => {
      await request
        .post("/api/v1/card/disable")
        .send({ cardId: ids[0], accountId: account.id })
        .set("Accept", "application/json")
        .expect(200);
    });
  });
});
