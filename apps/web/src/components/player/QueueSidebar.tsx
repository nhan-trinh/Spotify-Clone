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
      "h-full w-full bg-black flex flex-col border-l-2 border-white/10 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] relative overflow-hidden group/queue",
      isQueueVisible
        ? "translate-x-0 opacity-100 pointer-events-auto"
        : "translate-x-full opacity-0 pointer-events-none"
    )}>
      {/* Texture Overlay (Grain) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* Giant Background Label */}
      <div className="absolute -right-8 top-1/2 -translate-y-1/2 select-none pointer-events-none origin-center rotate-90 whitespace-nowrap">
        <span className="text-[140px] font-black text-white/[0.02] tracking-tighter uppercase leading-none">
          Up Next
        </span>
      </div>

      {/* Header - Editorial Style */}
      <div className="flex items-center justify-between p-6 border-b-2 border-white/10 relative z-10">
        <div className="flex flex-col">
          <h2 className="text-[24px] font-black text-white leading-none tracking-tighter uppercase flex items-center gap-3">
            Queue
          </h2>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-8 h-[2px] bg-[#1db954]" />
            <span className="text-[8px] font-black text-[#444] uppercase tracking-[0.4em]">What's Next?</span>
          </div>
        </div>
        <button
          onClick={toggleQueue}
          className="p-2 text-[#222] hover:text-white transition-all hover:scale-110 active:rotate-180"
        >
          <X size={28} strokeWidth={3} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
        <div className="p-8 space-y-16">
          {/* ══ NOW PLAYING ══ */}
          <section>
            <h3 className="text-[#333] text-[10px] font-black uppercase tracking-[0.4em] mb-8 flex items-center gap-4">
              Current Stream
              <div className="flex-1 h-[1px] bg-white/5" />
            </h3>
            {currentTrack ? (
              <div className="flex items-center gap-6 p-6 bg-white/[0.03] border border-white/10 group/now relative overflow-hidden">
                <div className="relative w-20 h-20 shrink-0 shadow-[10px_10px_0px_rgba(29,185,84,0.1)] transition-transform duration-500 group-hover/now:scale-105">
                  <img src={currentTrack.coverUrl} className="w-full h-full object-cover grayscale group-hover/now:grayscale-0 transition-all duration-700" alt="" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover/now:opacity-100 transition-opacity">
                    <button onClick={togglePlay} className="text-white hover:scale-125 transition-transform">
                      {isPlaying ? <Pause size={32} className="fill-current" /> : <Play size={32} className="fill-current ml-1" />}
                    </button>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[18px] font-black truncate text-[#1db954] uppercase tracking-tighter leading-none">{currentTrack.title}</p>
                  <p className="text-[10px] text-[#666] font-bold uppercase tracking-[0.2em] mt-3">{currentTrack.artistName}</p>

                  {/* Dynamic Stream Info */}
                  <div className="mt-4 flex items-center gap-3">
                    <div className="px-1.5 py-0.5 border border-white/10 text-[7px] font-black text-[#1db954] uppercase tracking-widest">Hi-Res</div>
                    <span className="text-[7px] font-black text-[#222] uppercase tracking-widest">PCM 24bit / 48kHz</span>
                  </div>
                </div>
                {/* Active industrial indicator */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#1db954] shadow-[0_0_15px_#1db954]" />
              </div>
            ) : (
              <p className="text-[11px] text-[#222] font-black uppercase tracking-widest italic">Signal Lost...</p>
            )}
          </section>

          {/* ══ NEXT UP (MANUAL) ══ */}
          {manualQueue.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-[#333] text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-4 flex-1">
                  Manual Entry
                  <div className="flex-1 h-[1px] bg-white/5" />
                </h3>
                <button
                  onClick={clearManualQueue}
                  className="ml-6 px-3 py-1 border border-white/10 text-[8px] font-black text-[#444] uppercase tracking-widest hover:text-white hover:border-white transition-all"
                >
                  Purge
                </button>
              </div>

              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="queue-sidebar-manual">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="flex flex-col">
                      {manualQueue.map((track, index) => (
                        <Draggable key={`${track.id}-${index}`} draggableId={`q-${track.id}-${index}`} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={cn(
                                "flex items-center gap-5 p-5 border-b border-white/5 hover:bg-white/[0.03] group/item transition-all relative",
                                snapshot.isDragging ? "bg-[#111] border-white/20 shadow-2xl z-50 scale-105" : ""
                              )}
                            >
                              <div {...provided.dragHandleProps} className="text-[#222] group-hover/item:text-[#1db954] transition-colors">
                                <GripVertical size={18} />
                              </div>
                              <div className="relative shrink-0">
                                <img src={track.coverUrl} className="w-14 h-14 object-cover grayscale group-hover/item:grayscale-0 transition-all duration-700 shadow-[6px_6px_0px_rgba(255,255,255,0.03)]" alt="" />
                                <div className="absolute -top-1 -right-1 text-[8px] font-black text-white/10 group-hover/item:text-[#1db954]">
                                  {(index + 1).toString().padStart(2, '0')}
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[14px] font-black truncate text-white uppercase tracking-tight">{track.title}</p>
                                <p className="text-[9px] text-[#444] font-bold uppercase tracking-[0.15em] mt-1">{track.artistName}</p>
                              </div>
                              <button
                                onClick={() => removeFromManualQueue(index)}
                                className="opacity-0 group-hover/item:opacity-100 p-2 text-[#222] hover:text-[#ff4444] transition-all"
                              >
                                <Trash2 size={18} />
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
          )}

          {/* ══ NEXT FROM CONTEXT ══ */}
          {nextInContext.length > 0 && (
            <section>
              <h3 className="text-[#333] text-[10px] font-black uppercase tracking-[0.4em] mb-8 flex items-center gap-4">
                Auto Generated
                <div className="flex-1 h-[1px] bg-white/5" />
              </h3>
              <div className="flex flex-col">
                {nextInContext.slice(0, 20).map((track, i) => (
                  <div
                    key={track.id + i}
                    className="flex items-center gap-5 p-5 border-b border-white/5 hover:bg-white/[0.03] group/ctx transition-all cursor-pointer relative"
                    onDoubleClick={() => playTrack(track)}
                  >
                    <div className="absolute left-2 top-2 text-[7px] font-black text-white/5">
                      {(i + 1).toString().padStart(2, '0')}
                    </div>
                    <img src={track.coverUrl} className="w-14 h-14 object-cover grayscale group-hover/ctx:grayscale-0 transition-all duration-700 shadow-[6px_6px_0px_rgba(255,255,255,0.03)]" alt="" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-black truncate text-white uppercase tracking-tight group-hover:text-[#1db954] transition-colors">{track.title}</p>
                      <p className="text-[9px] text-[#444] font-bold uppercase tracking-widest mt-1">{track.artistName}</p>
                    </div>
                    {/* Hover detail */}
                    <div className="opacity-0 group-hover/ctx:opacity-100 text-[7px] font-black text-[#222] uppercase tracking-widest">Context Flow</div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};
