import React, { useState, useEffect } from 'react';
import type { UniqueIdentifier } from '@dnd-kit/core';
import { X, Plus } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Constants
const MAX_LINKS = 10;
const MAX_NAME_LENGTH = 15;
const MAX_URL_LENGTH = 100;

// Sortable Item Component
const SortableItem = ({ link, removeLink, renderLinkIcon, truncateText, isBeingDragged }: { link: Link, removeLink: (id: string) => void, renderLinkIcon: (link: Link) => React.ReactNode, truncateText: (text: string, maxLength: number) => string, isBeingDragged: boolean }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : transition,
    zIndex: isDragging ? 1000 : 1,
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!isDragging && !isBeingDragged) {
      e.preventDefault();
      window.open(link.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        relative flex flex-col items-center justify-center bg-white/5 rounded-2xl 
        transition-all duration-200 hover:bg-white/10 hover:shadow-xl hover:-translate-y-0.5 
        border border-white/5 backdrop-blur-sm w-24 h-24 p-2 cursor-pointer active:cursor-pointer
        ${isDragging ? 'scale-90 shadow-2xl bg-white/15 opacity-80' : ''}
      `}
      onClick={handleClick}
    >
      <div className="w-full h-full flex flex-col items-center justify-center no-underline">
        <div className="flex-1 flex items-center justify-center">
          {renderLinkIcon(link)}
        </div>
        <div className="text-xs text-white/80 text-center mt-2 leading-tight max-w-full">
          <div className="truncate" title={link.name}>
            {truncateText(link.name, 12)}
          </div>
        </div>
      </div>
      <button
        className="absolute -top-2 -right-2 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-white text-xs opacity-0 hover:opacity-100 transition-opacity z-10"
        onClick={(e) => {
          e.stopPropagation();
          removeLink(link.id);
        }}
      >
        <X size={12} />
      </button>
    </div>
  );
};

// Map of icon names to their corresponding SVG paths
const iconMap: Record<string, string> = {
  'google': '/images/icons/google.svg',
  'github': '/images/icons/github.svg',
  'twitter': '/images/icons/twitter.svg',
  'mail': '/images/icons/gmail.svg',
  'youtube': '/images/icons/youtube.svg',
  'linkedin': '/images/icons/linkedin.svg',
  'default': '/images/icons/link-2.svg'
};

const defaultLinks = [
  { id: '1', name: 'Google', url: 'https://google.com', icon: 'google' },
  { id: '2', name: 'Gmail', url: 'https://mail.google.com', icon: 'mail' },
  { id: '3', name: 'Youtube', url: 'https://youtube.com', icon: 'youtube' },
  { id: '4', name: 'Twitter', url: 'https://twitter.com', icon: 'twitter' },
  { id: '5', name: 'GitHub', url: 'https://github.com', icon: 'github' },
];

interface Link {
  id: string;
  name: string;
  url: string;
  icon: string;
  isCustom: boolean;
}

const QuickLinks = () => {
  const [links, setLinks] = useState<Link[]>(() => {
    try {
      const saved = localStorage.getItem('quickLinks');
      return saved ? JSON.parse(saved) : defaultLinks;
    } catch {
      return defaultLinks;
    }
  });
  
  const [isAdding, setIsAdding] = useState(false);
  const [draggedId, setDraggedId] = useState<UniqueIdentifier | null>(null);
  const [newLink, setNewLink] = useState({ 
    name: '', 
    url: 'https://',
    icon: 'default',
    isCustom: true
  });
  const [initialValues, setInitialValues] = useState({
    name: '',
    url: 'https://'
  });
  
  const showNameCounter = newLink.name === '' || newLink.name === initialValues.name;
  const showUrlCounter = newLink.url === 'https://' || newLink.url === initialValues.url;

  // Save to localStorage whenever links change
  useEffect(() => {
    try {
      localStorage.setItem('quickLinks', JSON.stringify(links));
    } catch (error) {
      console.error('Failed to save links:', error);
    }
  }, [links]);
  
  // Reset initial values when opening the add form
  useEffect(() => {
    if (isAdding) {
      setInitialValues({
        name: newLink.name,
        url: newLink.url
      });
    }
  }, [isAdding]);

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength).trim() + '...' : text;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase().substring(0, 2);
  };

  const generateColorFromName = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash % 360);
    return `hsl(${hue}, 70%, 50%)`;
  };

  const addLink = () => {
    if (links.length >= MAX_LINKS) {
      alert(`Maximum of ${MAX_LINKS} links allowed`);
      return;
    }
    
    // Reset to initial values after adding
    setInitialValues({ name: '', url: 'https://' });

    if (newLink.name && newLink.url && newLink.url !== 'https://') {
      const trimmedName = newLink.name.trim();
      const trimmedUrl = newLink.url.trim();
      
      if (trimmedName.length > MAX_NAME_LENGTH) {
        alert(`Name cannot exceed ${MAX_NAME_LENGTH} characters`);
        return;
      }
      
      if (trimmedUrl.length > MAX_URL_LENGTH) {
        alert(`URL cannot exceed ${MAX_URL_LENGTH} characters`);
        return;
      }

      const finalName = trimmedName || (newLink.isCustom ? new URL(trimmedUrl).hostname.replace('www.', '') : trimmedName);

      setLinks([...links, { 
        ...newLink, 
        id: Date.now().toString(),
        icon: newLink.icon,
        name: finalName.length > MAX_NAME_LENGTH ? truncateText(finalName, MAX_NAME_LENGTH) : finalName,
        url: trimmedUrl,
        isCustom: newLink.isCustom
      }]);
      
      setNewLink({ 
        name: '', 
        url: 'https://', 
        icon: 'default',
        isCustom: true 
      });
      setIsAdding(false);
    }
  };

  const removeLink = (id: string) => {
    setLinks(links.filter(link => link.id !== id));
  };

  const getDeletedDefaultLinks = () => {
    const currentUrls = new Set(links.map(link => link.url));
    return defaultLinks.filter(link => !currentUrls.has(link.url));
  };

  const renderLinkIcon = (link: Link) => {
    if (link.isCustom) {
      const initials = getInitials(link.name);
      const bgColor = generateColorFromName(link.name);
      
      return (
        <div 
          className="w-12 h-12 flex items-center justify-center rounded-lg text-white font-bold text-lg transition-all duration-200"
          style={{ backgroundColor: bgColor }}
        >
          {initials}
        </div>
      );
    }
    
    return (
      <div className="w-12 h-12 flex items-center justify-center transition-all duration-200">
        <img 
          src={iconMap[link.icon] || iconMap.default} 
          alt="" 
          className="w-full h-full object-contain"
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            img.src = iconMap.default;
          }}
        />
      </div>
    );
  };

  // Set up sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const draggedIndex = links.findIndex(link => link.id === event.active.id);
    setDraggedId(event.active.id);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      // Immediately swap positions for visual feedback
      const activeIndex = links.findIndex(link => link.id === active.id);
      const overIndex = links.findIndex(link => link.id === over.id);
      
      if (activeIndex !== -1 && overIndex !== -1) {
        setLinks((items) => arrayMove(items, activeIndex, overIndex));
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setDraggedId(null);
    
    // Final position is already set by handleDragOver
  };

  // Calculate grid layout for perfect centering
  const getGridLayout = () => {
    const totalItems = links.length + (isAdding ? 1 : (links.length < MAX_LINKS ? 1 : 0));
    const maxCols = 6;
    const cols = Math.min(totalItems, maxCols);
    const rows = Math.ceil(totalItems / maxCols);
    
    return { cols, rows, totalItems };
  };

  const { cols, totalItems } = getGridLayout();

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-8">
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div 
          className="grid gap-6 justify-center"
          style={{
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            maxWidth: `${cols * 120}px`,
            margin: '0 auto'
          }}
        >
          <SortableContext 
            items={links}
            strategy={rectSortingStrategy}
          >
            {links.map((link) => {
              const isBeingDragged = draggedId === link.id;
              
              return (
                <React.Fragment key={link.id}>
                  <SortableItem
                    link={link}
                    removeLink={removeLink}
                    renderLinkIcon={renderLinkIcon}
                    truncateText={truncateText}
                    isBeingDragged={isBeingDragged}
                  />
                </React.Fragment>
              );
            })}
          </SortableContext>

          {/* Add button or form */}
          {links.length < MAX_LINKS && (
            isAdding ? (
              <div className="col-span-full flex justify-center">
                <div className="bg-white/10 rounded-2xl p-5 flex flex-col gap-4 border border-white/20 backdrop-blur-sm w-80">
                  <div className="text-center text-white font-medium mb-2">Add Quick Link</div>
                  
                  {/* Default Links Grid */}
                  {getDeletedDefaultLinks().length > 0 && (
                    <>
                      <div className="mb-4">
                        <div className="text-sm text-white/70 mb-3">Choose from popular sites:</div>
                        <div className="grid grid-cols-6 gap-3">
                          {getDeletedDefaultLinks().map(link => (
                            <button
                              key={link.id}
                              onClick={() => {
                                if (links.length < MAX_LINKS) {
                                  setLinks([...links, { 
                                    ...link, 
                                    id: Date.now().toString(),
                                    isCustom: false
                                  }]);
                                  setIsAdding(false);
                                }
                              }}
                              className="flex items-center justify-center bg-white/10 rounded-lg p-2 hover:bg-white/20 transition-colors border border-white/10 hover:border-white/20 aspect-square"
                              title={`Add ${link.name}`}
                            >
                              <div className="w-6 h-6 flex items-center justify-center">
                                <img 
                                  src={iconMap[link.icon] || iconMap.default} 
                                  alt="" 
                                  className="w-full h-full object-contain"
                                />
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 my-2">
                        <div className="flex-1 h-px bg-white/20"></div>
                        <div className="text-sm text-white/60">OR</div>
                        <div className="flex-1 h-px bg-white/20"></div>
                      </div>
                    </>
                  )}

                  {/* Custom Link Section */}
                  <div>
                    <div className="text-sm text-white/70 mb-3">Add custom link:</div>
                    <div className="space-y-3">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder={`Name (max ${MAX_NAME_LENGTH} characters)`}
                          value={newLink.name}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value.length <= MAX_NAME_LENGTH) {
                              setNewLink({...newLink, name: value});
                            }
                          }}
                          className="w-full px-4 py-3 bg-black/20 border border-white/20 rounded-lg text-white placeholder-white/50 text-base focus:outline-none focus:ring-2 focus:ring-white/30"
                          autoFocus
                        />
                        {showNameCounter && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-white/40">
                            {newLink.name.length}/{MAX_NAME_LENGTH}
                          </div>
                        )}
                      </div>
                      <div className="relative">
                        <input
                          type="url"
                          placeholder={`https://example.com (max ${MAX_URL_LENGTH} characters)`}
                          value={newLink.url}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value.length <= MAX_URL_LENGTH) {
                              setNewLink({...newLink, url: value});
                            }
                          }}
                          className="w-full px-4 py-3 bg-black/20 border border-white/20 rounded-lg text-white placeholder-white/50 text-base focus:outline-none focus:ring-2 focus:ring-white/30"
                        />
                        {showUrlCounter && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-white/40">
                            {newLink.url.length}/{MAX_URL_LENGTH}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-4">
                    <button 
                      onClick={addLink}
                      disabled={!newLink.name || !newLink.url || newLink.url === 'https://'}
                      className={`flex-1 py-2.5 px-4 text-base rounded-lg transition-colors ${
                        !newLink.name || !newLink.url || newLink.url === 'https://'
                          ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed' 
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      Add
                    </button>
                    <button 
                      onClick={() => {
                        setIsAdding(false);
                        setNewLink({ 
                          name: '', 
                          url: 'https://', 
                          icon: 'default', 
                          isCustom: true 
                        });
                      }}
                      className="flex-1 py-2.5 px-4 text-base rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button 
                className="flex items-center justify-center bg-white/5 rounded-2xl text-white/70 border-2 border-dashed border-white/20 hover:bg-white/10 hover:text-white hover:border-white/30 transition-all duration-200 w-24 h-24"
                onClick={() => setIsAdding(true)}
                aria-label="Add new quick link"
              >
                <Plus size={32} />
              </button>
            )
          )}
        </div>
      </DndContext>
    </div>
  );
};

export default QuickLinks;