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



      ///////////// b2) REFRESH_TOKEN KHI ACCESS_TOKEN HẾT HẠN
          const updateToken = async () => {
            const response = await instance.get('/api/v1/auth/refresh')
            console.log('>> Check rs rf tk:', response)
            if(response && response.data.access_token){
              return response.data.access_token
            }else null
            
          }


  const NO_RETRY_HEADER = 'x-no-retry'
      ////////////////////////////////////////////////////////////
// Add a response interceptor
instance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    console.log('>> check rs axios: ',response.data)
    return response && response.data ? response.data : response;
  }, async function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error

     ///////////// b1) REFRESH_TOKEN KHI ACCESS_TOKEN HẾT HẠN
     if (error.config && error.response && +error.response.status === 401 && !error.config.headers[NO_RETRY_HEADER]) {
      //PHÂN TÍCH:
      // TA CÓ MỘT HÀM ĐỂ GỌI API LẤY TOKEN MỚI 
      // SAU ĐÓ TA CONFIG LẠI ACCESS_TOKEN VỚI TOKEN MỚI
      const access_token = await updateToken()
      console.log('>> Check access_token: ', access_token)
      // retry with new token
      error.config.headers[NO_RETRY_HEADER] = 'true' // string val only

      if(access_token ) {
        error.config.headers['Authorization'] = `Bearer ${access_token}`
        localStorage.setItem('access_token', access_token)
        return instance.request(error.config);
      }
      // return updateToken().then((token) => {
      //   error.config.headers.xxxx <= set the token
      //   return axios.request(config);
      // });
    }

    ////// b3) Trường hợp refresh_token cũng hết hạn
    if(error.config && error.response && +error.response.status === 400 && error.config.url === '/api/v1/auth/refresh'){
      window.location.href='/login'
  }
  ////////////////////////////////////////////////////////////////

    console.log(">> check err: ",error.response.data)
    return error && error.response && error.response.data ? error.response.data : Promise.reject(error);
  });

  export default instance