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

export type CheckCycle = '1month' | '3months' | '6months' | '1year' | '2years' | 'never'
export type Portability = 'fixed' | 'portable'

export interface EmergencySupply {
  id: string
  name: string
  category: 'lighting' | 'medical' | 'fire' | 'food' | 'financial' | 'communication' | 'custom'
  portability: Portability
  isPrepared: boolean
  checkCycle: CheckCycle
  lastCheckedAt: number | null
  note: string
  isCustom: boolean
}

export interface AppData {
  contacts: EmergencyContact[]
  familyInfo: FamilyInfo
  healthInfo: HealthInfo
  supplies: EmergencySupply[]
}

interface AppState extends AppData {
  addContact: (contact: Omit<EmergencyContact, 'id'>) => void
  updateContact: (id: string, contact: Partial<EmergencyContact>) => void
  deleteContact: (id: string) => void
  setFamilyInfo: (info: Partial<FamilyInfo>) => void
  setHealthInfo: (info: Partial<HealthInfo>) => void
  toggleSupplyPrepared: (id: string) => void
  updateSupplyCheckCycle: (id: string, cycle: CheckCycle) => void
  updateSupplyNote: (id: string, note: string) => void
  markSupplyChecked: (id: string) => void
  addCustomSupply: (supply: Omit<EmergencySupply, 'id' | 'isCustom' | 'category' | 'isPrepared' | 'lastCheckedAt'>) => void
  deleteSupply: (id: string) => void
}

const STORAGE_KEY = 'family-emergency-data'

export const checkCycleLabels: Record<CheckCycle, string> = {
  '1month': '每月检查',
  '3months': '每3个月检查',
  '6months': '每6个月检查',
  '1year': '每年检查',
  '2years': '每2年检查',
  'never': '无需检查',
}

export const checkCycleMonths: Record<CheckCycle, number> = {
  '1month': 1,
  '3months': 3,
  '6months': 6,
  '1year': 12,
  '2years': 24,
  'never': Infinity,
}

export const categoryLabels: Record<EmergencySupply['category'], string> = {
  lighting: '照明通讯',
  medical: '医疗急救',
  fire: '消防逃生',
  food: '食物饮水',
  financial: '现金物资',
  communication: '通讯设备',
  custom: '自定义',
}

export const portabilityLabels: Record<Portability, string> = {
  fixed: '家中固定',
  portable: '随身携带',
}

const defaultSupplies: Omit<EmergencySupply, 'id'>[] = [
  { name: '手电筒', category: 'lighting', portability: 'portable', isPrepared: false, checkCycle: '6months', lastCheckedAt: null, note: '检查电池电量', isCustom: false },
  { name: '备用电池', category: 'lighting', portability: 'portable', isPrepared: false, checkCycle: '1year', lastCheckedAt: null, note: '多备几种型号', isCustom: false },
  { name: '急救包', category: 'medical', portability: 'portable', isPrepared: false, checkCycle: '6months', lastCheckedAt: null, note: '检查药品有效期', isCustom: false },
  { name: '灭火器', category: 'fire', portability: 'fixed', isPrepared: false, checkCycle: '6months', lastCheckedAt: null, note: '检查压力表', isCustom: false },
  { name: '饮用水', category: 'food', portability: 'fixed', isPrepared: false, checkCycle: '6months', lastCheckedAt: null, note: '每人每天3升，储备3天量', isCustom: false },
  { name: '应急食物', category: 'food', portability: 'fixed', isPrepared: false, checkCycle: '1year', lastCheckedAt: null, note: '压缩饼干、罐头等不易变质食品', isCustom: false },
  { name: '现金', category: 'financial', portability: 'portable', isPrepared: false, checkCycle: '1year', lastCheckedAt: null, note: '备小额现金', isCustom: false },
  { name: '充电宝', category: 'communication', portability: 'portable', isPrepared: false, checkCycle: '3months', lastCheckedAt: null, note: '保持电量充足', isCustom: false },
  { name: '逃生绳', category: 'fire', portability: 'fixed', isPrepared: false, checkCycle: '1year', lastCheckedAt: null, note: '检查承重和磨损', isCustom: false },
  { name: '防毒面具', category: 'fire', portability: 'portable', isPrepared: false, checkCycle: '2years', lastCheckedAt: null, note: '检查有效期', isCustom: false },
  { name: '常用药品', category: 'medical', portability: 'portable', isPrepared: false, checkCycle: '3months', lastCheckedAt: null, note: '感冒药、止泻药、止痛药等', isCustom: false },
  { name: '哨子', category: 'communication', portability: 'portable', isPrepared: false, checkCycle: '1year', lastCheckedAt: null, note: '用于求救', isCustom: false },
]

