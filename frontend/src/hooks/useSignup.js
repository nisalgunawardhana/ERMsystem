import { useState } from 'react'
import { useAuthContext } from './useAuthContext'

export const useSignup = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(null)
  const { dispatch } = useAuthContext()

  const signup = async (first_name, last_name, email, password, userRole) => {
    setIsLoading(true)
    setError(null)

    const response = await fetch('http://localhost:8080/user/signup', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ first_name, last_name, email, password, userRole })
    })
    const json = await response.json()

    //if there is a problem
    if (!response.ok) {
      setIsLoading(false)
      setError(json.error)
    }

    //if the response is ok
    if (response.ok) {
      // save the user to local storage
      localStorage.setItem('user', JSON.stringify(json))

      // update the auth context
      dispatch({type: 'LOGIN', payload: json})

      // update loading state
      setIsLoading(false)
    }
  }

  return { signup, isLoading, error }
}