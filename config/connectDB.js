const mongoose = require('mongoose')
// mongoose.set('strictQuery', false);
require( 'dotenv').config()


const mongoUrl = process.env.DB_URI || " mongodb://localhost:27017/userAuthentication"
const connectDB = async () =>{
    try{
        console.log(mongoUrl)
        const con =await mongoose.connect(mongoUrl);
        
             // useUnifiedTopology: true,
            // useNewUrlParser: true,
            // useCreateIndex: true

        console.log(`MongoDB Connected : ${con.connection.host}`);

    }catch (error){
        console.log(error);
        // process.exit(1);
    }
}

module.exports = connectDB