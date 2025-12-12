import mongoose from "mongoose";

const statsSchema = new mongoose.Schema({
  visits: { type: Number, default: 0 },
  date: { type: Date, required: true } // Stores the date (set to midnight)
});

const Stats = mongoose.models.Stats || mongoose.model("Stats", statsSchema);

export default Stats;