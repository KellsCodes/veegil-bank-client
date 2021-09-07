import axios from 'axios';

// "proxy": "http://localhost:5000"
// create an API instance to make calls to the base url
// production
const API = axios.create({ baseURL: "https://veegil-b.herokuapp.com/user", withCredentials: true, });
// development
// const API = axios.create({ baseURL: "http://localhost:5000/user", withCredentials: true, });

// axios interceptor when a user tampers his token or the token expires
API.interceptors.response.use(
  (response) => 
    new Promise((resolve, reject)=>{
      resolve(response);
    }),
  (error) => {
    // check if error is coming from front end and not server
    if(!error.response) {
      return new Promise((resolve, reject)=>{
        reject(error);
      });
    }
    // otherwise check if the response is forbidden or unauthentication
    if (error.response.status === 401 || error.response.status === 403) {
      // check if window location is on auth to terminate browser refresh
      if(window.location.pathname == "/signin") {
        return
      } else {
        // redirect user to sign in screen
          return window.location='/signin';
        }
    } else {
      return new Promise((resolve, reject)=>{
        reject(error);
      });
    }
  }
);

// export const logoutUser = () => API.get('/signout'); dev
export const logoutUser = () => API.get('/signout', {credentials: "include"}); //production
export const signInUser = (formData) => API.post('/signin', formData);
export const createUser = (formData) => API.post('/signup', formData);
export const deposit = (formData) => API.post('/deposit', formData);
export const withdraw = (formData) => API.post('/withdraw', formData);
export const transfer = (formData) => API.post('/transfer', formData);
export const history = (date) => API.post("/history", date);
export const authenticatedUser = () => API.get('/authenticated');
export const getUsers = () => API.get('/admin/manage');
export const delete_a_user = (id) => API.delete(`/admin/manage/${id}`);
