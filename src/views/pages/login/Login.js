import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import 'src/scss/_custom.scss'

const Login = () => {
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const mockLogin = (credentials) => {
    // Mock user data
    const mockUser = {
      fullName: 'admin',
      password: '123456',
      user: { id: 1, name: 'Admin User' },
      token: 'mock-token-123456',
    }

    if (
      credentials.FullName === mockUser.fullName &&
      credentials.Password === mockUser.password
    ) {
      return { success: true, user: mockUser.user, token: mockUser.token }
    }

    return { success: false, error: 'Invalid credentials' }
  }

  const handleLogin = (e) => {
    e.preventDefault()

    const signInDto = {
      FullName: fullName,
      Password: password,
    }

    const result = mockLogin(signInDto)

    if (result.success) {
      console.log('User:', result.user)
      console.log('Token:', result.token)
      navigate('/dashboard')
    } else {
      alert(result.error)
    }
  }

  const loginAsAdmin = () => {
    const adminCredentials = {
      FullName: 'admin',
      Password: '123456',
    }

    const result = mockLogin(adminCredentials)

    if (result.success) {
      console.log('Admin User:', result.user)
      console.log('Token:', result.token)
      navigate('/dashboard')
    } else {
      alert(result.error)
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleLogin}>
                    <h1>Login</h1>
                    <p className="text-body-secondary">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Username"
                        autoComplete="username"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton type="submit" color="primary" className="px-4">
                          Login
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton
                          type="button"
                          color="secondary"
                          className="px-4"
                          onClick={loginAsAdmin}
                        >
                          Login as Admin
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>
                      Welcome to Antonine university System designed This system control the
                      university application
                    </p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Register Now!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
