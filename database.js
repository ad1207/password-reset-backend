const mongoose = require("mongoose")
const url = process.env.MONGO_DB_URL

exports.connect = () => {
    mongoose.connect(url,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useCreateIndex: true,
        // useFindAndModify: false
    })
    .then(() => {
        console.log("Successfully connected to database")
    })
    .catch((err) => {
        console.log("Error connecting database")
        console.log(err)
    });
}

