import { useState } from 'react'
import {
  ClipboardList,
  Flame,
  Waves,
  MapPin,
  Plus,
  X,
  Pencil,
  Check,
  Share2,
  Users,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import {
  useAppStore,
  type EmergencyPlan as EmergencyPlanType,
} from '@/store/useAppStore'
import { cn } from '@/lib/utils'
import FloorPlanEditor from './FloorPlanEditor'
import ModalPortal from './ModalPortal'

function ShareModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  if (!open) return null

  return (
    <ModalPortal open={open}>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in pointer-events-auto">
        <div className="relative w-full max-w-md mx-4 animate-scale-in pointer-events-auto">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-amber-600 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Share2 size={22} className="text-white" />
                <h3 className="text-white font-serif font-bold text-lg">共享应急计划</h3>
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
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                <div className="flex items-start gap-3">
                  <Users size={20} className="text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-800">家庭成员共享</p>
                    <p className="text-xs text-amber-600 mt-1">
                      所有数据保存在本地浏览器中。您可以通过以下方式与家人共享：
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                  <p className="text-sm font-medium text-zinc-800">方式一：导出数据</p>
                  <p className="text-xs text-zinc-500 mt-1">
                    导出 JSON 数据文件，家人可在其设备上导入查看
                  </p>
                  <button
                    onClick={() => {
                      const data = localStorage.getItem('family-emergency-data')
                      if (data) {
                        const blob = new Blob([data], { type: 'application/json' })
                        const url = URL.createObjectURL(blob)
                        const a = document.createElement('a')
                        a.href = url
                        a.download = 'family-emergency-plan.json'
                        a.click()
                        URL.revokeObjectURL(url)
                      }
                    }}
                    className="mt-2 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium rounded-lg transition-colors"
                  >
                    导出数据
                  </button>
                </div>

                <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                  <p className="text-sm font-medium text-zinc-800">方式二：截图保存</p>
                  <p className="text-xs text-zinc-500 mt-1">
                    截图应急卡片和平面图，发送给家人保存
                  </p>
                  <p className="text-xs text-zinc-400 mt-2">
                    提示：可使用浏览器截图工具截取页面内容
                  </p>
                </div>

                <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                  <p className="text-sm font-medium text-zinc-800">方式三：打印应急卡片</p>
                  <p className="text-xs text-zinc-500 mt-1">
                    打印紧急信息卡片，每位家庭成员随身携带
                  </p>
                  <button
                    onClick={() => window.print()}
                    className="mt-2 px-3 py-1.5 bg-zinc-600 hover:bg-zinc-700 text-white text-xs font-medium rounded-lg transition-colors"
                  >
                    打印页面
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-xl transition-all active:scale-[0.98]"
                >
                  我知道了
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModalPortal>
  )
}

function EditableField({
  label,
  icon: Icon,
  value,
  placeholder,
  onSave,
  multiline = false,
  iconColor = 'text-amber-600',
  iconBg = 'bg-amber-600/10',
}: {
  label: string
  icon: typeof Flame
  value: string
  placeholder: string
  onSave: (value: string) => void
  multiline?: boolean
  iconColor?: string
  iconBg?: string
}) {
  const [editing, setEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)

  const handleSave = () => {
    onSave(editValue.trim())
    setEditing(false)
  }

  const handleEdit = () => {
    setEditValue(value)
    setEditing(true)
  }

  return (
    <div className="bg-white rounded-2xl border border-zinc-100 p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center', iconBg)}>
          <Icon size={14} className={iconColor} />
        </div>
        <h3 className="text-sm font-semibold text-zinc-800">{label}</h3>
      </div>

      {editing ? (
        <div className="space-y-2">
          {multiline ? (
            <textarea
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              placeholder={placeholder}
              rows={3}
              className="w-full px-3 py-2 rounded-xl border border-zinc-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all text-sm text-zinc-800 resize-none"
              autoFocus
            />
          ) : (
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              placeholder={placeholder}
              className="w-full px-3 py-2 rounded-xl border border-zinc-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all text-sm text-zinc-800"
              autoFocus
            />
          )}
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setEditing(false)}
              className="px-3 py-1.5 text-xs text-zinc-500 hover:bg-zinc-100 rounded-lg transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium rounded-lg transition-colors"
            >
              <Check size={12} />
              保存
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-start justify-between gap-3">
          <p className={cn('text-sm flex-1', value ? 'text-zinc-700' : 'text-zinc-400 italic')}>
            {value || placeholder}
          </p>
          <button
            onClick={handleEdit}
            className="p-1.5 rounded-lg hover:bg-zinc-100 transition-colors shrink-0"
          >
            <Pencil size={14} className="text-zinc-400" />
          </button>
        </div>
      )}
    </div>
  )
}

