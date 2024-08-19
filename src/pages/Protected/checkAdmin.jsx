import { useSelector } from "react-redux"
import NotAd from "./notAdmin"

const CheckAdmin = (props) => {

    const user = useSelector(state => state.account.user)
    const isLoading = useSelector(state => state.account.isLoading)

    const checkRole = user.role
    const routerAd = window.location.pathname.startsWith('/admin')


    return (
        <>
            {routerAd && checkRole === 'ADMIN' || !routerAd && checkRole === 'USER' || checkRole === 'ADMIN'
                ?
                <>{props.children}</>
                :
                <NotAd />
            }
        </>
    )
}

export default CheckAdmin