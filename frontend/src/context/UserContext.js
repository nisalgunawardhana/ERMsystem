import { createContext, useReducer } from 'react'

export const UsersContext = createContext()

//this is just to keep the local state
export const usersReducer = (state, action) => {
    switch (action.type) {
        case 'SET_USERS':
            return {
                users: action.payload
            }
        case 'CREATE_USER':
            return {
                users: [action.payload, ...state.users]
            }
        default:
            return state
    }
}

export const UsersContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(usersReducer, {
        users: null //initial value of the state
    })

    dispatch({type: 'SET_USERES', payload: [{}, {}]})

    return (
        <UsersContext.Provider value={{...state, dispatch}}>
            { children }
        </UsersContext.Provider>
    )
}