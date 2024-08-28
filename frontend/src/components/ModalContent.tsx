import styled from '@emotion/styled';
import {
  Box,
  Button,
  ButtonProps,
  List,
  ListItem,
  Text,
  createPolymorphicComponent
} from '@mantine/core';
import { useState } from 'react';
import MemryForm from './MemryForm.tsx';
import myData from './test-data.json';

export type DayObject = {
  date: string;
  tags: string[];
  texts: string[];
  images: string[];
};

const ModalContent = ({ data }: { data: string }) => {
  const dayData = myData.dateData.find((obj: DayObject) => obj.date === data);
  const [showForm, setShowForm] = useState(false);
  return (
    <Box ta={'center'}>
      {dayData && !showForm ? (
        <List mb={20}>
          {dayData.texts.map((text: string, index: number) => (
            <ListItem key={index}>{text}</ListItem>
          ))}
        </List>
      ) : !showForm ? (
        <Text size={'sm'} mt={30} mb={20}>
          {"looks like there's nothing here yet"}
        </Text>
      ) : null}
      {!showForm && <AddButton onClick={() => setShowForm(!showForm)}>add memry</AddButton>}
      {showForm && <MemryForm setShowForm={setShowForm} />}
    </Box>
  );
};

export default ModalContent;

const _AddButton = styled(Button)`
  background-color: ${({ theme }) => `${theme.white} !important`};
  &:hover {
    background-color: ${({ theme }) => `${theme.white} !important`};
  }
`;
const AddButton = createPolymorphicComponent<'button', ButtonProps>(_AddButton);