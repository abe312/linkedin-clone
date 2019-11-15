import axios from 'axios';

import {
  GET_PROFILE,
  PROFILE_LOADING,
  GET_ERRORS,
  CLEAR_CURRENT_PROFILE,
  SET_CURRENT_USER,
  GET_PROFILES,
} from './types';

// get current profile
export const getCurrentProfile = () => async dispatch => {
  dispatch(setProfileLoading());
  try {
    let res = await axios.get('/api/profile');
    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });
  } catch (e) {
    dispatch({
      type: GET_PROFILE,
      payload: {},
    });
  }
};

// Profile loading
export const setProfileLoading = () => {
  return {
    type: PROFILE_LOADING,
  };
};

// Clear profile
export const clearCurrentProfile = () => {
  return {
    type: CLEAR_CURRENT_PROFILE,
  };
};

// create profile
export const createProfile = (profileData, history) => async dispatch => {
  try {
    await axios.post('/api/profile', profileData);
    history.push('/dashboard');
  } catch (e) {
    dispatch({
      type: GET_ERRORS,
      payload: e.response.data,
    });
  }
};

// delete account & profile
export const deleteAccount = () => async dispatch => {
  if (window.confirm('Are you sure? This can NOT be undone!')) {
    try {
      await axios.delete('/api/profile');
      dispatch({
        type: SET_CURRENT_USER,
        payload: {},
      });
    } catch (e) {
      dispatch({
        type: GET_ERRORS,
        payload: e.response.data,
      });
    }
  }
};

// add experience
export const addExperience = (expData, history) => async dispatch => {
  try {
    await axios.post('/api/profile/experience', expData);
    history.push('/dashboard');
  } catch (e) {
    dispatch({
      type: GET_ERRORS,
      payload: e.response.data,
    });
  }
};

// add education
export const addEducation = (eduData, history) => async dispatch => {
  try {
    await axios.post('/api/profile/education', eduData);
    history.push('/dashboard');
  } catch (e) {
    dispatch({
      type: GET_ERRORS,
      payload: e.response.data,
    });
  }
};

// delete experience
export const deleteExperience = id => async dispatch => {
  try {
    const res = await axios.delete(`/api/profile/experience/${id}`);
    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });
  } catch (e) {
    dispatch({
      type: GET_ERRORS,
      payload: e.response.data,
    });
  }
};

// delete education
export const deleteEducation = id => async dispatch => {
  try {
    const res = await axios.delete(`/api/profile/education/${id}`);
    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });
  } catch (e) {
    dispatch({
      type: GET_ERRORS,
      payload: e.response.data,
    });
  }
};

// get all profiles
export const getProfiles = () => async dispatch => {
  dispatch(setProfileLoading());
  try {
    const res = await axios.get('/api/profile/all');
    console.log(res, 'here');
    dispatch({
      type: GET_PROFILES,
      payload: res.data,
    });
  } catch (e) {
    dispatch({
      type: GET_PROFILES,
      payload: null,
    });
  }
};

// get profile by handle
export const getProfileByHandle = handle => async dispatch => {
  dispatch(setProfileLoading());
  try {
    let res = await axios.get(`/api/profile/handle/${handle}`);
    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });
  } catch (e) {
    dispatch({
      type: GET_PROFILE,
      payload: null,
    });
  }
};
