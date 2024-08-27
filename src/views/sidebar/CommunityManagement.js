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
  CFormCheck,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButtonGroup,
  CPagination,
  CPaginationItem,
  CForm,
  CFormLabel,
  CRow,
  CCol,
  CAlert,
  CFormSelect,
} from '@coreui/react'

const CommunityManagement = () => {
  const [communities, setCommunities] = useState([])
  const [newCommunity, setNewCommunity] = useState({
    name: '',
    mainCommunityName: '',
    description: '',
    image: null,
  })
  const [selectedUsers, setSelectedUsers] = useState([])
  const [selectedCommunity, setSelectedCommunity] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [confirmationVisible, setConfirmationVisible] = useState(false)
  const [communityToDelete, setCommunityToDelete] = useState(null)
  const [allUsers, setAllUsers] = useState([])
  const [filteredAddUsers, setFilteredAddUsers] = useState([])
  const [filteredRemoveUsers, setFilteredRemoveUsers] = useState([])
  const [searchAdd, setSearchAdd] = useState('')
  const [searchRemove, setSearchRemove] = useState('')
  const [currentPageAdd, setCurrentPageAdd] = useState(1)
  const [currentPageRemove, setCurrentPageRemove] = useState(1)
  const [alertVisible, setAlertVisible] = useState(false)
  const [statusFilter, setStatusFilter] = useState('All')
  const [mainCommunityFilter, setMainCommunityFilter] = useState('All')

  const usersPerPage = 5

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const response = await fetch('http://192.168.1.184:7210/api/Community/adminSubCommunities')
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const data = await response.json()
        setCommunities(data)
      } catch (error) {
        console.error('Error fetching communities:', error)
      }
    }

    fetchCommunities()
  }, [])

  useEffect(() => {
    const fetchUsers = async (communityId) => {
      try {
        const response = await fetch(
          `http://192.168.1.184:7210/api/User/GetUserNamesNotInSubCommunity/${communityId}`,
        )
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const data = await response.json()
        setAllUsers(data)
        setFilteredAddUsers(data)
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }

    if (selectedCommunity) {
      fetchUsers(selectedCommunity)
    }
  }, [selectedCommunity])

  useEffect(() => {
    const fetchUsersInSubCommunity = async (subCommunityId) => {
      try {
        const response = await fetch(
          `http://192.168.1.184:7210/api/User/GetUserNamesInSubCommunity/${subCommunityId}`,
        )
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const data = await response.json()
        console.log('Users in SubCommunity:', data)
        setFilteredRemoveUsers(data)
      } catch (error) {
        console.error('Error fetching users in subcommunity:', error)
      }
    }

    if (selectedCommunity) {
      fetchUsersInSubCommunity(selectedCommunity)
    }
  }, [selectedCommunity])

  const handleInputChange = (e, communityId) => {
    const { name, value } = e.target
    setCommunities((prevCommunities) =>
      prevCommunities.map((community) =>
        community.id === communityId ? { ...community, [name]: value } : community,
      ),
    )
  }

  const toggleCommunityStatus = async (communityId) => {
    try {
      const response = await fetch(
        `http://192.168.1.184:7210/api/Community/${communityId}/toggle-status`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const newStatus = await response.text() // Assuming the API returns the new status as plain text
      setCommunities((prevCommunities) =>
        prevCommunities.map((community) =>
          community.id === communityId ? { ...community, status: newStatus } : community,
        ),
      )
    } catch (error) {
      console.error('Error toggling community status:', error)
    }
  }

  const handleDelete = (communityId) => {
    setCommunityToDelete(communityId)
    setConfirmationVisible(true)
  }

  const confirmDelete = async () => {
    try {
      const response = await fetch(
        `http://192.168.1.184:7210/api/Community/DeleteSubCommunity?subCommunityId=${communityToDelete}`,
        {
          method: 'DELETE',
        },
      )
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      setCommunities((prevCommunities) =>
        prevCommunities.filter((community) => community.id !== communityToDelete),
      )
      setConfirmationVisible(false)
      setCommunityToDelete(null)
    } catch (error) {
      console.error('Error deleting community:', error)
    }
  }

  const cancelDelete = () => {
    setConfirmationVisible(false)
    setCommunityToDelete(null)
  }

  const handleAddCommunity = async () => {
    const formData = new FormData()
    formData.append('name', newCommunity.name)
    formData.append('Maincommunityname', newCommunity.mainCommunityName)
    formData.append('Description', newCommunity.description)
    if (newCommunity.image) {
      formData.append('Image', newCommunity.image)
    }

    try {
      const response = await fetch(
        'http://192.168.1.184:7210/api/Community/CreateAdminSubCommunity',
        {
          method: 'POST',
          body: formData,
        },
      )

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      // Display the success alert
      setAlertVisible(true)
      setTimeout(() => setAlertVisible(false), 3000)

      // Reset the form
      setNewCommunity({
        name: '',
        mainCommunityName: '',
        description: '',
        image: null,
      })

      // Refetch communities
      const communitiesResponse = await fetch(
        'http://192.168.1.184:7210/api/Community/adminSubCommunities',
      )
      const communitiesData = await communitiesResponse.json()
      setCommunities(communitiesData)
    } catch (error) {
      console.error('Error creating subcommunity:', error)
    }
  }

  const handleAddUsers = async () => {
    try {
      const response = await fetch(
        `http://192.168.1.184:7210/api/Community/AddUsersToSubCommunity/${selectedCommunity}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(selectedUsers),
        },
      )
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      // Refetch the list of users not in the subcommunity
      const usersResponse = await fetch(
        `http://192.168.0.102:7210/api/User/GetUserNamesNotInSubCommunity/${selectedCommunity}`,
      )
      if (!usersResponse.ok) {
        throw new Error('Network response was not ok')
      }
      const usersData = await usersResponse.json()
      setAllUsers(usersData)
      setFilteredAddUsers(usersData)

      // Refetch the list of users in the subcommunity
      const usersInSubCommunityResponse = await fetch(
        `http://192.168.1.184:7210/api/User/GetUserNamesInSubCommunity/${selectedCommunity}`,
      )
      if (!usersInSubCommunityResponse.ok) {
        throw new Error('Network response was not ok')
      }
      const usersInSubCommunityData = await usersInSubCommunityResponse.json()
      setFilteredRemoveUsers(usersInSubCommunityData)

      // Clear selected users and close the modal
      setSelectedUsers([])
      setModalVisible(false)
    } catch (error) {
      console.error('Error adding users to subcommunity:', error)
    }
  }

  const handleRemoveUsers = async () => {
    try {
      const response = await fetch(
        `http://192.168.1.184:7210/api/Community/RemoveUsersFromSubCommunity/${selectedCommunity}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(selectedUsers),
        },
      )
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      // Refetch the list of users not in the subcommunity
      const usersResponse = await fetch(
        `http://192.168.1.184:7210/api/User/GetUserNamesNotInSubCommunity/${selectedCommunity}`,
      )
      if (!usersResponse.ok) {
        throw new Error('Network response was not ok')
      }
      const usersData = await usersResponse.json()
      setAllUsers(usersData)
      setFilteredAddUsers(usersData)

      // Refetch the list of users in the subcommunity
      const usersInSubCommunityResponse = await fetch(
        `http://192.168.1.184:7210/api/User/GetUserNamesInSubCommunity/${selectedCommunity}`,
      )
      if (!usersInSubCommunityResponse.ok) {
        throw new Error('Network response was not ok')
      }
      const usersInSubCommunityData = await usersInSubCommunityResponse.json()
      setFilteredRemoveUsers(usersInSubCommunityData)

      // Clear selected users and close the modal
      setSelectedUsers([])
      setModalVisible(false)
    } catch (error) {
      console.error('Error removing users from subcommunity:', error)
    }
  }

  const openModal = (communityId) => {
    setSelectedCommunity(communityId)
    setModalVisible(true)
    setSelectedUsers([])
    setCurrentPageAdd(1)
    setCurrentPageRemove(1)
  }

  useEffect(() => {
    const filtered = allUsers.filter((user) => user.toLowerCase().includes(searchAdd.toLowerCase()))
    setFilteredAddUsers(filtered)
  }, [searchAdd, allUsers])

  useEffect(() => {
    if (filteredRemoveUsers) {
      const filtered = filteredRemoveUsers.filter((user) =>
        user.toLowerCase().includes(searchRemove.toLowerCase()),
      )
      setFilteredRemoveUsers(filtered)
    }
  }, [searchRemove])

  const handleUserSelection = (user) => {
    setSelectedUsers((prevSelectedUsers) =>
      prevSelectedUsers.includes(user)
        ? prevSelectedUsers.filter((u) => u !== user)
        : [...prevSelectedUsers, user],
    )
  }

  const paginate = (users, currentPage) => {
    const indexOfLastUser = currentPage * usersPerPage
    const indexOfFirstUser = indexOfLastUser - usersPerPage
    return users.slice(indexOfFirstUser, indexOfFirstUser + usersPerPage)
  }

  const handlePageChangeAdd = (pageNumber) => setCurrentPageAdd(pageNumber)
  const handlePageChangeRemove = (pageNumber) => setCurrentPageRemove(pageNumber)

  const filteredCommunities = communities.filter((community) => {
    return (
      (statusFilter === 'All' || community.status === statusFilter) &&
      (mainCommunityFilter === 'All' || community.mainCommunityName === mainCommunityFilter)
    )
  })

  return (
    <div>
      <h1>Community Management</h1>
      <CAlert
        color="success"
        dismissible
        visible={alertVisible}
        onClose={() => setAlertVisible(false)}
      >
        Subcommunity created successfully!
      </CAlert>
      <CForm>
        <CRow className="align-items-center mb-3">
          <CCol md={4}>
            <CFormLabel htmlFor="mainCommunityName">Main Community Name</CFormLabel>
            <CFormInput
              type="text"
              id="mainCommunityName"
              value={newCommunity.mainCommunityName}
              onChange={(e) =>
                setNewCommunity({ ...newCommunity, mainCommunityName: e.target.value })
              }
            />
          </CCol>
          <CCol md={4}>
            <CFormLabel htmlFor="newCommunityName">New SubCommunity Name</CFormLabel>
            <CFormInput
              type="text"
              id="newCommunityName"
              value={newCommunity.name}
              onChange={(e) => setNewCommunity({ ...newCommunity, name: e.target.value })}
            />
          </CCol>
          <CCol md={4}>
            <CFormLabel htmlFor="image">Choose File</CFormLabel>
            <CFormInput
              type="file"
              id="image"
              onChange={(e) => setNewCommunity({ ...newCommunity, image: e.target.files[0] })}
            />
          </CCol>
        </CRow>
        <CRow className="mb-3">
          <CCol>
            <CFormLabel htmlFor="description">Description (Max 10 words)</CFormLabel>
            <CFormInput
              type="text"
              id="description"
              value={newCommunity.description}
              onChange={(e) => {
                const words = e.target.value.split(' ')
                if (words.length <= 10) {
                  setNewCommunity({ ...newCommunity, description: e.target.value })
                }
              }}
            />
          </CCol>
        </CRow>
        <CButton color="primary" onClick={handleAddCommunity} style={{ marginBottom: '10px' }}>
          Create Community
        </CButton>
        <h2 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Display Communities
          <div>
            <CFormSelect
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ marginRight: '10px', display: 'inline-block', width: 'auto' }}
            >
              <option value="All">All</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </CFormSelect>
            <CFormSelect
              value={mainCommunityFilter}
              onChange={(e) => setMainCommunityFilter(e.target.value)}
              style={{ display: 'inline-block', width: 'auto' }}
            >
              <option value="All">All</option>
              <option value="PreCommunity">PreCommunity</option>
              <option value="PostCommunity">PostCommunity</option>
            </CFormSelect>
          </div>
        </h2>
      </CForm>
      <CTable className="mt-4">
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>Name</CTableHeaderCell>
            <CTableHeaderCell>Main Community</CTableHeaderCell>
            <CTableHeaderCell>Status</CTableHeaderCell>
            <CTableHeaderCell>Number of Users</CTableHeaderCell>
            <CTableHeaderCell>Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {filteredCommunities.map((community) => (
            <CTableRow key={community.id}>
              <CTableDataCell>
                <CFormInput
                  type="text"
                  name="name"
                  value={community.name}
                  onChange={(e) => handleInputChange(e, community.id)}
                />
              </CTableDataCell>
              <CTableDataCell>{community.mainCommunityName}</CTableDataCell>
              <CTableDataCell>{community.status}</CTableDataCell>
              <CTableDataCell>{community.nbMembers}</CTableDataCell>
              <CTableDataCell>
                <CButtonGroup>
                  <CButton
                    color={community.status === 'Active' ? 'danger' : 'success'}
                    onClick={() => toggleCommunityStatus(community.id)}
                  >
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
            <CPaginationItem
              disabled={currentPageRemove === 1}
              onClick={() => handlePageChangeRemove(currentPageRemove - 1)}
            >
              Previous
            </CPaginationItem>
            {[...Array(Math.ceil(filteredRemoveUsers.length / usersPerPage)).keys()].map(
              (pageNumber) => (
                <CPaginationItem
                  key={pageNumber + 1}
                  active={currentPageRemove === pageNumber + 1}
                  onClick={() => handlePageChangeRemove(pageNumber + 1)}
                >
                  {pageNumber + 1}
                </CPaginationItem>
              ),
            )}
            <CPaginationItem
              disabled={currentPageRemove === Math.ceil(filteredRemoveUsers.length / usersPerPage)}
              onClick={() => handlePageChangeRemove(currentPageRemove + 1)}
            >
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
            <CPaginationItem
              disabled={currentPageAdd === 1}
              onClick={() => handlePageChangeAdd(currentPageAdd - 1)}
            >
              Previous
            </CPaginationItem>
            {[...Array(Math.ceil(filteredAddUsers.length / usersPerPage)).keys()].map(
              (pageNumber) => (
                <CPaginationItem
                  key={pageNumber + 1}
                  active={currentPageAdd === pageNumber + 1}
                  onClick={() => handlePageChangeAdd(pageNumber + 1)}
                >
                  {pageNumber + 1}
                </CPaginationItem>
              ),
            )}
            <CPaginationItem
              disabled={currentPageAdd === Math.ceil(filteredAddUsers.length / usersPerPage)}
              onClick={() => handlePageChangeAdd(currentPageAdd + 1)}
            >
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

      <CModal visible={confirmationVisible} onClose={() => setConfirmationVisible(false)}>
        <CModalHeader onClose={() => setConfirmationVisible(false)}>
          <CModalTitle>Confirm Deletion</CModalTitle>
        </CModalHeader>
        <CModalBody>Are you sure you want to delete this community?</CModalBody>
        <CModalFooter>
          <CButton color="danger" onClick={confirmDelete}>
            Yes, Delete
          </CButton>
          <CButton color="secondary" onClick={cancelDelete}>
            Cancel
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default CommunityManagement
