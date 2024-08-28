import { CloseButton, Combobox, TextInput, useCombobox } from '@mantine/core';
import { useState } from 'react';

const groceries = [
  '🏠 Home',
  '📚 School',
  '🌱 Park',
  '👵 Grandparent`s',
  '🎲 Game',
  '💉 Doctor`s',
  '🎉 Party',
  '🎂 Birthday'
];

export function AutocompleteClearable() {
  const combobox = useCombobox();
  const [value, setValue] = useState('');
  const shouldFilterOptions = !groceries.some((item) => item === value);
  const filteredOptions = shouldFilterOptions
    ? groceries.filter((item) => item.toLowerCase().includes(value.toLowerCase().trim()))
    : groceries;

  const options = filteredOptions.map((item) => (
    <Combobox.Option value={item} key={item}>
      {item}
    </Combobox.Option>
  ));

  return (
    <Combobox
      onOptionSubmit={(optionValue) => {
        setValue(optionValue);
        combobox.closeDropdown();
      }}
      store={combobox}
      withinPortal={false}
    >
      <Combobox.Target>
        <TextInput
          label='Tag'
          required
          withAsterisk
          placeholder='Pick value or type anything'
          value={value}
          onChange={(event) => {
            setValue(event.currentTarget.value);
            combobox.openDropdown();
            combobox.updateSelectedOptionIndex();
          }}
          onClick={() => combobox.openDropdown()}
          onFocus={() => combobox.openDropdown()}
          onBlur={() => combobox.closeDropdown()}
          rightSection={
            value !== '' && (
              <CloseButton
                size='sm'
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => setValue('')}
                aria-label='Clear value'
              />
            )
          }
        />
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>
          {options.length === 0 ? <Combobox.Empty>Nothing found</Combobox.Empty> : options}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
