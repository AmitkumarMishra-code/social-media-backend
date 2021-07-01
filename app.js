require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')


const app = express()
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


const authRouter = require('./routes/auth')
const userRouter = require('./routes/user')
const postRouter = require('./routes/post')

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});

app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/post', postRouter);

app.get('/', (req, res) => {
    console.log('Connected to server')
    res.status(200).send({ message: 'Successfully Connected' })
})

app.all(/.*/, (req, res) => {
    res.status(404).json({ response: 'Invalid endpoint. Please contact the admin.' })
})

const PORT = 3010;
app.listen(PORT, () => console.log('Server is listening on Port: ' + PORT))