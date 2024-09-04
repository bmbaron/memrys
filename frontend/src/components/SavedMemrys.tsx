import {
  Badge,
  Box,
  Flex,
  SimpleGrid,
  Space,
  Stack,
  Text,
  Title,
  useMantineTheme
} from '@mantine/core';
import { DayObject } from './ModalContent.tsx';

const SavedMemrys = ({ data }: { data: DayObject }) => {
  const theme = useMantineTheme();
  return (
    <Box mt={40} mb={40}>
      <Flex mb={20} align={'center'}>
        <Title order={5} mr={10}>
          Tagged:
        </Title>
        {...data.tags.map((tag: string, index: number) => (
          <Badge color={'blue'} size='xl' key={index}>
            <Flex>
              <Text tt={'none'} c={theme.white}>
                {tag}
              </Text>
            </Flex>
          </Badge>
        ))}
      </Flex>
      <Space h={'xl'} />
      <Box mb={20}>
        <Title ta={'left'} order={5} mr={10}>
          Notes:
        </Title>
        {...data.notes.map((note: string, index: number) => (
          <Text key={index} tt={'none'} c={theme.black}>
            {note}
          </Text>
        ))}
      </Box>
      <Stack gap={20}>
        <Title ta={'left'} order={5} mr={10}>
          Photos:
        </Title>
        <SimpleGrid cols={3} bd={'1px solid red'} mah={'400px'} w={'100%'}>
          {...data.images.map((imgSrc: string, index: number) => (
            <img
              src={imgSrc}
              style={{ height: '200px', border: '1px solid red', objectFit: 'cover' }}
              key={index}
            ></img>
          ))}
        </SimpleGrid>
      </Stack>
    </Box>
  );
};

export default SavedMemrys;
