import mongoose from "mongoose";
const topicSchema = new mongoose.Schema({
    name:{
        name:String,
        required: true,
        unique: true
    }
})
export default mongoose.model("Topic", topicSchema);