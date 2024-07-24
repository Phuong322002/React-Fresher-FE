import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { Outlet } from "react-router-dom";

import LoginPage from "./pages/Login/loginComponent";
import HeaderComponent from './components/headerComponent/headerComponent'
import FooterComponent from './components/footerComponent/footerComponent'
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
import ProtectedRouter from "./pages/Protected/protectedRouter";
import LayoutAdmin from './components/Admin/layoutAdmin';
import AdminPage from "./pages/Admin/admin";
import './styles/app.scss'
import UserTableAdmin from "./components/userAdmin/userAdmin";

const Layout = () => {
  return (
    <div className="layout-main" style={{ position: 'relative', border: '1px solid', height: '100vh' }}>
      <div className="header">
        <HeaderComponent />
      </div>

      <div className="content">
        <Outlet />
      </div>

      <div className="footer">
        <FooterComponent />
      </div>
    </div>
  )
}

// const LayoutAdmin = () => {

//   const user = useSelector(state => state.account.user)

//   const isAd = user.role
//   console.log('>> check role: ', isAd)
//   return (
//     <>
//       {window.location.pathname.startsWith('/admin') && isAd === 'ADMIN'
//         &&
//         <div className="header">
//           <HeaderComponent />
//         </div>}

//       <div className="content">
//         <Outlet />
//       </div>

//       {window.location.pathname.startsWith('/admin') && isAd === 'ADMIN'
//         &&
//         <div className="footer">
//           <FooterComponent />
//         </div>
//       }

//     </>
//   )
// }


const App = () => {

  const isLoading = useSelector(state => state.account.isLoading)

  const dispatch = useDispatch()

  const getDataUSer = async () => {
    if (window.location.pathname === '/login'
      // || window.location.pathname === '/'
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
      element: <ProtectedRouter>
        <LayoutAdmin />
      </ProtectedRouter>,
      errorElement: <NotFoundPage />,
      children: [
        {
          index: true, element:
            <ProtectedRouter>
              <AdminPage />
            </ProtectedRouter>
        },
        {
          path: 'user',
          element: <UserTableAdmin />
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
      {isLoading === false ||
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