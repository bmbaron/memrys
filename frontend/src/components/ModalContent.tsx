import { Box } from '@mantine/core';
import { fetchMemryFromDB } from '../utils/getDataFromDB.ts';
import MemryForm from './MemryForm.tsx';
import SavedMemrys from './SavedMemrys.tsx';
import myData from './test-data.json';

export type DayObject = {
  date: string;
  title: string;
  tags: string[];
  location: string;
  notes: string[];
  images: string[];
};

const ModalContent = ({ data, onClose }: { data: string; onClose: () => void }) => {
  console.log(data);
  fetchMemryFromDB(data);
  const dayData = myData.dateData.find((obj: DayObject) => obj.date === data);
  return (
    <Box ta={'center'}>
      {dayData ? <SavedMemrys data={dayData} /> : <MemryForm onClose={onClose} />}
    </Box>
  );
};

export default ModalContent;
