import styled from '@emotion/styled';
import { TagsInput } from '@mantine/core';
import { CSSProperties, ReactElement, useEffect, useState } from 'react';
const CustomTagsInput = ({
  label,
  placeholder,
  data,
  formValue,
  updateValue,
  loading,
  labelProps,
  analyzeErrorText
}: {
  label: string | ReactElement;
  placeholder: string;
  data: string[];
  formValue?: string;
  updateValue: (value: string) => void;
  loading: boolean;
  labelProps: CSSProperties;
  analyzeErrorText?: string;
}) => {
  const [value, setValue] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
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
      withErrorStyles={false}
      error={analyzeErrorText}
      label={label}
      labelProps={{ style: labelProps }}
      variant={'unstyled'}
      placeholder={!formValue ? (loading ? 'Analyzing...' : placeholderCustom) : ''}
      data={data}
      onClick={() => setIsOpen(true)}
      onOptionSubmit={(val) => {
        if (val) {
          setPlaceholderCustom('');
          setValue(val);
          setIsOpen(false);
        }
      }}
      onBlur={() => setIsOpen(false)}
      dropdownOpened={isOpen}
      value={value ? [value] : []}
      onRemove={() => {
        setPlaceholderCustom(placeholder);
        setValue('');
        setIsOpen(true);
      }}
      required={!loading}
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
