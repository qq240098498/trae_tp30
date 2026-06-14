import { create } from 'zustand'

export type ContactPriority = 'first' | 'second' | 'other'

export interface EmergencyContact {
  id: string
  name: string
  relationship: string
  phone: string
  backupPhone: string
  priority: ContactPriority
}

export interface FamilyInfo {
  address: string
}

export interface HealthInfo {
  bloodType: string
  allergies: string
  chronicDiseases: string
  medications: string
}

export interface AppData {
  contacts: EmergencyContact[]
  familyInfo: FamilyInfo
  healthInfo: HealthInfo
}

interface AppState extends AppData {
  addContact: (contact: Omit<EmergencyContact, 'id'>) => void
  updateContact: (id: string, contact: Partial<EmergencyContact>) => void
  deleteContact: (id: string) => void
  setFamilyInfo: (info: Partial<FamilyInfo>) => void
  setHealthInfo: (info: Partial<HealthInfo>) => void
}

const STORAGE_KEY = 'family-emergency-data'

function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      return JSON.parse(raw) as AppData
    }
  } catch {
    // ignore
  }
  return {
    contacts: [],
    familyInfo: { address: '' },
    healthInfo: {
      bloodType: '',
      allergies: '',
      chronicDiseases: '',
      medications: '',
    },
  }
}

function saveData(data: AppData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

const priorityOrder: Record<ContactPriority, number> = {
  first: 0,
  second: 1,
  other: 2,
}

export const useAppStore = create<AppState>((set) => {
  const initial = loadData()

  return {
    ...initial,

    addContact: (contact) =>
      set((state) => {
        const newContacts = [...state.contacts, { ...contact, id: generateId() }].sort(
          (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
        )
        const next = { ...state, contacts: newContacts }
        saveData(next)
        return next
      }),

    updateContact: (id, update) =>
      set((state) => {
        const newContacts = state.contacts
          .map((c) => (c.id === id ? { ...c, ...update } : c))
          .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
        const next = { ...state, contacts: newContacts }
        saveData(next)
        return next
      }),

    deleteContact: (id) =>
      set((state) => {
        const next = { ...state, contacts: state.contacts.filter((c) => c.id !== id) }
        saveData(next)
        return next
      }),

    setFamilyInfo: (info) =>
      set((state) => {
        const next = { ...state, familyInfo: { ...state.familyInfo, ...info } }
        saveData(next)
        return next
      }),

    setHealthInfo: (info) =>
      set((state) => {
        const next = { ...state, healthInfo: { ...state.healthInfo, ...info } }
        saveData(next)
        return next
      }),
  }
})

export const priorityLabels: Record<ContactPriority, string> = {
  first: '第一联系人',
  second: '第二联系人',
  other: '其他联系人',
}

export function generateEmergencyCardText(data: AppData): string {
  const lines: string[] = []
  lines.push('══════════════════════════════')
  lines.push('        紧 急 信 息 卡 片')
  lines.push('══════════════════════════════')
  lines.push('')

  if (data.familyInfo.address) {
    lines.push('【家庭住址】')
    lines.push(data.familyInfo.address)
    lines.push('')
  }

  if (data.contacts.length > 0) {
    lines.push('【紧急联系人】')
    data.contacts.forEach((c) => {
      lines.push(`  ${priorityLabels[c.priority]} - ${c.name}（${c.relationship}）`)
      lines.push(`    手机：${c.phone}`)
      if (c.backupPhone) {
        lines.push(`    备用：${c.backupPhone}`)
      }
    })
    lines.push('')
  }

  const hi = data.healthInfo
  const hasHealth = hi.bloodType || hi.allergies || hi.chronicDiseases || hi.medications
  if (hasHealth) {
    lines.push('【健康信息】')
    if (hi.bloodType) lines.push(`  血型：${hi.bloodType}`)
    if (hi.allergies) lines.push(`  过敏史：${hi.allergies}`)
    if (hi.chronicDiseases) lines.push(`  慢性病：${hi.chronicDiseases}`)
    if (hi.medications) lines.push(`  常用药物：${hi.medications}`)
    lines.push('')
  }

  lines.push('──────────────────────────────')
  lines.push('  请将此卡片截图保存至手机锁屏')
  lines.push('  或打印随身携带以备不时之需')
  lines.push('══════════════════════════════')

  return lines.join('\n')
}
