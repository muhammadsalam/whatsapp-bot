import makeWASocket from "baileys";
import P from "pino";
import QRCode from "qrcode";

const sock = makeWASocket({
    auth: "asd", // auth state of your choosing,
    logger: P(), // you can configure this as much as you want, even including streaming the logs to a ReadableStream for upload or saving to a file
});

sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;
    // on a qr event, the connection and lastDisconnect fields will be empty

    // In prod, send this string to your frontend then generate the QR there
    if (qr) {
        // as an example, this prints the qr code to the terminal
        console.log(await QRCode.toString(qr, { type: "terminal" }));
    }
});
