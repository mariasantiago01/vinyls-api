require('dotenv').config();
require('express-async-errors')

const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const expressRateLimiter = require('express-rate-limit')


const express = require('express')
const app = express()

// connectDB
const connectDB = require('./db/connect')
const authenticateUser = require('./middleware/authentication')
// Routers
const authRouter = require('./routes/auth')
const vinylsRouter = require('./routes/vinyls')

// Error Handler
const errorHandlerMiddleware = require('./middleware/error-handler')

app.set('trust proxy', 1); 
app.use(
  expressRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
)

app.use(express.json());

app.use(helmet())
app.use(cors())
app.use(xss())

// Public folder

// Routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/vinyls', authenticateUser, vinylsRouter)

app.use(errorHandlerMiddleware)

const port = process.env.PORT || 3000;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () => 
        console.log(`Server is listening on port ${port}...`)
        );
    } catch (error) {
        console.log(error);
    }
}
start();
