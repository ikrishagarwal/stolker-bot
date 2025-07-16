import type {
  Awaitable,
  ChatInputCommandInteraction,
  ContextMenuCommandBuilder,
  ContextMenuCommandInteraction,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
} from "discord.js";

export class Command {
  public static commandName: string;
  public static development: boolean = false;

  public static builder?():
    | SlashCommandBuilder
    | ContextMenuCommandBuilder
    | SlashCommandOptionsOnlyBuilder;

  public static chatInputRun?(
    interaction: ChatInputCommandInteraction
  ): Awaitable<unknown>;
  public static contextMenuRun?(
    interaction: ContextMenuCommandInteraction
  ): Awaitable<unknown>;
}
