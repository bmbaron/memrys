import { notifications } from '@mantine/notifications';
import { Check } from 'react-feather';
const showConfirmation = async (message: string, loadTime: number, closeTime: number) => {
  const id = notifications.show({
    loading: true,
    message: 'Connecting...',
    autoClose: false,
    withCloseButton: false,
    style: { boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px'  }
  });
  await new Promise<void>((resolve) => {
    setTimeout(() => {
      notifications.update({
        id,
        message,
        color: 'teal',
        title: 'Success!',
        icon: <Check style={{ width: 18, height: 18 }} />,
        loading: false,
        autoClose: closeTime,
      });
      resolve();
    }, loadTime);
  });
};

export default showConfirmation;
