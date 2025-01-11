import fullualogo from 'src/assets/brand/fullualogo.png'  
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
  CImage,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import 'src/scss/_custom.scss'

const Login = () => {
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()

    const signInDto = {
      username: fullName,
      password: password,
    }
    
    try {
      const response = await fetch('https://20.49.30.0/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signInDto),
      })

      const result = await response.json()

      if (response.ok) {
        console.log('User logged in successfully:', result)
        navigate('/dashboard') // Navigate to dashboard on success
      } else {
        alert(result.error || 'Login failed') // Show error message
      }
    } catch (error) {
      console.error('Error during login:', error)
      alert('An error occurred during login. Please try again.')
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
                  {/* Logo Image */}
                  <CImage
                    src={fullualogo}
                    alt="Full UA Logo"
                    className="mb-4"
                    style={{
                      display: 'block',
                      margin: '0 auto',
                      maxWidth: '200px',
                      height: 'auto',
                    }}
                  />
                  <CForm onSubmit={handleLogin}>
                    <h1>Login to Frank Admin</h1>
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
                    </CRow>
                  </CForm>
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
