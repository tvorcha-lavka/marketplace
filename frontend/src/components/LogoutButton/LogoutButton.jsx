import { useDispatch } from 'react-redux';

import { logOut } from '../../redux/auth/operations';

import CustomButton from '../CustomButton/CustomButton';

export default function LogoutButton() {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logOut());
  };

  return (
    <CustomButton onClick={handleLogout} size="small">
      Logout
    </CustomButton>
  );
}
