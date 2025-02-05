import React from "react";

const Dashboard: React.FC = () => {
  return (
    <div>
      <h1>User activity at a glance</h1>
      <div>
        <table>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Username</th>
              <th>Location</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>John Doe</td>
              <td>San Francisco</td>
              <td>10:00 AM</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Jane Doe</td>
              <td>New York</td>
              <td>11:00 AM</td>
            </tr>
            <tr>
              <td>3</td>
              <td>John Smith</td>
              <td>Los Angeles</td>
              <td>12:00 PM</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;

