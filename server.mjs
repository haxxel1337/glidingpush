import express from "express";
import webpush from "web-push";
import dotenv from "dotenv";
import fs from "fs/promises"; // Lägg till detta

dotenv.config();

const app = express();

app.use(express.json());

let subscriptionData = null;

webpush.setVapidDetails(
  `mailto:${process.env.VAPID_MAILTO}`,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

app.get('/send-notification', async (req, res) => {
  try {
    const fileContent = await fs.readFile("./public/rapport_text.txt", "utf8"); // Ändra filvägen här

    await webpush.sendNotification(subscriptionData, JSON.stringify({
      title: "Träningsrapport",
      body: fileContent // Använd filinnehållet som body
    }));
    res.sendStatus(200);
  } catch(err) {
    console.error(err);
    res.sendStatus(500);
  }
});

app.post("/save-subscription", async (req, res) => {
  subscriptionData = req.body;
  res.sendStatus(200);
});

app.use(express.static("./public"));

app.listen(process.env.PORT || 8000);
