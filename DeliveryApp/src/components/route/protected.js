/**
 * src/components/route/protected.jsx
 */

import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';

export default function PrivateRoute({ children }) {
  const { authenticated} = useContext(AuthContext);
  if (!authenticated) {
    return <Navigate to="/app/login" replace />
  }
  return children
}
