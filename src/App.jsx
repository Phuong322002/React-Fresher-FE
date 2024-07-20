import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { Outlet } from "react-router-dom";

import LoginPage from "./pages/Login/loginComponent";
import HeaderComponent from "./components/headerComponent";
import FooterComponent from "./components/footerComponent";
import HomePage from "./pages/Home/homePage";

import Ex1 from "./pages/ex/ex1";
import Ex2 from "./pages/ex/exx2";
import RegisterComponent from "./pages/Resgister/register";
import { useEffect } from "react";
import { fetchAccount } from "./services/axiosCreateAPI";
import { useDispatch } from "react-redux";
import { doFetchUserAction } from "./redux/account/accountSlice";
import NotFoundPage from "./pages/NotFound/notfound";
import LoadingComponent from "./components/Loading/loadingComponent";
import { useSelector } from "react-redux";
import AdminPage from "./pages/Admin/admin";
import ProtectedRouter from "./pages/Protected/protectedRouter";

const Layout = () => {
  return (
    <>
      <div className="header">
        <HeaderComponent />
      </div>

      <div className="content">
        <Outlet />
      </div>

      <div className="footer">
        <FooterComponent />
      </div>
    </>
  )
}

const LayoutAdmin = () => {

  const user = useSelector(state => state.account.user)

  const isAd = user.role
  console.log('>> check role: ', isAd)
  return (
    <>
      {window.location.pathname.startsWith('/admin') && isAd === 'ADMIN'
        &&
        <div className="header">
          <HeaderComponent />
        </div>}

      <div className="content">
        <Outlet />
      </div>

      {window.location.pathname.startsWith('/admin') && isAd === 'ADMIN'
        &&
        <div className="footer">
          <FooterComponent />
        </div>
      }

    </>
  )
}


const App = () => {

  const isAuthenticated = useSelector(state => state.account.isAuthenticated)

  const dispatch = useDispatch()

  const getDataUSer = async () => {
    if (window.location.pathname === '/login'
      || window.location.pathname === '/'
      || window.location.pathname === '/register'
    ) return

    const response = await fetchAccount()
    console.log('>> check get data user: ', response)
    if (response && response.data) {
      dispatch(doFetchUserAction(response.data))
    }

  }
  useEffect(() => {
    getDataUSer()
  }, [])

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <NotFoundPage />,
      children: [
        {
          index: true, element: <HomePage />
        },
        {
          path: 'ex1',
          element: <Ex1 />
        },
        {
          path: 'ex2',
          element: <Ex2 />
        }
      ]
    },
    {
      path: "/admin",
      element: <LayoutAdmin />,
      errorElement: <NotFoundPage />,
      children: [
        {
          index: true, element:
            <ProtectedRouter>
              <AdminPage />
            </ProtectedRouter>
        },
        {
          path: 'ex1',
          element: <Ex1 />
        },
        {
          path: 'ex2',
          element: <Ex2 />
        }
      ]
    },
    {
      path: "/login",
      element: <LoginPage />,

    },
    {
      path: "/register",
      element: <RegisterComponent />
    }
  ])
  return (
    <>
      {isAuthenticated === true ||
        window.location.pathname === '/login' ||
        window.location.pathname === '/' ||
        window.location.pathname === '/register'
        ?
        <RouterProvider router={router} />
        :
        <LoadingComponent />
      }
    </>
  )
}

export default App