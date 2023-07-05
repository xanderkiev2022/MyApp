import { createAction } from '@reduxjs/toolkit';

export const getRefreshUserAction = createAction('auth/refreshUser');
export const getRefreshDatabaseAction = createAction('auth/refreshDatabase');