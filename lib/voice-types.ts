export type VoiceIntent =
  | "navigate"
  | "add_to_cart"
  | "search_fish"
  | "answer_question"
  | "show_cart"
  | "remove_from_cart"
  | "clear_cart"
  | "go_to_order"
  | "unknown";

export type OllamaResponse = {
  intent: VoiceIntent;
  params: Record<string, string>;
  reply: string;
};

export type VoiceState = "idle" | "listening" | "processing" | "speaking";

export type ChatMessage = {
  role: "user" | "assistant";
  text: string;
};
