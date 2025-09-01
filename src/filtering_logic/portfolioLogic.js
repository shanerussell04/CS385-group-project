// Function to calculate portfolio recommendation based on answers
const getPortfolioRecommendation = (answers) => {
  // Destructure answers to get individual question responses
  const {
    question1, // Risk level (Low Risk, Medium Risk, High Risk)
    question2, // Risk tolerance (Minimal Loss, Moderate Loss, Significant Loss)
    question3, // Investment horizon (Short-Term, Medium-Term, Long-Term)
    question4, // Comfort with short-term losses (Very Uncomfortable, Somewhat Uncomfortable, Comfortable)
    question5, // Lifestyle impact of losses (Significantly, Moderately, Slightly)
    question6, // Investment management frequency (Daily, Weekly, Rarely)
    question7, // Comfort with losing money for higher returns (Not Comfortable, Somewhat Comfortable, Very Comfortable)
    question8, // Comfort with diversification (Uncomfortable, Neutral, Comfortable)
    question9, // Stock market reaction (Sell Everything, Hold for a while, Buy More)
    question10, // Age group (Under 25, 25-35, 36-50, 50+)
  } = answers;

  // Initialize portfolio allocations (in percentage)
  let sp500 = 0; // S&P 500 (equity)
  let top5Stocks = 0; // Top 5 stocks (equity)
  let gold = 0; // Gold (safe haven asset)
  let tBill = 0; // Treasury bills (safe asset)
  let cash = 0; // Cash (liquid, low-risk)

  // Adjust portfolio based on risk level (question1)
  if (question1 === "Low Risk") {
    sp500 = 20;
    top5Stocks = 10;
    gold = 25;
    tBill = 30;
    cash = 15;
  } else if (question1 === "Medium Risk") {
    sp500 = 40;
    top5Stocks = 25;
    gold = 15;
    tBill = 10;
    cash = 10;
  } else if (question1 === "High Risk") {
    sp500 = 50;
    top5Stocks = 35;
    gold = 5;
    tBill = 5;
    cash = 5;
  }

  // Adjust portfolio based on risk tolerance (question2)
  if (question2 === "Minimal Loss") {
    sp500 -= 10;
    top5Stocks -= 5;
    tBill += 15;
    cash += 10;
  } else if (question2 === "Moderate Loss") {
    sp500 += 5;
    top5Stocks += 5;
  } else if (question2 === "Significant Loss") {
    sp500 += 10;
    top5Stocks += 10;
  }

  // Adjust portfolio based on investment horizon (question3)
  if (question3 === "Short-Term") {
    sp500 -= 10;
    top5Stocks -= 5;
    gold += 10;
    tBill += 15;
    cash += 10;
  } else if (question3 === "Medium-Term") {
    sp500 += 5;
    top5Stocks += 5;
    gold += 5;
    tBill += 5;
    cash += 5;
  } else if (question3 === "Long-Term") {
    sp500 += 15;
    top5Stocks += 10;
    gold -= 5;
    tBill -= 5;
    cash -= 5;
  }

  // Adjust based on discomfort with short-term losses (question4)
  if (question4 === "Very Uncomfortable") {
    tBill += 10;
    cash += 5;
  } else if (question4 === "Somewhat Uncomfortable") {
    tBill += 5;
    cash += 5;
  } else if (question4 === "Comfortable") {
    sp500 += 5;
    top5Stocks += 5;
  }

  // Adjust based on lifestyle impact of losses (question5)
  if (question5 === "Significantly") {
    tBill += 10;
    cash += 5;
  } else if (question5 === "Moderately") {
    tBill += 5;
    cash += 5;
  } else if (question5 === "Slightly") {
    sp500 += 5;
    top5Stocks += 5;
  }

  // Adjust based on investment management frequency (question6)
  if (question6 === "Daily" || question6 === "Weekly") {
    top5Stocks += 5;
    sp500 += 5;
  } else if (question6 === "Rarely") {
    sp500 += 5;
    tBill += 10;
    cash += 5;
  }

  // Adjust based on comfort with losing money for higher returns (question7)
  if (question7 === "Not Comfortable") {
    sp500 -= 10;
    top5Stocks -= 5;
  } else if (question7 === "Somewhat Comfortable") {
    sp500 += 5;
    top5Stocks += 5;
  } else if (question7 === "Very Comfortable") {
    sp500 += 10;
    top5Stocks += 10;
  }

  // Adjust based on diversification comfort (question8)
  if (question8 === "Uncomfortable") {
    gold += 10;
    tBill += 10;
  } else if (question8 === "Neutral") {
    sp500 += 5;
    top5Stocks += 5;
  } else if (question8 === "Comfortable") {
    sp500 += 10;
    top5Stocks += 10;
  }

  // Adjust based on stock market reaction (question9)
  if (question9 === "Sell Everything") {
    tBill += 15;
    cash += 10;
  } else if (question9 === "Hold for a while") {
    sp500 += 5;
    top5Stocks += 5;
  } else if (question9 === "Buy More") {
    sp500 += 10;
    top5Stocks += 10;
  }

  // Adjust based on age group (question10)
  if (question10 === "Under 25") {
    sp500 += 20;
    top5Stocks += 15;
  } else if (question10 === "25-35") {
    sp500 += 15;
    top5Stocks += 10;
  } else if (question10 === "36-50") {
    sp500 += 10;
    top5Stocks += 5;
  } else if (question10 === "50+") {
    gold += 10;
    tBill += 15;
  }

  // Prevent negative values for T-Bills and Cash, as they shouldn't be shorted
  tBill = Math.max(tBill, 0); // Ensure T-Bill percentage is not negative
  cash = Math.max(cash, 0); // Ensure Cash percentage is not negative

  // Calculate total allocation across all assets
  const total = sp500 + top5Stocks + gold + tBill + cash;

  // Convert asset allocations to percentages and round to two decimal places
  sp500 = ((sp500 / total) * 100).toFixed(2);
  top5Stocks = ((top5Stocks / total) * 100).toFixed(2);
  gold = ((gold / total) * 100).toFixed(2);
  tBill = ((tBill / total) * 100).toFixed(2);
  cash = ((cash / total) * 100).toFixed(2);

  // Return the final portfolio recommendation object with percentages
  return {
    sp500: parseFloat(sp500), // Convert back to float after rounding
    top5Stocks: parseFloat(top5Stocks),
    gold: parseFloat(gold),
    tBill: parseFloat(tBill),
    cash: parseFloat(cash),
  };
};

export default getPortfolioRecommendation;
