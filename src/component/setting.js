import React, { useState, useEffect } from "react"; // Importing React along with useState and useEffect hooks for managing state and side effects
import { useNavigate } from "react-router-dom"; // Importing useNavigate from react-router-dom for navigation in React
import { Dropdown, Button, Form, Alert, Card } from "react-bootstrap"; // Importing components from React Bootstrap: Dropdown, Button, Form, Alert, and Card for UI elements
import { auth, db } from "../firebase";

function Settings() {
  const [fontSize, setFontSize] = useState("medium"); // Default font size is medium
  const [theme, setTheme] = useState("light"); // Default theme is light
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for menu visibility
  const navigate = useNavigate(); // Hook for navigation within the app
  const [showAlert, setShowAlert] = useState(false); // State for showing the alert

  // Effect to apply settings when the component mounts
  useEffect(() => {
    const savedSettings = JSON.parse(localStorage.getItem("userSettings")); // Retrieve saved settings from localStorage
    if (savedSettings) {
      // If settings are found
      setFontSize(savedSettings.fontSize); // Apply the saved font size
      setTheme(savedSettings.theme); // Apply the saved theme
    }
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  // Effect to dynamically apply the theme and font size to the body
  useEffect(() => {
    document.body.className = theme; // Apply the theme as a class to the body (e.g., 'light' or 'dark')
    // Apply font size based on the selected value
    document.body.style.fontSize =
      fontSize === "small" ? "12px" : fontSize === "large" ? "18px" : "16px"; // Default to 'medium' font size (16px)
  }, [theme, fontSize]); // Run this effect whenever the theme or font size changes

  // Function written by ChatGPT
  /// Function to save settings to localStorage
  const saveSettings = () => {
    const settings = { fontSize, theme }; // Create an object with the current settings (fontSize and theme)
    localStorage.setItem("userSettings", JSON.stringify(settings)); // Save the settings to localStorage
    setShowAlert(true); // Show the alert after saving settings
    setTimeout(() => setShowAlert(false), 3000); // Hide the alert after 3 seconds (3000 milliseconds)
  };

  // Toggle menu visibility
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen); // Toggle the state of the menu (open or close)

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Settings</h1> {/* Title of the Settings page */}
      {/* Menu Button */}
      <Button variant="primary" onClick={toggleMenu} className="mb-3">
        {" "}
        {/* Button to open/close the menu */}
        Menu
      </Button>
      {/* Dropdown Menu */}
      {isMenuOpen && ( // Conditional rendering: Menu will be shown if isMenuOpen is true
        <Dropdown.Menu show>
          {" "}
          {/* The menu will be visible when the state is true */}
          <Dropdown.Item onClick={() => navigate("/dashboard")}>
            {" "}
            {/* Navigates to the Dashboard */}
            Dashboard
          </Dropdown.Item>
          <Dropdown.Item onClick={() => navigate("/profile")}>
            {" "}
            {/* Navigates to the Profile page */}
            Profile
          </Dropdown.Item>
          <Dropdown.Item onClick={() => navigate("/friend-system")}>
            {" "}
            {/* Navigates to the Friends page */}
            Friends
          </Dropdown.Item>
          <Dropdown.Item onClick={() => navigate("/receipts")}>
            {" "}
            {/* Navigates to the Receipts page */}
            Receipts
          </Dropdown.Item>
          <Dropdown.Item onClick={() => navigate("/investment-questionnaire")}>
            {" "}
            {/* Navigates to the Investment Questionnaire page */}
            Investment Questionnaire
          </Dropdown.Item>
          <Dropdown.Item onClick={() => auth.signOut()}>
            {" "}
            {/* Placeholder for log out action */}
            Log Out
          </Dropdown.Item>
        </Dropdown.Menu>
      )}
      {showAlert && <Alert variant="success">Settings saved!</Alert>}
      <Card>
        <Card.Body>
          <Form.Group controlId="fontSize" className="mb-3">
            {" "}
            <Form.Label>Font Size</Form.Label>
            <Form.Control
              as="select" // Render a dropdown select
              value={fontSize} // Set the current font size value
              onChange={(e) => setFontSize(e.target.value)} // Update font size when user selects a new option
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>

              <option value="large">Large</option>
            </Form.Control>
          </Form.Group>
          {/* Theme Settings */}
          <Form.Group controlId="theme" className="mb-3">
            {" "}
            <Form.Label>Theme</Form.Label>
            <Form.Control
              as="select" // Render a dropdown select for theme
              value={theme} // Set the current theme value
              onChange={(e) => setTheme(e.target.value)} // Update the theme when user selects a new option
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </Form.Control>
          </Form.Group>
          {/* Save Settings Button */}
          <Button variant="success" onClick={saveSettings}>
            {"Save Settings"}
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Settings;
