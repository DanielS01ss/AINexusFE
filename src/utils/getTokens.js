export const getToken = (token)=>{
    return localStorage.getItem("token",token);
}

export const getRefreshToken = (refreshTk)=>{
    return localStorage.getItem("refreshToken",refreshTk);
}