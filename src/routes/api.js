import { Router } from 'express'

const router = Router()

router.get('/ping', (req, res) => {
  res.json({ test: 1000 })
})

export { router as apiRoutes }
