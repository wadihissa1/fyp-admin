import React, { useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CForm,
  CFormLabel,
  CFormInput,
  CAlert,
  CSpinner,
} from '@coreui/react'
import 'src/scss/_custom.scss'
import axios from 'axios'
import config from '/config'

const Dashboard = () => {
  const [pdfFile, setPdfFile] = useState(null)
  const [websiteLink, setWebsiteLink] = useState('')
  const [websiteLink2, setWebsiteLink2] = useState('') // New state for Website Link 2
  const [videoLink, setVideoLink] = useState('') // Changed state to store video link instead of file
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handlePdfChange = (e) => {
    const file = e.target.files[0]
    if (file && file.type !== 'application/pdf') {
      setError('Please upload a valid PDF file.')
      setPdfFile(null)
    } else {
      setError('')
      setPdfFile(file)
    }
  }

  const handleWebsiteLinkChange = (e) => {
    setWebsiteLink(e.target.value)
  }

  const handleWebsiteLink2Change = (e) => {
    setWebsiteLink2(e.target.value)
  }

  const handleVideoLinkChange = (e) => {
    setVideoLink(e.target.value)
  }

  const handleStartEmbedding = async () => {
    setError('')
    setSuccess('')
    setLoading(true)

    if (pdfFile) {
      // Handle PDF upload
      const formData = new FormData()
      formData.append('file', pdfFile)

      try {
        const response = await axios.post(`${config.apiBaseUrl}/upload_pdf`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        setSuccess(response.data.message)
        setPdfFile(null)
        setWebsiteLink('')
        setWebsiteLink2('')
        setVideoLink('')
      } catch (error) {
        setError(`Error: ${error.response?.data?.error || error.message}`)
      } finally {
        setLoading(false)
      }
    } else if (websiteLink) {
      // Handle Website Link 1
      try {
        const response = await axios.post(`${config.apiBaseUrl}/fetch_and_process`, {
          url: websiteLink,
        })
        setSuccess(response.data.message)
        setPdfFile(null)
        setWebsiteLink('')
        setWebsiteLink2('')
        setVideoLink('')
      } catch (error) {
        setError(`Error: ${error.response?.data?.error || error.message}`)
      } finally {
        setLoading(false)
      }
    } else if (websiteLink2) {
      // Handle Website Link 2
      try {
        const response = await axios.post(`${config.apiBaseUrl}/fetch_urls`, {
          url: websiteLink2,
        })
        setSuccess(response.data.message)
        setPdfFile(null)
        setWebsiteLink('')
        setWebsiteLink2('')
        setVideoLink('')
      } catch (error) {
        setError(`Error: ${error.response?.data?.error || error.message}`)
      } finally {
        setLoading(false)
      }
    } else if (videoLink) {
      // Handle Video Link for transcription
      try {
        const response = await axios.post(`${config.apiBaseUrl}/transcribe`, {
          url: videoLink,
        })
        setSuccess(response.data.message)
        setPdfFile(null)
        setWebsiteLink('')
        setWebsiteLink2('')
        setVideoLink('')
      } catch (error) {
        setError(`Error: ${error.response?.data?.error || error.message}`)
      } finally {
        setLoading(false)
      }
    } else {
      // If none of the fields are filled
      setError(
        'Please upload a PDF, enter a website link, or provide a video link before starting the embedding.',
      )
      setLoading(false)
    }
  }
  const handleResetEmbedding = async () => {
    setPdfFile(null)
    setWebsiteLink('')
    setWebsiteLink2('')
    setVideoLink('')
    setError('')
    setSuccess('')
    setLoading(true)
  
    try {
      const response = await axios.post(`${config.apiBaseUrl}/reset`, {
        url: videoLink, // Use the current videoLink value
      })
      setSuccess(`Chat context reset successfully: ${response.data.message}`)
    } catch (error) {
      setError(`Error resetting chat context: ${error.response?.data?.error || error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <CRow>
      <CCol>
        <CCard>
          <CCardHeader>
            <h3>Frank Dashboard</h3>
          </CCardHeader>
          <CCardBody>
            <CForm>
              {error && <CAlert color="danger">{error}</CAlert>}
              {success && (
                <CAlert color="success" onClick={() => setSuccess('')}>
                  {success}
                </CAlert>
              )}
              {loading && (
                <CAlert color="info">
                  Embedding started, please wait. It could take a few minutes.{' '}
                  <CSpinner size="sm" />
                </CAlert>
              )}
              <div className="mb-3">
                <CFormLabel htmlFor="pdfUpload" style={{ fontSize: '1.25rem' }}>
                  Upload PDF
                </CFormLabel>
                <CFormInput type="file" id="pdfUpload" accept=".pdf" onChange={handlePdfChange} />
              </div>
              <div className="mb-3">
                <CFormLabel htmlFor="websiteLink" style={{ fontSize: '1.25rem' }}>
                  Upload Website Link
                </CFormLabel>
                <CFormInput
                  type="url"
                  id="websiteLink"
                  value={websiteLink}
                  onChange={handleWebsiteLinkChange}
                />
              </div>
              <div className="mb-3">
                <CFormLabel htmlFor="websiteLink2" style={{ fontSize: '1.25rem' }}>
                  Upload Website Link (Multiple website pages)
                </CFormLabel>
                <CFormInput
                  type="url"
                  id="websiteLink2"
                  value={websiteLink2}
                  onChange={handleWebsiteLink2Change}
                />
              </div>
              <div className="mb-3">
                <CFormLabel htmlFor="videoLink" style={{ fontSize: '1.25rem' }}>
                  Enter Video Link
                </CFormLabel>
                <CFormInput
                  type="url"
                  id="videoLink"
                  value={videoLink}
                  onChange={handleVideoLinkChange}
                />
              </div>
              <CButton color="primary" onClick={handleStartEmbedding} style={{ marginTop: '10px' }}>
                Start Embedding
              </CButton>
              <CButton
                color="danger"
                onClick={handleResetEmbedding}
                style={{ marginLeft: '10px', marginTop: '10px' }}
              >
                Reset Chat Context
              </CButton>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Dashboard
