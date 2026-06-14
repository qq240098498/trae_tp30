import { useState } from 'react'
import {
  Package,
  Plus,
  Check,
  X,
  AlertTriangle,
  Clock,
  Edit3,
  Trash2,
  CheckCircle2,
  Circle,
  ChevronDown,
  Zap,
  Heart,
  Flame,
  Droplets,
  Wallet,
  Radio,
  Settings,
  Home,
  Backpack,
} from 'lucide-react'
import {
  useAppStore,
  categoryLabels,
  checkCycleLabels,
  portabilityLabels,
  isCheckDue,
  getDaysUntilCheck,
  type EmergencySupply,
  type CheckCycle,
  type Portability,
} from '@/store/useAppStore'
import { cn } from '@/lib/utils'
import ModalPortal from './ModalPortal'

const categoryIcons: Record<EmergencySupply['category'], typeof Zap> = {
  lighting: Zap,
  medical: Heart,
  fire: Flame,
  food: Droplets,
  financial: Wallet,
  communication: Radio,
  custom: Settings,
}

const portabilityIcons: Record<Portability, typeof Home> = {
  fixed: Home,
  portable: Backpack,
}

const portabilityColors: Record<Portability, string> = {
  fixed: 'bg-blue-500/10 text-blue-600 border-blue-200',
  portable: 'bg-green-500/10 text-green-600 border-green-200',
}

const categoryColors: Record<EmergencySupply['category'], string> = {
  lighting: 'bg-yellow-500/10 text-yellow-600',
  medical: 'bg-red-500/10 text-red-600',
  fire: 'bg-orange-500/10 text-orange-600',
  food: 'bg-blue-500/10 text-blue-600',
  financial: 'bg-green-500/10 text-green-600',
  communication: 'bg-purple-500/10 text-purple-600',
  custom: 'bg-zinc-500/10 text-zinc-600',
}

