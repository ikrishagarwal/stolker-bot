import {
  CacheType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
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

export const name = "genzify";
export const builder = new SlashCommandBuilder()
  .setName(name)
  .setDescription("Convert a message into Gen-Z style")
  .addStringOption((option) =>
    option
      .setName("text")
      .setDescription("The message to convert")
      .setRequired(true)
      .setMinLength(6)
  );

export default async (interaction: ChatInputCommandInteraction<CacheType>) => {
  const message = interaction.options.getString("text", true).trim();
  await interaction.deferReply();

  const genzifiedMessage = await genzify(message);

  try {
    const messageChannel = await interaction.client.channels.fetch(
      interaction.channelId
    );

    if (!messageChannel || !messageChannel.isTextBased())
      throw new Error("Channel not found or is not a text channel.");

    await interaction.editReply({
      content: genzifiedMessage.text,
      allowedMentions: {
        users: [],
        roles: [],
      },
    });
  } catch {
    await interaction.editReply({
      content: "Failed to convert the message. Please try again later.",
      allowedMentions: {
        repliedUser: false,
        users: [],
        roles: [],
      },
    });
  }
};
