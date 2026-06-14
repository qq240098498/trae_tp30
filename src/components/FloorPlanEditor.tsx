import { useState, useRef } from 'react'
import {
  Upload,
  X,
  Trash2,
  Info,
  Flame,
  Zap,
  Gauge,
  Plus,
  Pencil,
  Check,
} from 'lucide-react'
import {
  useAppStore,
  markerTypeLabels,
  markerTypeColors,
  type MarkerType,
  type FloorPlanMarker,
} from '@/store/useAppStore'
import { cn } from '@/lib/utils'
import ModalPortal from './ModalPortal'

const markerIcons: Record<MarkerType, typeof Flame> = {
  fireExtinguisher: Flame,
  electricalPanel: Zap,
  gasValve: Gauge,
}

function AddMarkerModal({
  open,
  onClose,
  position,
  onAdd,
}: {
  open: boolean
  onClose: () => void
  position: { x: number; y: number } | null
  onAdd: (type: MarkerType, note: string) => void
}) {
  const [selectedType, setSelectedType] = useState<MarkerType>('fireExtinguisher')
  const [note, setNote] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd(selectedType, note.trim())
    setNote('')
    setSelectedType('fireExtinguisher')
    onClose()
  }

  if (!open || !position) return null

  const markerTypes: MarkerType[] = ['fireExtinguisher', 'electricalPanel', 'gasValve']

  return (
    <ModalPortal open={open}>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in pointer-events-auto">
        <div className="relative w-full max-w-md mx-4 animate-scale-in pointer-events-auto">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-amber-600 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plus size={22} className="text-white" />
                <h3 className="text-white font-serif font-bold text-lg">添加标注点</h3>
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
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  设施类型 <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {markerTypes.map((type) => {
                    const Icon = markerIcons[type]
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setSelectedType(type)}
                        className={cn(
                          'flex flex-col items-center justify-center gap-1 px-3 py-3 rounded-xl text-xs font-medium transition-all border',
                          selectedType === type
                            ? 'bg-amber-50 border-amber-400 text-amber-700'
                            : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300'
                        )}
                      >
                        <Icon size={20} />
                        {markerTypeLabels[type]}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                  位置说明
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="如：客厅靠近阳台处"
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all text-zinc-800"
                  autoFocus
                />
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
                  className="flex-1 py-3 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-xl transition-all active:scale-[0.98]"
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

function EditMarkerModal({
  open,
  onClose,
  marker,
  onUpdate,
  onDelete,
}: {
  open: boolean
  onClose: () => void
  marker: FloorPlanMarker | null
  onUpdate: (note: string) => void
  onDelete: () => void
}) {
  const [note, setNote] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdate(note.trim())
    onClose()
  }

  if (!open || !marker) return null

  const Icon = markerIcons[marker.type]

  return (
    <ModalPortal open={open}>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in pointer-events-auto">
        <div className="relative w-full max-w-md mx-4 animate-scale-in pointer-events-auto">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-amber-600 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Pencil size={22} className="text-white" />
                <h3 className="text-white font-serif font-bold text-lg">编辑标注点</h3>
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
              <div className="flex items-center gap-2 p-3 bg-zinc-50 rounded-xl">
                <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', markerTypeColors[marker.type])}>
                  <Icon size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-800">{markerTypeLabels[marker.type]}</p>
                  <p className="text-xs text-zinc-500">位置已固定，点击平面图可移动</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                  位置说明
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="如：客厅靠近阳台处"
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all text-zinc-800"
                  autoFocus
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={onDelete}
                  className="px-4 py-3 border border-red-200 text-red-600 font-medium rounded-xl hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 border border-zinc-200 text-zinc-600 font-medium rounded-xl hover:bg-zinc-50 transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-xl transition-all active:scale-[0.98]"
                >
                  保存
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </ModalPortal>
  )
}

export default function FloorPlanEditor() {
  const floorPlan = useAppStore((s) => s.floorPlan)
  const setFloorPlanImage = useAppStore((s) => s.setFloorPlanImage)
  const addFloorPlanMarker = useAppStore((s) => s.addFloorPlanMarker)
  const updateFloorPlanMarker = useAppStore((s) => s.updateFloorPlanMarker)
  const deleteFloorPlanMarker = useAppStore((s) => s.deleteFloorPlanMarker)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [clickPosition, setClickPosition] = useState<{ x: number; y: number } | null>(null)
  const [selectedMarker, setSelectedMarker] = useState<FloorPlanMarker | null>(null)
  const [isPlacing, setIsPlacing] = useState(false)
  const [placingType, setPlacingType] = useState<MarkerType | null>(null)

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setFloorPlanImage(result)
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileUpload(file)
  }

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!floorPlan.imageData) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    const clickedMarker = floorPlan.markers.find((m) => {
      const dx = m.x - x
      const dy = m.y - y
      return Math.sqrt(dx * dx + dy * dy) < 3
    })

    if (isPlacing && placingType) {
      addFloorPlanMarker({
        type: placingType,
        x,
        y,
      })
      setIsPlacing(false)
      setPlacingType(null)
      return
    }

    if (clickedMarker) {
      setSelectedMarker(clickedMarker)
      setEditModalOpen(true)
    } else {
      setClickPosition({ x, y })
      setAddModalOpen(true)
    }
  }

  const handleAddMarker = (type: MarkerType, note: string) => {
    if (!clickPosition) return
    addFloorPlanMarker({
      type,
      x: clickPosition.x,
      y: clickPosition.y,
      note: note || undefined,
    })
  }

  const handleQuickAdd = (type: MarkerType) => {
    setIsPlacing(true)
    setPlacingType(type)
  }

  const handleUpdateMarker = (note: string) => {
    if (!selectedMarker) return
    updateFloorPlanMarker(selectedMarker.id, { note: note || undefined })
  }

  const handleDeleteMarker = () => {
    if (!selectedMarker) return
    deleteFloorPlanMarker(selectedMarker.id)
    setEditModalOpen(false)
  }

  const handleRemoveImage = () => {
    setFloorPlanImage(null)
  }

  const markerTypes: MarkerType[] = ['fireExtinguisher', 'electricalPanel', 'gasValve']

  return (
    <div className="space-y-4">
      {!floorPlan.imageData ? (
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            'border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all',
            isDragging
              ? 'border-amber-400 bg-amber-50'
              : 'border-zinc-200 hover:border-amber-300 hover:bg-zinc-50'
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleFileUpload(file)
            }}
          />
          <Upload size={48} className="mx-auto text-zinc-400 mb-3" />
          <p className="text-zinc-700 font-medium">点击或拖拽上传家中平面图</p>
          <p className="text-zinc-500 text-sm mt-1">支持 JPG、PNG 等图片格式</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Info size={14} className="text-zinc-400" />
              <p className="text-xs text-zinc-500">
                {isPlacing ? '点击平面图放置标注点' : '点击平面图添加标注点，点击已有标注点可编辑'}
              </p>
            </div>
            <button
              onClick={handleRemoveImage}
              className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 transition-colors"
            >
              <Trash2 size={14} />
              移除图片
            </button>
          </div>

          <div className="flex gap-2 flex-wrap">
            {markerTypes.map((type) => {
              const Icon = markerIcons[type]
              return (
                <button
                  key={type}
                  onClick={() => handleQuickAdd(type)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all border',
                    isPlacing && placingType === type
                      ? 'bg-amber-100 border-amber-400 text-amber-700'
                      : 'bg-white border-zinc-200 text-zinc-600 hover:border-amber-300'
                  )}
                >
                  <Icon size={14} />
                  添加{markerTypeLabels[type]}
                </button>
              )
            })}
            {isPlacing && (
              <button
                onClick={() => {
                  setIsPlacing(false)
                  setPlacingType(null)
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 transition-all"
              >
                <X size={14} />
                取消放置
              </button>
            )}
          </div>

          <div
            onClick={handleImageClick}
            className={cn(
              'relative rounded-2xl overflow-hidden border border-zinc-200 bg-white cursor-crosshair transition-all',
              isPlacing && 'ring-2 ring-amber-400 ring-offset-2'
            )}
          >
            <img
              src={floorPlan.imageData}
              alt="家中平面图"
              className="w-full h-auto select-none pointer-events-none"
              draggable={false}
            />
            {floorPlan.markers.map((marker) => {
              const Icon = markerIcons[marker.type]
              return (
                <div
                  key={marker.id}
                  className={cn(
                    'absolute w-7 h-7 rounded-full flex items-center justify-center shadow-lg transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110 cursor-pointer',
                    markerTypeColors[marker.type]
                  )}
                  style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                  title={marker.note || markerTypeLabels[marker.type]}
                >
                  <Icon size={14} className="text-white" />
                </div>
              )
            })}
          </div>

          {floorPlan.markers.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {markerTypes.map((type) => {
                const count = floorPlan.markers.filter((m) => m.type === type).length
                if (count === 0) return null
                const Icon = markerIcons[type]
                return (
                  <div
                    key={type}
                    className="flex items-center gap-2 text-xs text-zinc-600"
                  >
                    <div className={cn('w-4 h-4 rounded-full flex items-center justify-center', markerTypeColors[type])}>
                      <Icon size={10} className="text-white" />
                    </div>
                    <span>{markerTypeLabels[type]}: {count} 处</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      <AddMarkerModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        position={clickPosition}
        onAdd={handleAddMarker}
      />

      <EditMarkerModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        marker={selectedMarker}
        onUpdate={handleUpdateMarker}
        onDelete={handleDeleteMarker}
      />
    </div>
  )
}
