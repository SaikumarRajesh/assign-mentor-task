import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const username = process.env.DB_USERNAME || '';
const password = process.env.DB_PASSWORD || '';
const clusterName = process.env.DB_CLUSTER || '';
const dbName = process.env.DB_NAME || '';

const cloudurl = `mongodb+srv://${username}:${password}@${clusterName}/${dbName}?retryWrites=true&w=majority`;
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
