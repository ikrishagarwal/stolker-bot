import {
  CacheType,
  ChatInputCommandInteraction,
  cleanContent,
  SlashCommandBuilder,
} from "discord.js";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

const generateRoast = (content: string) => {
  return ai.models.generateContent({
    model: "gemini-2.5-flash-lite-preview-06-17",
    contents: content,
    config: {
      systemInstruction:
        "You are an average thug chad known for burning people with roasts. You'll be given a context to write a roast using some internet lingo like a gen z in no more than a few lines",
      temperature: 0.6,
    },
  });
};

export const name = "roast";
export const builder = new SlashCommandBuilder()
  .setName(name)
  .setDescription("Get a roast message based on the context you provide")
  .addStringOption((option) =>
    option
      .setName("context")
      .setDescription("The context to build up the roast from")
      .setRequired(true)
      .setMinLength(10)
  );

export default async (interaction: ChatInputCommandInteraction<CacheType>) => {
  const roastContext = interaction.options.getString("context", true).trim();
  await interaction.deferReply();

  const context = interaction.channel
    ? cleanContent(roastContext, interaction.channel)
    : roastContext;

  const roast = await generateRoast(context);

  await interaction.editReply({
    content: roast.text + `\n\n-# Roast generate by ${interaction.user}`,
    allowedMentions: {
      users: [],
      roles: [],
    },
  });
};
