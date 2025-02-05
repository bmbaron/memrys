import Styled from 'styled-components';

const Dashboard = () => {
  return (
    <Wrapper>
      <Label>User activity at a glance</Label>
      <TableWrapper>
        <Table>
          <Thread>
            <tr>
              <th>User ID</th>
              <th>Username</th>
              <th>Location</th>
              <th>Time</th>
            </tr>
          </Thread>
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
        </Table>
      </TableWrapper>
    </Wrapper>
  );
};

export default Dashboard;

const Wrapper = Styled('div')`
  width: auto;
  height: 100%;
  padding: 20px;
`;

const Label = Styled('h1')`
  margin-top: 50px;
  text-align: center;
  font-weight: 500;
  font-size: 24px;
`;

const TableWrapper = Styled('div')`
  width: 100%;
`;

const Table = Styled('table')`
  width: 80%;
  margin: 70px auto;
  border: 1px solid black;
`;

const Thread = Styled('thead')`
  font-weight: 500;
`;
