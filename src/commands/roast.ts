import {
  ApplicationCommandType,
  CacheType,
  cleanContent,
  ContextMenuCommandBuilder,
  MessageContextMenuCommandInteraction,
  MessageFlags,
} from "discord.js";
import { GoogleGenAI } from "@google/genai";
import { CLIENT_ID } from "#root/config";

const ai = new GoogleGenAI({});

const generateRoast = (content: string, authorName: string) => {
  return ai.models.generateContent({
    model: "gemini-2.5-flash-lite-preview-06-17",
    contents: content,
    config: {
      systemInstruction:
        "You are an average thug chad known for burning people with roasts. Roast the messages with some internet lingo like a gen z in no more than a few lines. For context the author's name is" +
        authorName,
      temperature: 0.6,
    },
  });
};

export const name = "Roast This";
export const builder = new ContextMenuCommandBuilder()
  .setName(name)
  .setType(ApplicationCommandType.Message);

export default async (
  interaction: MessageContextMenuCommandInteraction<CacheType>
) => {
  const message = interaction.targetMessage;

  if (message.author.id === CLIENT_ID) {
    try {
      await interaction.deferReply();

      const reply = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite-preview-06-17",
        contents:
          "Generate a reply for the user trying to roast your, the roast master's, own message with a little bit of sass in no more than a few lines, for context the author's name is " +
          interaction.user.displayName,
        config: {
          temperature: 0.6,
        },
      });

      console.log("Reply generated:", reply.text);

      await interaction.editReply({
        content: reply.text,
      });
    } catch (error) {
      console.error("Error generating reply:", error);
      await interaction.reply({
        content: "Something went wrong while generating the reply.",
        flags: MessageFlags.Ephemeral,
      });
    }

    return;
  }

  if (message.content.trim().length <= 10) {
    await interaction.reply({
      content: "Provide a message with at least a handful of words pal",
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  await interaction.deferReply();

  const content = cleanContent(message.content, message.channel);

  try {
    const messageChannel = await interaction.client.channels.fetch(
      message.channelId
    );

    if (!messageChannel || !messageChannel.isTextBased())
      throw new Error("Channel not found or is not a text channel.");

    const replyMessage = await messageChannel.messages.fetch(message.id);

    if (!replyMessage)
      throw new Error("Original message not found in the channel.");

    const member = await interaction.guild?.members
      .fetch(message.author.id)
      .catch(() => null);

    const authorName = member?.displayName || message.author.displayName;
    const roast = await generateRoast(content, authorName);

    await replyMessage.reply({
      content: roast.text + `\n\n-# Roast generate by ${interaction.user}`,
      allowedMentions: {
        users: [],
        roles: [],
      },
    });

    await interaction.editReply({
      content: "Roast sent!",
    });
    await interaction.deleteReply();
  } catch {
    const roast = await generateRoast(content, message.author.displayName);

    await interaction.editReply({
      content:
        `> **${message.author.displayName}:** ${message.content}\n\n` +
        roast.text +
        "\n\n-# Tip: Add me to this server to have a better experience",
      allowedMentions: {
        repliedUser: false,
        users: [],
        roles: [],
      },
    });
  }
};
