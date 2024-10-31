import { notifications } from '@mantine/notifications';
import { Check, UploadCloud } from 'react-feather';
const showConfirmation = async (
  message: string,
  loadTime: number,
  closeTime: number,
  pending: boolean
) => {
  const id = notifications.show({
    loading: true,
    message: 'Connecting...',
    autoClose: false,
    withCloseButton: false,
    style: { boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }
  });
  await new Promise<void>((resolve) => {
    setTimeout(() => {
      notifications.update({
        id,
        message,
        color: 'teal',
        title: pending ? '' : 'Success!',
        icon: pending ? (
          <UploadCloud style={{ width: 18, height: 18 }} />
        ) : (
          <Check style={{ width: 18, height: 18 }} />
        ),
        loading: false,
        autoClose: closeTime
      });
      resolve();
    }, loadTime);
  });
};

export default showConfirmation;
