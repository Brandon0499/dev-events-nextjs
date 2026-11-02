import { Schema, model, models, type HydratedDocument, type Model } from "mongoose";

export interface IEvent {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type EventDocument = HydratedDocument<IEvent>;

const requiredString = { type: String, required: true, trim: true } as const;

// Mongoose's `required` accepts an empty array, so lists need an explicit check.
const nonEmptyStringArray = {
  type: [String],
  required: true,
  validate: {
    validator: (items: string[]) =>
      items.length > 0 && items.every((item) => item.trim().length > 0),
    message: "{PATH} must contain at least one non-empty item",
  },
};

const EventSchema = new Schema<IEvent>(
  {
    title: requiredString,
    // Not `required`: validation runs before the pre-save hook that fills it in.
    slug: { type: String, unique: true, lowercase: true, trim: true },
    description: requiredString,
    overview: requiredString,
    image: requiredString,
    venue: requiredString,
    location: requiredString,
    date: requiredString,
    time: requiredString,
    mode: requiredString,
    audience: requiredString,
    agenda: nonEmptyStringArray,
    organizer: requiredString,
    tags: nonEmptyStringArray,
  },
  { timestamps: true },
);

function toSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

// Stores the calendar date only (YYYY-MM-DD). JS parses "2025-11-15" as UTC but
// "Nov 15, 2025" as local time, so each is read back in the zone it was parsed in.
function toIsoDate(value: string): string {
  const input = value.trim();
  const parsed = new Date(input);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Invalid event date: "${value}"`);
  }

  if (ISO_DATE_PATTERN.test(input)) {
    const normalized = parsed.toISOString().slice(0, 10);
    // Rejects dates JS silently rolls over, such as 2025-02-30.
    if (normalized !== input) throw new Error(`Invalid event date: "${value}"`);
    return normalized;
  }

  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Accepts "9:30", "09:30", "9:30 pm" or "9 PM" and stores 24-hour "HH:mm".
function toTwentyFourHourTime(value: string): string {
  const match = value.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/i);
  if (!match) {
    throw new Error(`Invalid event time: "${value}"`);
  }

  let hours = Number(match[1]);
  const minutes = Number(match[2] ?? "0");
  const period = match[3]?.toLowerCase();

  if (period) {
    if (hours < 1 || hours > 12) throw new Error(`Invalid event time: "${value}"`);
    hours = (hours % 12) + (period === "pm" ? 12 : 0);
  }
  if (hours > 23 || minutes > 59) {
    throw new Error(`Invalid event time: "${value}"`);
  }

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

EventSchema.pre("save", function () {
  if (this.isModified("title") || !this.slug) {
    this.slug = toSlug(this.title);
    if (!this.slug) {
      throw new Error("Title must contain at least one letter or number");
    }
  }

  if (this.isModified("date")) {
    this.date = toIsoDate(this.date);
  }

  if (this.isModified("time")) {
    this.time = toTwentyFourHourTime(this.time);
  }
});

// Reuse the compiled model across hot reloads instead of redefining it.
export const Event: Model<IEvent> = models.Event ?? model<IEvent>("Event", EventSchema);
