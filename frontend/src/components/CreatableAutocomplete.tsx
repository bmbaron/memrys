import { Autocomplete } from '@mantine/core';
import { useState } from 'react';

const CreatableAutocomplete = ({ label, data }: { label: string; data: string[] }) => {
  const [value, setValue] = useState('');

  return (
    <Autocomplete
      label={label}
      placeholder={'Select an option or write in your own'}
      data={data}
      value={value}
      onChange={setValue}
      required
    />
  );
};

export default CreatableAutocomplete;
