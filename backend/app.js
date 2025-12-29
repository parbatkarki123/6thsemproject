import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import authRouter from './src/routes/auth.js'
import eventsRouter from './src/routes/events.js'

const app = express()
app.use(express.json())
app.use(cors())

app.use('/api/auth', authRouter)
app.use('/api/events', eventsRouter)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})

export default app
