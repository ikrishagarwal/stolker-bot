import { Command } from "#lib/command";
import { GoogleGenAI } from "@google/genai";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

const name = "8ball";
const ai = new GoogleGenAI({});

export default class extends Command {
  public static override commandName = name;

  public static override builder() {
    return new SlashCommandBuilder()
      .setName(name)
      .setDescription("Ask the magic 8-ball a question")
      .addStringOption((option) =>
        option
          .setName("question")
          .setDescription("The question to ask the magic 8-ball")
          .setRequired(true)
          .setMinLength(5)
      );
  }

  public static override async chatInputRun(
    interaction: ChatInputCommandInteraction
  ) {
    await interaction.deferReply();

    const question = interaction.options.getString("question", true).trim();

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite-preview-06-17",
      contents: question,
      config: {
        systemInstruction:
          "You are a magic 8-ball. Answer the question in a few words and try make your answers sound mysterious and magical.",
        temperature: 0.6,
      },
    });

    await interaction.editReply({
      content: response.text,
      allowedMentions: {
        users: [],
        roles: [],
      },
    });
  }
}
