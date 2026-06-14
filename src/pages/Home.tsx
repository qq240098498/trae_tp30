import { ShieldAlert } from 'lucide-react'
import ContactSection from '@/components/ContactSection'
import FamilySection from '@/components/FamilySection'
import HealthSection from '@/components/HealthSection'
import EmergencyCard from '@/components/EmergencyCard'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F5F0EB]">
      <header className="bg-red-700 text-white">
        <div className="max-w-3xl mx-auto px-5 py-6 flex items-center gap-3">
          <ShieldAlert size={28} />
          <div>
            <h1 className="font-serif text-2xl font-bold leading-tight">家庭应急管理</h1>
            <p className="text-red-200 text-sm mt-0.5">紧急信息，一键掌握</p>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-5 py-8 space-y-8 animate-stagger-in">
        <ContactSection />
        <FamilySection />
        <HealthSection />
        <EmergencyCard />
      </main>

      <footer className="max-w-3xl mx-auto px-5 pb-8">
        <p className="text-center text-xs text-zinc-400">
          所有数据仅保存在本地浏览器中，不会上传至任何服务器
        </p>
      </footer>
    </div>
  )
}
