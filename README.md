# Ko-fi Telegram Bot

This Node.js bot integrates Ko-fi and Telegram to manage group memberships based on subscriptions. When a user subscribes through Ko-fi, they are automatically added to a specified Telegram group. When their subscription expires, they are removed from the group.

## Features

- Listens for messages in Ko-Fi to register user IDs
- Processes Ko-fi webhook events for subscription management
- Automatically adds subscribers to a Telegram group
- Removes users from the Telegram group when their subscription expires

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js installed (version 12.x or higher recommended)
- A Telegram Bot Token (obtain from [@BotFather](https://t.me/botfather))
- A Ko-fi account with API access
- A Telegram group where the bot is an administrator
- pm2 to keep the server running (optional)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/warfy5/kofi-telegram-bot.git
   cd kofi-telegram-bot
   ```

2. Install the dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory and add your credentials:
   ```
   TELEGRAM_BOT_TOKEN=your_telegram_bot_token
   KOFI_API_KEY=your_kofi_api_key
   TELEGRAM_GROUP_ID=your_telegram_group_id
   ```

## Usage

1. Start the bot:
   ```
   node index.js
   ```

2. Set up a Ko-fi webhook to send notifications to `http://your-server-address/kofi-webhook`

3. Users can register their Telegram ID by sending a message to the bot in the format: `telegram:12345678`

## Configuration

Update the following variables in the `index.js` file or use environment variables:

- `TELEGRAM_BOT_TOKEN`: Your Telegram Bot API token
- `KOFI_API_KEY`: Your Ko-fi API key
- `TELEGRAM_GROUP_ID`: The ID of your Telegram group

## License

Distributed under the MIT License. See `LICENSE` for more information.


## Acknowledgements

- [node-telegram-bot-api](https://github.com/yagop/node-telegram-bot-api)
- [Express.js](https://expressjs.com/)
- [Ko-fi](https://ko-fi.com/)
