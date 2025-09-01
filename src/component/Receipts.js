//Code written by William Kalabor
// Made use of Getting Started with Firebase 9 #4 - Firestore Setup & Fetching Data https://youtu.be/2yNyiW_41H8?si=pf77zDUQ_PfuCuiP
//Made use of Getting Started with Firebase 9 #5 - Adding & Deleting Documents https://youtu.be/s1frrNxq4js?si=hyJx6QPAY2gOC_6b
//Comments by Chatgpt, edited by William Kalabor
import React, { useState, useEffect } from "react"; // Import React and hooks (useState and useEffect) from React library
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook from react-router-dom for navigation functionality
import { auth, db } from "../firebase"; // Import the Firebase authentication (auth) and Firestore database (db) instances from the firebase config

import {
  //Written by chatgpt
  // Importing specific methods from Firebase Firestore
  doc, // Import the doc method to reference a specific document in Firestore
  getDocs, // Import the getDocs method to fetch all documents from a collection
  collection, // Import the collection method to reference a Firestore collection
  addDoc, // Import the addDoc method to add a new document to a collection
  deleteDoc, // Import the deleteDoc method to delete a specific document from Firestore
} from "firebase/firestore"; // Import from the Firebase Firestore module

import { Bar } from "react-chartjs-2"; // Import the Bar chart component from the react-chartjs-2 library

import {
  //Wriiten by chatgpt
  // Importing specific components from Chart.js
  Chart as ChartJS, // Import the main ChartJS object and alias it as ChartJS
  CategoryScale, // Import the category scale for the x-axis (useful for categorical data)
  LinearScale, // Import the linear scale for the y-axis (useful for numerical data)
  BarElement, // Import the bar chart element for rendering bars in a bar chart
  Title, // Import the Title component to add a title to the chart
  Tooltip, // Import the Tooltip component to show tooltips when hovering over chart elements
  Legend, // Import the Legend component to display a legend for chart series
} from "chart.js"; // Import from the Chart.js library
import { Button, Dropdown } from "react-bootstrap"; // Added Button and Dropdown import
import "./styles.css";

ChartJS.register(
  //Written by chatgpt
  // Registers the components used in the Chart.js chart
  CategoryScale, // Adds support for the category scale (x-axis for categorical data)
  LinearScale, // Adds support for the linear scale (y-axis for numerical data)
  BarElement, // Adds support for bar charts
  Title, // Adds the ability to display a title on the chart
  Tooltip, // Adds the ability to display tooltips when hovering over chart elements
  Legend // Adds the ability to display a legend for the chart
);

