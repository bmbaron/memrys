import { Box, Button, Loader, Table, TableCell, TableRow, Title } from '@adminjs/design-system';
import { ApiClient } from 'adminjs';
import React, { useEffect, useState } from 'react';

type UserDataType = {
  email: string;
  total: number;
  month: number;
}[];

type Submission = {
  params: {
    created_at: string;
  };
  populated: {
    user_id: {
      params: {
        email: string;
      };
    };
  };
};

type UserRecord = {
  created_at: string;
  email: string;
};

const Dashboard: React.FC = () => {
  const [userData, setUserData] = useState<UserDataType>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getResources = async () => {
    setLoading(true);
    const api = new ApiClient();

    //Fetch all records from the submissions resource with multiple calls
    const apiRecords: Submission[] = [];
    let page = 0;
    let totalPages = 0;
    do {
      const { data: response } = await api.resourceAction({
        resourceId: 'submissions',
        actionName: 'list',
        params: { page: ++page, perPage: 10 }
      });
      totalPages = Math.ceil(response.meta.total / 10);
      apiRecords.push(...response.records);
    } while (page < totalPages);

    setLoading(false);

    console.log(apiRecords);

    const recordData = apiRecords.map((record) => {
      return {
        created_at: record.params.created_at,
        email: record.populated.user_id.params.email
      };
    });
    const uniqueEmails: string[] = Array.from(
      new Set(recordData.map((record: UserRecord) => record.email))
    );

    const submissionData: UserDataType = uniqueEmails.map((email: string) => {
      const userRecords = recordData.filter((record: UserRecord) => record.email === email);
      const total: number = userRecords.length;
      const month: number = userRecords.filter((record: UserRecord) => {
        const date = new Date(record.created_at);
        const now = new Date();
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      }).length;
      return { email, total, month };
    });

    if (submissionData.length > 0) {
      setUserData(submissionData);
    }
  };

  useEffect(() => {
    void getResources();
  }, []);

  const getTableData = () => {
    return userData.map((user, index) => {
      return (
        <TableRow key={index}>
          <TableCell>{index + 1}</TableCell>
          <TableCell>{user.email}</TableCell>
          <TableCell>{user.month}</TableCell>
          <TableCell>{user.total}</TableCell>
        </TableRow>
      );
    });
  };

  return (
    <Box>
      <Box
        style={{
          height: 100,
          display: 'flex',
          flexDirection: 'row',
          gap: 40,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Title style={{ fontSize: 30, fontWeight: 500 }}>User activity at a glance</Title>
        <Button
          variant='outlined'
          color='primary'
          style={{ height: 40 }}
          onClick={() => void getResources()}
        >
          Reload
        </Button>
      </Box>
      <Box style={{ marginTop: 40 }}>
        {loading ? (
          <Box width='100%' height='100%' flex alignItems='center' justifyContent='center'>
            <Loader />
          </Box>
        ) : (
          <Table>
            <thead>
              <TableRow style={{ fontWeight: 500 }}>
                <TableCell>Number</TableCell>
                <TableCell>User Email</TableCell>
                <TableCell>Submissions This Month</TableCell>
                <TableCell>Total Submissions</TableCell>
              </TableRow>
            </thead>
            <tbody>{getTableData()}</tbody>
          </Table>
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;
