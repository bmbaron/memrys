import { Button, Group, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import React from 'react';
const MemryForm = ({
  setShowForm
}: {
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      text: ''
    }
  });
  return (
    <form onSubmit={form.onSubmit((values) => console.log(values))}>
      <TextInput
        withAsterisk
        label="text"
        placeholder="add some text"
        key={form.key('text')}
        {...form.getInputProps('text')}
      />
      <Group justify="flex-end" mt="md">
        <Button onClick={() => setShowForm(false)}>Cancel</Button>
        <Button bg={'green.7'} type="submit">
          Submit
        </Button>
      </Group>
    </form>
  );
};

export default MemryForm;
