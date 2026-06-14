import { useState } from 'react'
import { MapPin, Pencil, Check } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'

export default function FamilySection() {
  const familyInfo = useAppStore((s) => s.familyInfo)
  const setFamilyInfo = useAppStore((s) => s.setFamilyInfo)
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(familyInfo.address)

  const handleSave = () => {
    setFamilyInfo({ address: value })
    setEditing(false)
  }

  const handleEdit = () => {
    setValue(familyInfo.address)
    setEditing(true)
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-amber-600/10 flex items-center justify-center">
          <MapPin size={18} className="text-amber-600" />
        </div>
        <h2 className="font-serif text-xl font-bold text-zinc-800">家庭住址</h2>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-100 p-4 shadow-sm">
        {editing ? (
          <div className="space-y-3">
            <textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="请输入家庭住址"
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all text-zinc-800 resize-none"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditing(false)}
                className="px-4 py-2 text-sm text-zinc-500 hover:bg-zinc-100 rounded-xl transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-xl transition-all active:scale-[0.97]"
              >
                <Check size={15} />
                保存
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-start justify-between">
            <p className={familyInfo.address ? 'text-zinc-700' : 'text-zinc-400 italic'}>
              {familyInfo.address || '点击编辑按钮添加住址'}
            </p>
            <button
              onClick={handleEdit}
              className="p-1.5 rounded-lg hover:bg-zinc-100 transition-colors shrink-0 ml-3"
            >
              <Pencil size={15} className="text-zinc-400" />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
