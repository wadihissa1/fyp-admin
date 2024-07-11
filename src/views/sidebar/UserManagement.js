import React, { useState } from 'react'
import { CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CButton, CFormInput } from '@coreui/react'
import 'src/scss/_custom.scss';
const UserManagement = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      major: 'Computer Science',
      status: 'Active'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      major: 'Electrical Engineering',
      status: 'Inactive'
    },
    {
      id: 3,
      name: 'Sam Wilson',
      email: 'sam.wilson@example.com',
      major: 'Mechanical Engineering',
      status: 'Active'
    }
  ])

  const handleInputChange = (e, userId) => {
    const { name, value } = e.target
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, [name]: value } : user
      )
    )
  }

  const handleStatusChange = (userId) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId
          ? { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active' }
          : user
      )
    )
  }

  return (
    <div>
      <h1>User Management</h1>
      <CTable>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>Name</CTableHeaderCell>
            <CTableHeaderCell>Email</CTableHeaderCell>
            <CTableHeaderCell>Major</CTableHeaderCell>
            <CTableHeaderCell>Status</CTableHeaderCell>
            <CTableHeaderCell>Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {users.map((user) => (
            <CTableRow key={user.id}>
              <CTableDataCell>
                <CFormInput
                  type="text"
                  name="name"
                  value={user.name}
                  onChange={(e) => handleInputChange(e, user.id)}
                />
              </CTableDataCell>
              <CTableDataCell>
                <CFormInput
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={(e) => handleInputChange(e, user.id)}
                />
              </CTableDataCell>
              <CTableDataCell>
                <CFormInput
                  type="text"
                  name="major"
                  value={user.major}
                  onChange={(e) => handleInputChange(e, user.id)}
                />
              </CTableDataCell>
              <CTableDataCell>{user.status}</CTableDataCell>
              <CTableDataCell>
                <CButton
                  color={user.status === 'Active' ? 'danger' : 'success'}
                  onClick={() => handleStatusChange(user.id)}
                >
                  {user.status === 'Active' ? 'Disable' : 'Activate'}
                </CButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    </div>
  )
}

export default UserManagement
