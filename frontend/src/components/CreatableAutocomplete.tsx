import styled from '@emotion/styled';
import { TagsInput } from '@mantine/core';
import { ReactElement, useEffect, useState } from 'react';
const CustomTagsInput = ({
  label,
  placeholder,
  data,
  formValue,
  updateValue,
  required
}: {
  label: string | ReactElement;
  placeholder: string;
  data: string[];
  formValue: string | undefined;
  updateValue: (value: string) => void;
  required: boolean;
}) => {
  const [value, setValue] = useState<string>('');
  const [placeholderCustom, setPlaceholderCustom] = useState(placeholder);

  useEffect(() => {
    updateValue(value);
  }, [value]);

  useEffect(() => {
    if (formValue) {
      setValue(formValue);
    } else setValue('');
  }, [formValue]);

  return (
    <StyledTagsInput
      label={label}
      variant={'unstyled'}
      placeholder={!formValue ? placeholderCustom : ''}
      data={data}
      onOptionSubmit={(val) => {
        if (val) {
          setPlaceholderCustom('');
          setValue(val);
        }
      }}
      value={value ? [value] : []}
      onRemove={() => {
        setPlaceholderCustom(placeholder);
        setValue('');
      }}
      required={required}
      maxTags={1}
    />
  );
};

const StyledTagsInput = styled(TagsInput)`
  & .mantine-TagsInput-pill {
    background: var(--mantine-color-pink-3);
    font-size: 14px;
  }
`;

export default CustomTagsInput;
