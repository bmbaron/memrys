import { Box } from '@mantine/core';
import { useEffect, useState } from 'react';
import { fetchMemryFromDB } from '../utils/getDataFromDB.ts';
import MemryForm from './MemryForm.tsx';
import SavedMemrys from './SavedMemrys.tsx';

export type MemryObject = {
  id: number;
  created_at: string;
  title: string;
  tag: string;
  location: string;
};

const ModalContent = ({ dateUTC, onClose }: { dateUTC: string; onClose: () => void }) => {
  const [newData, setNewData] = useState({} as MemryObject);
  const fetchNewData = async () => {
    try {
      const newestData = await fetchMemryFromDB(dateUTC);
      setNewData(newestData);
    } catch (e: unknown) {
      console.error((e as Error).message);
    }
  };

  useEffect(() => {
    fetchNewData();
  }, []);

  return (
    <Box ta={'center'}>
      {newData ? <SavedMemrys data={newData} /> : <MemryForm dateUTC={dateUTC} onClose={onClose} />}
    </Box>
  );
};

export default ModalContent;
