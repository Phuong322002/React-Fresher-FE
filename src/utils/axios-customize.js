import axios from 'axios';
import.meta.env.VITE_BACKEND_URL

//Instance:
const instance = axios.create({
    baseURL: 'http://localhost:8080',
    withCredentials: true,
  });

  //Sending the bearer token with axios
  instance.defaults.headers.common = {'Authorization': `Bearer ${localStorage.getItem('access_token')}`}

//Interceptor:
// Add a request interceptor
instance.interceptors.request.use(function (config) {
    // Do something before request is sent
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

// Add a response interceptor
instance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    console.log('>> check rs axios: ',response.data)
    return response && response.data ? response.data : response;
  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error

    console.log(">> check err: ",error.response.data)
    return error && error.response && error.response.data ? error.response.data : Promise.reject(error);
  });

  export default instance