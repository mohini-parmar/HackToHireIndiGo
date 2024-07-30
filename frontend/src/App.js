import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './components/Login';
import FlightList from './components/FlightList';
import { AuthProvider } from './components/AuthContext';

function App() {
  return (
    <>
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path='/' element={<FlightList />} />
              <Route path='/login' element={<Login />} />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </>
  );
}

export default App;
