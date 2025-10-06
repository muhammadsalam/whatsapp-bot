require("dotenv").config();
const {
    fetchInstances,
    sendMessage,
    registerWebhook,
} = require("./services/evolution");
const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/webhook/wa/messages-upsert", async (req, res) => {
    console.log("Webhook received:", req.body);
    const messageObj = req.body;

    // req.body может содержать:
    // { instanceName, from, message, type, ... }

    // пример: отвечаем обратно
    console.log("messageObj.data.key.remoteJid", messageObj.data.key.remoteJid);
    if (!messageObj.data.key.fromMe) {
        await sendMessage(
            messageObj.instance,
            messageObj.data.key.remoteJid,
            "Привет! Я бот.",
            messageObj.data.key.id
        );
    }

    res.sendStatus(200);
});

app.get("/instances", async (req, res) => {
    const data = await fetchInstances();
    res.json(data);
});

registerWebhook("bot");

app.listen(3000, () => console.log("Server running on port 3000"));
