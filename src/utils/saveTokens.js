export const saveToken = (token)=>{
    localStorage.setItem("token",token);
}

export const saveRefreshToken = (refreshTk)=>{
    localStorage.setItem("refreshToken",refreshTk);
}