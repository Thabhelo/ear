export const modes = [
  {
    id: "just_listen",
    name: "Just Listen",
    description: "They talk. You listen. No advice unless requested."
  },
  {
    id: "conversation",
    name: "Conversation",
    description: "Normal back-and-forth with a real person."
  },
  {
    id: "deep_talk",
    name: "Deep Talk",
    description: "Life, relationships, loneliness, dreams."
  },
  {
    id: "silent_company",
    name: "Silent Company",
    description: "Almost no talking. Just presence."
  },
  {
    id: "study_buddy",
    name: "Study Buddy",
    description: "Work quietly together."
  },
  {
    id: "game_mode",
    name: "Game Mode",
    description: "Play games together through the platform."
  }
] as const;

export const oneOffs = [
  { id: "text_once", name: "Text once", price: "$6.99/day", detail: "Text-only access for the day" },
  { id: "quick_call", name: "Quick Call", price: "$2.99", detail: "3 minutes" },
  { id: "standard_call", name: "Standard Call", price: "$6.99", detail: "25 minutes" },
  { id: "long_call", name: "Long Call", price: "$14.99", detail: "60 minutes" }
] as const;

export const subscriptions = [
  { id: "text_friend", name: "Text Friend", price: "$4.99/mo", detail: "Messaging access and faster replies." },
  { id: "friend", name: "Friend", price: "$19/mo", detail: "Queue priority, reduced call rates, and voice notes." },
  { id: "close_friend", name: "Close Friend", price: "$29.99/mo", detail: "Monthly call allowance, voice notes, and game sessions." },
  { id: "always_there", name: "Always There", price: "$49/mo", detail: "Highest priority, check-ins, and fastest response tier." }
] as const;
