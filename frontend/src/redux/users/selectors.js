export const selectUsersList = (state) => state.users.list;

export const selectUsersCount = (state) => state.users.count;

export const selectSelectedUser = (state) => state.users.selectedUser;

export const selectEditingSecurity = (state) => state.users.isEditingSecurity;

export const selectEditingPersonal = (state) => state.users.isEditingPersonal;

export const selectUserLoading = (state) => state.users.loading;

export const selectUserError = (state) => state.users.error;
