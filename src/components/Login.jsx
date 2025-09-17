import React,{useEffect, useState} from 'react'
import "./Login.css"
import { loginUser,clearError } from '../features/auth/authSlice'
import { useDispatch, useSelector } from 'react-redux';

const Login = ({onClose,isOpen}) => {
  const {loading,error} = useSelector(state => state.auth);
  const dispatch = useDispatch()
    const [formData, setFormData] = useState({
            email:'',
            password:''
        })

         const handleInputChange =(e)=>{
        const {name, value} = e.target;
        setFormData(prevState=>({
            ...prevState,
            [name]:value
        }))
    }
    const onSubmit = async (e) => {
    e.preventDefault();
      dispatch(loginUser(formData))
  };

  useEffect(()=>{
   if(isOpen){
     setFormData({email:'', password:''})
     dispatch(clearError())
   }

  },[isOpen])

    if (!isOpen) return null;
  return (
 <div className="popup-overlay" onClick={onClose}>
        <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <div className="popup-header">
                <h2>Login</h2>
                <button className='close-button' onClick={onClose}>X</button>
            </div>

          <form className='login-form'  onSubmit={onSubmit }>
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
             {error && (
              <span className="error-message">{error}</span>
            )}
          </div>
         
          <div className="form-actions">
            <button type="submit" className="login-button">Login</button>
            <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
          </div>
            </form>  
            <div className="signup-link">
          Do not have an account? <button className="link-style">Sign Up</button>
        </div>
        </div>

    </div>
  )
}

export default Login