// resources/js/Layouts/AuthenticatedLayout.jsx

import DashboardHeader from '@/Components/DashboardHeader'
import { Head } from '@inertiajs/react'

export default function AuthenticatedLayout({ children }) {
  return (
    <div className="min-h-screen pt-14" style={{ background: 'linear-gradient(160deg, #060d1b 0%, #0a1628 60%, #080f1e 100%)' }}>
      <Head>
        <meta name="robots" content="noindex,nofollow" />
        <meta name="googlebot" content="noindex,nofollow" />
      </Head>
      <DashboardHeader />
      <main className="min-h-screen">
        {children}
      </main>
    </div>
  )
}
