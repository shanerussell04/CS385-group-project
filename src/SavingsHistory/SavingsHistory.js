//The items in the json file was made by chatgpt by asking it to generate all of the different dates, amounts, etc
//Code written by Shane Russell
//Comments written by chatgpt
import { useEffect, useState } from "react";
import Graph from "./Graph";

// SavingsHistory component to display the savings history of a selected person
function SavingsHistory({ selectedPerson, onBackButtonClick }) {
  return (
    <div>
      <h3 style={{ fontSize: "35px", textAlign: "center" }}>Savings History</h3>
      <table border="2">
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Transaction Date</th>
            <th>Amount</th>
            <th>Total Amount €</th>
          </tr>
        </thead>
        <tbody>
          {/* Display each transaction history for the selected person */}
          {selectedPerson.savingsHistory.map((transaction, i) => (
            <tr key={i}>
              <td>
                <b>{transaction.id}</b>
              </td>
              <td>
                <i>{transaction.date}</i>
              </td>
              <td>{transaction.amount}</td>
              <td>{transaction.updated}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={onBackButtonClick}>Back to Data</button>
      {/* Button to navigate back to the main data view */}
    </div>
  );
}

// Main App component to manage data display and transactions
export default function App() {
  const [error, setError] = useState(null); // State to store error messages
  const [data, setData] = useState([]); // State to store fetched transaction data
  const [isLoading, setIsLoading] = useState(false); // State to track loading state
  const [showRow, setShowRow] = useState(false); // State to control the display of the input row
  const [graph, setGraph] = useState(false); // State to switch between table and graph view
  const [transaction, setTransaction] = useState({ amount: "" }); // State to store new transaction data
  const [selectedPerson, setSelectedPerson] = useState(null); // State to store the selected person for savings history

  const url =
    "https://raw.githubusercontent.com/shanerussell04/transactions/refs/heads/main/transaction_data.json"; // URL to fetch transaction data

  // Function to fetch transaction data from the API
  async function fetchData() {
    try {
      setIsLoading(true); // Set loading state to true before fetching
      const response = await fetch(url); // Fetch data from the URL
      const json = await response.json(); // Parse the JSON response
      setData(json); // Update the state with the fetched data
    } catch (errorMessage) {
      setError(errorMessage); // Store any errors that occur during fetching
      console.log(errorMessage);
    } finally {
      setIsLoading(false); // Set loading state to false once fetching is done
    }
  }

  // useEffect hook to call fetchData when the component mounts
  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array ensures it runs only once when the component mounts

  const LogSavings = () => {
    setShowRow(true); // Show the input row for adding a new transaction
  };

  const Back = () => {
    setShowRow(false); // Hide the input row when returning to previous view
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTransaction((prev) => ({
      ...prev,
      [name]: value, // Update the transaction state when inputs change
    }));
  };

  const addData = () => {
    if (transaction.amount) {
      const lastTransaction = data[data.length - 1] || {}; // Get the last transaction, if any
      const newId = lastTransaction.id ? parseInt(lastTransaction.id) + 1 : 1; // Generate a new transaction ID
      const newTotal =
        (lastTransaction.updated ? parseFloat(lastTransaction.updated) : 0) +
        parseFloat(transaction.amount); // Calculate the new total amount

      const lastDate = lastTransaction.date
        ? new Date(lastTransaction.date)
        : new Date(); // Use the last transaction's date or today's date
      const incrementedDate = new Date(lastDate);
      incrementedDate.setDate(lastDate.getDate() + 1); // Increment the date by one day
      const formattedDate = incrementedDate.toISOString().split("T")[0]; // Format the new date

      // Create the new transaction object
      const newTransaction = {
        id: newId.toString(),
        date: formattedDate,
        amount: transaction.amount,
        updated: newTotal.toString(),
      };

      setData((prev) => [...prev, newTransaction]); // Add the new transaction to the data
      setTransaction({ amount: "" }); // Clear the transaction input field
    }
  };

  const handleBackButtonClick = () => {
    setSelectedPerson(null); // Reset the selected person when going back to the main data view
  };

  // Function to handle person selection and show savings history
  const handlePersonSelect = (person) => {
    setSelectedPerson(person); // Set the selected person to view their savings history
  };

  // Conditional rendering based on loading state, error, and selected person
  if (isLoading) {
    return <h3> Loading... Please wait </h3>;
  } else if (error) {
    return <h3> Error occurred: {error.toString()} </h3>;
  } else {
    return (
      <div
        style={{ display: "flex", flexDirection: "column", textAlign: "left" }}
      >
        {/* If no person is selected, show the main data view */}
        {!selectedPerson ? (
          <>
            {/* Display data in either table or graph view based on the graph state */}
            {!graph ? (
              <DisplayData
                APIData={data}
                showRow={showRow}
                transaction={transaction}
                onInputChange={handleChange}
                onAddTransaction={addData}
                onPersonSelect={handlePersonSelect} // Pass the handler to select a person
              />
            ) : (
              <Graph /> // Show the graph if graph state is true
            )}

            {/* Button to log savings or go back */}
            {!showRow && (
              <button style={{ padding: "8px 16px" }} onClick={LogSavings}>
                Log Savings
              </button>
            )}

            {showRow && (
              <button style={{ padding: "8px 16px" }} onClick={Back}>
                Back
              </button>
            )}
          </>
        ) : (
          // Show savings history for the selected person
          <SavingsHistory
            selectedPerson={selectedPerson}
            onBackButtonClick={handleBackButtonClick}
          />
        )}

        {/* Button to toggle between graph and table view */}
        {showRow && (
          <button
            style={{ padding: "8px 16px" }}
            onClick={() => setGraph((prev) => !prev)}
          >
            {graph ? "Show Savings in Table" : "Show Savings in Graph"}
          </button>
        )}
      </div>
    );
  }
}

// Component to display transaction data in a table
function DisplayData(props) {
  let filteredArray = props.APIData; // Store the data to be displayed

  return (
    <>
      <h3 style={{ fontSize: "35px", textAlign: "center" }}>Savings History</h3>
      <table border="2">
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Transaction Date</th>
            <th>Amount</th>
            <th>Total Amount €</th>
          </tr>
        </thead>
        <tbody>
          {/* Display each transaction row */}
          {filteredArray.map((transaction, i) => (
            <tr key={i} onClick={() => props.onPersonSelect(transaction)}>
              <td>
                <b>{transaction.id}</b>
              </td>
              <td>
                <i>{transaction.date}</i>
              </td>
              <td>{transaction.amount}</td>
              <td>{transaction.updated}</td>
            </tr>
          ))}
          {/* Show row for input when logging a new transaction */}
          {props.showRow && (
            <tr>
              <td>ID</td>
              <td>Date</td>
              <td>
                <input
                  type="text"
                  placeholder="Amount"
                  name="amount"
                  value={props.transaction.amount}
                  onChange={props.onInputChange} // Handle input change
                  style={{ fontWeight: "bold" }}
                />
              </td>
              <td>Total Amount</td>
              <td>
                <button onClick={props.onAddTransaction}>Enter</button>{" "}
                {/* Add new transaction */}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}
