import React, { useState, useEffect } from 'react';
import {
  CAvatar,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPeople } from '@coreui/icons';

import avatar1 from 'src/assets/images/avatars/1.jpg';
import 'src/scss/_custom.scss';
import MainChart from './MainChart'; // Import MainChart component

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Static data for testing
    const data = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        lastActivity: '2024-06-28T10:00:00Z',
        signIns: ['2024-06-25', '2024-06-25', '2024-06-26', '2024-06-27', '2024-06-28'],
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        lastActivity: '2024-06-27T11:00:00Z',
        signIns: ['2024-06-26', '2024-06-27', '2024-06-27'],
      },
      {
        name: 'Sam Wilson',
        email: 'sam@example.com',
        lastActivity: '2024-06-26T09:00:00Z',
        signIns: ['2024-06-25', '2024-06-25', '2024-06-26', '2024-06-26', '2024-06-26', '2024-06-27', '2024-06-28'],
      },
      {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        lastActivity: '2024-06-25T14:00:00Z',
        signIns: ['2024-06-25', '2024-06-25', '2024-06-26', '2024-06-27'],
      },
      {
        name: 'Bob Brown',
        email: 'bob@example.com',
        lastActivity: '2024-06-24T16:00:00Z',
        signIns: ['2024-06-24', '2024-06-25', '2024-06-26', '2024-06-27', '2024-06-28', '2024-06-28'],
      },
    ];
    setUsers(data);
    setLoading(false);
  }, []);

  return (
    <CRow>
      <CCol xs={12} lg={6}>
        <CCard className="mb-4">
          <CCardHeader>Users</CCardHeader>
          <CCardBody>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead className="text-nowrap">
                  <CTableRow>
                    <CTableHeaderCell className="bg-body-tertiary text-center">
                      <CIcon icon={cilPeople} />
                    </CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">User</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">Email</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Last Activity</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">Sign-Ins</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {users.map((user, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell className="text-center">
                        <CAvatar size="md" src={user.avatar || avatar1} status="success" />
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>{user.name}</div>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        {user.email}
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="small text-body-secondary text-nowrap">Last login</div>
                        <div className="fw-semibold text-nowrap">{new Date(user.lastActivity).toLocaleString()}</div>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        {user.signIns.length}
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            )}
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={12} lg={6}>
        <MainChart users={users} />
      </CCol>
    </CRow>
  );
};

export default Dashboard;
