const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const connectDB = require('./config/db')
const exphbs = require('express-handlebars')
const passport = require('passport')
const methodOverride = require('method-override')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const mongoose = require('mongoose')

// configs
dotenv.config({ path: './config/config.env'})

// Passport config
require('./config/passport')(passport)

connectDB()

const app = express()

// Body parsing
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Method Override for POST & DELETE
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and dleete it
        let method = req.body._method
        return method
    }
}))

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}
// Handlebars Helpers
const { formatDate, stripTags, editIcon, truncate, select } = require('./helpers/hbs')

// Handlebars
app.engine('.hbs',exphbs.engine({helpers: {
    formatDate,
    stripTags,
    truncate,
    editIcon,
    select
}, defaultLayout: 'main', extname: '.hbs'}))
app.set('view engine', '.hbs')

// For connection
let store = MongoStore.create({
    client: mongoose.connection.getClient()
})

// Sessions
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: store
}))


// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Set global variable
app.use(function (req,res, next) {
    res.locals.user = req.user || null
    next()
})

// Static folder
app.use(express.static(path.join(__dirname, "public")))

// Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`))