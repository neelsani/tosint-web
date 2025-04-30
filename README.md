# Telegram OSINT Analyzer

A sleek, modern front-end built with React, TypeScript, and Tailwind CSS that lets you gather quick OSINT insights about any Telegram bot and group chat. Enter your bot token and chat ID to instantly view bot details, membership status, chat information, invite links, member counts, and administrators—all in an intuitive, card-based UI.

---

## Features

- **Bot Info**: Fetch and display bot name, username, ID, and group permissions.
- **Member Status**: See your bot's status (member/admin) in the specified chat.
- **Chat Details**: View chat title, type, ID, visibility settings, and invite link.
- **Invite Links**: Export or create new invite links on the fly.
- **Member Count**: Retrieve total number of members in the chat.
- **Administrators**: List all admins with names and IDs.
- **Responsive UI**: Fully responsive, card-based layout with icons for clear visual hierarchy.

---

## Tech Stack

- **React** + **TypeScript**
- **Tailwind CSS** for utility-first styling
- Fetch API for data retrieval from Telegram Bot API

---

## Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/neelsani/tosint-web.git
   cd tosint-web
   ```
2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```
3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Usage

1. Enter your Telegram **bot token** (with or without `bot` prefix).
2. Enter the target **chat ID** (e.g. `-1001234567890`).
3. Click **Analyze** and explore the returned data cards.

---

## Contributing

Contributions welcome! Please fork the repo and submit a pull request with your improvements or bug fixes.

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

