const mongoose = require('mongoose');

const connectDatabase = async () => {
    try {
        // تأكد أن الاسم هنا هو MONGODB_URI كما في ملف .env
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDatabase;