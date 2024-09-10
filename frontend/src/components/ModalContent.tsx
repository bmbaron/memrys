import { Box } from '@mantine/core';
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

const ModalContent = ({ data }: { data: string }) => {
  const dayData = myData.dateData.find((obj: DayObject) => obj.date === data);
  return <Box ta={'center'}>{dayData ? <SavedMemrys data={dayData} /> : <MemryForm />}</Box>;
};

export default ModalContent;
