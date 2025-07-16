import {
  ApplicationCommandType,
  CacheType,
  ContextMenuCommandBuilder,
  MessageContextMenuCommandInteraction,
  MessageFlags,
  TextBasedChannel,
  Message,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { GoogleGenAI } from "@google/genai";
import { splitIntoSentences } from "#utils/strings";
import { Command } from "#lib/command";

const name = "Start Summarizing";
const ai = new GoogleGenAI({});

export default class extends Command {
  public static commandName = name;

  public static builder() {
    return new ContextMenuCommandBuilder()
      .setName(name)
      .setType(ApplicationCommandType.Message);
  }

  public static async contextMenuRun(
    interaction: MessageContextMenuCommandInteraction<CacheType>
  ) {
    if (
      !interaction.guildId ||
      !interaction.client.guilds.cache.has(interaction.guildId)
    ) {
      return await interaction.reply({
        content: "Add me to this server to use this command.",
        flags: MessageFlags.Ephemeral,
      });
    }

    await interaction.deferReply({
      // flags: MessageFlags.Ephemeral,
    });

    const message = await interaction.editReply({
      content: "How far you want your summary to go?",
      components: [
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId("summarize_until_message")
            .setLabel("Summarize Until a Message")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId("summarize_until_latest")
            .setLabel("Summarize Until Latest")
            .setStyle(ButtonStyle.Primary)
        ),
      ],
    });

    const collector = message.createMessageComponentCollector({
      filter: (i) => i.user.id === interaction.user.id,
      time: 60_000, // 1 minute
      max: 1,
    });

    collector.once("collect", async (buttonInteraction) => {
      if (buttonInteraction.customId === "summarize_until_latest") {
        await buttonInteraction.deferUpdate();
        await summarizeAndReply(interaction);
        return;
      }

      if (buttonInteraction.customId === "summarize_until_message") {
        await buttonInteraction.showModal({
          title: "Summarize Until a Message",
          customId: "summarize_until_message_modal",
          components: [
            new ActionRowBuilder<TextInputBuilder>().addComponents(
              new TextInputBuilder()
                .setCustomId("message_id_input")
                .setLabel("Enter the message ID to stop at")
                .setStyle(TextInputStyle.Short)
                .setRequired(true)
                .setPlaceholder("Message ID of the message to stop at")
            ),
          ],
        });

        try {
          const submittedModal = await buttonInteraction.awaitModalSubmit({
            time: 60_000, // 60 seconds timeout
            filter: (i) =>
              i.customId === "summarize_until_message_modal" &&
              i.user.id === buttonInteraction.user.id,
          });

          const messageId =
            submittedModal.fields.getTextInputValue("message_id_input");

          await submittedModal.deferUpdate();
          await summarizeAndReply(interaction, messageId);
        } catch (error) {
          console.warn("Modal was not submitted in time or was cancelled.");
          return await buttonInteraction.editReply({
            content: "You took too long to respond. Please try again.",
            components: [],
          });
        }
        return;
      }

      collector.stop();
      return;
    });

    collector.once("end", async (collected) => {
      if (collected.size === 0) {
        await interaction.editReply({
          content: "You took too long to respond. Please try again.",
          components: [],
        });
      }
    });

    return;
  }
}

async function summarizeAndReply(
  interaction: MessageContextMenuCommandInteraction<CacheType>,
  stopAt?: string
) {
  const fetchedMessages = await fetchMessagesUntilLatest(
    interaction.targetMessage.channel,
    interaction.targetMessage.id,
    stopAt
  );

  await interaction.editReply({
    content: `Summarizing ${fetchedMessages.length} messages...`,
    components: [],
  });

  const messages = fetchedMessages
    .map((msg) => {
      return `${msg.author.displayName}(${msg.author.username}):${msg.cleanContent}`;
    })
    .join("\n");

  const summary = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite-preview-06-17",
    contents: messages,
    config: {
      systemInstruction:
        "provide a comprehensive summary of the given text? The summary should cover all the key points and main ideas presented in the original text, while also condensing the information into a concise and easy-to-understand format. Please ensure that the summary includes relevant details and examples that support the main ideas, while avoiding any unnecessary information or repetition. The length of the summary should be appropriate for the length and complexity of the original text, providing a clear and accurate overview without omitting any important information. There's also username provided with the nickname of users with every message, if two people share the same nickname only in that case use their usernames. In max to max 1900 characters",
    },
  });

  if (!summary || !summary.text) {
    await interaction.editReply({
      content: "Failed to generate a summary. Please try again later.",
      components: [],
    });
    return;
  }

  const summaryChunks = splitIntoSentences(summary.text);

  await interaction.editReply({
    content: summaryChunks.pop(),
    components: [],
  });

  while (summaryChunks.length > 0) {
    interaction.followUp({
      content: summaryChunks.pop(),
      components: [],
      // flags: MessageFlags.Ephemeral,
    });
  }
}

async function fetchMessagesUntilLatest(
  channel: TextBasedChannel,
  startMessageId: string,
  stopAtId?: string // Optional stop condition
): Promise<Message[]> {
  const allMessages: Message[] = [];

  // Optionally include the starting message itself
  try {
    const startMessage = await channel.messages.fetch(startMessageId);
    allMessages.push(startMessage);
  } catch {
    console.warn("Start message not found, skipping inclusion.");
  }

  let lastId = startMessageId;
  let keepFetching = true;

  while (keepFetching) {
    const batch = await channel.messages.fetch({ after: lastId, limit: 100 });

    // Sort messages chronologically (oldest first)
    const sorted = [...batch.values()].sort(
      (a, b) => a.createdTimestamp - b.createdTimestamp
    );

    for (const msg of sorted) {
      lastId = msg.id;
      if (stopAtId && msg.id === stopAtId) {
        keepFetching = false;
        if (!msg.author.bot) allMessages.push(msg);
        break;
      }

      if (!msg.author.bot) allMessages.push(msg);
    }

    // If fewer than 100 messages were fetched, we've hit the latest
    if (batch.size < 100) break;
  }

  return allMessages;
}
