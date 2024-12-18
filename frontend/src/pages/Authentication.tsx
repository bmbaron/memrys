import {
  Anchor,
  Button,
  Checkbox,
  Flex,
  Group,
  Paper,
  PasswordInput,
  Stack,
  TextInput,
  Title
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { upperFirst, useToggle } from '@mantine/hooks';
import { FormEvent, useContext, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import classes from '../../src/Authentication.module.css';
import { getGradientColorText } from '../utils/gradientColorText.tsx';
import { postLogin, postRegister } from '../utils/postAuth.ts';
import showConfirmation from '../utils/showConfirmation.tsx';
import { UserContext } from '../utils/UserContext.tsx';

const Authentication = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('mode');
  const [formType, toggle] = useToggle(['login', 'register']);
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useContext(UserContext);

  useEffect(() => {
    localStorage.setItem('current_user', currentUser);
  }, [currentUser]);

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
      email: 'lara@croft.com',
      password: '12345678',
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
      const register = await postRegister(myForm.getValues());
      const resString = JSON.stringify(register);
      if (resString !== '{}') {
        return true;
      } else {
        return false;
      }
    } catch (err: unknown) {
      console.error((err as Error).message);
      return false;
    }
  };

  const handleLogin = async () => {
    try {
      const login = await postLogin(myForm.getValues());
      const resString = JSON.stringify(login);
      if (resString !== '{}') {
        setCurrentUser(login.name);
        return true;
      } else {
        return false;
      }
    } catch (err: unknown) {
      console.error((err as Error).message);
      return false;
    }
  };

  const handleSuccess = async (isRegister?: boolean) => {
    const loadTime = 2000;
    const closeTime = 2000;
    await showConfirmation(
      formType === 'register' ? 'Please login' : 'You are now logged in',
      loadTime,
      closeTime,
      false
    );
    myForm.reset();
    if (isRegister) {
      setSearchParams('mode=login');
      toggle();
    } else {
      console.log('logged in');
      navigate('/home');
    }
  };
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (formType === 'register') {
      const register = await handleRegister();
      if (register) {
        await handleSuccess(true);
      } else {
        alert('there was a problem logging you in');
      }
    } else {
      const login = await handleLogin();
      if (login) {
        await handleSuccess(false);
      } else {
        alert('there was a problem logging you in');
      }
    }
  };
  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={30} pt={70}>
        <Flex direction={'column'} gap={20}>
          <Flex style={{ fontSize: 40 }}>
            <Title order={1}>let&apos;s make&nbsp;</Title>
            {getGradientColorText('memrys', 'orange', 'cyan', 1)}
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
