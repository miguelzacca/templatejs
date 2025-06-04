import { Router } from 'express'
import { html } from '../util/template.js'

const router = Router()

router.get('/', (req, res) => {
  res.send(
    html('./pages/index', {
      pid: process.pid,
      title: 'Versatil',
      href: '/outra',
    }),
  )
})

router.get('/outra', (req, res) => {
  res.send(
    html('./pages/outra', {
      title: 'Versatil - Outra pagina',
      lang: 'pt-br',
      href: '/',
    }),
  )
})

export { router as frontendRoutes }
