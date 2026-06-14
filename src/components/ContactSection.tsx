import { useState } from 'react'
import { Phone, PhoneCall, Plus, Pencil, Trash2, UserCircle } from 'lucide-react'
import { useAppStore, priorityLabels, type EmergencyContact } from '@/store/useAppStore'
import { cn } from '@/lib/utils'
import ContactFormModal from './ContactFormModal'

const priorityBadge: Record<string, string> = {
  first: 'bg-red-700 text-white',
  second: 'bg-amber-600 text-white',
  other: 'bg-zinc-400 text-white',
}

export default function ContactSection() {
  const contacts = useAppStore((s) => s.contacts)
  const deleteContact = useAppStore((s) => s.deleteContact)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<EmergencyContact | null>(null)

  const handleAdd = () => {
    setEditing(null)
    setModalOpen(true)
  }

  const handleEdit = (c: EmergencyContact) => {
    setEditing(c)
    setModalOpen(true)
  }

  const handleDelete = (id: string) => {
    deleteContact(id)
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-700/10 flex items-center justify-center">
            <PhoneCall size={18} className="text-red-700" />
          </div>
          <h2 className="font-serif text-xl font-bold text-zinc-800">紧急联系人</h2>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-1.5 px-4 py-2 bg-red-700 hover:bg-red-800 text-white text-sm font-medium rounded-xl transition-all hover:shadow-lg active:scale-[0.97]"
        >
          <Plus size={16} />
          添加
        </button>
      </div>

      {contacts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-zinc-400">
          <UserCircle size={48} strokeWidth={1} />
          <p className="mt-3 text-sm">暂无联系人，点击上方按钮添加</p>
        </div>
      ) : (
        <div className="space-y-3">
          {contacts.map((c) => (
            <div
              key={c.id}
              className="group relative bg-white rounded-2xl border border-zinc-100 p-4 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      'px-2.5 py-0.5 rounded-md text-xs font-semibold',
                      priorityBadge[c.priority]
                    )}
                  >
                    {priorityLabels[c.priority]}
                  </span>
                  <div>
                    <p className="font-semibold text-zinc-800">{c.name}</p>
                    <p className="text-sm text-zinc-500">{c.relationship}</p>
                  </div>
                </div>

                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(c)}
                    className="p-1.5 rounded-lg hover:bg-zinc-100 transition-colors"
                  >
                    <Pencil size={15} className="text-zinc-400" />
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={15} className="text-red-400" />
                  </button>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-3">
                <div className="flex items-center gap-1.5 text-sm text-zinc-600">
                  <Phone size={14} className="text-red-600" />
                  <span>{c.phone}</span>
                </div>
                {c.backupPhone && (
                  <div className="flex items-center gap-1.5 text-sm text-zinc-400">
                    <Phone size={14} />
                    <span>{c.backupPhone}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <ContactFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editing={editing}
      />
    </section>
  )
}
