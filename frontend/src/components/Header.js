import React, { useContext } from 'react'
import { Navbar, Container, Button } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from './AuthContext'
import IndiGo_logo from '../assets/IndiGo_logo.avif'

const Header = () => {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <Navbar className='header' bg='light' data-bs-theme="light">
        <Container className='d-flex'>
          <Link to={'/'}>
            <img src={IndiGo_logo} alt='IndiGo' height='28px'/>
          </Link>
          {user ? (
            <Button className='text-end' variant='outline-danger' onClick={handleLogout}>Logout</Button>
          )
            :
            (<Link to='/login'>
              <Button className='text-alight-end' variant='outline-success'>Admin Login</Button>
            </Link>)}
        </Container>
      </Navbar>
    </>
  )
}

export default Header