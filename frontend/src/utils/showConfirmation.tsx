import { notifications } from '@mantine/notifications';
import { Check } from 'react-feather';
const showConfirmation = async (message: string, loadTime: number, closeTime: number) => {
  const id = notifications.show({
    loading: true,
    message: 'Connecting...',
    autoClose: false,
    withCloseButton: false
  });
  await new Promise<void>((resolve) => {
    setTimeout(() => {
      notifications.update({
        id,
        color: 'teal',
        title: 'Success!',
        message,
        icon: <Check style={{ width: 18, height: 18 }} />,
        loading: false,
        autoClose: closeTime
      });
      resolve();
    }, loadTime);
  });
};

export default showConfirmation;
