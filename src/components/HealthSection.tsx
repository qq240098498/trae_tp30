import { useState } from 'react'
import { Heart, Droplets, AlertTriangle, Activity, Pill, Pencil, Check, X } from 'lucide-react'
import { useAppStore, type HealthInfo } from '@/store/useAppStore'
import { cn } from '@/lib/utils'

interface FieldConfig {
  key: keyof HealthInfo
  label: string
  icon: React.ReactNode
  placeholder: string
}

const fields: FieldConfig[] = [
  {
    key: 'bloodType',
    label: '血型',
    icon: <Droplets size={18} className="text-red-500" />,
    placeholder: '如：A型、B型、O型、AB型',
  },
  {
    key: 'allergies',
    label: '过敏史',
    icon: <AlertTriangle size={18} className="text-amber-500" />,
    placeholder: '如：青霉素、花粉、海鲜',
  },
  {
    key: 'chronicDiseases',
    label: '慢性病史',
    icon: <Activity size={18} className="text-orange-500" />,
    placeholder: '如：高血压、糖尿病',
  },
  {
    key: 'medications',
    label: '常用药物',
    icon: <Pill size={18} className="text-green-600" />,
    placeholder: '如：阿司匹林、降压药',
  },
]

export default function HealthSection() {
  const healthInfo = useAppStore((s) => s.healthInfo)
  const setHealthInfo = useAppStore((s) => s.setHealthInfo)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState(healthInfo)

  const handleEdit = () => {
    setForm(healthInfo)
    setEditing(true)
  }

  const handleSave = () => {
    setHealthInfo(form)
    setEditing(false)
  }

  const handleCancel = () => {
    setForm(healthInfo)
    setEditing(false)
  }

  const updateField = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-green-700/10 flex items-center justify-center">
            <Heart size={18} className="text-green-700" />
          </div>
          <h2 className="font-serif text-xl font-bold text-zinc-800">健康信息</h2>
        </div>
        {!editing && (
          <button
            onClick={handleEdit}
            className="flex items-center gap-1.5 px-4 py-2 border border-zinc-200 hover:bg-zinc-50 text-zinc-600 text-sm font-medium rounded-xl transition-all active:scale-[0.97]"
          >
            <Pencil size={14} />
            编辑
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {fields.map((f) => (
          <div
            key={f.key}
            className="bg-white rounded-2xl border border-zinc-100 p-4 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-2">
              {f.icon}
              <span className="text-sm font-semibold text-zinc-600">{f.label}</span>
            </div>
            {editing ? (
              <input
                value={form[f.key]}
                onChange={(e) => updateField(f.key, e.target.value)}
                placeholder={f.placeholder}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 focus:border-green-400 focus:ring-2 focus:ring-green-100 outline-none transition-all text-sm text-zinc-800"
              />
            ) : (
              <p className={cn('text-sm', healthInfo[f.key] ? 'text-zinc-700' : 'text-zinc-400 italic')}>
                {healthInfo[f.key] || '未填写'}
              </p>
            )}
          </div>
        ))}
      </div>

      {editing && (
        <div className="flex justify-end gap-2">
          <button
            onClick={handleCancel}
            className="flex items-center gap-1.5 px-4 py-2 text-sm text-zinc-500 hover:bg-zinc-100 rounded-xl transition-colors"
          >
            <X size={14} />
            取消
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 bg-green-700 hover:bg-green-800 text-white text-sm font-medium rounded-xl transition-all active:scale-[0.97]"
          >
            <Check size={14} />
            保存
          </button>
        </div>
      )}
    </section>
  )
}
