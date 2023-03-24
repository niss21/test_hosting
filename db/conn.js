const mongoose = require("mongoose");

mongoose.set('strictQuery', true);


// const DB = process.env.DATABASE
// mongoose.connect(DB,{
//     useUnifiedTopology:true,
//     useNewUrlParser:true
// }).then(()=> console.log("DataBase Connected")).catch((err)=>{
//     console.log(err);
// })


mongoose.connect(`${process.env.DATABASE}`, {useNewUrlParser: true, useUnifiedTopology: true}, ()=>{
    console.log("mongodb is connected")
});