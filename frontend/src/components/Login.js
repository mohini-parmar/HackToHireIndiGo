import React, { useContext, useState } from 'react'
import { Button, Container, Form, Row, Col } from 'react-bootstrap'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from './AuthContext'
import './index.css'

const Login = () => {
    const [uname, setUname] = useState('');
    const [pswd, setPswd] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useContext(AuthContext)
 
    const handleLogin = async (e) =>{
        e.preventDefault();
        setLoading(true);
        setError('')
        try{
            const res = await axios.post('http://localhost:3000/login',{uname , pswd});
            login(res.data)
            navigate('/');
        }catch(error){
            console.error('Error logging in', error);
        }finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div className='d-flex'>
                <div className='col-md-4' />
                <div className='col-md-4'>
                    <Container className='d-flex justify-content-center align-items-center login_form'>
                        <Row classNamew='w-100'>
                            <Col xs={12} md={12} lg={12} className="mx-auto">
                                <h2 className='text-center mb-4'>Login</h2>
                                {error && <p className="text-danger text-center">{error}</p>}
                                <Form onSubmit={handleLogin}>
                                    <Form.Group controlId='formEmail'>
                                        <Form.Label className='form-label'>Enter Username</Form.Label>
                                        <Form.Control type='text' placeholder='Enter Username' value={uname} onChange={(e) => setUname(e.target.value)} required />
                                    </Form.Group>
                                    <br />
                                    <Form.Group controlId="formBasicPassword">
                                        <Form.Label className='form-label'>Enter Password</Form.Label>
                                        <Form.Control type="password" placeholder="Password" value={pswd} onChange={(e) => setPswd(e.target.value)} required />
                                    </Form.Group>
                                    <br />
                                    <div className="d-flex justify-content-center">
                                        <Button variant="primary" type="submit" className="w-50" disabled={loading}>
                                            {loading ? 'Loading...' : 'Submit'}
                                        </Button>
                                    </div>
                                </Form>
                            </Col>
                        </Row>
                    </Container>
                </div>
                <div className='col-md-4' />
            </div>
        </>
    )
}

export default Login
