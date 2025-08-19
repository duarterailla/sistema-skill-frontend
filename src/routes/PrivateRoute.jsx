<<<<<<< HEAD
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
	const isAuthenticated = !!localStorage.getItem('userId');
	return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
=======
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
	const isAuthenticated = !!localStorage.getItem('userId');
	return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
>>>>>>> 75b9b479a453719b25ebf1ec8155f7004fe16684
