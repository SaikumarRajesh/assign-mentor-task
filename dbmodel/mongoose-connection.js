import mongoose from "mongoose";

const username="saikumar";
const password ="d5GZzac0dNLyKYn7"
const cloudurl =`mongodb+srv://saikumar:${password}@cluster0.c4xezro.mongodb.net/assign-mentor-student?retryWrites=true&w=majority`;
const localurl ="mongodb://0.0.0.0:27017/assign-mentor";

const dbconnect = async () => {
    try{
    await mongoose.connect(cloudurl,{
        useNewUrlParser: true,useUnifiedTopology: true
    });
    console.log("DB coonected succesfully");
}
catch(err)
{
    console.log(err);
    process.exit(1);
}
}


export default dbconnect;
