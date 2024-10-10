import {
  Box,
  Button,
  Center,
  CloseButton,
  Flex,
  Group,
  Image,
  Loader,
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
import suggestImageLocation from '../utils/suggestImageLocation.ts';
import CustomTagsInput from './CreatableAutocomplete.tsx';
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
  const [loading, setLoading] = useState(false);
  const form = useForm({
    mode: 'controlled',
    initialValues: {
      dateUTC: dateUTC,
      title: '',
      tag: '',
      location: '',
      notes: [''],
      photo: {} as FileWithPath
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

  const photoPreview = () => {
    const photo = form.getValues().photo;
    if (!photo.name) {
      return;
    }
    const photoURL = URL.createObjectURL(photo);
    return (
      <Box pos={'relative'}>
        <Text pos={'absolute'}>
          <b>{photo.name}</b> ({(photo.size / 1024).toFixed(2)} kb)
          <CloseButton
            size={'xs'}
            onClick={() => {
              form.setFieldValue('photo', {} as FileWithPath);
            }}
          />
        </Text>
        <Image
          h={250}
          w={'100%'}
          mt={30}
          style={{ borderRadius: 10 }}
          src={photoURL}
          onLoad={() => URL.revokeObjectURL(photoURL)}
        />
      </Box>
    );
  };
  const getSuggestedLocation = async () => {
    setLoading(true);
    form.setFieldValue('location', '');
    const formData = new FormData();
    formData.set('image', form.getValues().photo);
    const result = await suggestImageLocation(formData);
    form.setFieldValue('location', result);
    setLoading(false);
  };

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
      <Box
        mx={40}
        mt={40}
        ta={'left'}
        display={'flex'}
        style={{ flexDirection: 'column', gap: 20 }}
      >
        <Flex
          direction={'column'}
          gap={30}
          bd={'1px solid borders.0'}
          style={{ borderRadius: 10, padding: 20 }}
        >
          {!form.getValues().photo.name ? (
            <Dropzone
              h={250}
              p={0}
              mt={30}
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
              multiple={false}
              maxFiles={1}
              accept={[MIME_TYPES.png, MIME_TYPES.jpeg, MIME_TYPES.svg]}
              onDrop={(acceptedFile) => {
                form.setFieldValue('photo', acceptedFile[0]);
                getSuggestedLocation();
              }}
              onReject={() => form.setFieldError('photo', 'Select image only')}
            >
              <Center h={250}>
                <Dropzone.Idle>Drop image here</Dropzone.Idle>
                <Dropzone.Accept>Drop image here</Dropzone.Accept>
                <Dropzone.Reject>File is invalid</Dropzone.Reject>
              </Center>
            </Dropzone>
          ) : (
            photoPreview()
          )}
          {form.errors.photo && (
            <Text c={'red'} mt={5}>
              {form.errors.photo}
            </Text>
          )}
          <CustomTagsInput
            label={loading ? <Loader size={20} color={'blue'} /> : 'Location'}
            placeholder={loading ? 'Analyzing...' : 'Select an option or write in your own'}
            data={locations}
            key={form.key('location')}
            formValue={form.getValues().location !== '' ? form.getValues().location : undefined}
            updateValue={(value: string) => form.setFieldValue('location', value)}
            required={!loading}
          />
        </Flex>
        <CustomTagsInput
          label={'Who'}
          placeholder={'Select an option or write in your own'}
          data={tags}
          key={form.key('tag')}
          formValue={form.getValues().tag}
          updateValue={(value) => form.setFieldValue('tag', value)}
          required
        />
        <TextInput
          label={'Title'}
          required
          key={form.key('title')}
          value={form.getValues().title}
          onChange={(e) => form.setFieldValue('title', e.target.value)}
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
