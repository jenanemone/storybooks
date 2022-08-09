const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        console.log(process.env.MONGO_URI)
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        })

        console.log(`MongoDB connected: ${conn.connection.host}`)

    }
    catch (err) {
        console.error(err)
        process.exit(1)
    }
}

module.exports = connectDB