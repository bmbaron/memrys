import {
  Anchor,
  Button,
  Checkbox,
  Flex,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { upperFirst, useToggle } from '@mantine/hooks';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import classes from '../../src/Authentication.module.css';
import {postRegister} from "../utils/postRegister.ts";

const Authentication = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('mode');
  const [type, toggle] = useToggle(['login', 'register']);

  useEffect(() => {
    if (query && type !== query) {
      toggle(query);
    }
  }, []);

  const handleChange = () => {
    setSearchParams(`mode=${type === 'login' ? 'register' : 'login'}`);
    toggle();
  };

  const myForm = useForm({
    initialValues: {
      email: '',
      name: '',
      password: '',
      password2: '',
      terms: false
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) =>
        value.length <= 6 ? 'Password should include at least 6 characters' : null,
      password2: (value, values) =>
        value !== values.password ? 'Passwords did not match' : null,
      terms: (value) => !value && 'Please accept the terms'
    }
  });
  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={30} pt={70}>
        <Flex direction={'column'} gap={20}>
          <Flex>
            <Title order={1} size={40}>
              let&apos;s make&nbsp;
            </Title>
            <Text
              component={Title}
              fw={900}
              variant={'gradient'}
              gradient={{ from: 'orange', to: 'cyan', deg: 90 }}
              style={{ fontSize: 40 }}
            >
              memrys
            </Text>
          </Flex>
          <form onSubmit={myForm.onSubmit((values) => postRegister(values))}>
            <Stack>
              {type === 'register' && (
                <TextInput
                  required
                  label={'Name'}
                  placeholder={'Your name'}
                  value={myForm.values.name}
                  onChange={(event) => myForm.setFieldValue('name', event.currentTarget.value)}
                  radius={'md'}
                />
              )}
              <TextInput
                required
                label={'Email'}
                placeholder={'hello@mantine.dev'}
                value={myForm.values.email}
                onChange={(event) => myForm.setFieldValue('email', event.currentTarget.value)}
                error={myForm.errors.email}
                radius={'md'}
              />
              <PasswordInput
                required
                label={'Password'}
                placeholder={'Your password'}
                value={myForm.values.password}
                onChange={(event) => myForm.setFieldValue('password', event.currentTarget.value)}
                error={myForm.errors.password}
                radius={'md'}
              />
              {type === 'register' && (
                <>
                  <PasswordInput
                    required
                    label={''}
                    placeholder={'Confirm your password'}
                    value={myForm.values.password2}
                    onChange={(event) =>
                      myForm.setFieldValue('password2', event.currentTarget.value)
                    }
                    error={myForm.errors.password2}
                    radius={'md'}
                  />
                  <Checkbox
                    label={'I accept terms and conditions'}
                    checked={myForm.values.terms}
                    onChange={(event) => myForm.setFieldValue('terms', event.currentTarget.checked)}
                    error={myForm.errors.terms}
                  />
                </>
              )}
            </Stack>
            <Group justify={'space-between'} mt={'xl'}>
              <Anchor
                component={'button'}
                type={'button'}
                c={'dimmed'}
                onClick={handleChange}
                size={'xs'}
              >
                {type === 'register'
                  ? 'Already have an account? Login'
                  : "Don't have an account? Register"}
              </Anchor>
              <Button type={'submit'} radius={'xl'}>
                {upperFirst(type)}
              </Button>
            </Group>
          </form>
        </Flex>
      </Paper>
    </div>
  );
};

export default Authentication;
