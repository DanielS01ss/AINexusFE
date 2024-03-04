import logo from './logo.svg';
import './App.css';
import DataProcessing from './components/DataProcessing/DataProcessing.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SignInSide from './components/login/SignInSide';
import SignUp from './components/login/SignUpSide';
import { LandingPage } from './components/landing_page/LandingPage';
import PrivateRoutes from './components/PrivateRoutes/PrivateRoutes.js';
import Error from './components/NotFound/NotFound.js';

function App() {

  return (
    <div className="App">
       <Router>
          <Routes>
            <Route element={<PrivateRoutes />}>
                <Route element={<DataProcessing/>} path="/pipelines"/>
            </Route>
            <Route element={<SignInSide/>} path="/login"/>
            <Route element={<SignUp/>} path="/signup"/>
            <Route element={<LandingPage/>} path="/"/>
            <Route element={<Error/>} path='*' />
          </Routes>
      </Router>
    </div>
  );
}

export default App;
