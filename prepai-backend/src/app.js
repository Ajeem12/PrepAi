import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import authRouter from './routes/auth.routes.js'
import interviewRouter from './routes/interview.routes.js'

const app = express()

app.use(express.json())
app.use(cookieParser())

const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL,
].filter(Boolean)

app.use(
  cors({
    origin(origin, callback) {
      // Allows server-to-server calls or tools without an Origin header.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true)
      }

      return callback(new Error('Origin not allowed by CORS'))
    },
    credentials: true,
  }),
)

app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok' })
})

/* using all the routes here */
app.use('/api/auth', authRouter)
app.use('/api/interview', interviewRouter)

export default app
