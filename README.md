# 🤖 Stolker – AI-Powered Discord Message Summarizer & Roaster

Stolker is a smart and snarky Discord bot that uses AI to **summarize**, **roast**, and **analyze messages** on demand using right-click context menus and slash commands.

---

## ✨ Features

- **🧠 AI-Powered Summarization**  
  Right-click any message and choose **Apps → Start Summarizing** to summarize the surrounding conversation. Choose to summarize the whole channel or until a specific message ID.

- **🔥 Gen-Z Style Roasts**  
  Right-click any message and select **Roast This Message** to get a witty AI-generated roast.

- **📘 Quickstart Help**  
  Use the `/quickstart` slash command to view a quick guide on using the bot.

---


## 🔠 Commands

### Context Menu Commands
- **Start Summarizing**: Summarize the conversation around a message.
- **Roast This Message**: Get a witty roast for a specific message.
- **Gen-Zify This Message**: Convert a message to Gen-Z slang.
- **Explain Like I'm 5**: Get a simplified explanation of a message.
- **TL;DR**: Get a concise summary of a message.

### Slash Commands
- **/quickstart**: Get a quick guide on how to use Stolker.
- **/roast**: Roast a specific message with a witty AI-generated response.
- **/8ball**: Ask a question and get a random answer.
- **/truth-or-dare**: Play a game of Truth or Dare with the bot.
- **/genzify**: Convert a message to Gen-Z slang.
- **/vibe-check**: Check the vibe of a message.
- **/comeback**: Get a witty comeback for a message.

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/ikrishagarwal/stolker.git
cd stolker
````

### 2. Install Dependencies

```bash
pnpm install
```

> ✅ Requires [Node.js v18+](https://nodejs.org/) and [pnpm](https://pnpm.io/)

### 3. Environment Variables

Create a `.env` file and add your bot token:

```env
TOKEN=your-bot-token-here
```

Update `CLIENT_ID` (and optionally `GUILD_ID`) in `src/config.ts` or `.env`.

---

## 🧠 Usage

### Slash Commands & Context Menus

Stolker supports:

* Slash commands (like `/quickstart`)
* Message context menus (right-click → Apps)

### Registering Commands

```bash
pnpm run register
```

Export a constant called `development` and set it to `true` in every command file you want to register inside a guild only, otherwise all commands are registered globally.

This registers all slash/context commands globally (or guild-specific in development).

---

## 🛠 Tech Stack

* **[Discord.JS v14](https://discord.js.org/)**
* **TypeScript**
* **OpenAI / Google Gemini API (via `@google/generative-ai`)**

---

## 📜 Terms of Service & Privacy

Using this bot implies acceptance of its [Terms of Service](./ToS.md)

---

## 🙋‍♂️ Author

**Krish Agarwal**

* GitHub: [ikrishagarwal](https://github.com/ikrishagarwal)
* Discord: [`@ikrish`](https://discord.com/users/701008374883418113/)

---

## ⭐ License

MIT License.
Feel free to fork, improve, or contribute — just give credit where it's due!