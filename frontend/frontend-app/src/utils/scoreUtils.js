// Backend returns 0.0-1.0, convert to 0-100
export const normalizeScore = (score) => {
  if (score === null || score === undefined) return 0
  if (score <= 1) return Math.round(score * 100)
  return Math.round(score)
}

export const getScoreColor = (score) => {
  const s = normalizeScore(score)
  if (s >= 70) return '#E05555'
  if (s >= 31) return '#D0BC77'
  return '#77997B'
}

export const getScoreLabel = (score) => {
  const s = normalizeScore(score)
  if (s >= 70) return 'MALICIOUS'
  if (s >= 31) return 'WARNING'
  return 'CLEAN'
}

// Convert backend indicators object to display array
// Backend returns: { urls: [...], ips: [...], emails: [...] }
export const formatIndicators = (indicators) => {
  if (!indicators) return []
  const result = []
  const typeMap = {
    urls:           { sev: 'M', label: 'Suspicious URL detected' },
    ips:            { sev: 'M', label: 'IP address found' },
    emails:         { sev: 'L', label: 'Email address found' },
    bitcoin:        { sev: 'H', label: 'Bitcoin address found' },
    ethereum:       { sev: 'H', label: 'Ethereum address found' },
    md5_hashes:     { sev: 'L', label: 'MD5 hash found' },
    sha1_hashes:    { sev: 'L', label: 'SHA1 hash found' },
    sha256_hashes:  { sev: 'L', label: 'SHA256 hash found' },
  }
  Object.entries(indicators).forEach(([type, values]) => {
    if (Array.isArray(values) && values.length > 0) {
      const info = typeMap[type] || { sev: 'M', label: type }
      values.forEach(val => {
        result.push({
          sev: info.sev,
          title: info.label,
          desc: val
        })
      })
    }
  })
  return result
}