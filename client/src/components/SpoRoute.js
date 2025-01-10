import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { hideLoading, showLoading } from '../redux/features/alertSlice';
import { setUser } from '../redux/features/userSlice';

export default function SpoRoute({ children }) {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is not an organizer
        if (!user || !user.isSponsor) {
            navigate('/home'); // Redirect to home page
        }
    }, [user, navigate]); // Dependency array ensures effect runs when user changes

    // If the user is valid and isOrganizer is true, render the children components
    return user?.isSponsor ? children : null;
}
