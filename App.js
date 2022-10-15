import { useState, useEffect } from "react";
import { ToastContainer } from 'react-toastify';
import './media-query.css';
import './style.scss';
import './App.css';
import { Header } from './components';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { About, Home, Detail, AddEditBlog, Auth, NotFound } from './pages';
import 'react-toastify/dist/ReactToastify.css';
import { auth } from "./firebase";
import { signOut } from "firebase/auth";

function App() {
  const [active, setActive] = useState('home');
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      auth.onAuthStateChanged((authUser) => {
        if (authUser) {
          setUser(authUser);
        } else {
          setUser(null);
        }
      });
    }
  }, []);

  const handleLogout = () => {
    signOut(auth).then(() => {
      setUser(null);
      setActive('login');
      navigate('/auth')
    })
  }

  return (
    <div className="App">
      <Header
        setActive={setActive}
        active={active}
        user={user}
        handleLogout={handleLogout}
      />
      <ToastContainer position="top-center" />
      <Routes>
        <Route path="/" element={<Home setActive={setActive} user={user} />} />
        <Route path="/detail/:id" element={<Detail setActive={setActive} />} />
        <Route
          path="/create"
          element={
            user?.uid ? <AddEditBlog user={user} /> : <Navigate to="/" setActive={setActive} />
          }
        />
        <Route
          path="/update/:id"
          element={
            user?.uid ? <AddEditBlog user={user} setActive={setActive} /> : <Navigate to="/" setActive={setActive}  />
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="/auth" element={<Auth setActive={setActive} setUser={setUser} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
