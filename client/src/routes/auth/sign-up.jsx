import { SignUp } from '@clerk/clerk-react'
import { motion } from 'framer-motion'

export default function SignUpPage() {
  return (
    <motion.div
      className='bg-white flex items-center justify-center min-h-screen'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >

      <SignUp path="/sign-up" />
    </motion.div>
  )
}