import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema({
    sender: { type: String, required: true }, // ObjectId ref to User
    text: { type: String, required: true }, 
    roomId: { type: String, required: true, index: true }
});

const Message = mongoose.model('Message', messageSchema);
export { Message };

