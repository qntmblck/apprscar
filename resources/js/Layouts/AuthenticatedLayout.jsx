// resources/js/Layouts/AuthenticatedLayout.jsx

import DashboardHeader from '@/Components/DashboardHeader'
import { Head } from '@inertiajs/react'

export default function AuthenticatedLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 pt-14">
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
