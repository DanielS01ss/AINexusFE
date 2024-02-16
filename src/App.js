import logo from './logo.svg';
import './App.css';
import DataProcessing from './components/DataProcessing/DataProcessing.js';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import SignInSide from './components/login/SignInSide';
import SignUp from './components/login/SignUpSide';
import { LandingPage } from './components/landing_page/LandingPage';

function App() {

  const router = createBrowserRouter([{
    path:'/',
    element:<LandingPage/>
  },
  {
    path:'/login',
    element:<SignInSide></SignInSide>
  },
  {
    path:'/signup',
    element:<SignUp></SignUp>
  },
  {
      path:'/pipelines',
      element:<DataProcessing/>
  }

  ]);

  return (
    <div className="App">
      <RouterProvider router={router}/>
    </div>
  );
}

export default App;
