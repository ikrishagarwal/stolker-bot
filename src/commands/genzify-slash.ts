import {
  CacheType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import { GoogleGenAI } from "@google/genai";
import { Command } from "#lib/command";

const name = "genzify";
const ai = new GoogleGenAI({});

const genzify = (content: string) => {
  return ai.models.generateContent({
    model: "gemini-2.5-flash-lite-preview-06-17",
    contents: content,
    config: {
      systemInstruction:
        "You are a young Gen-Z guy. Convert the messages into a Gen-Z style with some internet lingo in no more than a few lines, for context it's a discord message and might include mentions and emojis. You are strictly required to just convert the message without any additional text or context.",
      temperature: 0.6,
    },
  });
};

export default class extends Command {
  public static override commandName = name;

  public static override builder() {
    return new SlashCommandBuilder()
      .setName(name)
      .setDescription("Convert a message into Gen-Z style")
      .addStringOption((option) =>
        option
          .setName("text")
          .setDescription("The message to convert")
          .setRequired(true)
          .setMinLength(6)
      );
  }

  public static override async chatInputRun(
    interaction: ChatInputCommandInteraction<CacheType>
  ) {
    const message = interaction.options.getString("text", true).trim();
    await interaction.deferReply();

    const genzifiedMessage = await genzify(message);

    await interaction.editReply({
      content: genzifiedMessage.text,
      allowedMentions: {
        users: [],
        roles: [],
      },
    });
  }
}
