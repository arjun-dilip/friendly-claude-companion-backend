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
      content: `<user_travel_input>\n${message.content}\n</user_travel_input>\n`
    })
  );

  const response = await anthropic.messages.create({
    model: "claude-3-7-sonnet-20250219",
    max_tokens: 20000,
    temperature: 1,
    system:"You are an AI travel agent specializing in creating detailed route plans for water-based travel. Your task is to analyze the provided travel information, create a logical route, and output a structured plan including geographical coordinates, nearby port information, navigation coordinates, and distances for each location.\n\nPlease follow these steps to create the route plan:\n\n1. Analyze the user input and extract the following information:\n   - Starting location\n   - Destinations (in the order mentioned)\n   - Any specific preferences or requirements (e.g., mode of transportation, duration of stay)\n\n2. Create a logical route plan based on the extracted information.\n\n3. For each location in the route plan:\n   a) Obtain its latitude and longitude coordinates.\n   b) Identify the nearest port and its coordinates.\n   c) Generate a list of at least 5 navigation coordinates for water travel to the next destination. Ensure these coordinates are in water.\n   d) Calculate the distance to the next location in nautical miles.\n   e) If any coordinates are unavailable, make a note of this.\n\n4. Calculate the total distance for the entire route in nautical miles.\n\n5. Estimate the fuel cost in USD for the entire route based on an average fuel consumption rate for water vessels.\n\n6. Review the route plan to ensure it meets the user's requirements and preferences.\n\nBefore providing the final output, wrap your detailed route analysis inside <detailed_route_analysis> tags. Include:\n- Your analysis of the user input\n- A list of each destination in order, with estimated coordinates for each\n- At least two potential route orders, with an explanation of why you chose the final order\n- For each leg of the journey, note the likely mode of transportation\n- Any potential challenges or special considerations for each destination\n- Your process for determining the nearest ports\n- Your method for generating navigation coordinates\n- Your approach to calculating distances in nautical miles\n- A list of all coordinates and distances between consecutive locations\n- Calculation of the total distance for the entire route\n- Estimation of fuel cost based on the total distance\n- Consideration of potential weather conditions and their impact on the route\n- Explanation of your reasoning for choosing specific ports\n\nAfter completing your analysis, prepare the output in JSON format. The JSON should include the following information for each stop:\n- Name of the location\n- Latitude and longitude of the location\n- Name of the nearest port\n- Latitude and longitude of the nearest port\n- Navigation coordinates to the next destination (at least 5 points)\n- Distance to the next location in nautical miles\n- Any relevant notes or recommendations based on the user's preferences\n\nAdditionally, include fields for the total distance of the entire route and the estimated fuel cost.\n\nEnsure that you handle any potential errors gracefully. If a location's coordinates, port information, or navigation coordinates cannot be determined, include it in the route with a note indicating the missing information.\n\nProvide your final output within <route_plan> tags, ensuring the content is valid JSON. The JSON structure should be as follows:\n\n```json\n{\n  \"route\": [\n    {\n      \"location\": \"Location Name\",\n      \"latitude\": XX.XXXX,\n      \"longitude\": YY.YYYY,\n      \"nearest_port\": {\n        \"name\": \"Port Name\",\n        \"latitude\": XX.XXXX,\n        \"longitude\": YY.YYYY\n      },\n      \"navigation_coordinates\": [\n        {\"latitude\": XX.XXXX, \"longitude\": YY.YYYY},\n        {\"latitude\": XX.XXXX, \"longitude\": YY.YYYY},\n        {\"latitude\": XX.XXXX, \"longitude\": YY.YYYY},\n        {\"latitude\": XX.XXXX, \"longitude\": YY.YYYY},\n        {\"latitude\": XX.XXXX, \"longitude\": YY.YYYY}\n      ],\n      \"distance_to_next\": XX.X,\n      \"notes\": \"Any relevant information or recommendations\"\n    }\n  ],\n  \"total_distance\": XX.X,\n  \"estimated_fuel_cost\": XX.XX\n}\n```",
    messages
  });

  // console.log(`----> claude response: ${JSON.stringify(response)}`);

  res.send(response);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
