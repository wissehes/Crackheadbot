
const mongoose = require("mongoose");

module.exports = async (db) => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("[DB]: Connected to DB");
    } catch (err) {
        console.error(err.message);
    }
}