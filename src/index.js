import express from 'express'
import cors from 'cors'
import { frontendRoutes } from './routes/frontend.js'
import { apiRoutes } from './routes/api.js'
import { html } from './util/template.js'

const app = express()
app.use(express.json())
app.use(cors())

app.use(express.static('./public'))

app.use(frontendRoutes)
app.use('/api', apiRoutes)

app.use((req, res) => {
  res.send(html('./pages/404', { title: 'Not Fount', lang: 'en' }))
})

app.listen(5500, () => {
  console.log('Running...')
})
