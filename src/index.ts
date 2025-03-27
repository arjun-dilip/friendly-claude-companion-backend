import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3000;

const jsonParser = bodyParser.json();

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/api/claude", jsonParser, async (req, res) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (apiKey) {
    console.log(`----> User prompt: ${JSON.stringify(req.body)}`);
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(req.body),
    });

    const resp = await response.json();

    console.log(`----> claude response: ${JSON.stringify(resp)}`);
    res.send(JSON.stringify(resp));
  } else {
    res.send("No API key found");
  }

  // res.send("debug mode, son");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
