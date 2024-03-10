import * as React from 'react';
import { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import axios from "axios";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AUTHENTICATION_LOGIN } from '../../utils/apiEndpoints';
import { saveToken, saveRefreshToken } from '../../utils/saveTokens';
import Alert from '@mui/material/Alert';
import { jwtDecode } from "jwt-decode";
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';


function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {''}
      <Link color="inherit" href="/">
        AI Nexus
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}



const defaultTheme = createTheme();

export default function SignIn() {

  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [emailErrorMsg,setEmailErrorMsg] = useState("");
  const [passwordErrorMsg, setPasswordErrorMsg] = useState("");
  const [isFormInValid, setIsFormInValid] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [firstTryEmail, setFirstTryEmail] = useState(true);
  const [firstTryPassword, setFirstTryPassword] = useState(true);
  const [unsuccessfulSubmit, setUnsuccessfulSubmit] = useState(false);
  const [alertErrorMessage, setAlertErrorMessage] = useState("");
  const [alertSuccessMessage, setAlertSuccessMessage] = useState("Success! Redirecting...");
  const [alertError, setAlertError] = useState(false);
  const [alertSuccess, setAlertSuccess] = useState(false);

  const navigate = useNavigate();
  const handleClick = () => {
        navigate('/pipelines');
  };

  const toggleAlert = (alert_type)=>{
    if(alert_type == "error"){
      setAlertError(true);
      setTimeout(()=>{
        setAlertError(false);
      },3000)
    } else if(alert_type == "success"){
      setAlertSuccess(true);
      setTimeout(()=>{
        setAlertSuccess(false);
      },3000)
    }
  }

  const authenticationRequest = async(auth_obj)=>{
    let response;
    try{
       response = await axios.post(AUTHENTICATION_LOGIN,auth_obj);
      saveToken(response.data.token);
      saveRefreshToken(response.data.refreshToken);
      toggleAlert("success");
      const decoded_token = jwtDecode(response.data.refreshToken);
      const userEmail = JSON.parse(decoded_token.sub).email;
      localStorage.setItem("user-email",userEmail);
      setTimeout(()=>{
        handleClick();
      },2000)
    } catch(err){
      console.log(err);
      if(err && err.response && err.response.status == 403){
        setUnsuccessfulSubmit(true);
        setIsEmailValid(false);
        setIsPasswordValid(false);
        setAlertErrorMessage("Wrong credentials")
        setTimeout(()=>{
          toggleAlert("error");
        },500)
      }
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    authenticationRequest({
      email: data.get('email'),
      password: data.get('password'),
    });

  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleEmailChange = (evt)=>{
    setFirstTryEmail(false);
    setUnsuccessfulSubmit(false);
    const emailValidity = validateEmail(evt.target.value);
    if(!emailValidity){
      setEmailErrorMsg("The email is not valid!");
    } 
    setIsEmailValid(validateEmail(evt.target.value));
  }

  const handlePasswordChange = (evt) =>{
    setFirstTryPassword(false);
    setUnsuccessfulSubmit(false);
    if(evt.target.value.length !=0){
      setIsPasswordValid(true);
      setPasswordError(false);
    } else {
      setIsPasswordValid(false);
      setPasswordError(true);
    }
  }


  useEffect(()=>{
    if(isEmailValid && isPasswordValid){
      setIsFormInValid(false);
    } else {
      setIsFormInValid(true);
    }
  },[isEmailValid, isPasswordValid])
  

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          {
            unsuccessfulSubmit &&
            <div style={{padding:"10px", fontSize:"1.3rem", color:"red"}}>
                Email or password is incorrect!
            </div>
          }
          
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              error={!firstTryEmail && !isEmailValid}
              onChange={(evt)=>{handleEmailChange(evt)}}
              autoFocus
            />
            {!firstTryEmail && !isEmailValid && ( 
              <div style={{ color: 'red', fontSize: '16px', marginTop: '5px' }}>
                  {emailErrorMsg}
               </div>
            )}
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              error={!firstTryPassword && !isPasswordValid}
              onChange={(evt)=>{handlePasswordChange(evt)}}
            />
            {passwordError && ( 
              <div style={{ color: 'red', fontSize: '16px', marginTop: '5px' }}>
                  The password is not valid
               </div>
            )}
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            {alertError &&
               <Alert variant="filled" severity="error" style={{ position: 'absolute', top: 10, right: 10, width:"300px", fontSize:"1.1rem" }}>
               Wrong credentials!
               </Alert>
            }
            {
                alertSuccess &&
                <Alert variant="filled" severity="success" style={{ position: 'absolute', top: 10, right: 10, width:"400px", fontSize:"1.1rem" }}>
                  {alertSuccessMessage}
              </Alert>
            }
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isFormInValid}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}