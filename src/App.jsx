import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { Outlet } from "react-router-dom";

import LoginPage from "./pages/Login/loginComponent";
import HeaderComponent from "./components/headerComponent";
import FooterComponent from "./components/footerComponent";
import HomePage from "./pages/Login/Home/homePage";

import Ex1 from "./pages/Login/ex/ex1";
import Ex2 from "./pages/Login/ex/exx2";

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

const ErrorPage = () => {
  return (
    <>
      404 Not found page with this router!
    </>
  )
}


const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true, element: <HomePage />
        },
        {
          path: '/ex1',
          element: <Ex1 />
        },
        {
          path: '/ex2',
          element: <Ex2 />
        }
      ]
    },
    {
      path: "/login",
      element: <LoginPage />,

    }
  ])
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App