import axios from 'axios';
import { GET_ERRORS, SET_CURRENT_USER } from './types';
import setAuthToken from '../../utils/setAuthToken';
import jwt_decode from 'jwt-decode';

// Register
export const registerUser = (userData, history) => async dispatch => {
  try {
    let data = await axios.post('/api/users/register', userData);
    console.log(data);
    history.push('/login');
  } catch (e) {
    console.log(e.response.data);
    // this.setState({ errors: e.response.data });
    dispatch({
      type: GET_ERRORS,
      payload: e.response.data,
    });
  }
};

// login - get usr token
export const loginUser = userData => async dispatch => {
  try {
    let res = await axios.post('/api/users/login', userData);
    const { token } = res.data;

    // set token to ls
    localStorage.setItem('jwtToken', token);

    // set token to auth header
    setAuthToken(token);

    // decode token to get user data
    const decoded = jwt_decode(token);

    // set current user
    dispatch(setCurrentUser(decoded));
  } catch (e) {
    console.log(e.response.data);
    dispatch({
      type: GET_ERRORS,
      payload: e.response.data,
    });
  }
};

// set logged in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded,
  };
};

// log user out
export const logoutUser = () => dispatch => {
  // remove token from localStorage
  localStorage.removeItem('jwtToken');
  // remove auth header for future requests
  setAuthToken(false);

  // set current user to {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
};
