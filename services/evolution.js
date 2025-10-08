require("dotenv").config();
const axios = require("axios");

const API_KEY = process.env.AUTHENTICATION_API_KEY;
const BASE_URL = process.env.EVOLUTION_API_URL || "http://localhost:8080";

const headers = {
    apikey: API_KEY,
    "Content-Type": "application/json",
};

async function registerWebhook(instanceName) {
    try {
        const res = await axios.post(
            `${BASE_URL}/webhook/set/${instanceName}`,
            {
                webhook: {
                    enabled: true,
                    url: process.env.WEBHOOK_GLOBAL_URL,
                    webhookByEvents: true,
                    webhookBase64: true,
                    events: ["MESSAGES_UPSERT"],
                },
            },
            { headers }
        );

        console.log("Webhook registered:", res.data);
    } catch (err) {
        console.error(
            "Error registering webhook:",
            err.response?.data || err.message
        );

        console.error(
            "registerWebhook error body:",
            JSON.stringify(err.response?.data, null, 2)
        );
    }
}

async function fetchInstances() {
    const res = await axios.get(`${BASE_URL}/instance/fetchInstances`, {
        headers,
        body: undefined,
    });

    return res.data;
}

async function sendMessage(instanceName, to, text, messageId) {
    try {
        // Normalize recipient: accept JID (like 1234567890@s.whatsapp.net) or plain phone
        const phone =
            typeof to === "string" && to.includes("@") ? to.split("@")[0] : to;
        const body = {
            number: String(phone),
            text,
            quoted: {
                key: {
                    id: messageId,
                },
            },
        };

        const endpoint = `${BASE_URL}/message/sendText/${instanceName}`;
        const res = await axios.post(endpoint, body, { headers });

        return res.data;
    } catch (error) {
        // Improve diagnostics for 400 Bad Request and others
        const status = error.response?.status;
        const data = error.response?.data;
        console.error("sendMessage error status:", status);
        if (data) {
            console.error(
                "sendMessage error body:",
                JSON.stringify(data, null, 2)
            );
        } else {
            console.error("sendMessage error:", error.message);
        }
        return null;
    }
}

async function sendReaction(instanceName, remoteJid, messageId, reaction) {
    const body = {
        key: {
            remoteJid,
            fromMe: true,
            id: messageId,
        },
        reaction,
    };

    const endpoint = `${BASE_URL}/message/sendReaction/${instanceName}`;
    const res = await axios.post(endpoint, body, { headers });

    return res.data;
}

module.exports = { fetchInstances, sendMessage, sendReaction, registerWebhook };
