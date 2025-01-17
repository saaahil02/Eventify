// import React, { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useSelector, useDispatch } from 'react-redux';
// import { hideLoading, showLoading } from '../redux/features/alertSlice';
// import { setUser } from '../redux/features/userSlice';

// export default function OrgRoute({ children }) {
//     const dispatch = useDispatch();
//     const { user } = useSelector((state) => state.user);
//     const navigate = useNavigate();

//     useEffect(() => {
//         // Check if user is not an organizer
//         if (!user || !user.isOrganizer) {
//             navigate('/home'); // Redirect to home page
//         }
//     }, [user, navigate]); // Dependency array ensures effect runs when user changes

//     // If the user is valid and isOrganizer is true, render the children components
//     return user?.isOrganizer ? children : null;
// }
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { hideLoading, showLoading } from '../redux/features/alertSlice';
import { setUser } from '../redux/features/userSlice';
import axios from 'axios';

export default function OrgRoute({ children }) {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);

    const getUser = async () => {
        try {
            dispatch(showLoading());
            const response = await axios.post(
                '/api/v1/user/getUserData',
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            dispatch(hideLoading());
            if (response.data.success) {
                dispatch(setUser(response.data.data));
            } else {
                localStorage.clear();
            }
        } catch (error) {
            dispatch(hideLoading());
            console.error('Error fetching user data:', error);
            localStorage.clear();
        }
    };

    useEffect(() => {
        if (!user && localStorage.getItem('token')) {
            getUser(); // Fetch user data if not available in Redux state
        }
    }, [user]); // Run only if `user` is null/undefined

    if (!localStorage.getItem('token')) {
        return <Navigate to="/" />;
    }

    if (user?.isOrganizer) {
        return children;
    }

    if (user && !user.isOrganizer) {
        return <Navigate to="/home" />;
    }

    return null; // Render nothing while waiting for user data
}
