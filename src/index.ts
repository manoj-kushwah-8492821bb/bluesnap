import cors from "cors";
import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import planRouter from "../routes/plan";
import serviceRouter from "../routes/service";
import errorHandler from "../common/errorHandler";
import handleWebhook from "../common/handleWebhook";
import subscriptionRouter from "../routes/subscription";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// routes
app.use("/services", serviceRouter);
app.use("/recurring/plans", planRouter);
app.use("/recurring/subscriptions", subscriptionRouter);

// webhook route integrated in IPN bluesnap
app.post("/webhook", async (req, res) => {
  try {
    const event = req.body;
    await handleWebhook(event); // Call the extracted webhook handler function
    res.status(200).send("Webhook processed successfully");
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).send("Internal Server Error");
  }
});

// error handler
app.use(errorHandler);

// server started
app.listen(PORT, () =>
  console.log(`🚀 Server ready at: http://localhost:${PORT}`)
);

export default app;
