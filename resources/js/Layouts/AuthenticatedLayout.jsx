// resources/js/Layouts/AuthenticatedLayout.jsx

import DashboardHeader from '@/Components/DashboardHeader'

export default function AuthenticatedLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 pt-14">
      <DashboardHeader />
      <main className="pt-2 pb-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

        {children}
      </main>
    </div>
  )
}
