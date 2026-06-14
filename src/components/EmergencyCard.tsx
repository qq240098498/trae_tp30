import { useState } from 'react'
import { ShieldAlert, Copy, Check, X } from 'lucide-react'
import { useAppStore, generateEmergencyCardText } from '@/store/useAppStore'
import ModalPortal from './ModalPortal'

export default function EmergencyCard() {
  const store = useAppStore()
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const hasData =
    store.contacts.length > 0 ||
    store.familyInfo.address !== '' ||
    store.healthInfo.bloodType !== '' ||
    store.healthInfo.allergies !== '' ||
    store.healthInfo.chronicDiseases !== '' ||
    store.healthInfo.medications !== '' ||
    store.emergencyPlan.fireEscapeRoute !== '' ||
    store.emergencyPlan.earthquakeShelter !== '' ||
    store.emergencyPlan.meetingPoints.length > 0 ||
    store.floorPlan.markers.length > 0

  const handleGenerate = () => {
    setOpen(true)
  }

  const handleCopy = async () => {
    const text = generateEmergencyCardText({
      contacts: store.contacts,
      familyInfo: store.familyInfo,
      healthInfo: store.healthInfo,
      supplies: store.supplies,
      emergencyPlan: store.emergencyPlan,
      floorPlan: store.floorPlan,
    })
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const cardText = open
    ? generateEmergencyCardText({
        contacts: store.contacts,
        familyInfo: store.familyInfo,
        healthInfo: store.healthInfo,
        supplies: store.supplies,
        emergencyPlan: store.emergencyPlan,
        floorPlan: store.floorPlan,
      })
    : ''

  return (
    <>
      <button
        onClick={handleGenerate}
        disabled={!hasData}
        className="w-full flex items-center justify-center gap-2 py-4 bg-red-700 hover:bg-red-800 disabled:bg-zinc-300 disabled:cursor-not-allowed text-white font-bold text-lg rounded-2xl transition-all hover:shadow-xl active:scale-[0.98] shadow-lg shadow-red-700/20"
      >
        <ShieldAlert size={22} />
        生成紧急信息卡片
      </button>

      {!hasData && (
        <p className="text-center text-sm text-zinc-400 mt-2">请先录入至少一项信息</p>
      )}

      <ModalPortal open={open}>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in pointer-events-auto">
          <div className="relative w-full max-w-lg mx-4 animate-scale-in pointer-events-auto">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="bg-red-700 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert size={22} className="text-white" />
                  <h3 className="text-white font-serif font-bold text-lg">紧急信息卡片</h3>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <X size={20} className="text-white" />
                </button>
              </div>

              <div className="p-6">
                <div className="bg-zinc-50 rounded-xl border border-zinc-200 p-5 font-mono text-sm leading-relaxed whitespace-pre-wrap text-zinc-800 select-all">
                  {cardText}
                </div>

                <div className="mt-5 flex flex-col gap-3">
                  <button
                    onClick={handleCopy}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-zinc-800 hover:bg-zinc-900 text-white font-medium rounded-xl transition-all active:scale-[0.98]"
                  >
                    {copied ? (
                      <>
                        <Check size={18} />
                        已复制
                      </>
                    ) : (
                      <>
                        <Copy size={18} />
                        复制文本
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs text-zinc-400">
                    复制后可粘贴到备忘录，或截图保存至手机锁屏
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ModalPortal>
    </>
  )
}
