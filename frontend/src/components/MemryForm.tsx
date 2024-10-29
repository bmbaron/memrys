import {
  Box,
  Button,
  Center,
  Checkbox,
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
import React, { useEffect, useRef, useState } from 'react';
import { Edit } from 'react-feather';
import { fetchTagOrLocation } from '../utils/getDataFromDB.ts';
import FeatherIcon from '../utils/getFeatherIcon.tsx';
import { postTagOrLocationToDB } from '../utils/postDataToDB.ts';
import { postMemryToDB } from '../utils/postMemryToDB.ts';
import showConfirmation from '../utils/showConfirmation.tsx';
import suggestImageLocation from '../utils/suggestImageLocation.ts';
import CustomTagsInput from './CustomTagsInput.tsx';
const MemryForm = ({
  dateUTC,
  onClose,
  onReload
}: {
  dateUTC: string;
  onClose: () => void;
  onReload: () => void;
}) => {
  // const [addNote, setAddNote] = useState(0);
  const [tags, setTags] = useState(['']);
  const [locations, setLocations] = useState(['']);
  const [loading, setLoading] = useState(false);
  const openRef = useRef<() => void>(null);
  const checkboxRef = useRef<HTMLInputElement[]>([]);

  const form = useForm({
    mode: 'controlled',
    initialValues: {
      dateUTC: dateUTC,
      title: '',
      tag: '',
      location: '',
      notes: '',
      photo: {} as FileWithPath
    }
  });
  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setFieldValue('tag', e.currentTarget.value);
    checkboxRef.current.forEach((c) => {
      if (
        c.labels &&
        c.labels[0].textContent &&
        c.labels[0].textContent.toLowerCase() === e.currentTarget.value.toLowerCase()
      ) {
        c.checked = true;
      } else {
        c.checked = false;
      }
    });
  };
  const handleCheckbox = (index: number) => {
    let clickedValue = '';
    if (checkboxRef.current[index].labels && checkboxRef.current[index].labels[0].textContent) {
      clickedValue = checkboxRef.current[index].labels[0].textContent;
    }
    if (clickedValue === form.getValues().tag) {
      form.setFieldValue('tag', '');
      return;
    } else {
      form.setFieldValue('tag', clickedValue);
      checkboxRef.current.forEach((c, i) => {
        if (i !== index) {
          c.checked = false;
        }
      });
    }
  };

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
    const handleClick = () => {
      form.setFieldValue('photo', {} as FileWithPath);
      form.setFieldValue('location', '');
      setTimeout(() => {
        openRef.current?.();
      }, 100);
    };
    return (
      <Box pos={'relative'}>
        <CloseButton
          pos={'absolute'}
          right={-35}
          top={-80}
          onClick={() => {
            form.setFieldValue('photo', {} as FileWithPath);
            form.setFieldValue('location', '');
          }}
        />
        <Text pos={'absolute'} right={0} top={-5}>
          <b style={{ marginRight: 10, fontSize: 15 }}>{photo.name}</b>
          <FeatherIcon Type={Edit} hasHover onClick={handleClick} />
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

  const labelStyle = {
    padding: '8px 15px 6px 15px',
    background: '#7AD1DD',
    borderRadius: 20,
    marginBottom: 10,
    fontSize: 15
  };

  return (
    <form onSubmit={handleSubmit}>
      <Flex
        direction={'column'}
        gap={50}
        mx={{ xs: 0, sm: 20 }}
        mt={40}
        ta={'left'}
        display={'flex'}
      >
        <TextInput
          label={'Title'}
          required
          key={form.key('title')}
          value={form.getValues().title}
          onChange={(e) => form.setFieldValue('title', e.target.value)}
          labelProps={{ style: labelStyle }}
        />
        <Flex direction={'column'} gap={20}>
          <TextInput
            required
            label={'Who'}
            labelProps={{ style: labelStyle }}
            placeholder={'Select an option or write in your own'}
            key={form.key('tag')}
            value={form.getValues().tag}
            onChange={handleTagChange}
          />
          <Flex gap={20}>
            {tags.map((tag, index) => (
              <Checkbox
                defaultChecked={false}
                ref={(el) => (checkboxRef.current[index] = el as HTMLInputElement)}
                key={index}
                label={tag}
                onClick={() => handleCheckbox(index)}
              />
            ))}
          </Flex>
        </Flex>
        <Flex
          direction={'column'}
          gap={30}
          pt={50}
          bd={'1px solid borders.0'}
          style={{ borderRadius: 10, padding: 20 }}
        >
          {!form.getValues().photo.name ? (
            <Dropzone
              h={250}
              p={0}
              mt={30}
              bd={'1 dashed'}
              openRef={openRef}
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
            labelProps={labelStyle}
            placeholder={loading ? 'Analyzing...' : 'Select an option or write in your own'}
            data={locations}
            key={form.key('location')}
            formValue={form.getValues().location !== '' ? form.getValues().location : undefined}
            updateValue={(value: string) => form.setFieldValue('location', value)}
            loading={loading}
          />
        </Flex>
        <Textarea
          label={'Notes'}
          labelProps={{ style: labelStyle }}
          placeholder={'What happened'}
          key={form.key('notes')}
          value={form.getValues().notes}
          onChange={(e) => form.setFieldValue('notes', e.currentTarget.value)}
        />
        {/*{addNote > 0 &&*/}
        {/*  [...Array(addNote)].map((_, index) => (*/}
        {/*    <Box pos={'relative'} key={index}>*/}
        {/*      <Textarea placeholder={'What else happened'} pr={50} />*/}
        {/*      <Button*/}
        {/*        pos={'absolute'}*/}
        {/*        right={10}*/}
        {/*        top={30}*/}
        {/*        w={35}*/}
        {/*        h={35}*/}
        {/*        p={0}*/}
        {/*        onClick={handleDeleteNote}*/}
        {/*      >*/}
        {/*        <Trash2 />*/}
        {/*      </Button>*/}
        {/*    </Box>*/}
        {/*  ))}*/}
        {/*<Button onClick={() => setAddNote((prev) => prev + 1)}>Add note</Button>*/}
        <Group justify={'flex-end'} mt={'md'}>
          <Button bg={'green.7'} type={'submit'}>
            Submit
          </Button>
        </Group>
      </Flex>
    </form>
  );
};

export default MemryForm;
