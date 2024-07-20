
import instance from '../utils/axios-customize'

const Register = (fullName, email, password, phone) => {

    return instance.post('/api/v1/user/register', {
        fullName: fullName,
        email: email,
        password: password,
        phone: phone
    })
}

const Login = (username, password) => {

    return instance.post('/api/v1/auth/login', {
        username,
        password,
        delay: 3000
    })
}

const fetchAccount = () => {

    return instance.get('/api/v1/auth/account')
}

export {
    Register,
    Login,
    fetchAccount
}