import { notifications } from '@mantine/notifications';
import { Check } from 'react-feather';
const showConfirmation = (response: string, loadTime: number, closeTime: number) => {
  const id = notifications.show({
    loading: true,
    message: 'Sending data',
    autoClose: false,
    withCloseButton: false
  });
  setTimeout(() => {
    notifications.update({
      id,
      color: 'teal',
      title: 'Success!',
      message: response,
      icon: <Check style={{ width: 18, height: 18 }} />,
      loading: false,
      autoClose: closeTime
    });
  }, loadTime);
};

export default showConfirmation;
