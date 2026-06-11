import express from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 8080

// /jira/* → https://jira.softtech.com.tr/*
app.use('/jira', createProxyMiddleware({
  target: 'https://jira.softtech.com.tr',
  changeOrigin: true,
  secure: false,
  pathRewrite: { '^/jira': '' },
  on: {
    error: (err, req, res) => {
      console.error('Proxy error:', err.message)
      res.status(502).json({ error: 'Proxy error', message: err.message })
    },
  },
}))

// Build çıktısını serve et
app.use(express.static(join(__dirname, 'dist')))

// SPA fallback (Vue Router için)
app.get('*', (_, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
