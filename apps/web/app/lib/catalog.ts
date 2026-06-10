export const modes = [
  {
    id: "just_listen",
    name: "Just Listen",
    description: "You vent. Someone real just listens. No advice unless you ask."
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

export type ModeId = (typeof modes)[number]["id"];

export const oneOffs = [
  {
    id: "text_once",
    name: "Text once",
    price: "$6.99",
    priceNote: "for the day",
    amountCents: 699,
    duration: "All day",
    detail: "Text-only access until midnight",
    kind: "text"
  },
  {
    id: "quick_call",
    name: "Quick Call",
    price: "$2.99",
    priceNote: "one time",
    amountCents: 299,
    duration: "3 min",
    detail: "A short check-in when you need it",
    kind: "call"
  },
  {
    id: "standard_call",
    name: "Standard Call",
    price: "$6.99",
    priceNote: "one time",
    amountCents: 699,
    duration: "25 min",
    detail: "Enough time to actually get into it",
    kind: "call"
  },
  {
    id: "long_call",
    name: "Long Call",
    price: "$14.99",
    priceNote: "one time",
    amountCents: 1499,
    duration: "60 min",
    detail: "A full hour of real company",
    kind: "call"
  }
] as const;

export type OneOffId = (typeof oneOffs)[number]["id"];

export const subscriptions = [
  {
    id: "text_friend",
    name: "Text Friend",
    price: "$4.99",
    cadence: "/month",
    tagline: "Someone to text",
    perks: ["Platform messaging access", "Faster replies than non-members"],
    featured: false
  },
  {
    id: "friend",
    name: "Friend",
    price: "$19",
    cadence: "/month",
    tagline: "Texts plus priority",
    perks: ["Messaging access", "Queue priority", "Reduced call rates", "Occasional voice notes"],
    featured: true
  },
  {
    id: "close_friend",
    name: "Close Friend",
    price: "$29.99",
    cadence: "/month",
    tagline: "Calls built in",
    perks: ["Priority responses", "Monthly call allowance", "Voice notes", "Game sessions"],
    featured: false
  },
  {
    id: "always_there",
    name: "Always There",
    price: "$49",
    cadence: "/month",
    tagline: "The closest thing to that person",
    perks: ["Highest queue priority", "Fastest response tier", "Monthly call allowance", "Check-ins"],
    featured: false
  }
] as const;

export type PlanId = (typeof subscriptions)[number]["id"];
