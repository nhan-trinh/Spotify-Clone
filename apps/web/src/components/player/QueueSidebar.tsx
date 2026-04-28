import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { usePlayerStore } from '../../stores/player.store';
import { useUIStore } from '../../stores/ui.store';
import { Play, Pause, Trash2, GripVertical, X } from 'lucide-react';
import { cn } from '../../lib/utils';

export const QueueSidebar = () => {
  const { 
    currentTrack, 
    manualQueue, 
    contextQueue, 
    contextIndex, 
    isPlaying, 
    togglePlay, 
    removeFromManualQueue, 
    moveManualQueueTrack,
    clearManualQueue,
    playTrack
  } = usePlayerStore();

  const { isQueueVisible, toggleQueue } = useUIStore();

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    moveManualQueueTrack(result.source.index, result.destination.index);
  };

  const nextInContext = contextQueue.slice(contextIndex + 1);

  return (
    <div className={cn(
      "h-full w-full bg-[#121212] flex flex-col rounded-lg overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.3,0,0,1)]",
      isQueueVisible 
        ? "translate-y-0 opacity-100 pointer-events-auto" 
        : "translate-y-[20%] opacity-0 pointer-events-none"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 py-3 shrink-0">
        <span className="text-[13px] font-bold text-white uppercase tracking-tight">
          Danh sách chờ
        </span>
        <button 
          onClick={toggleQueue}
          className="p-1.5 text-[#b3b3b3] hover:text-white hover:bg-white/10 rounded-full transition-all"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 pt-0 space-y-6">
        {/* Banner gợi ý (giống Spotify) */}
        <div className="bg-[#242424] p-4 rounded-lg">
           <p className="text-[#b3b3b3] text-sm leading-relaxed">
             Về nội dung để xuất và tác động của việc quảng bá
           </p>
        </div>
        {/* ══ ĐANG PHÁT ══ */}
        <section>
          <h3 className="text-white text-base font-bold mb-4">Đang phát</h3>
          {currentTrack ? (
            <div className="flex items-center gap-3 p-2 rounded-md hover:bg-white/5 group relative">
              <div className="relative w-12 h-12 shrink-0">
                <img src={currentTrack.coverUrl} className="w-full h-full object-cover rounded shadow" alt="" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={togglePlay} className="text-white">
                    {isPlaying ? <Pause size={20} className="fill-current" /> : <Play size={20} className="fill-current ml-0.5" />}
                  </button>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate text-[#1db954]">{currentTrack.title}</p>
                <p className="text-xs text-[#b3b3b3] truncate font-medium">{currentTrack.artistName}</p>
              </div>
            </div>
          ) : (
            <p className="text-[#b3b3b3] italic text-xs">Không có bài hát nào</p>
          )}
        </section>

        {/* ══ HÀNG CHỜ CỦA BẠN (TIẾP THEO) ══ */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white text-base font-bold">Tiếp theo</h3>
            {manualQueue.length > 0 && (
              <button 
                onClick={clearManualQueue}
                className="text-xs font-bold text-[#b3b3b3] hover:text-white hover:underline"
              >
                Xóa hết
              </button>
            )}
          </div>

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="queue-sidebar-manual">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="flex flex-col gap-1">
                  {manualQueue.map((track, index) => (
                    <Draggable key={`${track.id}-${index}`} draggableId={`q-${track.id}-${index}`} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={cn(
                            "flex items-center gap-3 p-2 rounded-md hover:bg-white/10 group transition-colors",
                            snapshot.isDragging ? "bg-[#282828] shadow-2xl" : ""
                          )}
                        >
                          <div {...provided.dragHandleProps} className="text-[#b3b3b3] hover:text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <GripVertical size={14} />
                          </div>
                          <img src={track.coverUrl} className="w-10 h-10 object-cover rounded shadow shrink-0" alt="" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold truncate text-white">{track.title}</p>
                            <p className="text-xs text-[#b3b3b3] truncate font-medium">{track.artistName}</p>
                          </div>
                          <button 
                            onClick={() => removeFromManualQueue(index)}
                            className="opacity-0 group-hover:opacity-100 p-2 text-[#b3b3b3] hover:text-white transition-opacity"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </section>

        {/* ══ TIẾP THEO TỪ CONTEXT ══ */}
        {nextInContext.length > 0 && (
          <section>
            <h3 className="text-[#b3b3b3] text-sm font-bold mb-4 uppercase tracking-tight">
              Tiếp theo từ: {currentTrack?.artistName || 'Nội dung này'}
            </h3>
            <div className="flex flex-col gap-1">
              {nextInContext.slice(0, 20).map((track, i) => (
                <div 
                  key={track.id + i} 
                  className="flex items-center gap-3 p-2 pl-2 rounded-md hover:bg-white/10 group transition-colors cursor-pointer"
                  onDoubleClick={() => playTrack(track)}
                >
                  <img src={track.coverUrl} className="w-10 h-10 object-cover rounded shadow shrink-0" alt="" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate text-white group-hover:text-[#1db954]">{track.title}</p>
                    <p className="text-xs text-[#b3b3b3] truncate font-medium">{track.artistName}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