function Receipt() {
  // Function component to handle receipt management
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to control if the menu is open or closed
  const [receipts, setReceipts] = useState([]); // State to store all the receipts
  const [filteredReceipts, setFilteredReceipts] = useState([]); // State to store filtered receipts based on selected criteria
  const [amount, setAmount] = useState(""); // State to store the amount of the receipt
  const [date, setDate] = useState(""); // State to store the date of the receipt
  const [items, setItems] = useState(""); // State to store the items listed on the receipt
  const [theme, setTheme] = useState("light"); // State to manage the theme (light or dark)
  const [monthFilter, setMonthFilter] = useState("All"); // State to store the selected month filter for receipts
  const navigate = useNavigate(); // Hook for navigation to different routes

  const user = auth.currentUser; // Get the currently authenticated user
  const userId = user ? user.uid : null; // If user is authenticated, set userId to their UID, otherwise null

  // Function to calculate the average spending per category
  const calculateAverageSpendingPerCategory = () => {
    const categoryTotals = {};
    const categoryCounts = {};

    receipts.forEach((receipt) => {
      const { items, amount } = receipt;
      if (!categoryTotals[items]) {
        categoryTotals[items] = 0;
        categoryCounts[items] = 0;
      }
      categoryTotals[items] += amount;
      categoryCounts[items] += 1;
    });

    // Calculate averages
    const averageSpending = Object.keys(categoryTotals).map((category) => ({
      category,
      average: categoryTotals[category] / categoryCounts[category],
    }));

    return averageSpending;
  };

  // Call this function to get the data
  const averageSpending = calculateAverageSpendingPerCategory();
  useEffect(() => {
    // Effect hook to run when component mounts or when dependencies change
    const fetchReceipts = async () => {
      // Async function to fetch receipts from Firestore
      if (!userId) {
        // Check if userId exists (i.e., user is authenticated)
        console.log("User not authenticated"); // Log a message if the user is not authenticated
        return; // Exit the function if the user is not authenticated
      }

      try {
        // Start of try block for error handling
        const userRef = doc(db, "users", userId); // Get a reference to the user's document in Firestore
        const receiptsRef = collection(userRef, "receipts"); // Get a reference to the "receipts" collection within the user's document
        const querySnapshot = await getDocs(receiptsRef); // Fetch the documents in the "receipts" collection
        const allReceipts = []; // Initialize an empty array to store all the receipts

        querySnapshot.forEach((doc) => {
          // Iterate through each document in the query snapshot
          allReceipts.push({ id: doc.id, ...doc.data() }); // Push each receipt's data into the array, including the document ID
        });

        setReceipts(allReceipts); // Update the receipts state with the fetched data
        setFilteredReceipts(allReceipts); // Initially show all receipts in the filteredReceipts state
      } catch (error) {
        // Catch any errors during the data fetching process
        console.error("Error getting receipts:", error); // Log the error message to the console
      }
    };

    fetchReceipts(); // Call the fetchReceipts function to initiate fetching the receipts
  }, [userId]); // Dependency array for useEffect, re-runs the effect when userId changes

  const handleAddReceipt = async () => {
    // Function to handle adding a new receipt
    if (!userId) {
      // Check if userId is available (i.e., user is authenticated)
      console.log("User not authenticated"); // Log message if user is not authenticated
      return; // Exit function if user is not authenticated
    }

    const receiptData = { amount, date, items }; // Create an object containing the receipt data (amount, date, items)

    try {
      // Start of try block for error handling
      const userRef = doc(db, "users", userId); // Get a reference to the user's document in Firestore
      const receiptsRef = collection(userRef, "receipts"); // Get a reference to the "receipts" collection within the user's document
      const docRef = await addDoc(receiptsRef, receiptData); // Add the new receipt data to the Firestore collection and get a reference to the newly added document

      const updatedReceipts = [...receipts, { id: docRef.id, ...receiptData }]; // Create a new array of receipts, adding the newly added receipt with its Firestore ID
      setReceipts(updatedReceipts); // Update the receipts state with the new list (including the added receipt)
      setFilteredReceipts(updatedReceipts); // Update the filteredReceipts state with the new list (to reflect the added receipt)

      setAmount(""); // Clear the amount field after successfully adding the receipt
      setDate(""); // Clear the date field after successfully adding the receipt
      setItems(""); // Clear the items field after successfully adding the receipt
    } catch (error) {
      // Catch any errors during the adding process
      console.error("Error adding receipt:", error); // Log the error message to the console
    }
  };

  const handleDeleteReceipt = async (id) => {
    // Function to handle receipt deletion
    if (!userId) {
      // Check if userId is available (i.e., user is authenticated)
      console.log("User not authenticated"); // Log message if user is not authenticated
      return; // Exit function if user is not authenticated
    }

    //Try function written by Chatgpt
    try {
      // Start of try block for error handling
      const userRef = doc(db, "users", userId); // Get a reference to the user's document in Firestore
      const receiptRef = doc(userRef, "receipts", id); // Get a reference to the specific receipt document
      await deleteDoc(receiptRef); // Delete the receipt document from Firestore

      const updatedReceipts = receipts.filter((receipt) => receipt.id !== id); // Remove the deleted receipt from the receipts array
      setReceipts(updatedReceipts); // Update the receipts state with the new list (without the deleted receipt)
      setFilteredReceipts(updatedReceipts); // Update the filteredReceipts state with the new list (if any filtering is applied)

      // Add feedback to the user (optional)
      alert("Receipt deleted successfully"); // Show an alert to the user confirming receipt deletion
    } catch (error) {
      // Catch any errors during the deletion process
      console.error("Error deleting receipt:", error); // Log the error message to the console
      alert("Error deleting receipt. Please try again."); // Show an alert to the user if there was an error
    }
  };

  // Function to handle user logout
  const logOut = () => {
    // Call the signOut method from the auth service
    auth
      .signOut()
      .then(() => {
        // Redirect the user to the homepage after successful logout
        navigate("/");
      })
      .catch((error) => {
        // Log an error message if signing out fails
        console.error("Error signing out: ", error);
      });
  };

  // Function to filter receipts based on the selected month and optionally aggregate them by category
  const filterReceipts = (month) => {
    // Start with the complete receipts list
    let filtered = receipts;

    // If the selected month is not "All," filter receipts to include only those from the selected month
    if (month !== "All") {
      filtered = receipts.filter((receipt) => {
        // Extract the month from the receipt date (adding 1 because `getMonth()` returns a zero-based index)
        const receiptMonth = new Date(receipt.date).getMonth() + 1;
        // Compare the extracted month with the selected month (converted to a number) and return matching receipts
        return receiptMonth === parseInt(month);
      });
    }

    // If "All" is selected, aggregate receipts by category
    if (month === "All") {
      // Reduce the filtered receipts array into an object where each category (item) is a key
      const aggregated = filtered.reduce((acc, receipt) => {
        const { items, amount } = receipt; // Destructure `items` (category) and `amount` from each receipt
        // If the category is not already in the accumulator, initialize its total amount to 0
        if (!acc[items]) {
          acc[items] = 0;
        }
        // Add the amount for the current receipt to the total for the category
        acc[items] += parseFloat(amount);
        return acc; // Return the updated accumulator object
      }, {}); // Initialize the accumulator as an empty object

      // Convert the aggregated object into an array of receipt objects with `items` and `amount`
      const aggregatedReceipts = Object.keys(aggregated).map((key) => ({
        items: key, // The category name
        amount: aggregated[key], // The total amount for this category
      }));

      // Update the state with the aggregated receipts array
      setFilteredReceipts(aggregatedReceipts);
    } else {
      // If a specific month is selected, update the state with the filtered receipts (no aggregation)
      setFilteredReceipts(filtered);
    }
  };

  // Function to handle changes to the month filter dropdown
  const handleMonthChange = (event) => {
    // Update the state with the newly selected month
    setMonthFilter(event.target.value);
    // Call the filterReceipts function with the selected month to update the displayed receipts
    filterReceipts(event.target.value);
  };

  // Calculate the total sum of amounts in the filtered receipts
  const totalAmount = filteredReceipts.reduce((total, receipt) => {
    // Add the amount of the current receipt (converted to a float) to the running total
    return total + parseFloat(receipt.amount);
  }, 0); // Initialize the total to 0

  // Prepare the data structure for a chart visualization
  const chartData = {
    // Generate the labels for the chart using the `items` field from each receipt in the filtered list
    labels: filteredReceipts.map((receipt) => receipt.items),
    // Define the datasets for the chart
    datasets: [
      {
        // Label for the dataset, used in the chart legend
        label: "Amount (€)",
        // Extract the `amount` values from the filtered receipts to use as the chart data points
        data: filteredReceipts.map((receipt) => receipt.amount),
        // Set the background color of the bars/points in the chart with some transparency
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        // Set the border color of the bars/points in the chart
        borderColor: "rgba(75, 192, 192, 1)",
        // Define the width of the border around the bars/points
        borderWidth: 4,
      },
    ],
  };

  //ChartOptions written by ChatGpt and eddited by William Kalabor
  // Define the configuration options for the chart
  const chartOptions = {
    // Enable responsiveness so the chart adjusts dynamically to its container size
    responsive: true,
    // Configure plugins for the chart (like the title and legend)
    plugins: {
      // Settings for the chart title
      title: {
        // Enable the display of the chart title
        display: true,
        // Set the text of the chart title
        text: "Receipts Overview",
      },
      // Settings for the chart legend
      legend: {
        // Position the legend at the top of the chart
        position: "top",
      },
    },
    // Configure the chart axes and their styling
    scales: {
      // Settings for the x-axis
      x: {
        // Configure the grid lines for the x-axis
        grid: {
          // Enable grid line display for the x-axis
          display: true,
          // Add border width for the x-axis
          drawBorder: true, // Ensure the border is drawn
          borderWidth: 2, // Adjust thickness as desired
          // Set the border color with transparency
          borderColor:
            theme === "dark"
              ? "rgba(255, 255, 255, 0.5)"
              : "rgba(0, 0, 0, 0.5)",
        },
        // Configure the tick marks on the x-axis
        ticks: {
          // Set the color of the tick labels based on the theme (dark or light)
          color: theme === "dark" ? "#0056b3" : "#0056b3",
        },
      },
      // Settings for the y-axis
      y: {
        // Configure the grid lines for the y-axis
        grid: {
          // Disable grid line display for the y-axis
          display: false,
          // Add border width for the y-axis
          drawBorder: true, // Ensure the border is drawn
          borderWidth: 2, // Adjust thickness as desired
          // Set the border color with transparency
          borderColor:
            theme === "dark"
              ? "rgba(255, 255, 255, 0.5)"
              : "rgba(0, 0, 0, 0.5)",
        },
        // Configure the tick marks on the y-axis
        ticks: {
          // Set the color of the tick labels based on the theme (dark or light)
          color: theme === "dark" ? "#0056b3" : "#0056b3",
        },
      },
    },
  };

  return (
    // Main container for the page with margin at the top
    <div className="container mt-4">
      {/* Heading for the Receipts section with margin at the bottom */}
      <h1 className="mb-4">Receipts</h1>
      {/* Button to toggle the menu visibility */}
      <Button
        variant="primary" // Set the button style to primary (blue button)
        onClick={() => setIsMenuOpen(!isMenuOpen)} // Toggle the value of `isMenuOpen` state when clicked
        className="mb-3" // Add margin-bottom to the button for spacing
      >
        Menu
      </Button>
      {/* Menu */}
      {isMenuOpen && (
        <Dropdown.Menu show>
          <Dropdown.Item onClick={() => navigate("/dashboard")}>
            Dashboard
          </Dropdown.Item>
          <Dropdown.Item onClick={() => navigate("/profile")}>
            Profile
          </Dropdown.Item>
          <Dropdown.Item onClick={() => navigate("/friend-system")}>
            Friends
          </Dropdown.Item>
          <Dropdown.Item onClick={() => navigate("/investment-questionnaire")}>
            Investment Questionnaire
          </Dropdown.Item>
          <Dropdown.Item onClick={() => navigate("/settings")}>
            Settings
          </Dropdown.Item>
          <Dropdown.Item onClick={logOut}>Log Out</Dropdown.Item>
        </Dropdown.Menu>
      )}
      {/* Bar Chart */}
      <div className="chart-container">
        {/* Render the Bar chart component with the data and options passed as props */}
        <Bar data={chartData} options={chartOptions} />
      </div>
      <div className="add-receipt-form" style={{ marginBottom: "30px" }}>
        {/* Heading for the form */}
        <h2>Add New Receipt</h2>

        {/* Row for the form input fields */}
        <div className="form-row">
          {/* Label for the date input field */}
          <label>
            Date:
            {/* Date input field */}
            <input
              type="date" // Set input type to "date"
              value={date} // Bind the value of the input to the `date` state variable
              onChange={(e) => setDate(e.target.value)} // Update the `date` state when the input value changes
            />
          </label>
          <label>
            {/* Label for the item dropdown menu */}
            Item:
            {/* Dropdown menu for selecting an item category */}
            <select value={items} onChange={(e) => setItems(e.target.value)}>
              <option value="Filter">Filter</option>
              <option value="Other">Other</option>
              <option value="Transport">Transport</option>
              <option value="Rent/Mortgage">Rent/Mortgage</option>
              <option value="Utilities">Utilities</option>
              <option value="Shopping">Shopping</option>
              <option value="Food">Food</option>
              <option value="Leisure">Leisure</option>
            </select>
          </label>
          <label>
            {/* Label for the amount input field */}
            Amount:
            {/* Input field for entering the amount */}
            <input
              type="number" // Set the input type to "number" to allow numeric input only
              value={amount} // Bind the value of the input to the `amount` state variable
              onChange={(e) => {
                // Ensure the amount is not below zero
                const newAmount = Math.max(0, e.target.value); // Prevent negative values by taking the maximum of 0 and the entered value
                setAmount(newAmount); // Update the `amount` state with the new valid value
              }}
              placeholder="Enter amount" // Display a placeholder text when the input is empty
              min="0" // Ensure the input field can't go below 0 (this restricts the browser UI to allow only positive numbers)
            />
          </label>
        </div>

        <div className="add-receipt-button-container">
          <button onClick={handleAddReceipt} className="settings-button">
            Add Receipt
          </button>
        </div>
      </div>{" "}
      {/* This closes the add-receipt-form div */}
      {/* Month Filter */}
      <label>
        Filter by Month:
        <select
          value={monthFilter}
          onChange={handleMonthChange}
          className="month-filter"
        >
          <option value="Filter">Filter</option>
          <option value="All">All</option>
          <option value="1">January</option>
          <option value="2">February</option>
          <option value="3">March</option>
          <option value="4">April</option>
          <option value="5">May</option>
          <option value="6">June</option>
          <option value="7">July</option>
          <option value="8">August</option>
          <option value="9">September</option>
          <option value="10">October</option>
          <option value="11">November</option>
          <option value="12">December</option>
        </select>
      </label>
      {/* Table to display receipts */}
      <table className="receipts-table">
        {/* Table header row */}
        <thead>
          <tr>
            {/* Conditionally render the "Date" column if monthFilter is not "All" */}
            {monthFilter !== "All" && <th>Date</th>}
            {/* Static "Item" column */}
            <th>Item</th>
            {/* Static "Amount" column */}
            <th>Amount (€)</th>
            {/* Static "Actions" column for buttons or links */}
            <th>Actions</th>
          </tr>
        </thead>

        {/* Table body */}
        <tbody>
          {/* Check if there are any filtered receipts to display */}
          {filteredReceipts.length > 0 ? (
            // Loop through each filtered receipt and render a row
            filteredReceipts.map((receipt) => (
              <tr key={receipt.id}>
                {/* Conditionally render the "Date" cell if monthFilter is not "All" */}
                {monthFilter !== "All" && <td>{receipt.date}</td>}
                {/* Render the item/category name for the current receipt */}
                <td>{receipt.items}</td>
                <td>
                  {/* Format the receipt amount as a currency (EUR) using Intl.NumberFormat */}
                  {new Intl.NumberFormat("en-IE", {
                    style: "currency", // Display the number as currency
                    currency: "EUR", // Use EUR as the currency
                  }).format(receipt.amount)}{" "}
                  {/* Display the formatted amount */}
                </td>

                <td>
                  <button
                    onClick={() => handleDeleteReceipt(receipt.id)} // Call the handleDeleteReceipt function with the receipt id when clicked
                    className="delete-button"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              {/* Table cell that spans 4 columns */}
              <td colSpan={4} style={{ textAlign: "center", color: "white" }}>
                {/* Message displayed when there are no receipts */}
                No receipts available.
              </td>
            </tr>
          )}
          {/* Total Row */}
          {filteredReceipts.length > 0 && ( // Only display the total row if there are filtered receipts
            <tr>
              {/* Cell for the "Total:" label, spans two columns */}
              <td colSpan={1} style={{ textAlign: "right" }}>
                <strong>Total:</strong>{" "}
                {/* Display the "Total" label in bold */}
              </td>

              {/* Cell to display the total amount */}
              <td>
                {/* Format the totalAmount as a currency (EUR) using Intl.NumberFormat */}
                {new Intl.NumberFormat("en-IE", {
                  style: "currency", // Display the number as currency
                  currency: "EUR", // Use EUR as the currency
                }).format(totalAmount)}{" "}
                {/* Display the formatted totalAmount */}
              </td>
              <td></td>
            </tr>
          )}
        </tbody>
      </table>
      {/* Trends Section */}
      <section className="trends-section">
        {/* Heading for the Trends Section */}
        <h2>Trends</h2>

        {/* Container for the Trends Content */}
        <div className="trends-content">
          {/* Description for the Trends Content */}
          <p>Average Spending Per Category:</p>

          {/* Box to Contain the Trends List */}
          <div className="trends-box">
            {/* Unordered List to Display the Trend Items */}
            <ul>
              {/* Check if there is any average spending data */}
              {averageSpending.length > 0 ? (
                // If there is data, loop through it and display each category with its average
                averageSpending.map((data, index) => (
                  <li key={index}>
                    {/* Display the category name in bold */}
                    <strong>{data.category}:</strong>
                    {/* Display the average spending for the category, formatted to 2 decimal places */}
                    €{data.average.toFixed(2)}
                  </li>
                ))
              ) : (
                // If no data is available, display a fallback message
                <li>No spending data available</li>
              )}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Receipt;
