import axios from 'axios'

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000'
})

export const scanFile = (file) => {
  const formData = new FormData()
  formData.append('file', file)
  return api.post('/api/analyze/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

export const scanURL = (url) =>
  api.post('/api/analyze/url', { url })

export const checkHealth = () =>
  api.get('/api/health')

export const getRecentScans = (limit = 10) =>
  api.get(`/api/results/recent?limit=${limit}`)

export default api