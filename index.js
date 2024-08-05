const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const KOFI_API_KEY = process.env.KOFI_API_KEY;
const TELEGRAM_GROUP_ID = process.env.TELEGRAM_GROUP_ID;

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: false });
const app = express();
app.use(bodyParser.json());

// Store subscriptions (in-memory, replace with a database in production)
const subscriptions = new Map();

// Ko-fi webhook endpoint
app.post('/kofi-webhook', (req, res) => {
  const data = req.body.data;
  
  if (data.verification_token !== KOFI_API_KEY) {
    return res.status(403).send('Invalid API Key');
  }

  if (data.type === 'Donation' || data.type === 'Subscription') {
    handleKofiMessage(data);
  }

  res.status(200).send('OK');
});

function handleKofiMessage(data) {
  const message = data.message;
  const match = message.match(/telegram:(\d+)/);

  if (match) {
    const telegramId = match[1];
    const isSubscription = data.type === 'Subscription';
    const isRecurring = data.is_recurring;
    const isFirstSubscription = data.is_first_subscription_payment;
    const isExpired = data.is_subscription_payment_expired;

    if (isSubscription) {
      if (isFirstSubscription || isRecurring) {
        addUserToGroup(telegramId);
      } else if (isExpired) {
        removeUserFromGroup(telegramId);
      }
    } else {
      // For one-time donations, you might want to add them temporarily or handle differently
      addUserToGroup(telegramId);
    }
  }
}

function addUserToGroup(telegramId) {
  bot.inviteChatMember(TELEGRAM_GROUP_ID, telegramId)
    .then(() => {
      bot.sendMessage(telegramId, 'You have been added to the group. Thank you for your support!');
    })
    .catch((error) => {
      console.error('Error adding user to group:', error);
    });
}

function removeUserFromGroup(telegramId) {
  bot.kickChatMember(TELEGRAM_GROUP_ID, telegramId)
    .then(() => {
      bot.sendMessage(telegramId, 'Your subscription has expired. You have been removed from the group.');
    })
    .catch((error) => {
      console.error('Error removing user from group:', error);
    });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
