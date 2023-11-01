import mongoose from "mongoose";

const dbconnect = async () => {
    try{
    await mongoose.connect('mongodb://127.0.0.1:27017/assign-mentor',{
        useNewUrlParser: true
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
