import { toast } from 'react-hot-toast';

import ErrorToast from './ErrorToast';
import SuccessToast from './SuccessToast';

const toastComponents = {
  success: SuccessToast,
  error: ErrorToast,
};

export default function showToast(message, type = 'error') {
  const ToastComponent = toastComponents[type] || ErrorToast;

  toast.custom(<ToastComponent message={message} />);
}
