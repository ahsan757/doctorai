import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    sender: {
        type: String,
        enum: ["user", "bot"],
        required: true
    },
    type: {
        type: String,
        enum: ["text", "doctor-suggestion"],
        default: "text"
    },
    text: {
        type: String,
        required: true
    },
}, { _id: false });

const chatSchema = new mongoose.Schema({
    sessionId: {
        type: String,
        required: true
    },
    messages: [messageSchema],
    createdAt: {
        type: Date,
        default: Date.now
    },
});

export default mongoose.models.Chat || mongoose.model("Chat", chatSchema);
