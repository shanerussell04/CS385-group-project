// HomePage code written by Anthony Hayes
// Comments added by ChatGPT
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import { auth } from "../firebase"; // Firebase authentication
import logo from "../assets/logo.jpeg"; // Logo image path
import { Button, Container, Row, Col, Image } from "react-bootstrap"; // Bootstrap components

const HomePage = () => {
  const navigate = useNavigate(); // Hook to navigate between pages
  const [user, setUser] = useState(null); // State to track if the user is logged in

  // useEffect to listen for authentication status changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser); // Update user state based on auth status
    });

    return () => unsubscribe(); // Cleanup the listener on component unmount
  }, []);

  // Function to handle redirection to the login page
  const handleLoginRedirect = () => {
    navigate("/login"); // Navigate to the login route
  };

  return (
    <Container
      fluid
      className="d-flex flex-column justify-content-center align-items-center vh-100 bg-dark text-white"
    >
      {/* Top-Right Corner Text */}
      <div
        className="position-absolute"
        style={{
          top: "10px", // Position from the top
          right: "20px", // Position from the right
          fontSize: "1rem", // Smaller font size
          fontWeight: "bold",
          color: "#ffffff",
        }}
      >
        Team Einsteinium
      </div>

      {/* Logo Section */}
      <Row className="w-100 justify-content-center mb-4">
        <Col xs={10} md={6} lg={4} className="text-center">
          {/* Display the logo image with fluid scaling */}
          <Image
            src={logo}
            alt="Team Logo"
            fluid
            style={{ maxHeight: "60vh", objectFit: "contain" }}
          />
        </Col>
      </Row>

      {/* Button Section */}
      <Row>
        <Col className="text-center">
          {/* Login Button with custom styling */}
          <Button
            variant="primary" // Bootstrap button style
            size="lg" // Large button size
            className="rounded-pill px-5 py-3" // Add rounded edges and padding
            onClick={handleLoginRedirect} // Redirect to login page on click
          >
            Go to Login
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
