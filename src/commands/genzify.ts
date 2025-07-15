import {
  ApplicationCommandType,
  CacheType,
  ContextMenuCommandBuilder,
  MessageContextMenuCommandInteraction,
  MessageFlags,
} from "discord.js";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

const genzify = (content: string) => {
  return ai.models.generateContent({
    model: "gemini-2.5-flash-lite-preview-06-17",
    contents: content,
    config: {
      systemInstruction:
        "You are a young Gen-Z guy. Convert the messages into a Gen-Z style with some internet lingo in no more than a few lines, for context it's a discord message and might include mentions and emojis",
      temperature: 0.6,
    },
  });
};

export const name = "Genzify";
export const builder = new ContextMenuCommandBuilder()
  .setName(name)
  .setType(ApplicationCommandType.Message);

export default async (
  interaction: MessageContextMenuCommandInteraction<CacheType>
) => {
  const message = interaction.targetMessage.content.trim();

  if (message.length <= 3) {
    await interaction.reply({
      content: "Provide a message with at least a handful of words pal",
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  await interaction.deferReply();

  const genzifiedMessage = await genzify(message);

  try {
    const messageChannel = await interaction.client.channels.fetch(
      interaction.targetMessage.channelId
    );

    if (!messageChannel || !messageChannel.isTextBased())
      throw new Error("Channel not found or is not a text channel.");

    const replyMessage = await messageChannel.messages.fetch(
      interaction.targetMessage.id
    );

    if (!replyMessage)
      throw new Error("Original message not found in the channel.");

    await replyMessage.reply({
      content:
        genzifiedMessage.text + `\n\n-# GenZ-fied by ${interaction.user}`,
      allowedMentions: {
        users: [],
        roles: [],
      },
    });

    await interaction.editReply({
      content: "GenZ-fied version of the message sent!",
    });
    await interaction.deleteReply();
  } catch {
    await interaction.editReply({
      content:
        `> **${interaction.targetMessage.author.displayName}:** ${message}\n\n` +
        genzifiedMessage.text +
        "\n\n-# Tip: Add me to this server to have a better experience",
      allowedMentions: {
        repliedUser: false,
        users: [],
        roles: [],
      },
    });
  }
};
