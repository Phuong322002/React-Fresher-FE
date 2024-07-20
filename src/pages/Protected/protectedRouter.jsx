import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"

import CheckAdmin from "./checkAdmin"
const ProtectedRouter = (props) => {


    const isAuthenticated = useSelector(state => state.account.isAuthenticated)
    return (
        <>
            {isAuthenticated === true
                ?
                <CheckAdmin>
                    {props.children}
                </CheckAdmin>
                :
                <Navigate to='/login' replace />

            }
        </>
    )
}

export default ProtectedRouter