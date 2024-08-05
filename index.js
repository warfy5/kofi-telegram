const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const bodyParser = require('body-parser');

// Replace with your Telegram Bot Token
const TELEGRAM_BOT_TOKEN = 'YOUR_TELEGRAM_BOT_TOKEN';
// Replace with your Ko-fi API Key
const KOFI_API_KEY = 'YOUR_KOFI_API_KEY';
// Replace with your Telegram group ID
const TELEGRAM_GROUP_ID = 'YOUR_TELEGRAM_GROUP_ID';

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });
const app = express();
app.use(bodyParser.json());

// Store subscriptions (in-memory, replace with a database in production)
const subscriptions = new Map();

// Handle messages in Telegram
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text.startsWith('telegram:')) {
    const userId = text.split(':')[1];
    subscriptions.set(userId, chatId);
    bot.sendMessage(chatId, 'Your Telegram ID has been registered. You will be added to the group once your subscription is confirmed.');
  }
});

// Ko-fi webhook endpoint
app.post('/kofi-webhook', (req, res) => {
  const data = req.body;
  
  if (data.verification_token !== KOFI_API_KEY) {
    return res.status(403).send('Invalid API Key');
  }

  if (data.type === 'Subscription') {
    handleSubscription(data);
  }

  res.status(200).send('OK');
});

function handleSubscription(data) {
  const userId = data.from_name; // Assuming the Ko-fi username matches the Telegram ID
  const chatId = subscriptions.get(userId);

  if (!chatId) {
    console.log(`No Telegram chat ID found for user: ${userId}`);
    return;
  }

  if (data.is_subscription_payment) {
    // Add user to the group
    bot.inviteChatMember(TELEGRAM_GROUP_ID, chatId)
      .then(() => {
        bot.sendMessage(chatId, 'You have been added to the group. Thank you for your subscription!');
      })
      .catch((error) => {
        console.error('Error adding user to group:', error);
      });
  } else if (data.is_expired) {
    // Remove user from the group
    bot.kickChatMember(TELEGRAM_GROUP_ID, chatId)
      .then(() => {
        bot.sendMessage(chatId, 'Your subscription has expired. You have been removed from the group.');
      })
      .catch((error) => {
        console.error('Error removing user from group:', error);
      });
  }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
