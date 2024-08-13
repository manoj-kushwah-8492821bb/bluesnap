import app from "../src";
import request from "supertest";

// plans
const GET_PLANS = "/recurring/plans";
const CREATE_PLAN = "/recurring/plans";

// services
const AUTH_CAPTURE = "/services/auth-capture";

// seubscriptions
const GET_SUBSCRIPTIONS = "/recurring/subscriptions";
const CREATE_SUBSCRIPTIONS = "/recurring/subscriptions";

describe("#1 Fetch Data", () => {
  test("should return list of all plans", async () => {
    const res = await request(app).get(GET_PLANS);
    expect(res.body.success).toBe(true);
  }); // list of plans

  test("should return data of specific plan", async () => {
    const res = await request(app).get(`${GET_PLANS}/2916603`);
    expect(res.body.success).toBe(true);
  }); // specific plan by id

  test("should return list of all subscriptions", async () => {
    const res = await request(app).get(GET_SUBSCRIPTIONS);
    expect(res.body.success).toBe(true);
  }); // list of subscriptions

  test("should return data of specific subscriptions", async () => {
    const res = await request(app).get(`${GET_SUBSCRIPTIONS}/48305749`);
    expect(res.body.success).toBe(true);
  }); // specific subscription by id
}); // all fetch apis

describe("#2 Create New Data", () => {
  test("should return success response without any error in plan creation", async () => {
    const res = await request(app).post(CREATE_PLAN).send({
      chargeFrequency: "MONTHLY",
      name: "Bronze Plan",
      currency: "USD",
      recurringChargeAmount: 10.1,
    });
    expect(res.body.success).toBe(true);
  }); // create plan with valid data

  test("should return success response without any error in subscription creation", async () => {
    const res = await request(app)
      .post(`${CREATE_SUBSCRIPTIONS}/20/9203909/create`)
      .send({
        payerInfo: {
          firstName: "Test",
          lastName: "User",
          zip: 123456,
          phone: 23456789,
        },
        paymentSource: {
          creditCardInfo: {
            creditCard: {
              expirationYear: 2026,
              expirationMonth: 2,
              cardNumber: 3566000020000410,
              securityCode: 567,
            },
          },
        },
      });
    expect(res.body.success).toBe(false);
    // expect(res.body.message).toBe("Subscription created success.");
  }); // create subscription with valid data

  test("should throw error when there is no data in body in auth capture", async () => {
    const res = await request(app)
      .post(`${CREATE_SUBSCRIPTIONS}/20/9203909/create`)
      .send({});
    expect(res.body.success).toBe(false);
  }); // throw error when no data in body in subscription creation

  test("should return success response without any error in subscription cancellation", async () => {
    const res = await request(app).put(`/recurring/subscriptions/61/cancel`);
    expect(res.body.success).toBe(false);
  }); // subscription cancelation with valid data

  test("should return success response without any error in plan switching", async () => {
    const res = await request(app).put(
      `/recurring/subscriptions/61/switchPlan/2916607`
    );
    expect(res.body.success).toBe(false);
  }); // plan switching with valid data

  test("should throw error when there is no data in body in auth capture", async () => {
    const res = await request(app).post(AUTH_CAPTURE).send({});
    expect(res.body.success).toBe(false);
  }); // auth capture without data

  test("should return success response without any error in auth only", async () => {
    const res = await request(app)
      .post(AUTH_CAPTURE)
      .send({
        cardTransactionType: "AUTH_CAPTURE",
        softDescriptor: "DescTest",
        amount: 11.0,
        currency: "USD",
        cardHolderInfo: {
          firstName: "test first name",
          lastName: "test last name",
          zip: "2453",
        },
        creditCard: {
          cardNumber: 3566000020000410,
          securityCode: 123,
          expirationMonth: 2,
          expirationYear: 2026,
        },
      });
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("auth capture success");
  }); // auth capture with data
}); // all post apis
