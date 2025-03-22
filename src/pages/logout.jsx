import { useNavigate } from 'react-router'
import { useEffect } from 'react'
import { useAuth } from '../provider/authProvider.jsx'

function LogoutPage () {
  const { setToken } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    setToken(null)
    navigate("/login")
  }, [])

  return (
    <div></div>
  )
}

export default LogoutPage