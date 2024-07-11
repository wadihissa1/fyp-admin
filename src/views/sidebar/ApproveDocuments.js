import React, { useState } from 'react'
import { CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CButtonGroup, CButton } from '@coreui/react'
import 'src/scss/_custom.scss';
const ApproveDocuments = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'John Doe',
      major: 'Computer Science',
      documentUrl: 'https://example.com/documents/johndoe.pdf',
      documentName: 'johndoe.pdf'
    },
    {
      id: 2,
      name: 'Jane Smith',
      major: 'Electrical Engineering',
      documentUrl: 'https://example.com/documents/janesmith.pdf',
      documentName: 'janesmith.pdf'
    },
    {
      id: 3,
      name: 'Sam Wilson',
      major: 'Mechanical Engineering',
      documentUrl: 'https://example.com/documents/samwilson.pdf',
      documentName: 'samwilson.pdf'
    }
  ])

  const handleApprove = (userId) => {
    // Handle approve logic
    console.log('Approved:', userId)
  }

  const handleDecline = (userId) => {
    // Handle decline logic
    console.log('Declined:', userId)
  }

  const handleOpenDocument = (documentUrl) => {
    // Open the document in a new tab
    window.open(documentUrl, '_blank')
  }

  return (
    <div>
      <h1>Approve Documents</h1>
      <CTable>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>Name</CTableHeaderCell>
            <CTableHeaderCell>Major</CTableHeaderCell>
            <CTableHeaderCell>Document</CTableHeaderCell>
            <CTableHeaderCell>Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {users.map((user) => (
            <CTableRow key={user.id}>
              <CTableDataCell>{user.name}</CTableDataCell>
              <CTableDataCell>{user.major}</CTableDataCell>
              <CTableDataCell>
                <CButton color="link" onClick={() => handleOpenDocument(user.documentUrl)}>
                  {user.documentName}
                </CButton>
              </CTableDataCell>
              <CTableDataCell>
                <CButtonGroup>
                  <CButton color="success" onClick={() => handleApprove(user.id)}>
                    Approve
                  </CButton>
                  <CButton color="danger" onClick={() => handleDecline(user.id)}>
                    Decline
                  </CButton>
                </CButtonGroup>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    </div>
  )
}

export default ApproveDocuments