function SupplyItem({ supply }: { supply: EmergencySupply }) {
  const toggleSupplyPrepared = useAppStore((s) => s.toggleSupplyPrepared)
  const updateSupplyCheckCycle = useAppStore((s) => s.updateSupplyCheckCycle)
  const updateSupplyNote = useAppStore((s) => s.updateSupplyNote)
  const markSupplyChecked = useAppStore((s) => s.markSupplyChecked)
  const deleteSupply = useAppStore((s) => s.deleteSupply)

  const [showCycleMenu, setShowCycleMenu] = useState(false)
  const [editingNote, setEditingNote] = useState(false)
  const [noteValue, setNoteValue] = useState(supply.note)

  const checkDue = isCheckDue(supply)
  const daysUntil = getDaysUntilCheck(supply)
  const Icon = categoryIcons[supply.category]
  const PortIcon = portabilityIcons[supply.portability]

  const handleSaveNote = () => {
    updateSupplyNote(supply.id, noteValue)
    setEditingNote(false)
  }

  const handleCycleChange = (cycle: CheckCycle) => {
    updateSupplyCheckCycle(supply.id, cycle)
    setShowCycleMenu(false)
  }

  return (
    <div
      className={cn(
        'group relative bg-white rounded-2xl border p-4 shadow-sm hover:shadow-md transition-all',
        supply.isPrepared ? 'border-green-200 bg-green-50/30' : 'border-zinc-100',
        checkDue && supply.isPrepared ? 'border-amber-300 bg-amber-50/50' : ''
      )}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={() => toggleSupplyPrepared(supply.id)}
          className="mt-0.5 shrink-0 transition-transform active:scale-95"
        >
          {supply.isPrepared ? (
            <CheckCircle2 size={22} className="text-green-600" />
          ) : (
            <Circle size={22} className="text-zinc-300 hover:text-zinc-400 transition-colors" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p
              className={cn(
                'font-semibold',
                supply.isPrepared ? 'text-zinc-800' : 'text-zinc-600'
              )}
            >
              {supply.name}
            </p>
            <span
              className={cn(
                'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border',
                portabilityColors[supply.portability]
              )}
            >
              <PortIcon size={12} />
              {portabilityLabels[supply.portability]}
            </span>
            <span
              className={cn(
                'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium',
                categoryColors[supply.category]
              )}
            >
              <Icon size={12} />
              {categoryLabels[supply.category]}
            </span>
            {checkDue && supply.isPrepared && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-amber-500 text-white animate-pulse">
                <AlertTriangle size={12} />
                需检查
              </span>
            )}
          </div>

          {supply.note && !editingNote && (
            <p className="mt-1 text-sm text-zinc-500">{supply.note}</p>
          )}

          {editingNote && (
            <div className="mt-2 space-y-2">
              <input
                type="text"
                value={noteValue}
                onChange={(e) => setNoteValue(e.target.value)}
                placeholder="添加备注（如检查要点）"
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none text-sm"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveNote}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium rounded-lg transition-colors"
                >
                  保存
                </button>
                <button
                  onClick={() => {
                    setNoteValue(supply.note)
                    setEditingNote(false)
                  }}
                  className="px-3 py-1.5 text-zinc-500 hover:bg-zinc-100 text-xs font-medium rounded-lg transition-colors"
                >
                  取消
                </button>
              </div>
            </div>
          )}

          <div className="mt-3 flex items-center gap-3 flex-wrap">
            <div className="relative">
              <button
                onClick={() => setShowCycleMenu(!showCycleMenu)}
                disabled={!supply.isPrepared}
                className={cn(
                  'inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors',
                  supply.isPrepared
                    ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                    : 'bg-zinc-50 text-zinc-400 cursor-not-allowed'
                )}
              >
                <Clock size={12} />
                {checkCycleLabels[supply.checkCycle]}
                <ChevronDown size={12} />
              </button>

              {showCycleMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowCycleMenu(false)}
                  />
                  <div className="absolute top-full left-0 mt-1 z-20 bg-white rounded-xl shadow-lg border border-zinc-100 py-1 min-w-[140px] overflow-hidden">
                    {(Object.keys(checkCycleLabels) as CheckCycle[]).map((cycle) => (
                      <button
                        key={cycle}
                        onClick={() => handleCycleChange(cycle)}
                        className={cn(
                          'w-full px-3 py-2 text-left text-xs transition-colors',
                          supply.checkCycle === cycle
                            ? 'bg-amber-50 text-amber-700 font-medium'
                            : 'text-zinc-600 hover:bg-zinc-50'
                        )}
                      >
                        {checkCycleLabels[cycle]}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {supply.isPrepared && supply.lastCheckedAt && (
              <span className="text-xs text-zinc-400">
                上次检查：{new Date(supply.lastCheckedAt).toLocaleDateString('zh-CN')}
              </span>
            )}

            {supply.isPrepared && daysUntil !== null && (
              <span
                className={cn(
                  'text-xs font-medium',
                  daysUntil <= 0
                    ? 'text-amber-600'
                    : daysUntil <= 7
                    ? 'text-amber-500'
                    : 'text-zinc-400'
                )}
              >
                {daysUntil <= 0 ? '已过期' : `还有 ${daysUntil} 天`}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          {supply.isPrepared && !checkDue && (
            <button
              onClick={() => markSupplyChecked(supply.id)}
              title="标记为已检查"
              className="p-1.5 rounded-lg hover:bg-green-50 transition-colors"
            >
              <Check size={15} className="text-green-500" />
            </button>
          )}
          {supply.isPrepared && checkDue && (
            <button
              onClick={() => markSupplyChecked(supply.id)}
              title="标记为已检查"
              className="p-1.5 rounded-lg hover:bg-amber-50 transition-colors animate-pulse"
            >
              <Check size={15} className="text-amber-500" />
            </button>
          )}
          <button
            onClick={() => {
              setNoteValue(supply.note)
              setEditingNote(true)
            }}
            title="编辑备注"
            className="p-1.5 rounded-lg hover:bg-zinc-100 transition-colors"
          >
            <Edit3 size={15} className="text-zinc-400" />
          </button>
          {supply.isCustom && (
            <button
              onClick={() => deleteSupply(supply.id)}
              title="删除"
              className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
            >
              <Trash2 size={15} className="text-red-400" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function AddSupplyModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const addCustomSupply = useAppStore((s) => s.addCustomSupply)
  const [name, setName] = useState('')
  const [note, setNote] = useState('')
  const [checkCycle, setCheckCycle] = useState<CheckCycle>('6months')
  const [portability, setPortability] = useState<Portability>('portable')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    addCustomSupply({
      name: name.trim(),
      note: note.trim(),
      checkCycle,
      portability,
    })

    setName('')
    setNote('')
    setCheckCycle('6months')
    setPortability('portable')
    onClose()
  }

  if (!open) return null

  return (
    <ModalPortal open={open}>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in pointer-events-auto">
        <div className="relative w-full max-w-md mx-4 animate-scale-in pointer-events-auto">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-amber-600 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package size={22} className="text-white" />
                <h3 className="text-white font-serif font-bold text-lg">添加自定义物资</h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-white/20 transition-colors"
              >
                <X size={20} className="text-white" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                  物资名称 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="如：救生衣、防毒面具、应急收音机等"
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all text-zinc-800"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                  便携类型
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['fixed', 'portable'] as Portability[]).map((p) => {
                    const PIcon = portabilityIcons[p]
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPortability(p)}
                        className={cn(
                          'flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all border',
                          portability === p
                            ? 'bg-amber-50 border-amber-400 text-amber-700'
                            : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300'
                        )}
                      >
                        <PIcon size={16} />
                        {portabilityLabels[p]}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                  备注说明
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="如：洪水地区必备"
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all text-zinc-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                  检查周期
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(checkCycleLabels) as CheckCycle[]).map((cycle) => (
                    <button
                      key={cycle}
                      type="button"
                      onClick={() => setCheckCycle(cycle)}
                      className={cn(
                        'px-3 py-2 rounded-lg text-sm font-medium transition-all border',
                        checkCycle === cycle
                          ? 'bg-amber-50 border-amber-400 text-amber-700'
                          : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300'
                      )}
                    >
                      {checkCycleLabels[cycle]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 border border-zinc-200 text-zinc-600 font-medium rounded-xl hover:bg-zinc-50 transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={!name.trim()}
                  className="flex-1 py-3 bg-amber-600 hover:bg-amber-700 disabled:bg-zinc-300 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all active:scale-[0.98]"
                >
                  添加
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </ModalPortal>
  )
}

export default function EmergencySupplySection() {
  const supplies = useAppStore((s) => s.supplies)
  const [modalOpen, setModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'all' | Portability>('all')

  const filteredSupplies = activeTab === 'all'
    ? supplies
    : supplies.filter((s) => s.portability === activeTab)

  const preparedCount = supplies.filter((s) => s.isPrepared).length
  const dueCount = supplies.filter((s) => s.isPrepared && isCheckDue(s)).length

  const fixedCount = supplies.filter((s) => s.portability === 'fixed').length
  const portableCount = supplies.filter((s) => s.portability === 'portable').length
  const fixedPreparedCount = supplies.filter((s) => s.portability === 'fixed' && s.isPrepared).length
  const portablePreparedCount = supplies.filter((s) => s.portability === 'portable' && s.isPrepared).length

  const groupedSupplies = filteredSupplies.reduce((acc, supply) => {
    const key = supply.category
    if (!acc[key]) acc[key] = []
    acc[key].push(supply)
    return acc
  }, {} as Record<EmergencySupply['category'], EmergencySupply[]>)

  const categoryOrder: EmergencySupply['category'][] = [
    'lighting',
    'medical',
    'fire',
    'food',
    'financial',
    'communication',
    'custom',
  ]

  const tabs: { key: 'all' | Portability; label: string; icon: typeof Package }[] = [
    { key: 'all', label: '全部', icon: Package },
    { key: 'fixed', label: '家中固定', icon: Home },
    { key: 'portable', label: '随身携带', icon: Backpack },
  ]

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-600/10 flex items-center justify-center">
            <Package size={18} className="text-amber-600" />
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold text-zinc-800">应急物资清单</h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              已备 {preparedCount}/{supplies.length} 项
              {dueCount > 0 && (
                <span className="ml-2 text-amber-600 font-medium">
                  ({dueCount} 项需检查)
                </span>
              )}
            </p>
          </div>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-xl transition-all hover:shadow-lg active:scale-[0.97]"
        >
          <Plus size={16} />
          添加自定义
        </button>
      </div>

      <div className="flex bg-white rounded-xl p-1 border border-zinc-100 shadow-sm">
        {tabs.map((tab) => {
          const TabIcon = tab.icon
          const isActive = activeTab === tab.key
          let count = supplies.length
          let prepared = preparedCount
          if (tab.key === 'fixed') {
            count = fixedCount
            prepared = fixedPreparedCount
          } else if (tab.key === 'portable') {
            count = portableCount
            prepared = portablePreparedCount
          }
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm font-medium transition-all',
                isActive
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-zinc-500 hover:bg-zinc-50'
              )}
            >
              <TabIcon size={14} />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className={cn(
                'text-xs px-1.5 py-0.5 rounded-md',
                isActive ? 'bg-white/20 text-white' : 'bg-zinc-100 text-zinc-500'
              )}>
                {prepared}/{count}
              </span>
            </button>
          )
        })}
      </div>

      <div className="space-y-6">
        {categoryOrder.map((category) => {
          const categorySupplies = groupedSupplies[category]
          if (!categorySupplies || categorySupplies.length === 0) return null

          const CatIcon = categoryIcons[category]
          return (
            <div key={category} className="space-y-2">
              <div className="flex items-center gap-2">
                <CatIcon size={16} className="text-zinc-400" />
                <h3 className="text-sm font-semibold text-zinc-500">
                  {categoryLabels[category]}
                </h3>
                <span className="text-xs text-zinc-400">
                  ({categorySupplies.filter((s) => s.isPrepared).length}/
                  {categorySupplies.length})
                </span>
              </div>
              <div className="space-y-2">
                {categorySupplies.map((supply) => (
                  <SupplyItem key={supply.id} supply={supply} />
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <AddSupplyModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  )
}
