import { useEffect,useState } from 'react'
import './App.css'
import Home from './pages/Homes.jsx'
import TestMultiplayer from './pages/TestMultiplayer.jsx'
import { initializeAuth } from './features/auth/authSlice.js'
import { useDispatch, useSelector } from 'react-redux'
import ErrorBoundary from './components/ErrorBoundary.jsx'

function App() {
    const dispatch = useDispatch();
   const [isInitialized, setIsInitialized] = useState(false);
  useEffect(()=>{
    const initializeApp = async () =>{
      try{
        await dispatch(initializeAuth())
        setIsInitialized(true)
        
      }
      catch(error){
        setIsInitialized(true)
      }
    }
    initializeApp();
  },[dispatch])

  if(!isInitialized){
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        Loading...
      </div>
    );
  }
  return (
    <> 
    {/* <ErrorBoundary>
       <Home />
      </ErrorBoundary>
      */}
      <Home />
      {/* <TestMultiplayer/> */}
    </>
  ) 
}

export default App
