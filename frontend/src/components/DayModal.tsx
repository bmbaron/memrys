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
import myData from './test-data.json';

export type DayObject = {
  date: string;
  tags: string[];
  texts: string[];
  images: string[];
};

const DayModal = ({ data }: { data: string }) => {
  const dayData = myData.find((obj: DayObject) => obj.date === data);
  return dayData ? (
    <Box ta={'center'}>
      <List mb={20}>
        {dayData.texts.map((text: string, index: number) => (
          <ListItem key={index}>{text}</ListItem>
        ))}
      </List>
      <AddButton>add memry</AddButton>
    </Box>
  ) : (
    <Box ta={'center'}>
      <Text size={'sm'} mt={30} mb={20}>
        {"looks like there's nothing here yet"}
      </Text>
      <AddButton>add memry</AddButton>
    </Box>
  );
};

export default DayModal;

const _AddButton = styled(Button)`
  background-color: ${({ theme }) => `${theme.white} !important`};
  &:hover {
    background-color: ${({ theme }) => `${theme.white} !important`};
  }
`;
const AddButton = createPolymorphicComponent<'button', ButtonProps>(_AddButton);
