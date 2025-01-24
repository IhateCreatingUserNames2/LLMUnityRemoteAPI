const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch"); // Ensure node-fetch is installed

const app = express();
const PORT = process.env.PORT || 3000;

// Get MiniMax API Key from environment variables
const MINI_MAX_API_KEY = process.env.MiniMax_API_KEY;

if (!MINI_MAX_API_KEY) {
  console.error("Error: MINI_MAX_API_KEY is not set. Please configure it in the environment variables.");
  process.exit(1); // Exit if the key is missing
}

// Middleware to log all incoming requests
app.use((req, res, next) => {
  console.log(`\n[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  next();
});

app.use(bodyParser.json());

// Serve static files like index.html
app.use(express.static(__dirname));

// Serve index.html at the root route
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

/**
 * Endpoint for Web-based Chatbot (/chatbot)
 */
app.post("/chatbot", async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required." });
  }

  try {
    // Use the message directly in MiniMax API call
    const apiResponse = await fetch("https://api.minimaxi.chat/v1/text/chatcompletion_v2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${MINI_MAX_API_KEY}`,
      },
      body: JSON.stringify({
        model: "MiniMax-Text-01",
        max_tokens: 1024,
        temperature: 0.8, // Based on your preference
        top_p: 0.9,
        messages: [
          {
            role: "system",
            content: "A conversation between a user and an assistant.",
          },
          {
            role: "user",
            content: message, // User's input
          },
        ],
      }),
    });

    const data = await apiResponse.json();

    if (apiResponse.ok && data.choices && data.choices[0]) {
      res.json({ reply: data.choices[0].message.content });
    } else {
      console.error("Error from MiniMax API:", data);
      res.status(500).json({
        error: "MiniMax API responded with an error.",
        details: data,
      });
    }
  } catch (error) {
    console.error("Error in /chatbot:", error);
    res.status(500).json({ error: "An error occurred while processing your request." });
  }
});

/**
 * Endpoint for LLMUnity Integration (/chat)
 */
app.post("/chat", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required for LLMUnity requests." });
  }

  try {
    const apiResponse = await fetch("https://api.minimaxi.chat/v1/text/chatcompletion_v2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${MINI_MAX_API_KEY}`,
      },
      body: JSON.stringify({
        model: "MiniMax-Text-01",
        max_tokens: 256,
        temperature: 1.0,
        top_p: 0.95,
        messages: [
          {
            role: "system",
            content: "A conversation between a user and an assistant.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    const data = await apiResponse.json();

    if (apiResponse.ok && data.choices && data.choices[0]) {
      res.json({ result: data.choices[0].message.content });
    } else {
      console.error("Error from MiniMax API:", data);
      res.status(500).json({
        error: "MiniMax API responded with an error.",
        details: data,
      });
    }
  } catch (error) {
    console.error("Error connecting to MiniMax API:", error);
    res.status(500).json({ error: "An error occurred while connecting to the MiniMax API." });
  }
});

/**
 * Endpoint for LLMUnity "completion" calls
 */
app.post("/completion", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required for completion requests." });
  }

  try {
    const apiResponse = await fetch("https://api.minimaxi.chat/v1/text/chatcompletion_v2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${MINI_MAX_API_KEY}`,
      },
      body: JSON.stringify({
        model: "MiniMax-Text-01",
        max_tokens: 256,
        temperature: 1.0,
        top_p: 0.95,
        messages: [
          {
            role: "system",
            content: "A conversation between a user and an assistant.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    const data = await apiResponse.json();

    if (apiResponse.ok && data.choices && data.choices[0]) {
      res.json({ content: data.choices[0].message.content });
    } else {
      console.error("Error from MiniMax API:", data);
      res.status(500).json({
        error: "MiniMax API responded with an error.",
        details: data,
      });
    }
  } catch (error) {
    console.error("Error connecting to MiniMax API:", error);
    res.status(500).json({ error: "An error occurred while connecting to the MiniMax API." });
  }
});

/**
 * Endpoint for LLMUnity "template" calls
 */
app.post("/template", async (req, res) => {
  // Example template definition
  const template = {
    name: "chatml",
    description: "ChatML Template",
    system_prefix: "<|im_start|>system\n",
    system_suffix: "<|im_end|>\n",
    user_prefix: "<|im_start|>user\n",
    assistant_prefix: "<|im_start|>assistant\n",
    message_separator: "\n",
    stopwords: ["<|im_end|>", "<|im_start|>"],
  };

  try {
    res.status(200).json(template); // Send the template as a JSON response
  } catch (error) {
    console.error("Error in /template endpoint:", error);
    res.status(500).json({ error: "An error occurred while generating the template." });
  }
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
