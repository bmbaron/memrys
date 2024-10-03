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
import { fetchTagOrLocation } from '../utils/getDataFromDB.ts';
import { postTagOrLocationToDB } from '../utils/postDataToDB.ts';
import { postMemryToDB } from '../utils/postMemryToDB.ts';
import showConfirmation from '../utils/showConfirmation.tsx';
import CreatableAutocomplete from './CreatableAutocomplete.tsx';
const MemryForm = ({
  dateUTC,
  onClose,
  onReload
}: {
  dateUTC: string;
  onClose: () => void;
  onReload: () => void;
}) => {
  const [addNote, setAddNote] = useState(0);
  const [tags, setTags] = useState(['']);
  const [locations, setLocations] = useState(['']);
  const form = useForm({
    mode: 'controlled',
    initialValues: {
      dateUTC: dateUTC,
      title: 'asfaf',
      tag: 'Person',
      location: 'home',
      notes: [''],
      photos: [] as FileWithPath[]
    }
  });

  const fetchData = async () => {
    try {
      const tags = await fetchTagOrLocation('tags');
      setTags(tags);
      const locations = await fetchTagOrLocation('locations');
      setLocations(locations);
    } catch (err: unknown) {
      console.error((err as Error).message);
    }
  };

  useEffect(() => {
    void fetchData();
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
              form.setFieldValue('photos', updatedFiles); // Only set the updated list
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

  const handleDeleteNote = (e: React.MouseEvent<HTMLButtonElement>) => {
    const parent = e.currentTarget.parentElement;
    if (parent) {
      parent.remove();
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const tagValue = form.getValues().tag;
    if (!tags.find((item) => item === tagValue)) {
      void postTagOrLocationToDB(tagValue, 'tags');
    }
    const locationValue = form.getValues().location;
    if (!locations.find((item) => item === locationValue)) {
      void postTagOrLocationToDB(locationValue, 'locations');
    }
    try {
      const response = await postMemryToDB(form.getValues());
      if (response.message) {
        await showConfirmation(response.message, 2000, 4000);
        onClose();
        onReload();
      } else if (response.error) {
        console.error(response.error);
      }
    } catch (err: unknown) {
      console.error(err as Error);
    }
  };

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
          key={form.key('tag')}
          formValue={form.getValues().tag}
          updateValue={(value) => form.setFieldValue('tag', value)}
        />
        <CreatableAutocomplete
          label={'Where'}
          data={locations}
          key={form.key('location')}
          formValue={form.getValues().location}
          updateValue={(value) => form.setFieldValue('location', value)}
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
                onClick={handleDeleteNote}
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
              form.setFieldValue('photos', [...form.getValues().photos, ...acceptedFiles]);
            }}
            onReject={() => form.setFieldError('photos', 'Select images only')}
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
              <Flex wrap={'wrap'} direction={{ xs: 'column', sm: 'row' }} gap={40}>
                {selectedFiles}
              </Flex>
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
