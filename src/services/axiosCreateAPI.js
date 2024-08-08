
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

const deleteUser = (_id) => {
    return instance.delete(`/api/v1/user/${_id}`)
}

const getListBookWithPaginate = (query) => {

    return instance.get(`/api/v1/book?${query}`)
}

const getCategoryBook = () => {

    return instance.get('/api/v1/database/category');
}

const postUploadImgBook = (fileImg) => {
    const formDataBook = new FormData();

    formDataBook.append('fileImg', fileImg);
    return instance({
        method: 'post',
        url: '/api/v1/file/upload',
        data: formDataBook,
        headers: {
            'Content-Type': `multipart/form-data`,
            'upload-type': 'book'
        },
    })
}

const postCreateABook = (thumbnail, 
    slider, 
    mainText, 
    author, 
    price, 
    sold, 
    quantity, 
    category) => {
    
    return instance.post('/api/v1/book', {thumbnail, slider, mainText, author, price, sold, quantity,
        category
    })
}

const deleteABook = (_id) => {
    return instance.delete(`/api/v1/book/${_id}`)
}

const updateABook = (_id, thumbnail, slider, mainText, author, price, sold, quantity, category) => {
    
    return instance.put(`/api/v1/book/${_id}`, {thumbnail, slider, mainText, author, price, sold,quantity,category})
}

export {
    Register,
    Login,
    fetchAccount,
    Logout,
    getUserWithPaginate,
    postCreateUser,
    postCreateListUserBulk,
    putUpdateUser,
    deleteUser,
    getListBookWithPaginate,
    getCategoryBook,
    postUploadImgBook,
    postCreateABook,
    deleteABook,
    updateABook
}