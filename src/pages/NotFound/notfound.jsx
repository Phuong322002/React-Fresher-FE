
import { Button, Result } from 'antd';
import { NavLink } from 'react-router-dom';
const NotFoundPage = () => {

    return (
        <>
            <Result
                status="404"
                title="404"
                subTitle="Sorry, you are not authorized to access this page."
                extra={<Button type="primary"><NavLink to='/'>Back Home</NavLink></Button>}
            />
        </>
    )
}

export default NotFoundPage