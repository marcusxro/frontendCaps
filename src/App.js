import logo from './logo.svg';
import './App.css';
import Login from './comp/Login';
import { authentication } from './authentication';
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import System from './pages/System';
import Static from './pages/Static';
import Inventory from './pages/Inventory';
import Menu from './pages/Menu'
import Reports from './pages/Reports'
import Loading from './comp/Loading';
import NotFound from './pages/NotFound';
import Register from './pages/Register';
import Forgotpw from './pages/Forgotpw';
import Security from './pages/Security';

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authentication, (user) => {
      if (user) {
        setAuthenticated(true);
        setLoading(true)
      } else {
        setAuthenticated(false);
        setLoading(false)

      }
    });
    // Unsubscribe when the component unmounts.
    return () => unsubscribe();
  }, []);

  return (
    <Router>
    <div className="App">
      <Routes>
        <Route path='/' element={<Static />} />
        <Route path='/register' element={<Register />} />
        <Route path='/forgotPassword' element={<Forgotpw />} />
        {/* Only render Login component if not authenticated */}
        {!loading && !authenticated && <Route path='/login' element={<Login />} />}
        {/* Redirect authenticated users away from the /login route */}
        <Route path='/login' 
        element={<Login />} />
        <Route path='/system' 
        element={loading ? (authenticated ? <System /> : <Navigate to='/login' />) : <Loading />} />

        <Route path='/system/inventory' 
        element={authenticated ? (loading ? <Inventory /> : <Loading />) : <Navigate to='/login' /> } />

        <Route path='/system/menu'
         element={loading ? (authenticated ? <Menu /> : <Navigate to='/login' />) : <Loading />} />

        <Route path='/system/report' 
        element={loading ? (authenticated ? <Reports /> : <Navigate to='/login' />) : <Loading />} />
        
        <Route path='/system/security' 
        element={loading ? (authenticated ? <Security /> : <Navigate to='/login' />) : <Loading />} />

        <Route path='*' 
        element={ <NotFound />} />
        <Route path='/logs' 
        element={<Loading />} />
      </Routes>
    </div>
  </Router>
  );
}

export default App;
