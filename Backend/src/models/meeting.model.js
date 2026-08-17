import mongoose from "mongoose";

const meetingSchema = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    meetingName: {
      type: String,
      required: true,
    },
    meetingCode: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

const meetingModel = mongoose.model("Meeting", meetingSchema);
export default meetingModel;
