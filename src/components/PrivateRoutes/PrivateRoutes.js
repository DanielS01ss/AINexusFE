import { Outlet, Navigate } from 'react-router-dom'


const PrivateRoutes = () => {
    const checkIfUserIsLoggedIn = ()=>{
        const token = localStorage.getItem("token");
        const refreshToken = localStorage.getItem("refreshToken");
        
        if(token && refreshToken && token.length !==0 && refreshToken.length !== 0){
            return true;
        }
       
        return false;
    }
    
    return(
        checkIfUserIsLoggedIn() ? <Outlet/> : <Navigate to="/login"/>
    )
}

export default PrivateRoutes