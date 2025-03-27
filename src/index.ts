import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3000;

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/api/claude", async (req, res) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (apiKey) {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20240620",
        max_tokens: 300,
        messages: [
          {
            role: "user",
            content: "Hello, can you introduce yourself?",
          },
        ],
      }),
    });

    const resp = await response.json();

    res.send(JSON.stringify(resp));
  } else {
    res.send("No API key found");
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
