import { Configuration, OpenAIApi } from 'openai'
import express from 'express'
import { trainingData } from './data.js'

const apiKey = process.env.OPENAI_API_KEY || ''

if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not set')
}

const app = express()

app.use(express.json())

app.post('/chat', async (req, res, next) => {
    try {
        const query = req.body.messages

        const configuration = new Configuration({
            apiKey: process.env.OPENAI_API_KEY,
        })
        const openai = new OpenAIApi(configuration)

        const result = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: 'Du besvarer spørgsmål som en agent fra kunde support' },
                { role: 'system', content: trainingData.join('\n') },
                ...query,
            ],
        })

        return res.send(result.data.choices.at(0)?.message)
    } catch (error) {
        return next(error)
    }
})

app.listen(3000, () => console.log('http://localhost:3000'))
