import { Command } from "#lib/command";
import { TOS_URL } from "#root/config";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";

const name = "quickstart";

export default class extends Command {
  public static override commandName = name;

  public static override builder() {
    return new SlashCommandBuilder()
      .setName(name)
      .setDescription(
        "Quickstart command to guide you through bot's features and other necessary information."
      );
  }

  public static override async chatInputRun(
    interaction: ChatInputCommandInteraction
  ) {
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

### 7. 📖 Explain

Right-click on any message → **Apps → Explain This Message**  
The bot will provide a detailed explanation of the selected message.

### 8. 🕵️‍♂️ Vibe Check

Use the \`/vibe-check\` command to check the vibe of a message. Either provide the message text or the message ID to get started.

### 9. 🗣️ Comeback

Use the \`/comeback\` command to generate a witty comeback for a specific message with their message id based on the optional context you provide.

> 💡 **Tip:** You can optionally make this anonymous to hide evidences.

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
  }
}