function MeetingPoints({
  points,
  onAdd,
  onRemove,
}: {
  points: string[]
  onAdd: (point: string) => void
  onRemove: (index: number) => void
}) {
  const [adding, setAdding] = useState(false)
  const [newPoint, setNewPoint] = useState('')

  const handleAdd = () => {
    if (!newPoint.trim()) return
    onAdd(newPoint.trim())
    setNewPoint('')
    setAdding(false)
  }

  const commonPoints = ['小区广场', '附近派出所', '社区公园', '学校操场', '地铁站出口']

  return (
    <div className="bg-white rounded-2xl border border-zinc-100 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-600/10 flex items-center justify-center">
            <MapPin size={14} className="text-blue-600" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-800">紧急集合地点</h3>
        </div>
        <span className="text-xs text-zinc-400">
          {points.length} 个地点
        </span>
      </div>

      {points.length > 0 && (
        <div className="space-y-2 mb-3">
          {points.map((point, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2.5 bg-zinc-50 rounded-xl group"
            >
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-xs font-medium flex items-center justify-center">
                  {index + 1}
                </span>
                <span className="text-sm text-zinc-700">{point}</span>
              </div>
              <button
                onClick={() => onRemove(index)}
                className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 transition-all"
              >
                <X size={14} className="text-red-400" />
              </button>
            </div>
          ))}
        </div>
      )}

      {adding ? (
        <div className="space-y-2">
          <input
            type="text"
            value={newPoint}
            onChange={(e) => setNewPoint(e.target.value)}
            placeholder="如：小区广场、附近派出所"
            className="w-full px-3 py-2 rounded-xl border border-zinc-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all text-sm text-zinc-800"
            autoFocus
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <div className="flex flex-wrap gap-1.5 mb-2">
            {commonPoints.map((p) => (
              <button
                key={p}
                onClick={() => setNewPoint(p)}
                className="px-2 py-1 text-xs bg-zinc-100 hover:bg-zinc-200 text-zinc-600 rounded-lg transition-colors"
              >
                {p}
              </button>
            ))}
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setAdding(false)
                setNewPoint('')
              }}
              className="px-3 py-1.5 text-xs text-zinc-500 hover:bg-zinc-100 rounded-lg transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleAdd}
              disabled={!newPoint.trim()}
              className="flex items-center gap-1 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 disabled:bg-zinc-300 disabled:cursor-not-allowed text-white text-xs font-medium rounded-lg transition-colors"
            >
              <Check size={12} />
              添加
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 border border-dashed border-zinc-300 rounded-xl text-sm text-zinc-500 hover:border-amber-400 hover:text-amber-600 hover:bg-amber-50/50 transition-all"
        >
          <Plus size={16} />
          添加集合地点
        </button>
      )}
    </div>
  )
}

export default function EmergencyPlanSection() {
  const emergencyPlan = useAppStore((s) => s.emergencyPlan)
  const setEmergencyPlan = useAppStore((s) => s.setEmergencyPlan)
  const addMeetingPoint = useAppStore((s) => s.addMeetingPoint)
  const removeMeetingPoint = useAppStore((s) => s.removeMeetingPoint)

  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [showFloorPlan, setShowFloorPlan] = useState(false)

  const handleSaveFireEscapeRoute = (value: string) => {
    setEmergencyPlan({ fireEscapeRoute: value })
  }

  const handleSaveEarthquakeShelter = (value: string) => {
    setEmergencyPlan({ earthquakeShelter: value })
  }

  const completedCount = [
    emergencyPlan.fireEscapeRoute,
    emergencyPlan.earthquakeShelter,
    emergencyPlan.meetingPoints.length > 0,
  ].filter(Boolean).length

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-600/10 flex items-center justify-center">
            <ClipboardList size={18} className="text-red-600" />
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold text-zinc-800">家庭应急计划</h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              已完成 {completedCount}/3 项
            </p>
          </div>
        </div>
        <button
          onClick={() => setShareModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-sm font-medium rounded-xl transition-all"
        >
          <Share2 size={14} />
          <span className="hidden sm:inline">共享</span>
        </button>
      </div>

      <div className="space-y-3">
        <EditableField
          label="火灾逃生路线"
          icon={Flame}
          value={emergencyPlan.fireEscapeRoute}
          placeholder="请填写火灾发生时的逃生路线，如：从卧室经客厅到正门逃生，或从阳台使用逃生绳"
          onSave={handleSaveFireEscapeRoute}
          multiline
          iconColor="text-red-600"
          iconBg="bg-red-600/10"
        />

        <EditableField
          label="地震躲避点"
          icon={Waves}
          value={emergencyPlan.earthquakeShelter}
          placeholder="请填写地震发生时的躲避位置，如：客厅承重墙根、卫生间、书桌下"
          onSave={handleSaveEarthquakeShelter}
          multiline
          iconColor="text-orange-600"
          iconBg="bg-orange-600/10"
        />

        <MeetingPoints
          points={emergencyPlan.meetingPoints}
          onAdd={addMeetingPoint}
          onRemove={removeMeetingPoint}
        />

        <div className="bg-white rounded-2xl border border-zinc-100 p-4 shadow-sm">
          <button
            onClick={() => setShowFloorPlan(!showFloorPlan)}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-purple-600/10 flex items-center justify-center">
                <ImageIcon size={14} className="text-purple-600" />
              </div>
              <div className="text-left">
                <h3 className="text-sm font-semibold text-zinc-800">家中平面图标注</h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  标注灭火器、总电闸、燃气阀门位置
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {showFloorPlan ? (
                <ChevronUp size={18} className="text-zinc-400" />
              ) : (
                <ChevronDown size={18} className="text-zinc-400" />
              )}
            </div>
          </button>

          {showFloorPlan && (
            <div className="mt-4 pt-4 border-t border-zinc-100">
              <FloorPlanEditor />
            </div>
          )}
        </div>
      </div>

      <ShareModal open={shareModalOpen} onClose={() => setShareModalOpen(false)} />
    </section>
  )
}
