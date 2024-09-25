import React, { useState, useEffect } from 'react'
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButtonGroup,
  CButton,
  CFormInput,
} from '@coreui/react'
import Modal from 'react-modal'
import 'src/scss/_custom.scss'

Modal.setAppElement('#root')

const ApproveDocuments = () => {
  const [documents, setDocuments] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [note, setNote] = useState('')
  const [currentDocumentId, setCurrentDocumentId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOrder, setSortOrder] = useState('asc')

  const fetchDocuments = async () => {
    try {
      const response = await fetch(
        'http://192.168.1.141:7210/api/documents/adminDocuments?adminUserId=4',
      )
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await response.json()
      setDocuments(data)
    } catch (error) {
      console.error('Error fetching documents:', error)
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, [])

  const handleApprove = async (documentId) => {
    const confirmApprove = window.confirm('Are you sure you want to approve this document?')
    if (confirmApprove) {
      try {
        const formData = new FormData()
        formData.append('documentId', documentId)
        formData.append('adminUserId', 1)

        const response = await fetch('http://1192.168.1.141:7210/api/documents/approve', {
          method: 'POST',
          body: formData,
        })
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        setDocuments(documents.filter((doc) => doc.id !== documentId))
      } catch (error) {
        console.error('Error approving document:', error)
      }
    }
  }

  const handleDecline = (documentId) => {
    setCurrentDocumentId(documentId)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setNote('')
    setCurrentDocumentId(null)
  }

  const handleModalSubmit = async () => {
    if (!note) {
      alert('Please enter a note.')
      return
    }

    try {
      const formData = new FormData()
      formData.append('documentId', currentDocumentId)
      formData.append('adminUserId', 1)
      formData.append('note', note)

      const response = await fetch('http://192.168.1.141:7210/api/documents/refuse', {
        method: 'POST',
        body: formData,
      })
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      setDocuments(documents.filter((doc) => doc.id !== currentDocumentId))
      handleModalClose()
    } catch (error) {
      console.error('Error refusing document:', error)
    }
  }

  const handleOpenDocument = (documentUrl) => {
    const newWindow = window.open()
    newWindow.opener = null
    newWindow.location = documentUrl
  }

  const truncateUrl = (url) => {
    const maxLength = 30
    if (!url) return ''
    if (url.length <= maxLength) return url
    return url.substring(0, maxLength) + '...'
  }

  const handleSortByDate = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc'
    setSortOrder(newOrder)

    const sortedDocuments = [...documents].sort((a, b) => {
      const dateA = new Date(a.uploadDate)
      const dateB = new Date(b.uploadDate)

      return newOrder === 'asc' ? dateA - dateB : dateB - dateA
    })

    setDocuments(sortedDocuments)
  }

  const filteredDocuments = documents.filter(
    (document) =>
      document.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      document.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div>
      <h1>Approve Documents</h1>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <CFormInput
            type="text"
            placeholder="Search by document or user name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ marginRight: '10px', width: '300px' }}
          />
        </div>
        <div>
          <CButton color="primary" onClick={handleSortByDate} style={{ marginRight: '10px' }}>
            Sort by Upload Date ({sortOrder === 'asc' ? 'Oldest First' : 'Newest First'})
          </CButton>
          <CButton color="primary" onClick={fetchDocuments}>
            Refresh
          </CButton>
        </div>
      </div>
      <CTable>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>User</CTableHeaderCell>
            <CTableHeaderCell>Document Name</CTableHeaderCell>
            <CTableHeaderCell>Document</CTableHeaderCell>
            <CTableHeaderCell>Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {filteredDocuments.map((document) => (
            <CTableRow key={document.id}>
              <CTableDataCell>{document.username}</CTableDataCell>
              <CTableDataCell>{document.name}</CTableDataCell>
              <CTableDataCell>
                <CButton color="link" onClick={() => handleOpenDocument(document.imgUrl)}>
                  {truncateUrl(document.imgUrl)}
                </CButton>
              </CTableDataCell>
              <CTableDataCell>
                <CButtonGroup>
                  <CButton color="success" onClick={() => handleApprove(document.id)}>
                    Approve
                  </CButton>
                  <CButton color="danger" onClick={() => handleDecline(document.id)}>
                    Decline
                  </CButton>
                </CButtonGroup>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleModalClose}
        contentLabel="Decline Document"
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '400px',
          },
        }}
      >
        <h2>Decline Document</h2>
        <div>
          <label htmlFor="note">Note:</label>
          <textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Enter note for declining the document"
            style={{ width: '100%', height: '100px' }}
          />
        </div>
        <div style={{ marginTop: '20px', textAlign: 'right' }}>
          <CButton color="danger" onClick={handleModalSubmit}>
            OK
          </CButton>
          <CButton color="secondary" onClick={handleModalClose} style={{ marginLeft: '10px' }}>
            Cancel
          </CButton>
        </div>
      </Modal>
    </div>
  )
}

export default ApproveDocuments
