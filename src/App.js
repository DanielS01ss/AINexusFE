import logo from './logo.svg';
import './App.css';
import DataProcessing from './components/DataProcessing/DataProcessing.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SignInSide from './components/login/SignInSide';
import SignUp from './components/login/SignUpSide';
import { LandingPage } from './components/landing_page/LandingPage';
import PrivateRoutes from './components/PrivateRoutes/PrivateRoutes.js';
import Error from './components/NotFound/NotFound.js';
import MyModelsPage from './components/Models/MyModelsPage/MyModelsPage.js';
import ModelDetails from './components/Models/ModelDetails/ModelDetails.js';
import ModelStatistics from './components/DataProcessing/Model_statistics/ModelStatistics.js';
import SavedPipelines from './components/DataProcessing/SavedPipelines/SavedPipelines.js';

function App() {

  return (
    <div className="App">
       <Router>
          <Routes>
            <Route element={<PrivateRoutes />}>
                <Route element={<DataProcessing/>} path="/pipelines"/>
                <Route element={<MyModelsPage/>} path="/models" />
                <Route element={<ModelDetails/>} path="/model-details" />
                <Route element={<ModelStatistics/>} path="/model-statistics" />
                <Route element={<SavedPipelines/>} path="/saved-pipelines"/>
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
