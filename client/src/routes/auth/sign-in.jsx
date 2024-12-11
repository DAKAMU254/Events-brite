import { SignIn } from '@clerk/clerk-react'
import { motion } from 'framer-motion'

export default function SignInPage() {
  return (
    <motion.div
      className='bg-white flex items-center justify-center min-h-screen'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >

      <SignIn path="/sign-in"/>
    </motion.div>
  )
}