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
  analyzeErrorText,
  setAnalyzeErrorText
}: {
  label: string | ReactElement;
  placeholder: string;
  data: string[];
  formValue?: string;
  updateValue: (value: string) => void;
  loading: boolean;
  labelProps: CSSProperties;
  analyzeErrorText?: string;
  setAnalyzeErrorText?: (value: string) => void;
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
      hasError={analyzeErrorText === '' ? false : true}
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
          if (setAnalyzeErrorText) {
            setAnalyzeErrorText('');
          }
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

const StyledTagsInput = styled(TagsInput, {
  shouldForwardProp: (props) => props !== 'hasError'
})<{ hasError: boolean }>(({ hasError }) => ({
  '& .mantine-TagsInput-pill': {
    background: hasError ? 'var(--mantine-color-red-7)' : 'var(--mantine-color-blue-3)',
    fontSize: '14px',
    padding: '5px 10px 5px 15px',
    height: 'fit-content'
  }
}));

export default CustomTagsInput;
