import mongoose from "mongoose";

// 1 create shcedma
// 2 create model based of schema


const noteSchema = new mongoose.Schema({
    title: {
        type:String,
        required: true
    },
    content:{
        type:String,
        required: True
    },
},
{timestamps:true}// created at/updated at
)
//captilaised for naming convention
const Note = mongoose.model("Note", noteSchema)

export default Note