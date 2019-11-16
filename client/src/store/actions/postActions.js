import axios from 'axios';

import {
  ADD_POST,
  GET_ERRORS,
  GET_POSTS,
  POST_LOADING,
  DELETE_POST,
  GET_POST,
} from './types';

// Add post
export const addPost = postData => async dispatch => {
  try {
    let res = await axios.post('/api/posts', postData);
    dispatch({
      type: ADD_POST,
      payload: res.data,
    });
  } catch (e) {
    dispatch({
      type: GET_ERRORS,
      payload: e.response.data,
    });
  }
};

// get posts
export const getPosts = () => async dispatch => {
  dispatch(setPostLoading);
  try {
    let res = await axios.get('/api/posts');
    dispatch({
      type: GET_POSTS,
      payload: res.data,
    });
  } catch (e) {
    dispatch({
      type: GET_POSTS,
      payload: null,
    });
  }
};

// set loading state
export const setPostLoading = () => {
  return {
    type: POST_LOADING,
  };
};

// delete post
export const deletePost = id => async dispatch => {
  try {
    await axios.delete(`/api/posts/${id}`);
    dispatch({
      type: DELETE_POST,
      payload: id,
    });
  } catch (e) {
    dispatch({
      type: GET_ERRORS,
      payload: e.response.data,
    });
  }
};

// add like
export const addLike = id => async dispatch => {
  try {
    await axios.post(`/api/posts/like/${id}`);
    dispatch(getPosts());
  } catch (e) {
    dispatch({
      type: GET_ERRORS,
      payload: e.response.data,
    });
  }
};

// remove like
export const removeLike = id => async dispatch => {
  try {
    await axios.delete(`/api/posts/unlike/${id}`);
    dispatch(getPosts());
  } catch (e) {
    dispatch({
      type: GET_ERRORS,
      payload: e.response.data,
    });
  }
};

// get post
export const getPost = id => async dispatch => {
  dispatch(setPostLoading);
  try {
    let res = await axios.get(`/api/posts/${id}`);
    dispatch({
      type: GET_POST,
      payload: res.data,
    });
  } catch (e) {
    dispatch({
      type: GET_POST,
      payload: null,
    });
  }
};

// Add comment
export const addComment = (postId, commentData) => async dispatch => {
  try {
    let res = await axios.post(`/api/posts/comment/${postId}`, commentData);
    dispatch({
      type: GET_POST,
      payload: res.data,
    });
  } catch (e) {
    dispatch({
      type: GET_ERRORS,
      payload: e.response.data,
    });
  }
};

// delete comment
export const deleteComment = (postId, commentId) => async dispatch => {
  try {
    let res = await axios.delete(`/api/posts/comment/${postId}/${commentId}`);
    dispatch({
      type: GET_POST,
      payload: res.data,
    });
  } catch (e) {
    dispatch({
      type: GET_ERRORS,
      payload: e.response.data,
    });
  }
};
