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
import { useNavigate, useSearchParams } from 'react-router-dom';
import classes from '../../src/Authentication.module.css';

const Authentication = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('mode');
  const [type, toggle] = useToggle(['login', 'register']);
  const navigate = useNavigate();

  useEffect(() => {
    if (query && type !== query) {
      toggle(query);
    }
  }, []);

  const handleChange = () => {
    setSearchParams(`mode=${type === 'login' ? 'register' : 'login'}`);
    toggle();
  };

  const form = useForm({
    initialValues: {
      email: '',
      name: '',
      password: '',
      confirmPassword: '',
      terms: false
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) =>
        value.length <= 6 ? 'Password should include at least 6 characters' : null,
      confirmPassword: (value, values) =>
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
          <form onSubmit={() => navigate('/')}>
            <Stack>
              {type === 'register' && (
                <TextInput
                  label={'Name'}
                  placeholder={'Your name'}
                  value={form.values.name}
                  onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
                  radius={'md'}
                />
              )}
              <TextInput
                required
                label={'Email'}
                placeholder={'hello@mantine.dev'}
                value={form.values.email}
                onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
                error={form.errors.email}
                radius={'md'}
              />
              <PasswordInput
                required
                label={'Password'}
                placeholder={'Your password'}
                value={form.values.password}
                onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
                error={form.errors.password}
                radius={'md'}
              />
              {type === 'register' && (
                <>
                  <PasswordInput
                    required
                    label={''}
                    placeholder={'Confirm your password'}
                    value={form.values.confirmPassword}
                    onChange={(event) =>
                      form.setFieldValue('confirmPassword', event.currentTarget.value)
                    }
                    error={form.errors.confirmPassword}
                    radius={'md'}
                  />
                  <Checkbox
                    label={'I accept terms and conditions'}
                    checked={form.values.terms}
                    onChange={(event) => form.setFieldValue('terms', event.currentTarget.checked)}
                    error={form.errors.terms}
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
