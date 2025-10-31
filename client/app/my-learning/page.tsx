import React from 'react'
import MyLearning from '@/components/student/MyLearning'
import ProtectedRoutes from '@/components/ProtectedRoutes'


const LearningPage = () => {
  
  return (
    <ProtectedRoutes>
      <div><MyLearning /></div>
    </ProtectedRoutes>
  )
}

export default LearningPage