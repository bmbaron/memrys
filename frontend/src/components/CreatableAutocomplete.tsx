import { Autocomplete } from '@mantine/core';
import { useEffect, useState } from 'react';

const CreatableAutocomplete = ({
  label,
  data,
  formValue,
  updateValue
}: {
  label: string;
  data: string[];
  formValue: string;
  updateValue: (value: string) => void;
}) => {
  const [value, setValue] = useState(formValue);

  useEffect(() => {
    updateValue(value);
  }, [value]);

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
