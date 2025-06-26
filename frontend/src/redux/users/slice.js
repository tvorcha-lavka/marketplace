import { createSlice } from '@reduxjs/toolkit';
import {
  fetchUsers,
  fetchUserById,
  updateUser,
  updateUserSecurity,
  deleteUser,
} from './operations';

const handlePending = (state) => {
  state.loading = true;
  state.error = false;
};

const handleRejected = (state, action) => {
  state.loading = false;
  state.error = action.payload;
};

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    list: [],
    count: 0,
    next: null,
    previous: null,
    selectedUser: null,
    isEditingPersonal: false,
    isEditingSecurity: false,
    loading: false,
    error: false,
  },
  reducers: {
    clearSelectedUser(state) {
      state.selectedUser = null;
    },
    setSelectedUser(state, action) {
      state.selectedUser = action.payload;
    },
    setIsEditingPersonal(state, action) {
      state.isEditingPersonal = action.payload;
    },
    setIsEditingSecurity(state, action) {
      state.isEditingSecurity = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, handlePending)
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.results;
        state.count = action.payload.count;
        state.next = action.payload.next;
        state.previous = action.payload.previous;
      })
      .addCase(fetchUsers.rejected, handleRejected)

      .addCase(fetchUserById.pending, handlePending)
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
      })
      .addCase(fetchUserById.rejected, handleRejected)

      .addCase(updateUser.pending, handlePending)
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
      })
      .addCase(updateUser.rejected, handleRejected)

      .addCase(updateUserSecurity.pending, handlePending)
      .addCase(updateUserSecurity.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = {
          ...state.selectedUser,
          ...action.payload,
        };
        state.isEditingSecurity = false;
      })
      .addCase(updateUserSecurity.rejected, handleRejected)

      .addCase(deleteUser.pending, handlePending)
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter((user) => user.id !== action.payload);
      })
      .addCase(deleteUser.rejected, handleRejected);
  },
});

export const {
  clearSelectedUser,
  setSelectedUser,
  setIsEditingPersonal,
  setIsEditingSecurity,
} = usersSlice.actions;

export const usersReducer = usersSlice.reducer;
