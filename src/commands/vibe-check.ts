import { Command } from "#lib/command";
import { GoogleGenAI } from "@google/genai";
import {
  CacheType,
  ChatInputCommandInteraction,
  cleanContent,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";

const name = "vibe-check";
const ai = new GoogleGenAI({});

export default class extends Command {
  public static commandName = name;

  public static builder() {
    return new SlashCommandBuilder()
      .setName(name)
      .setDescription("Check the vibe of a message")
      .addStringOption((option) =>
        option
          .setName("message")
          .setDescription("The message to vibe check")
          .setRequired(false)
      )
      .addStringOption((option) =>
        option
          .setName("message_id")
          .setDescription("The ID of the message to vibe check")
          .setRequired(false)
      );
  }

  public static async chatInputRun(
    interaction: ChatInputCommandInteraction<CacheType>
  ) {
    const messageOption = interaction.options.getString("message");
    const messageID = interaction.options.getString("message_id");

    if (!messageOption && !messageID) {
      await interaction.reply({
        content:
          "At least provide either of message or message ID you dumb dumb, also, I judged you on this one!",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    await interaction.deferReply();
    let message =
      messageOption && interaction.channel?.isTextBased()
        ? cleanContent(messageOption, interaction.channel)
        : "";

    if (messageID) {
      const fetchedMessage = await interaction.channel?.messages
        .fetch(messageID)
        .catch(() => null);

      if (!fetchedMessage) {
        await interaction.editReply({
          content: "Are you sure that ID exists? *suspects*",
        });
        return;
      }

      message = fetchedMessage.cleanContent.trim();
    }

    if (message.length < 6) {
      await interaction.editReply({
        content: "That's not even a handful of words, pal!",
      });
      return;
    }

    const vibeCheck = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite-preview-06-17",
      contents: message,
      config: {
        systemInstruction: `You are a sarcastic and extremely online Discord mod.

Given a Discord conversation, your job is to do a vibe check. Respond with a culturally tuned, one-liner judgment of the vibe — like a comment on a viral TikTok or a post from a very self-aware Twitter user.

Your tone should be blunt, ironic, or witty — no explanations, just the vibe. Use labels or made-up classifications like:

- "Gen Z energy"
- "Millennial workplace trauma"
- "NPC behavior"
- "That's mid"
- "Corporate speak"
- "Lowkey unhinged"
- "Boomer take"
- "Main character syndrome"
- "Terminally online"
- "Wholesome for no reason"
- "Soft-launching a breakdown"
- "Certified Discord Moment™"

Once in a while, add a **rare or easter egg response**, like:
- "Red flag detected 🚩"
- "Energy: Subway Surfers background with no context"
- "This convo has been reviewed by the Ministry of Cringe"
- "This thread is why aliens won't visit us"

Do not include emojis unless part of an easter egg. Keep it to **one witty sentence**, no filler. Your goal is to *judge the energy* of the message — not explain it.

Output only the verdict, nothing else.
`,
        temperature: 0.5,
      },
    });

    await interaction.editReply({
      content: `> ${message}` + "\n\nUmm.. " + vibeCheck.text,
      allowedMentions: {
        users: [],
        roles: [],
      },
    });
  }
}
