import { TOS_URL } from "#root/config";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";

export const name = "quickstart";
export const builder = new SlashCommandBuilder()
  .setName(name)
  .setDescription(
    "Quickstart command to guide you through bot's features and other necessary information."
  );

export default async (interaction: ChatInputCommandInteraction) => {
  await interaction.reply({
    content: `
# 📘 Quickstart Guide - STOLKER Bot

Welcome to the Quickstart Guide!  
This command will help you get familiar with the bot’s features and provide essential information to get started.

## 🚀 Features Overview

### 1. 🔍 Summarize

Right-click on any message → **Apps → Start Summarizing**  
You'll be prompted to choose between summarizing the **entire channel** or **up to a specific message**.

> 💡 **Tip:** Have the **message ID** of the last message you want to summarize ready.  
> ⚠️ The bot must be present in the server to use this feature.

### 2. 🔥 Roast

Right-click on any message → **Apps → Roast This Message**  
The bot will generate a Gen-Z-style roast of the selected message.

### 3. 📘 Quickstart

Use the \`/quickstart\` command at any time to view this guide again and quickly review how to use the bot’s features.

### 4. 🧑‍💻 Genzify

Right-click on any message → **Apps → Genzify This Message**  
The bot will convert the selected message into a Gen-Z style with internet lingo.

### 5. 📝 Roast Slash Command

Use the \`/roast\` command to generate a roast based on the context you provide.

### 6. 🧑‍💻 Genzify Slash Command

Use the \`/genzify\` command to convert a message into Gen-Z style.

## 📄 Terms & Conditions

By using this bot, you agree to the Terms of Service.  
Click the button below to read them.
`,
    components: [
      new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setLabel("Terms of Service")
          .setStyle(ButtonStyle.Link)
          .setURL(TOS_URL)
      ),
    ],
    ephemeral: true,
  });
};
