import React, { createContext, useReducer, useEffect } from 'react';

export const UsersContext = createContext();

// Reducer function to manage state updates
export const usersReducer = (state, action) => {
    switch (action.type) {
        case 'SET_USERS':
            return {
                ...state,
                users: action.payload
            };
        case 'CREATE_USER':
            return {
                ...state,
                users: [action.payload, ...state.users]
            };
        default:
            return state;
    }
};

export const UsersContextProvider = ({ children }) => {
    // Initialize state using useReducer
    const [state, dispatch] = useReducer(usersReducer, {
        users: null // Initial value of the state
    });

    useEffect(() => {
        // Dispatch initial action to set users only once when component mounts
        dispatch({ type: 'SET_USERS', payload: [] });
    }, []); // Empty dependency array ensures this effect runs only once

    return (
        <UsersContext.Provider value={{ ...state, dispatch }}>
            {children}
        </UsersContext.Provider>
    );
};