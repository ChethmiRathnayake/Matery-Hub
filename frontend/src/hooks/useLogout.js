// src/hooks/useLogout.js
import { useAuthContext } from './useAuthContext'
import { useNavigate } from 'react-router-dom'

export const useLogout = () => {
    const { dispatch } = useAuthContext()
    const navigate = useNavigate()

    const logout = () => {
        // Remove user from localStorage
        localStorage.removeItem('user')

        // Dispatch logout action
        dispatch({ type: 'LOGOUT' })

        // Navigate to login
        navigate('/')
    }

    return { logout }
}
