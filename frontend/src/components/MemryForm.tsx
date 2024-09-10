import {
  Box,
  Button,
  Center,
  CloseButton,
  Flex,
  Group,
  Image,
  Text,
  Textarea,
  TextInput
} from '@mantine/core';
import { Dropzone, FileWithPath, MIME_TYPES } from '@mantine/dropzone';
import { useForm } from '@mantine/form';
import React, { useState } from 'react';
import { Trash2 } from 'react-feather';
import CreatableAutocomplete from './CreatableAutocomplete.tsx';
const MemryForm = () => {
  const [addNote, setAddNote] = useState(0);
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      who: '',
      where: '',
      notes: [''],
      files: [] as FileWithPath[],
      photos: [''],
      audio: ['']
    }
  });

  const selectedFiles = form.getValues().files.map((file: FileWithPath, index) => {
    const imageUrl = URL.createObjectURL(file);
    console.log(file);
    return (
      <Box key={file.name}>
        <Text>
          <b>{file.name}</b> ({(file.size / 1024).toFixed(2)} kb)
          <CloseButton
            size={'xs'}
            onClick={() => {
              const updatedFiles = form.getValues().files.filter((_, i) => i !== index);
              form.setFieldValue('files', updatedFiles); // Only set the updated list
            }}
          />
        </Text>
        <Image
          key={index}
          h={200}
          w={200}
          src={imageUrl}
          onLoad={() => URL.revokeObjectURL(imageUrl)}
        />
      </Box>
    );
  });

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    const parent = e.currentTarget.parentElement;
    if (parent) {
      parent.remove();
    }
  };
  return (
    <form onSubmit={form.onSubmit((values) => console.log(values))}>
      <Box mt={20} ta={'left'} display={'flex'} style={{ flexDirection: 'column', gap: 20 }}>
        <TextInput label={'Title'} required />
        <CreatableAutocomplete label={'Who'} data={['Sam', 'Bi', 'Bong', 'Minh']} />
        <CreatableAutocomplete
          label={'Where'}
          data={[
            'Home',
            `School`,
            'Park',
            'Grandparents',
            'Game',
            'Sports Event',
            'Doctor',
            'Party',
            'Birthday'
          ]}
        />
        <Textarea label={'Notes'} description={'What happened'} key={form.key('notes')} />
        {addNote > 0 &&
          [...Array(addNote)].map((_, index) => (
            <Box pos={'relative'} key={index}>
              <Textarea description={'What else happened'} pr={50} />
              <Button
                pos={'absolute'}
                right={10}
                top={30}
                w={35}
                h={35}
                p={0}
                onClick={handleDelete}
              >
                <Trash2 />
              </Button>
            </Box>
          ))}
        <Button onClick={() => setAddNote((prev) => prev + 1)}>Add note</Button>
        <>
          <Dropzone
            h={120}
            p={0}
            multiple
            bd={'1 dashed'}
            style={(theme) => ({
              border: `2px dashed ${theme.colors.gray[4]}`,
              borderRadius: theme.radius.md,
              cursor: 'pointer',
              padding: theme.spacing.md,
              '&:hover': {
                backgroundColor: theme.colors.gray[0]
              }
            })}
            accept={[MIME_TYPES.png, MIME_TYPES.jpeg, MIME_TYPES.svg]}
            onDrop={(acceptedFiles: FileWithPath[]) => {
              form.setFieldValue('files', [...form.getValues().files, ...acceptedFiles]);
            }}
            onReject={() => form.setFieldError('files', 'Select images only')}
          >
            <Center h={120}>
              <Dropzone.Idle>Drop images here</Dropzone.Idle>
              <Dropzone.Accept>Drop images here</Dropzone.Accept>
              <Dropzone.Reject>Files are invalid</Dropzone.Reject>
            </Center>
          </Dropzone>
          {form.errors.files && (
            <Text c={'red'} mt={5}>
              {form.errors.files}
            </Text>
          )}

          {selectedFiles.length > 0 && (
            <>
              <Text mb={5} mt={'md'}>
                Selected files:
              </Text>
              <Flex gap={40}>{selectedFiles}</Flex>
            </>
          )}
        </>
        {/*<FileInput*/}
        {/*    multiple*/}
        {/*    clearable*/}
        {/*    label={'Add photo(s)'}*/}
        {/*    description={'Upload some photos'}*/}
        {/*    placeholder={<Image />}*/}
        {/*    accept={'image/png,image/jpeg'}*/}
        {/*    key={form.key('photos')}*/}
        {/*/>*/}
        {/*<FileInput*/}
        {/*    multiple*/}
        {/*    clearable*/}
        {/*    label={'Add audio file(s)'}*/}
        {/*    description={'Upload some recordings'}*/}
        {/*    placeholder={<FeatherIcon Type={Headphones} />}*/}
        {/*    accept={'audio/mpg,audio/ogg,audio/wav'}*/}
        {/*    key={form.key('audio')}*/}
        {/*/>*/}
        <Group justify={'flex-end'} mt={'md'}>
          <Button bg={'green.7'} type={'submit'}>
            Submit
          </Button>
        </Group>
      </Box>
    </form>
  );
};

export default MemryForm;
