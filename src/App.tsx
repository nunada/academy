import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import Layout from './components/Layout'
import { useStore } from './app/store'
import { useI18n } from './i18n'

import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Catalog from './pages/Catalog'
import CourseMap from './pages/CourseMap'
import LessonPage from './pages/LessonPage'
import ProjectPage from './pages/ProjectPage'
import Playground from './pages/Playground'
import Leaderboard from './pages/Leaderboard'
import Profile from './pages/Profile'
import Certificate from './pages/Certificate'

function RequireAuth({ children }: { children: ReactNode }) {
  const { ready, user } = useStore()
  const { t } = useI18n()
  const location = useLocation()

  if (!ready) return <main className="page center muted">{t('loading')}</main>
  if (!user) return <Navigate to="/auth" replace state={{ from: location.pathname }} />
  return <>{children}</>
}

export default function App() {
  const { user, ready } = useStore()

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={ready && user ? <Navigate to="/learn" replace /> : <Landing />} />
        <Route path="/auth" element={ready && user ? <Navigate to="/learn" replace /> : <Auth />} />

        <Route
          path="/learn"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/catalog"
          element={
            <RequireAuth>
              <Catalog />
            </RequireAuth>
          }
        />
        <Route
          path="/course/:courseId"
          element={
            <RequireAuth>
              <CourseMap />
            </RequireAuth>
          }
        />
        <Route
          path="/course/:courseId/lesson/:itemId"
          element={
            <RequireAuth>
              <LessonPage />
            </RequireAuth>
          }
        />
        <Route
          path="/course/:courseId/project/:itemId"
          element={
            <RequireAuth>
              <ProjectPage />
            </RequireAuth>
          }
        />
        <Route
          path="/playground"
          element={
            <RequireAuth>
              <Playground />
            </RequireAuth>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <RequireAuth>
              <Leaderboard />
            </RequireAuth>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />
        <Route
          path="/certificate/:kind/:refId"
          element={
            <RequireAuth>
              <Certificate />
            </RequireAuth>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
