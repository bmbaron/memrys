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
import { fetchOptionsFromDB } from '../utils/getDataFromDB.ts';
import FeatherIcon from '../utils/getFeatherIcon.tsx';
import { postTagOrLocationToDB } from '../utils/postDataToDB.ts';
import { sendMemryToDB } from '../utils/sendMemryToDB.ts';
import showConfirmation from '../utils/showConfirmation.tsx';
import suggestImageLocation from '../utils/suggestImageLocation.ts';
import CustomTagsInput from './CustomTagsInput.tsx';
import { SeedData } from './SavedMemrys.tsx';
const MemryForm = ({
  dateUTC,
  onClose,
  onReload,
  seedData
}: {
  dateUTC: string;
  onClose?: () => void;
  onReload?: () => void;
  seedData?: SeedData;
}) => {
  // const [addNote, setAddNote] = useState(0);
  const [tags, setTags] = useState(['']);
  const [locations, setLocations] = useState(['']);
  const [loading, setLoading] = useState(false);
  // const [imageCleared, setImageCleared] = useState(false);
  const openRef = useRef<() => void>(null);
  const checkboxRef = useRef<HTMLInputElement[]>([]);

  const form = useForm({
    mode: 'controlled',
    initialValues: {
      dateUTC,
      title: '',
      tag: '',
      location: '',
      notes: '',
      image: {} as FileWithPath,
      imageURL: ''
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

  const fetchDropdownOptions = async () => {
    try {
      const tags = await fetchOptionsFromDB('tags');
      setTags(tags);
      const locations = await fetchOptionsFromDB('locations');
      setLocations(locations);
    } catch (err: unknown) {
      console.error((err as Error).message);
    }
  };

  useEffect(() => {
    if (seedData) {
      for (const [key, value] of Object.entries(seedData)) {
        form.setFieldValue(key, value);
      }
    }
    void fetchDropdownOptions();
  }, []);

  const imagePreview = () => {
    const image = form.getValues().image;
    const imageURL = form.getValues().imageURL;
    if (!imageURL && !image.name) {
      return;
    }
    const imageSRC = imageURL || URL.createObjectURL(image);

    const clearImage = () => {
      form.setFieldValue('image', {} as FileWithPath);
      form.setFieldValue('imageURL', '');
    };
    const updateImage = () => {
      clearImage();
      form.setFieldValue('location', '');
      setTimeout(() => {
        openRef.current?.();
      }, 100);
    };
    return (
      <Box pos={'relative'}>
        <CloseButton pos={'absolute'} right={-35} top={-80} onClick={clearImage} />
        <Text pos={'absolute'} right={0} top={-5}>
          <b style={{ marginRight: 10, fontSize: 15 }}>{image.name || 'existing image'}</b>
          <FeatherIcon Type={Edit} hasHover onClick={updateImage} />
        </Text>
        <Image
          h={250}
          w={'100%'}
          mt={30}
          style={{ borderRadius: 10 }}
          src={imageSRC}
          onLoad={() => URL.revokeObjectURL(imageSRC)}
        />
      </Box>
    );
  };
  const getSuggestedLocation = async () => {
    setLoading(true);
    form.setFieldValue('location', '');
    const formData = new FormData();
    formData.set('image', form.getValues().image);
    const result = await suggestImageLocation(formData);
    form.setFieldValue('location', result);
    setLoading(false);
  };

  const updateOptions = () => {
    const tagValue = form.getValues().tag;
    if (!tags.find((item) => item === tagValue)) {
      void postTagOrLocationToDB(tagValue, 'tags');
    }
    const locationValue = form.getValues().location;
    if (!locations.find((item) => item === locationValue)) {
      void postTagOrLocationToDB(locationValue, 'locations');
    }
  };
  const handleSubmit = async (e: React.FormEvent, updated: boolean) => {
    e.preventDefault();
    updateOptions();
    console.log(form.getValues());
    try {
      await showConfirmation('Working on it...', 0, 2000, true);
      const response = await sendMemryToDB(form.getValues(), updated);
      if (response.message) {
        await showConfirmation(response.message, 2500, 4000, false);
        // TODO
        if (!seedData) {
          onClose();
          onReload();
        }
      } else if (response.error) {
        console.error(response.error);
      }
    } catch (err: unknown) {
      console.error(err as Error);
    }
    // TODO
    // change to the view mode and reload with latest values
  };

  const labelStyle = {
    padding: '8px 15px 6px 15px',
    background: '#7AD1DD',
    borderRadius: 20,
    marginBottom: 10,
    fontSize: 15
  };

  const checkChanged = async (e: React.FormEvent) => {
    e.preventDefault();
    const formValues = form.getValues();
    if (JSON.stringify(formValues) !== JSON.stringify(seedData)) {
      if (confirm('Are you sure you want to update this memry?')) {
        await handleSubmit(e, true);
      } else return;
    }
    return;
  };

  return (
    <form onSubmit={seedData ? checkChanged : (e) => handleSubmit(e, false)}>
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
                defaultChecked={form.getValues().tag !== '' && form.getValues().tag === tag}
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
          {!form.getValues().image.name && !form.getValues().imageURL ? (
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
              maxSize={5000000}
              accept={[MIME_TYPES.png, MIME_TYPES.jpeg, MIME_TYPES.svg]}
              onDrop={(acceptedFile) => {
                form.setFieldValue('image', acceptedFile[0]);
                void getSuggestedLocation();
              }}
              onReject={(err) =>
                form.setFieldError(
                  'image',
                  err[0].errors[0].message + '. ' + 'Please upload a smaller file'
                )
              }
            >
              <Center h={250}>
                <Dropzone.Idle>Drop image here</Dropzone.Idle>
                <Dropzone.Accept>Drop image here</Dropzone.Accept>
                <Dropzone.Reject>File is invalid</Dropzone.Reject>
              </Center>
            </Dropzone>
          ) : (
            imagePreview()
          )}
          {form.errors.image && (
            <Text c={'red'} mt={5}>
              {form.errors.image}
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
          value={form.getValues().notes || ''}
          onChange={(e) => form.setFieldValue('notes', e.currentTarget.value)}
        />
        <Group justify={'flex-end'} mt={'md'}>
          <Button bg={seedData ? 'yellow.7' : 'green.7'} type={'submit'}>
            {seedData ? 'Update' : 'Submit'}
          </Button>
        </Group>
      </Flex>
    </form>
  );
};

export default MemryForm;
