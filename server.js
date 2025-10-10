require("dotenv").config();
const {
    fetchInstances,
    sendMessage,
    registerWebhook,
    sendReaction,
    sendList,
} = require("./services/evolution");
const { messages } = require("./text");
const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/webhook/wa/messages-upsert", async (req, res) => {
    console.log("Webhook received:", req.body);
    const messageObj = req.body;

    if (messageObj.data.key.fromMe) {
        const data = await sendReaction(
            messageObj.instance,
            messageObj.data.key.remoteJid,
            messageObj.data.key.id,
            "🗣️"
        );
        console.log("reaction-data ", data);

        return res.sendStatus(201);
    }

    if (!true) {
        const data = await sendList(
            messageObj.instance,
            messageObj.data.key.remoteJid,
            {
                sections: [
                    {
                        title: "titleList",
                        rows: [
                            {
                                title: "titleRow",
                                description: "descriptionRow",
                                rowId: "rowId",
                            },
                        ],
                    },
                ],
            },
            messageObj.data.key.id
        );
        console.log("list-data ", data);
        return res.sendStatus(200);
    }

    console.log("messageObj.data.key.remoteJid", messageObj.data.key.remoteJid);
    // пример: отвечаем обратно
    await sendMessage(
        messageObj.instance,
        messageObj.data.key.remoteJid,
        messages.greeting,
        messageObj.data.key.id
    );

    res.sendStatus(200);
});

app.get("/instances", async (req, res) => {
    const data = await fetchInstances();
    res.json(data);
});

registerWebhook("me");

app.listen(3000, () => console.log("Server running on port 3000"));
