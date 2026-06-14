import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { useAppStore, type EmergencyContact, type ContactPriority, priorityLabels } from '@/store/useAppStore'
import { cn } from '@/lib/utils'
import ModalPortal from './ModalPortal'

interface Props {
  open: boolean
  onClose: () => void
  editing?: EmergencyContact | null
}

export default function ContactFormModal({ open, onClose, editing }: Props) {
  const addContact = useAppStore((s) => s.addContact)
  const updateContact = useAppStore((s) => s.updateContact)

  const [name, setName] = useState('')
  const [relationship, setRelationship] = useState('')
  const [phone, setPhone] = useState('')
  const [backupPhone, setBackupPhone] = useState('')
  const [priority, setPriority] = useState<ContactPriority>('first')

  useEffect(() => {
    if (open) {
      setName(editing?.name ?? '')
      setRelationship(editing?.relationship ?? '')
      setPhone(editing?.phone ?? '')
      setBackupPhone(editing?.backupPhone ?? '')
      setPriority(editing?.priority ?? 'first')
    }
  }, [open, editing])

  const resetForm = (keepPriority: boolean = false) => {
    setName('')
    setRelationship('')
    setPhone('')
    setBackupPhone('')
    if (!keepPriority) {
      setPriority('other')
    }
  }

  const doSave = () => {
    if (!name.trim() || !phone.trim()) return false

    if (editing) {
      updateContact(editing.id, { name, relationship, phone, backupPhone, priority })
    } else {
      addContact({ name, relationship, phone, backupPhone, priority })
    }
    return true
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!doSave()) return
    onClose()
  }

  const handleSaveAndContinue = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!doSave()) return
    resetForm(true)
  }

  const priorityOptions: { value: ContactPriority; label: string; color: string }[] = [
    { value: 'first', label: priorityLabels.first, color: 'bg-red-700 text-white' },
    { value: 'second', label: priorityLabels.second, color: 'bg-amber-600 text-white' },
    { value: 'other', label: priorityLabels.other, color: 'bg-zinc-400 text-white' },
  ]

  return (
    <ModalPortal open={open}>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in pointer-events-auto">
        <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-in pointer-events-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
          <h3 className="font-serif text-lg font-bold text-zinc-800">
            {editing ? '编辑联系人' : '添加联系人'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-zinc-100 transition-colors"
          >
            <X size={20} className="text-zinc-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-zinc-600 mb-1.5">优先级</label>
            <div className="flex gap-2">
              {priorityOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setPriority(opt.value)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                    priority === opt.value
                      ? opt.color + ' shadow-md scale-105'
                      : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-600 mb-1.5">姓名 *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="请输入姓名"
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 outline-none transition-all text-zinc-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-600 mb-1.5">关系</label>
            <input
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              placeholder="如：配偶、父亲、邻居"
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 outline-none transition-all text-zinc-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-600 mb-1.5">手机号 *</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="请输入手机号"
              type="tel"
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 outline-none transition-all text-zinc-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-600 mb-1.5">备用电话</label>
            <input
              value={backupPhone}
              onChange={(e) => setBackupPhone(e.target.value)}
              placeholder="可选"
              type="tel"
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 outline-none transition-all text-zinc-800"
            />
          </div>

          {editing ? (
            <button
              type="submit"
              disabled={!name.trim() || !phone.trim()}
              className="w-full py-3 bg-red-700 hover:bg-red-800 disabled:bg-zinc-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all hover:shadow-lg active:scale-[0.98]"
            >
              保存修改
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleSaveAndContinue}
                disabled={!name.trim() || !phone.trim()}
                className="py-3 bg-white border-2 border-red-700 text-red-700 hover:bg-red-50 disabled:border-zinc-200 disabled:text-zinc-300 disabled:cursor-not-allowed font-semibold rounded-xl transition-all active:scale-[0.98]"
              >
                保存并继续
              </button>
              <button
                type="submit"
                disabled={!name.trim() || !phone.trim()}
                className="py-3 bg-red-700 hover:bg-red-800 disabled:bg-zinc-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all hover:shadow-lg active:scale-[0.98]"
              >
                保存并关闭
              </button>
            </div>
          )}
        </form>
      </div>
      </div>
    </ModalPortal>
  )
}
