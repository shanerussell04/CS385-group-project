//https://recharts.org/en-US
//This is where i found how to make charts in codesandbox
//Code written by Shane Russell
//Comments written by chatgpt

import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";

export default function App() {
  // Data for the chart: This array contains the savings data for each month
  const data = [
    { month: "Oct", savings: 3970 },
    { month: "Nov", savings: 5750 },
    { month: "Dec", savings: 7700 },
    { month: "Jan", savings: 800 },
  ];

  return (
    // Styling the container div to center the chart and provide some padding at the top
    <div style={{ width: "100%", margin: "auto", paddingTop: "50px" }}>
      {/* Title of the chart */}
      <h2 style={{ textAlign: "center" }}>Savings History Chart</h2>
      {/* LineChart component to render the chart, receiving data and width/height settings */}
      <LineChart width={600} height={300} data={data}>
        {/* CartesianGrid adds a grid to the background of the chart */}
        <CartesianGrid strokeDasharray="3 3" />
        {/* XAxis component to render the X-axis, using 'month' as the key for labels */}
        <XAxis dataKey="month" />
        {/* YAxis component to render the Y-axis, automatically scaling to the data */}
        <YAxis />
        {/* Line component to render the savings line, with the 'savings' data being plotted on the Y-axis */}
        <Line dataKey="savings" fill="#8884d8" />
      </LineChart>
    </div>
  );
}