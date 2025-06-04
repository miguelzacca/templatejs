import express from 'express'
import cors from 'cors'
import { html } from './util/template.js'

const app = express()
app.use(express.json())
app.use(cors())

app.use(express.static('./public'))

app.get('/', (req, res) => {
  res.send(
    html('./pages/index', {
      pid: process.pid,
      title: 'Versatil',
      href: '/outra',
    }),
  )
})

app.get('/outra', (req, res) => {
  res.send(
    html('./pages/outra', {
      title: 'Versatil - Outra pagina',
      lang: 'pt-br',
      href: '/',
    }),
  )
})

app.get('/ping', (req, res) => {
  res.json({ test: 1000 })
})

app.listen(5500, () => {
  console.log('Running...')
})
