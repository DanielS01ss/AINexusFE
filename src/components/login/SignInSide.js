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

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
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
    const emailValidity = validateEmail(evt.target.value);
    if(!emailValidity){
      setEmailErrorMsg("The email is not valid!");
    } 
    setIsEmailValid(validateEmail(evt.target.value));
  }

  const handlePasswordChange = (evt) =>{
    setFirstTryPassword(false);
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
            {!firstTryEmail && emailError && ( 
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