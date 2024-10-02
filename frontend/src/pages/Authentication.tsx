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
import { FormEvent, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import classes from '../../src/Authentication.module.css';
import { postLogin, postRegister } from '../utils/postAuth.ts';
import showConfirmation from '../utils/showConfirmation.tsx';

const Authentication = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('mode');
  const [formType, toggle] = useToggle(['login', 'register']);
  const navigate = useNavigate();

  useEffect(() => {
    if (query && formType !== query) {
      toggle(query);
    }
  }, []);

  const handleChange = () => {
    setSearchParams(`mode=${formType === 'login' ? 'register' : 'login'}`);
    toggle();
  };

  const myForm = useForm({
    initialValues: {
      name: 'a',
      email: '',
      password: '111111',
      password2: '111111',
      terms: true
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) =>
        value.length < 6 ? 'Password should include at least 6 characters' : null,
      password2: (value, values) => (value !== values.password ? 'Passwords did not match' : null),
      terms: (value) => !value && 'Please accept the terms'
    }
  });

  const handleRegister = async () => {
    try {
      await postRegister(myForm.getValues());
    } catch (err: unknown) {
      console.error(err);
      alert(err as Error);
    }
  };

  const handleLogin = async () => {
    try {
      const login = await postLogin(myForm.getValues());
      const resString = JSON.stringify(login);
      if (resString !== '{}') {
        alert(JSON.stringify(login.message));
        return true;
      } else {
        return false;
      }
    } catch (err: unknown) {
      console.error(err);
      alert(err as Error);
      return false;
    }
  };

  const handleSuccess = () => {
    const loadTime = 2000;
    const closeTime = 2000;
    showConfirmation(
      formType === 'register' ? 'Please login' : 'You are now logged in',
      loadTime,
      closeTime
    );
    setTimeout(() => {
      myForm.reset();
      if (formType === 'register') {
        setSearchParams('mode=login');
        toggle();
      } else {
        navigate('/');
      }
    }, loadTime + closeTime);
  };
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (formType === 'register') {
      await handleRegister();
    } else {
      const login = await handleLogin();
      if (login) {
        handleSuccess();
      } else {
        alert('there was a problem logging you in');
      }
    }
  };
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
          <form onSubmit={handleSubmit}>
            <Stack>
              {formType === 'register' && (
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
                placeholder={'hello@test.com'}
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
              {formType === 'register' && (
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
                {formType === 'register'
                  ? 'Already have an account? Login'
                  : "Don't have an account? Register"}
              </Anchor>
              <Button type={'submit'} radius={'xl'}>
                {upperFirst(formType)}
              </Button>
            </Group>
          </form>
        </Flex>
      </Paper>
    </div>
  );
};

export default Authentication;
