import React,{useState} from 'react'
import "./LoginSignup.css"
import SignUp from './SignUp'
import Login from './Login'
const LoginSignup = () => {
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
   const handleSignupClick = () => {
    setIsSignupOpen(true);
  };
  const closeSignup = () => {
    setIsSignupOpen(false);
   
  };
  const closeLogin = ()=>{
     setIsLoginOpen(false);
  }
    const handleLoginClick = () => {
    setIsLoginOpen(true)
  };
  return (
    <>
     <div className='login-container'>
        <button className='link-button' onClick={handleLoginClick}>Login</button>
        <button className='link-button' onClick={handleSignupClick}>Signup</button>
    </div>
    <SignUp
        isOpen={isSignupOpen}
        onClose={closeSignup}
      />
     <Login
     isOpen={isLoginOpen}
     onClose={closeLogin}
     />
    </>
   
  )
}

export default LoginSignup 