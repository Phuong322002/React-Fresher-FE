import { Button, Result } from 'antd';
import { NavLink } from 'react-router-dom';

const NotAd = () => {

    return (
        <>
            <Result
                status="403"
                title="403"
                subTitle="Sorry, you are not authorized to access this page."
                extra={<Button type="primary"><NavLink to='/'>Back Home</NavLink></Button>}
            />
        </>
    )
}

export default NotAd