import { Box, Button, FileInput, Group, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { Headphones, Image } from 'react-feather';
import FeatherIcon from '../utils/getFeatherIcon.tsx';
import { AutocompleteClearable } from './AutocompleteClearable.tsx';
const MemryForm = ({
  setShowForm
}: {
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      tag: '',
      text: '',
      details: '',
      photos: [''],
      audio: ['']
    }
  });
  return (
    <form onSubmit={form.onSubmit((values) => console.log(values))}>
      <Box mt={20} ta={'left'} display={'flex'} style={{ flexDirection: 'column', gap: 20 }}>
        <AutocompleteClearable key={form.key('tag')} />
        <TextInput label='What happened' key={form.key('text')} />
        <Textarea description='More details' key={form.key('details')} />
        <FileInput
          multiple
          clearable
          label='Add photo(s)'
          description='Upload some photos'
          placeholder={<FeatherIcon Type={Image} />}
          accept='image/png,image/jpeg'
          key={form.key('photos')}
        />
        <FileInput
          multiple
          clearable
          label='Add audio file(s)'
          description='Upload some recordings'
          placeholder={<FeatherIcon Type={Headphones} />}
          accept='audio/mpg,audio/ogg,audio/wav'
          key={form.key('audio')}
        />
        <Group justify='flex-end' mt='md'>
          <Button onClick={() => setShowForm(false)}>Cancel</Button>
          <Button bg={'green.7'} type='submit'>
            Submit
          </Button>
        </Group>
      </Box>
    </form>
  );
};

export default MemryForm;
