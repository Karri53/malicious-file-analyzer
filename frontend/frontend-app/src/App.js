import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Home from './pages/Home'
import EmailAnalysis from './pages/EmailAnalysis'
import URLAnalyzer from './pages/URLAnalyzer'
import FileUpload from './pages/FileUpload'
import Results from './pages/Results'
import { ThemeProvider } from './utils/ThemeContext'

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/email" element={<EmailAnalysis />} />
          <Route path="/url" element={<URLAnalyzer />} />
          <Route path="/upload" element={<FileUpload />} />
          <Route path="/results" element={<Results />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App