import { Schema, model, models, type HydratedDocument, type Model, type Types } from "mongoose";
import { Event } from "./event.model";

export interface IBooking {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export type BookingDocument = HydratedDocument<IBooking>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const BookingSchema = new Schema<IBooking>(
  {
    // Indexed because bookings are almost always looked up by event.
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true, index: true },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [EMAIL_PATTERN, "Please provide a valid email address"],
    },
  },
  { timestamps: true },
);

// MongoDB does not enforce references, so check the event exists before saving.
BookingSchema.pre("save", async function () {
  if (!this.isNew && !this.isModified("eventId")) return;

  const eventExists = await Event.exists({ _id: this.eventId });
  if (!eventExists) {
    throw new Error(`Event with ID ${this.eventId.toString()} does not exist`);
  }
});

export const Booking: Model<IBooking> =
  models.Booking ?? model<IBooking>("Booking", BookingSchema);
