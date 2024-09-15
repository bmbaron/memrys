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
import React, { useEffect, useState } from 'react';
import { Trash2 } from 'react-feather';
import { getDBTags } from '../utils/getDBTags.ts';
import CreatableAutocomplete from './CreatableAutocomplete.tsx';
const MemryForm = () => {
  const [addNote, setAddNote] = useState(0);
  const [tags, setTags] = useState(['']);
  const form = useForm({
    mode: 'controlled',
    initialValues: {
      title: 'hello',
      who: '',
      where: '',
      notes: [''],
      photos: [] as FileWithPath[]
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tags = await getDBTags();
        setTags(tags);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const selectedFiles = form.getValues().photos.map((file: FileWithPath, index) => {
    const imageUrl = URL.createObjectURL(file);
    return (
      <Box key={file.name}>
        <Text>
          <b>{file.name}</b> ({(file.size / 1024).toFixed(2)} kb)
          <CloseButton
            size={'xs'}
            onClick={() => {
              const updatedFiles = form.getValues().photos.filter((_, i) => i !== index);
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

  const handleSubmit = () => {
    form.onSubmit((values) => console.log(values));
    if (!tags.includes(form.getValues().who)) {
      console.log('new')
    }
  }
  return (
    <form onSubmit={handleSubmit}>
      <Box mt={20} ta={'left'} display={'flex'} style={{ flexDirection: 'column', gap: 20 }}>
        <TextInput
          label={'Title'}
          required
          key={form.key('title')}
          value={form.getValues().title}
          onChange={(e) => form.setFieldValue('title', e.target.value)}
        />
        <CreatableAutocomplete
          label={'Who'}
          data={tags}
          key={form.key('who')}
          formValue={form.getValues().who}
          updateValue={(value) => form.setFieldValue('who', value)}
        />
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
          key={form.key('where')}
          formValue={form.getValues().where}
          updateValue={(value) => form.setFieldValue('where', value)}
        />
        <Textarea label={'Notes'} description={'What happened'} />
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
              form.setFieldValue('files', [...form.getValues().photos, ...acceptedFiles]);
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
