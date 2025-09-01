//ChatGPT was used to help autofill parts of the savings history table and helped me increment the date by 1 when adding savings
//Comments written by chatgpt
//This code is written by Shane Russell and William Kalabor
import React, { useState, useEffect } from "react";
import saving_Data from "./saving_Data"; // Import the static data (saving_Data)
import SavingsHistory from "../SavingsHistory/SavingsHistory"; // Import the SavingsHistory component to view a person's savings history
import { auth, db, getUserPortfolio, getFriendsData } from "../firebase"; // Import Firebase services for auth, data fetching, etc.
import { onAuthStateChanged } from "firebase/auth"; // Import Firebase Auth state listener to track user sign-in status

const FilterLogic = () => {
  const [user, setUser] = useState(null); // State to store the current user
  const [userData, setUserData] = useState(null); // State to store the current user's data
  const [friendsData, setFriendsData] = useState([]); // State to store the list of friends' data
  const [data, setData] = useState(saving_Data); // State to store the combined data (user data + friends data)
  const [selectedSort1, setSelectedSort1] = useState(""); // State to store the first selected sort criterion
  const [selectedOrder1, setSelectedOrder1] = useState("asc"); // State to store the order (ascending or descending) for the first sort
  const [selectedSort2, setSelectedSort2] = useState(""); // State to store the second selected sort criterion
  const [selectedOrder2, setSelectedOrder2] = useState("asc"); // State to store the order (ascending or descending) for the second sort
  const [search, setSearch] = useState(""); // State to store the search term for filtering by name
  const [selectedPerson, setSelectedPerson] = useState(null); // State to track the selected person's savings history
  const [viewData, setViewData] = useState(true); // State to toggle between viewing data table or selected person's savings history

  useEffect(() => {
    // Listen for changes in the authentication state (whether user is logged in)
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser); // Set user when authenticated
        const userData = await getUserPortfolio(currentUser.uid); // Fetch user data from Firebase
        setUserData(userData); // Set the user's data in state

        const friendsEmails = userData?.friends || []; // Get friends' emails from user's data
        if (friendsEmails.length > 0) {
          const fetchedFriendsData = await getFriendsData(friendsEmails); // Fetch data for each friend
          setFriendsData(fetchedFriendsData); // Set the fetched friends data
        }
      } else {
        setUser(null); // Reset user if not authenticated
      }
    });

    return () => unsubscribe(); // Cleanup listener when component unmounts
  }, []);

  useEffect(() => {
    applyBothFilters(); // Reapply filters when search term, user data, or friends data changes
  }, [search, friendsData, userData]); // Dependencies for re-running the filter logic

  // Handlers for sorting selections
  const handleSortChange1 = (event) => {
    setSelectedSort1(event.target.value); // Update first sort criterion
  };

  const handleOrderChange1 = (event) => {
    setSelectedOrder1(event.target.value); // Update order for first sort criterion
  };

  const handleSortChange2 = (event) => {
    setSelectedSort2(event.target.value); // Update second sort criterion
  };

  const handleOrderChange2 = (event) => {
    setSelectedOrder2(event.target.value); // Update order for second sort criterion
  };

  const handleChange = (e) => {
    setSearch(e.target.value); // Update search term as user types
  };

  const clearSearch = () => {
    setSearch(""); // Clear the search term
  };

  const handleNameClick = (person) => {
    setSelectedPerson(person); // Set the selected person to view their savings history
    setViewData(false); // Switch to selected person's savings history view
  };

  const handleBackButtonClick = () => {
    setSelectedPerson(null); // Reset the selected person
    setViewData(true); // Switch back to the data table view
  };
  // Function to apply both search and sort filters
  const applyBothFilters = () => {
    let filteredData = [...saving_Data, ...friendsData]; // Combine static saving data with friends' data

    // Filter data based on search term (case insensitive)
    filteredData = filteredData.filter(
      (item) => item.name.toLowerCase().includes(search.toLowerCase()) // Filter items whose names include the search term
    );
    {
      /* Code Below written by William Kalabor*/
    }
    // Apply first sorting criterion
    if (selectedSort1) {
      filteredData.sort((a, b) => {
        const firstOrder = selectedOrder1 === "asc" ? 1 : -1; // Determine sorting order (ascending or descending)
        if (typeof a[selectedSort1] === "number") {
          return firstOrder * (a[selectedSort1] - b[selectedSort1]); // Numeric sorting
        }
        return firstOrder * a[selectedSort1].localeCompare(b[selectedSort1]); // Lexicographical sorting
      });
    }

    // Apply second sorting criterion
    if (selectedSort2) {
      filteredData.sort((a, b) => {
        const firstOrder = selectedOrder2 === "asc" ? 1 : -1; // Determine sorting order (ascending or descending)
        if (typeof a[selectedSort2] === "number") {
          return firstOrder * (a[selectedSort2] - b[selectedSort2]); // Numeric sorting
        }
        return firstOrder * a[selectedSort2].localeCompare(b[selectedSort2]); // Lexicographical sorting
      });
    }

    // Update the data state with the filtered and sorted data
    setData(filteredData); // Set the filtered and sorted data to state
  };

  return (
    <div>
      <h2>Data Table with Sorting</h2> {/* Title for the data table */}
      <div>
        <input
          type="text"
          placeholder="Search by name" // Placeholder text for the search input
          value={search} // Value of the search input field
          onChange={handleChange} // Update search term on input change
        />
        <button onClick={clearSearch}>Clear Search</button>{" "}
        {/* Button to clear the search term */}
      </div>
      {/* Sorting dropdowns */}
      <label>
        Choose the first sort criterion:
        <select value={selectedSort1} onChange={handleSortChange1}>
          {" "}
          {/* Dropdown for the first sorting criterion */}
          <option value="">Select Sort Criterion</option>
          <option value="age">Age</option>
          <option value="income">Income</option>
          <option value="county">County</option>
          <option value="town">Town</option>
          <option value="employmentStatus">Employment Status</option>
          <option value="savings">Savings</option>
        </select>
      </label>
      <label>
        Sort Order:
        <select value={selectedOrder1} onChange={handleOrderChange1}>
          {" "}
          {/* Dropdown for the first sort order */}
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </label>
      <label>
        Choose the second sort criterion:
        <select value={selectedSort2} onChange={handleSortChange2}>
          {" "}
          {/* Dropdown for the second sorting criterion */}
          <option value="">Select Sort Criterion</option>
          <option value="age">Age</option>
          <option value="income">Income</option>
          <option value="county">County</option>
          <option value="town">Town</option>
          <option value="employmentStatus">Employment Status</option>
          <option value="savings">Savings</option>
        </select>
      </label>
      <label>
        Sort Order:
        <select value={selectedOrder2} onChange={handleOrderChange2}>
          {" "}
          {/* Dropdown for the second sort order */}
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </label>
      <button onClick={applyBothFilters}>Apply Both Filters</button>{" "}
      {/* Button to apply both search and sorting filters */}
      {/* Back to data button */}
      {viewData === false && (
        <button onClick={handleBackButtonClick}>Back to Data</button>
      )}
      {/* Code above written by William Kalabor*/}
      {viewData ? (
        <div>
          {/* My Data Section */}
          <h1>My Data</h1>
          <table className="receipts-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Income</th>
                <th>County</th>
                <th>Town</th>
                <th>Employment Status</th>
                <th>Savings</th>
              </tr>
            </thead>
            <tbody>
              {userData ? (
                <tr>
                  <td>
                    <button
                      style={{
                        background: "none",
                        border: "none",
                        color: "blue",
                        textDecoration: "underline",
                        cursor: "pointer",
                      }}
                      onClick={() => handleNameClick(userData)}
                    >
                      {userData.name}
                    </button>
                  </td>
                  <td>{userData.age}</td>
                  <td>{userData.income}</td>
                  <td>{userData.county}</td>
                  <td>{userData.town}</td>
                  <td>{userData.employmentStatus}</td>
                  <td>{userData.savings}</td>
                </tr>
              ) : (
                <tr>
                  <td colSpan="7">No data available.</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Friends' Data Section */}
          <h1>Friends' Data</h1>
          <table className="receipts-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Income</th>
                <th>County</th>
                <th>Town</th>
                <th>Employment Status</th>
                <th>Savings</th>
              </tr>
            </thead>
            <tbody>
              {data.filter((item) => item.name !== "Me").length > 0 ? (
                data
                  .filter((item) => item.name !== "Me")
                  .map((item, index) => (
                    <tr key={index}>
                      <td>
                        <button
                          style={{
                            background: "none",
                            border: "none",
                            color: "blue",
                            textDecoration: "underline",
                            cursor: "pointer",
                          }}
                          onClick={() => handleNameClick(item)}
                        >
                          {item.name}
                        </button>
                      </td>
                      <td>{item.age}</td>
                      <td>{item.income}</td>
                      <td>{item.county}</td>
                      <td>{item.town}</td>
                      <td>{item.employmentStatus}</td>
                      <td>{item.savings}</td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan="7">No friends' data available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div>
          <SavingsHistory
            selectedPerson={selectedPerson}
            onBackButtonClick={handleBackButtonClick}
          />
        </div>
      )}
    </div>
  );
};

export default FilterLogic;
