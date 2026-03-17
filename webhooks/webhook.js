const express = require("express");

const app = express();
const PORT = 3000;

// Middleware to parse JSON body
app.use(express.json());

// Webhook endpoint
app.post("/webhook", (req, res) => {
    const payload = req.body;

    console.log("Webhook received!");
    console.log(payload);

    // Example logic based on event
    if (payload.event === "push") {
        console.log("Code pushed to repository");
    }

    res.status(200).send("Webhook received successfully");
});

// Start server
app.listen(PORT, () => {
    console.log(`Webhook server running on port ${PORT}`);
});