function getNextCheckDate(supply: EmergencySupply): number | null {
  if (supply.checkCycle === 'never' || !supply.lastCheckedAt) return null
  const months = checkCycleMonths[supply.checkCycle]
  return supply.lastCheckedAt + months * 30 * 24 * 60 * 60 * 1000
}

export function isCheckDue(supply: EmergencySupply): boolean {
  const nextCheck = getNextCheckDate(supply)
  if (!nextCheck) return false
  return Date.now() >= nextCheck
}

export function getDaysUntilCheck(supply: EmergencySupply): number | null {
  const nextCheck = getNextCheckDate(supply)
  if (!nextCheck) return null
  return Math.ceil((nextCheck - Date.now()) / (24 * 60 * 60 * 1000))
}

function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as AppData
      if (!parsed.supplies || parsed.supplies.length === 0) {
        parsed.supplies = defaultSupplies.map(s => ({ ...s, id: generateId() }))
      } else {
        parsed.supplies = parsed.supplies.map((s) => {
          if (!('portability' in s)) {
            const supply = s as EmergencySupply
            if (supply.category === 'fire' || supply.category === 'food') {
              return { ...supply, portability: supply.name === '防毒面具' ? 'portable' : 'fixed' }
            }
            return { ...supply, portability: 'portable' as const }
          }
          return s
        })
      }
      return parsed
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
    supplies: defaultSupplies.map(s => ({ ...s, id: generateId() })),
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

    toggleSupplyPrepared: (id) =>
      set((state) => {
        const newSupplies = state.supplies.map((s) =>
          s.id === id ? { ...s, isPrepared: !s.isPrepared, lastCheckedAt: s.isPrepared ? s.lastCheckedAt : Date.now() } : s
        )
        const next = { ...state, supplies: newSupplies }
        saveData(next)
        return next
      }),

    updateSupplyCheckCycle: (id, cycle) =>
      set((state) => {
        const newSupplies = state.supplies.map((s) =>
          s.id === id ? { ...s, checkCycle: cycle } : s
        )
        const next = { ...state, supplies: newSupplies }
        saveData(next)
        return next
      }),

    updateSupplyNote: (id, note) =>
      set((state) => {
        const newSupplies = state.supplies.map((s) =>
          s.id === id ? { ...s, note } : s
        )
        const next = { ...state, supplies: newSupplies }
        saveData(next)
        return next
      }),

    markSupplyChecked: (id) =>
      set((state) => {
        const newSupplies = state.supplies.map((s) =>
          s.id === id ? { ...s, lastCheckedAt: Date.now() } : s
        )
        const next = { ...state, supplies: newSupplies }
        saveData(next)
        return next
      }),

    addCustomSupply: (supply) =>
      set((state) => {
        const newSupply: EmergencySupply = {
          ...supply,
          id: generateId(),
          category: 'custom',
          isPrepared: false,
          isCustom: true,
          lastCheckedAt: null,
        }
        const newSupplies = [...state.supplies, newSupply]
        const next = { ...state, supplies: newSupplies }
        saveData(next)
        return next
      }),

    deleteSupply: (id) =>
      set((state) => {
        const next = { ...state, supplies: state.supplies.filter((s) => s.id !== id) }
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

  const preparedSupplies = data.supplies.filter(s => s.isPrepared)
  if (preparedSupplies.length > 0) {
    lines.push('【应急物资】')
    preparedSupplies.forEach(s => {
      lines.push(`  ✓ ${s.name}`)
    })
    const missingCount = data.supplies.filter(s => !s.isPrepared).length
    if (missingCount > 0) {
      lines.push(`  （还有 ${missingCount} 项物资待准备）`)
    }
    lines.push('')
  }

  lines.push('──────────────────────────────')
  lines.push('  请将此卡片截图保存至手机锁屏')
  lines.push('  或打印随身携带以备不时之需')
  lines.push('══════════════════════════════')

  return lines.join('\n')
}
