import { useSelector } from "react-redux"
import NotAd from "./notAdmin"

const CheckAdmin = (props) => {

    const user = useSelector(state => state.account.user)
    const isLoading = useSelector(state => state.account.isLoading)

    const checkAd = user.role
    const routerAd = window.location.pathname.startsWith('/admin')


    return (
        <>
            {routerAd && checkAd === 'ADMIN'
                ?
                <>{props.children}</>
                :
                <NotAd />
            }
        </>
    )
}

export default CheckAdmin