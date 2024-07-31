
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

const Logout = () => {
    return instance.post('/api/v1/auth/logout');
}

const getUserWithPaginate = (query) => {
    return instance.get(`/api/v1/user?${query}`)
}

const postCreateUser = (fullName, password, email, phone) => {
    return instance.post('/api/v1/user', {fullName, password, email, phone})
}

const postCreateListUserBulk = (dataFileUser) => {

    return instance.post('/api/v1/user/bulk-create', [...dataFileUser])
}

const putUpdateUser = (_id, fullName, phone ) => {

    return instance.put('/api/v1/user', {_id, fullName, phone })
}

export {
    Register,
    Login,
    fetchAccount,
    Logout,
    getUserWithPaginate,
    postCreateUser,
    postCreateListUserBulk,
    putUpdateUser
}