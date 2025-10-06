/**
 * src/routes/index.js
 */

import { useContext } from 'react'; 
import { AuthContext } from '../contexts/AuthContext';
import AuthRoutes from './Auth.Routes';
import AppRoutes from './App.Routes';

function Routes() {
  const { signed } = useContext(AuthContext); // descomente se usar AuthContext
  return (
    signed ? <AppRoutes/> : <AuthRoutes/> 
  )
}

export default Routes;
