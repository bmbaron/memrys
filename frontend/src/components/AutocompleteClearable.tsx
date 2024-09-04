import { CloseButton, Combobox, TextInput, useCombobox } from '@mantine/core';
import { useState } from 'react';

const optionEmojis = ['🏠', `📚`, '🌱', '👵', '🎲', '⚽', '💉', '🎉', '🎂'];

const optionTexts = [
  'Home',
  `School`,
  'Park',
  'Grandparents',
  'Game',
  'Sports',
  'Doctor',
  'Party',
  'Birthday'
];

export function AutocompleteClearable() {
  const combobox = useCombobox();
  const [value, setValue] = useState('');
  const shouldFilterOptions = !optionTexts.some((item) => item === value);
  const filteredOptions = shouldFilterOptions
    ? optionTexts.filter((item) => item.toLowerCase().includes(value.toLowerCase().trim()))
    : optionTexts;

  const options = filteredOptions.map((item, index) => (
    <Combobox.Option value={item} key={item}>
      {optionEmojis[index]}&nbsp;&nbsp;{item}
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
