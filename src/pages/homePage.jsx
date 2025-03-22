import { cn } from '../common/cn.js'
import { useAuth } from '../provider/authProvider.jsx'
import { useNavigate } from 'react-router'
import { useEffect } from 'react'
import { checkAuth } from '../common/utils.js'

function HomePage() {
  const { token } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    checkAuth(token, navigate)
  }, [])

  return (
    <div className={cn('p-[20px]')}>Home</div>
  )
}

export default HomePage