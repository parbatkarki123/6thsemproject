import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import authRouter from './src/routes/auth.js'
import eventsRouter from './src/routes/events.js'
import studentRouter from './src/routes/student.js'
import adminRouter from './src/routes/admin.js'

const app = express()
app.use(express.json())
app.use(cors())

app.use('/api/auth', authRouter)
app.use('/api/events', eventsRouter)
app.use('/api/student', studentRouter)
app.use('/api/admin', adminRouter)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})

export default app
