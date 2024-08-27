import React, { useState, useEffect } from 'react'
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CFormInput,
  CFormSelect,
} from '@coreui/react'
import 'src/scss/_custom.scss'
import config from './config'

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://192.168.1.184:7210/api/User/admin')
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const data = await response.json()
        setUsers(data)
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }

    fetchUsers()
  }, [])

  const handleInputChange = (e, userId) => {
    const { name, value } = e.target
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === userId ? { ...user, [name]: value } : user)),
    )
  }

  const handleKeyPress = (e, userId) => {
    if (e.key === 'Enter') {
      updateUserDetails(userId)
    }
  }

  const updateUserDetails = async (userId) => {
    const user = users.find((user) => user.id === userId)
    try {
      const response = await fetch(`http://192.168.1.184:7210/api/User/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: user.fullName,
          email: user.email,
          role: user.role,
        }),
      })

      const responseText = await response.text()

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${responseText}`)
      }

      // You can still update the user details locally if the backend doesn't return updated user details
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === userId
            ? { ...u, fullName: user.fullName, email: user.email, role: user.role }
            : u,
        ),
      )

      alert(`User ${user.fullName} updated successfully`)
    } catch (error) {
      console.error('Error updating user details:', error)
    }
  }

  const handleStatusChange = async (userId) => {
    try {
      const response = await fetch(`http://192.168.1.184:7210/api/User/${userId}/toggle-status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const newStatus = await response.text()

      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === userId ? { ...user, memberStatus: newStatus } : user)),
      )
    } catch (error) {
      console.error('Error updating user status:', error)
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      (user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === 'All' || user.memberStatus === statusFilter),
  )

  return (
    <div>
      <h1>User Management</h1>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <CFormInput
          type="text"
          placeholder="Search by name, role, or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginRight: '10px', width: '300px' }}
        />
        <CFormSelect
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ marginRight: '10px', width: '200px' }}
        >
          <option value="All">All</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </CFormSelect>
      </div>
      <CTable>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>Name</CTableHeaderCell>
            <CTableHeaderCell>Email</CTableHeaderCell>
            <CTableHeaderCell>Role</CTableHeaderCell>
            <CTableHeaderCell>Status</CTableHeaderCell>
            <CTableHeaderCell>Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {filteredUsers.map((user) => (
            <CTableRow key={user.id}>
              <CTableDataCell>
                <CFormInput
                  type="text"
                  name="fullName"
                  value={user.fullName}
                  onChange={(e) => handleInputChange(e, user.id)}
                  onKeyPress={(e) => handleKeyPress(e, user.id)}
                />
              </CTableDataCell>
              <CTableDataCell>
                <CFormInput
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={(e) => handleInputChange(e, user.id)}
                  onKeyPress={(e) => handleKeyPress(e, user.id)}
                />
              </CTableDataCell>
              <CTableDataCell>
                <CFormInput
                  type="text"
                  name="role"
                  value={user.role}
                  onChange={(e) => handleInputChange(e, user.id)}
                  onKeyPress={(e) => handleKeyPress(e, user.id)}
                />
              </CTableDataCell>
              <CTableDataCell>{user.memberStatus}</CTableDataCell>
              <CTableDataCell>
                <CButton
                  color={user.memberStatus === 'Active' ? 'danger' : 'success'}
                  onClick={() => handleStatusChange(user.id)}
                >
                  {user.memberStatus === 'Active' ? 'Disable' : 'Activate'}
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
