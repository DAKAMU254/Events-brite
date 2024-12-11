import { ClerkProvider } from '@clerk/clerk-react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import RootLayout  from './layouts/root-layout'
import SignUpPage from './routes/auth/sign-up'
import SignInPage from './routes/auth/sign-in'
import Profile from './routes/auth/profile'
import Home from './routes'
import AddEvent from './routes/events/add-event'
import EditEvent from './routes/events/edit-event'
import Events from './routes/events'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

function App() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<RootLayout />}>
            <Route index element={<Home />} />
            <Route path='sign-in' element={<SignInPage />} />
            <Route path='sign-up' element={<SignUpPage />} />
            <Route path='profile' element={<Profile />} />
            <Route path='addevent' element={<AddEvent />} />
            <Route path='events/:id' element={<Events />} />
            <Route path='edit/:id' element={<EditEvent />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ClerkProvider>
  )
}

export default App;