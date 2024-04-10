import './App.css'; // Importing CSS file
import React, { useState, useEffect } from 'react'; // Importing necessary modules from React
import Login from './components/Login'; // Importing Login component
import Chatroom from './components/Chatroom'; // Importing Chatroom component
import {
  Route,
  BrowserRouter as Router,
  Routes,
  Navigate,
  Outlet
} from "react-router-dom"; // Importing necessary components from react-router-dom
import { auth } from './firebase.js' // Importing auth object from firebase.js

// Function component for PrivateRoute
function PrivateRoute({ authenticated }) {
  return (
    authenticated === true ? ( // If user is authenticated, render child components
      <Outlet />
    ) : (
      <Navigate to={{ pathname: "/" }} /> // If user is not authenticated, redirect to login page
    )
  );
}

// Function component for PublicRoute
function PublicRoute({ authenticated }) {
  return (
    authenticated === false ? ( // If user is not authenticated, render child components
      <Outlet />
    ) :  (
      <Navigate to="chatroom" /> // If user is authenticated, redirect to chatroom page
    )
  );
}

// Main App component
function App() {
  const [authenticated, setAuthenticated] = useState(false); // State variable for authentication status

  // useEffect hook to subscribe to authentication state changes
  useEffect(() => {
    // When component mounts, set up observer to detect authentication state changes
    auth.onAuthStateChanged((user) => {
      console.log(user); // Log user object

      // If user exists (authenticated), set authenticated state to true; otherwise, set it to false
      if(user) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
      }
    })
  }, []) // Empty dependency array to run effect only once

  return (
    <div className="App"> {/* Root element with class name App */}
     <Router> {/* Router component for managing routes */}
      <Routes> {/* Routes component to define application routes */}
        {/* Route for public pages */}
        <Route exact path='/' element={<PublicRoute authenticated={authenticated}/>}> 
          <Route exact path='/' element={<Login/>}/> {/* Render Login component */}
        </Route>
        {/* Route for private pages */}
        <Route exact path='/chatroom' element={<PrivateRoute authenticated={authenticated}/>}>
          <Route exact path='/chatroom' element={<Chatroom/>}/> {/* Render Chatroom component */}
        </Route>
      </Routes>
     </Router>
    </div>
  );
}

export default App; // Exporting App component
