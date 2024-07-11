import React, { useState } from 'react'
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CFormInput,
  CFormCheck,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButtonGroup,
  CPagination,
  CPaginationItem
} from '@coreui/react'

const CommunityManagement = () => {
  const [communities, setCommunities] = useState([
    {
      id: 1,
      name: 'Community A',
      status: 'Active',
      users: ['John Doe', 'Jane Smith']
    },
    {
      id: 2,
      name: 'Community B',
      status: 'Inactive',
      users: ['Sam Wilson']
    }
  ])
  const [newCommunity, setNewCommunity] = useState('')
  const [selectedUsers, setSelectedUsers] = useState([])
  const [selectedCommunity, setSelectedCommunity] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [allUsers, setAllUsers] = useState([
    'John Doe', 'Jane Smith', 'Sam Wilson', 'Alice Johnson', 'Bob Brown', 'John Doe', 'Jane Smith', 'Sam Wilson', 'Alice Johnson', 'Bob Brown', 'John Doe', 'Jane Smith', 'Sam Wilson', 'Alice Johnson', 'Bob Brown', 'John Doe', 'Jane Smith', 'Sam Wilson', 'Alice Johnson', 'Bob Brown', 'John Doe', 'Jane Smith', 'Sam Wilson', 'Alice Johnson', 'Bob Brown' // Replace with actual user data
  ])
  const [searchAdd, setSearchAdd] = useState('')
  const [searchRemove, setSearchRemove] = useState('')
  const [currentPageAdd, setCurrentPageAdd] = useState(1)
  const [currentPageRemove, setCurrentPageRemove] = useState(1)
  const usersPerPage = 5

  const handleInputChange = (e, communityId) => {
    const { name, value } = e.target
    setCommunities((prevCommunities) =>
      prevCommunities.map((community) =>
        community.id === communityId ? { ...community, [name]: value } : community
      )
    )
  }

  const handleStatusChange = (communityId) => {
    setCommunities((prevCommunities) =>
      prevCommunities.map((community) =>
        community.id === communityId
          ? { ...community, status: community.status === 'Active' ? 'Inactive' : 'Active' }
          : community
      )
    )
  }

  const handleDelete = (communityId) => {
    setCommunities((prevCommunities) =>
      prevCommunities.filter((community) => community.id !== communityId)
    )
  }

  const handleAddCommunity = () => {
    setCommunities((prevCommunities) => [
      ...prevCommunities,
      {
        id: prevCommunities.length + 1,
        name: newCommunity,
        status: 'Active',
        users: []
      }
    ])
    setNewCommunity('')
  }

  const handleAddUsers = () => {
    setCommunities((prevCommunities) =>
      prevCommunities.map((community) =>
        community.id === selectedCommunity
          ? { ...community, users: [...new Set([...community.users, ...selectedUsers])] }
          : community
      )
    )
    setSelectedUsers([])
    setModalVisible(false)
  }

  const handleRemoveUsers = () => {
    setCommunities((prevCommunities) =>
      prevCommunities.map((community) =>
        community.id === selectedCommunity
          ? { ...community, users: community.users.filter((user) => !selectedUsers.includes(user)) }
          : community
      )
    )
    setSelectedUsers([])
    setModalVisible(false)
  }

  const openModal = (communityId) => {
    setSelectedCommunity(communityId)
    setModalVisible(true)
    setSelectedUsers([])
    setCurrentPageAdd(1)
    setCurrentPageRemove(1)
  }

  const filteredAddUsers = allUsers.filter(user => 
    user.toLowerCase().includes(searchAdd.toLowerCase()) && !communities.find(community => community.id === selectedCommunity)?.users.includes(user)
  )

  const filteredRemoveUsers = selectedCommunity ? communities.find(community => community.id === selectedCommunity).users.filter(user =>
    user.toLowerCase().includes(searchRemove.toLowerCase())
  ) : []

  const handleUserSelection = (user) => {
    setSelectedUsers((prevSelectedUsers) => 
      prevSelectedUsers.includes(user) ? prevSelectedUsers.filter(u => u !== user) : [...prevSelectedUsers, user]
    )
  }

  const paginate = (users, currentPage) => {
    const indexOfLastUser = currentPage * usersPerPage
    const indexOfFirstUser = indexOfLastUser - usersPerPage
    return users.slice(indexOfFirstUser, indexOfLastUser)
  }

  const handlePageChangeAdd = (pageNumber) => setCurrentPageAdd(pageNumber)
  const handlePageChangeRemove = (pageNumber) => setCurrentPageRemove(pageNumber)

  return (
    <div>
      <h1>Community Management</h1>
      <div>
        <CFormInput
          type="text"
          placeholder="New Community Name"
          value={newCommunity}
          onChange={(e) => setNewCommunity(e.target.value)}
        />
        <CButton color="primary" onClick={handleAddCommunity} className="mt-2">
          Create Community
        </CButton>
      </div>
      <CTable className="mt-4">
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>Name</CTableHeaderCell>
            <CTableHeaderCell>Status</CTableHeaderCell>
            <CTableHeaderCell>Number of Users</CTableHeaderCell>
            <CTableHeaderCell>Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {communities.map((community) => (
            <CTableRow key={community.id}>
              <CTableDataCell>
                <CFormInput
                  type="text"
                  name="name"
                  value={community.name}
                  onChange={(e) => handleInputChange(e, community.id)}
                />
              </CTableDataCell>
              <CTableDataCell>{community.status}</CTableDataCell>
              <CTableDataCell>{community.users.length}</CTableDataCell>
              <CTableDataCell>
                <CButtonGroup>
                  <CButton color={community.status === 'Active' ? 'danger' : 'success'} onClick={() => handleStatusChange(community.id)}>
                    {community.status === 'Active' ? 'Disable' : 'Activate'}
                  </CButton>
                  <CButton color="danger" onClick={() => handleDelete(community.id)}>
                    Delete
                  </CButton>
                  <CButton color="primary" onClick={() => openModal(community.id)}>
                    Manage Users
                  </CButton>
                </CButtonGroup>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
      <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <CModalHeader onClose={() => setModalVisible(false)}>
          <CModalTitle>Manage Users</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <h5>Current Users</h5>
          <CFormInput
            type="text"
            placeholder="Search to remove users"
            value={searchRemove}
            onChange={(e) => setSearchRemove(e.target.value)}
          />
          <ul>
            {paginate(filteredRemoveUsers, currentPageRemove).map((user, index) => (
              <li key={index}>
                <CFormCheck
                  id={`remove-${user}`}
                  label={user}
                  checked={selectedUsers.includes(user)}
                  onChange={() => handleUserSelection(user)}
                />
              </li>
            ))}
          </ul>
          <CPagination className="justify-content-center">
            <CPaginationItem disabled={currentPageRemove === 1} onClick={() => handlePageChangeRemove(currentPageRemove - 1)}>
              Previous
            </CPaginationItem>
            {[...Array(Math.ceil(filteredRemoveUsers.length / usersPerPage)).keys()].map(pageNumber => (
              <CPaginationItem key={pageNumber + 1} active={currentPageRemove === pageNumber + 1} onClick={() => handlePageChangeRemove(pageNumber + 1)}>
                {pageNumber + 1}
              </CPaginationItem>
            ))}
            <CPaginationItem disabled={currentPageRemove === Math.ceil(filteredRemoveUsers.length / usersPerPage)} onClick={() => handlePageChangeRemove(currentPageRemove + 1)}>
              Next
            </CPaginationItem>
          </CPagination>
          <CButton color="danger" onClick={handleRemoveUsers} className="mt-2">
            Remove Selected Users
          </CButton>
          <h5 className="mt-3">Add Users</h5>
          <CFormInput
            type="text"
            placeholder="Search to add users"
            value={searchAdd}
            onChange={(e) => setSearchAdd(e.target.value)}
          />
          <ul>
            {paginate(filteredAddUsers, currentPageAdd).map((user, index) => (
              <li key={index}>
                <CFormCheck
                  id={`add-${user}`}
                  label={user}
                  checked={selectedUsers.includes(user)}
                  onChange={() => handleUserSelection(user)}
                />
              </li>
            ))}
          </ul>
          <CPagination className="justify-content-center">
            <CPaginationItem disabled={currentPageAdd === 1} onClick={() => handlePageChangeAdd(currentPageAdd - 1)}>
              Previous
            </CPaginationItem>
            {[...Array(Math.ceil(filteredAddUsers.length / usersPerPage)).keys()].map(pageNumber => (
              <CPaginationItem key={pageNumber + 1} active={currentPageAdd === pageNumber + 1} onClick={() => handlePageChangeAdd(pageNumber + 1)}>
                {pageNumber + 1}
              </CPaginationItem>
            ))}
            <CPaginationItem disabled={currentPageAdd === Math.ceil(filteredAddUsers.length / usersPerPage)} onClick={() => handlePageChangeAdd(currentPageAdd + 1)}>
              Next
            </CPaginationItem>
          </CPagination>
          <CButton color="primary" onClick={handleAddUsers} className="mt-2">
            Add Selected Users
          </CButton>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalVisible(false)}>
            Cancel
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default CommunityManagement
