import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  // defaults to process.env["ANTHROPIC_API_KEY"]
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Replace placeholders like {{USER_INPUT}} with real values,
// because the SDK does not support variables.

dotenv.config();

const app = express();
const port = 3000;

const jsonParser = bodyParser.json();

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/api/claude", jsonParser, async (req, res) => {
  const messages = req.body.messages.map(
    (message: any) => ({
      role: message.role,
      content: `<user_input>\n${message.content}\n</user_input>\n`
    })
  );

  const response = await anthropic.messages.create({
    model: "claude-3-7-sonnet-20250219",
    max_tokens: 20000,
    temperature: 1,
    system: "You are an AI travel agent tasked with creating a route plan based on user input. You will need to draft a route plan and provide the output in JSON format, including latitude and longitude coordinates for each location in the route.\n\nHere is the user's input:\n\nTo complete this task, follow these steps:\n\n1. Carefully read and analyze the user input. Extract the following information:\n   - Starting location\n   - Destinations (in the order mentioned)\n   - Any specific preferences or requirements (e.g., mode of transportation, duration of stay)\n\n2. Create a route plan based on the extracted information. The route should start from the starting location and include all mentioned destinations in a logical order.\n\n3. For each location in the route plan, you will need to obtain its latitude and longitude coordinates. To do this, use the provided coordinates API. The API takes a location name as input and returns the corresponding coordinates. Use the following format to call the API:\n\n4. Once you have created the route plan and obtained the coordinates for each location, prepare the output in JSON format. The JSON should include the following information for each stop in the route:\n   - Name of the location\n   - Latitude\n   - Longitude\n   - Any relevant notes or recommendations based on the user's preferences\n\n5. The final output should be structured as follows:\n   ```json\n   {\n     \"route\": [\n       {\n         \"location\": \"Starting Location Name\",\n         \"latitude\": XX.XXXX,\n         \"longitude\": YY.YYYY,\n         \"notes\": \"Any relevant information or recommendations\"\n       },\n       {\n         \"location\": \"Second Location Name\",\n         \"latitude\": XX.XXXX,\n         \"longitude\": YY.YYYY,\n         \"notes\": \"Any relevant information or recommendations\"\n       },\n       // ... additional locations ...\n     ]\n   }\n   ```\n\n6. Ensure that you handle any potential errors gracefully. If a location cannot be found using the coordinates API, include it in the route with a note indicating that coordinates are unavailable.\n\n7. Before finalizing your response, review the route plan to ensure it meets the user's requirements and preferences as stated in their input.\n\n8. Provide your final output within <route_plan> tags, ensuring the content is valid JSON.\n\nRemember to think through the route logically, considering factors such as geographical proximity and any specific order mentioned by the user. If the user input is unclear or lacks necessary information, make reasonable assumptions and include these in the notes for each location.",
    messages
  });

  console.log(`----> claude response: ${JSON.stringify(response)}`);

  res.send(response);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
