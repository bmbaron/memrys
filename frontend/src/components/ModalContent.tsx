import { Box } from '@mantine/core';
import { useEffect, useState } from 'react';
import { fetchMemry } from '../utils/getDataFromDB.ts';
import MemryForm from './MemryForm.tsx';
import SavedMemrys from './SavedMemrys.tsx';

export type MemryObject = {
  id: number;
  created_at: string;
  title: string;
  tag: string;
  location: string;
  notes?: string;
  thumbnailURL?: string;
  mainURL?: string;
};

const ModalContent = ({
  dateUTC,
  onClose,
  onReload
}: {
  dateUTC: string;
  onClose: () => void;
  onReload: () => void;
}) => {
  const [newData, setNewData] = useState({} as MemryObject);
  const [loading, setLoading] = useState<boolean>(true);
  const fetchNewData = async () => {
    try {
      setLoading(true);
      const newestData = await fetchMemry(dateUTC);
      setLoading(false);
      setNewData(newestData);
    } catch (e: unknown) {
      console.error((e as Error).message);
    }
  };

  useEffect(() => {
    void fetchNewData();
  }, []);

  return (
    <Box ta={'center'}>
      {newData ? (
        <SavedMemrys data={newData} loading={loading} onClose={onClose} onReload={onReload} />
      ) : (
        <MemryForm dateUTC={dateUTC} onClose={onClose} onReload={onReload} />
      )}
    </Box>
  );
};

export default ModalContent;
