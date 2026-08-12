import mongoose from "mongoose";

const exchangeCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

exchangeCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const exchangeCodeModel = mongoose.model("ExchangeCode", exchangeCodeSchema);

export default exchangeCodeModel;
