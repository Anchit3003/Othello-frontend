import React,{useState, useEffect} from 'react'
import "./Signup.css";
import {useDispatch,useSelector} from 'react-redux';
import { signupUser } from '../features/auth/authSlice';
const SignUp = ({isOpen, onClose}) => {
    const [formData, setFormData] = useState({
        name:'',
        email:'',
        password:''
    })
    const [errors, setErrors] = useState({
    passwordMismatch: false,
    emptyFields: false
  });
    const [confirmPassword, setConfirmPassword] = useState('')
    const dispatch = useDispatch();
    const {loading,error} = useSelector(state => state.auth);
    const handleInputChange =(e)=>{
        setFormData({...formData,[e.target.name]: e.target.value});
      
        console.log("checking form dataxxxxx",formData);
    }
    const handleConfirmPasswordChange =(e)=>{
        setConfirmPassword(e.target.value);
    }

    const onSubmit =(e)=>{
      if(confirmPassword !== formData.password) {
        setErrors({...errors, passwordMismatch: true});
        e.preventDefault();
      } else {
             e.preventDefault();
    dispatch(signupUser(formData));
      }

    }
   useEffect(() => {
  if (error) {
    console.error('Signup Error from Redux:', error);
  }
}, [error]);
  
if (!isOpen) return null;

  return (
    <div className="popup-overlay" onClick={onClose}>
        <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <div className="popup-header">
                <h2>Create Account</h2>
                <button className='close-button' onClick={onClose}>X</button>
            </div>

          <form className='signup-form'  onSubmit={onSubmit }>
            <div className="form-group">
                <label htmlFor='userName'>Username</label>
                <input type='text' id='userName' name='name' onChange={handleInputChange} placeholder='Enter your username' required />
            </div>
            <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              required
            />
          </div>
           <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              required
            />
          </div>
           <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              placeholder="Confirm your password"
              required
            />
             {errors.passwordMismatch && (
              <span className="error-message">Passwords do not match</span>
            )}
            {error && (
              <span className="error-message">{error}</span>
            )}
          </div>
          {errors.emptyFields && (
            <div className="error-message">Please fill in all fields</div>
          )}
          <div className="form-actions">
            <button type="submit" className="signup-button">Sign Up</button>
            <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
          </div>
            </form>  
            <div className="login-link">
          Already have an account? <button className="link-style">Login</button>
        </div>
        </div>

    </div>
  )
}

export default SignUp