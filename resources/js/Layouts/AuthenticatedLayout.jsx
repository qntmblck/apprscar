// resources/js/Layouts/AuthenticatedLayout.jsx

import DashboardHeader from '@/Components/DashboardHeader'

export default function AuthenticatedLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 pt-14">
      <DashboardHeader />
      <main className="min-h-screen">
  {children}
</main>

    </div>
  )
}
