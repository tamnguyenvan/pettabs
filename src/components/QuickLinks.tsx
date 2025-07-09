// QuickLinks.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { X, Plus } from 'lucide-react';

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

interface QuickLink {
  id: string;
  url: string;
  name: string;
  icon: string;
  isCustom?: boolean;
}

const defaultLinks: QuickLink[] = [
  { id: '1', name: 'Google', url: 'https://google.com', icon: 'google' },
  { id: '2', name: 'Gmail', url: 'https://mail.google.com', icon: 'mail' },
  { id: '3', name: 'Youtube', url: 'https://youtube.com', icon: 'youtube' },
  { id: '4', name: 'Twitter', url: 'https://twitter.com', icon: 'twitter' },
  { id: '5', name: 'GitHub', url: 'https://github.com', icon: 'github' },
];

// Constants for validation
const MAX_NAME_LENGTH = 15;
const MAX_URL_LENGTH = 100;

const QuickLinks: React.FC = () => {
  const [links, setLinks] = useState<QuickLink[]>(() => {
    const saved = localStorage.getItem('quickLinks');
    return saved ? JSON.parse(saved) : defaultLinks;
  });
  const [isAdding, setIsAdding] = useState(false);
  const [showDefaultLinks, setShowDefaultLinks] = useState(false);
  const [newLink, setNewLink] = useState<Omit<QuickLink, 'id'> & { isCustom: boolean }>({ 
    name: '', 
    url: 'https://',
    icon: 'default',
    isCustom: true
  });

  // Save to localStorage whenever links change
  useEffect(() => {
    localStorage.setItem('quickLinks', JSON.stringify(links));
  }, [links]);



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
    if (newLink.name && newLink.url && newLink.url !== 'https://') {
      // Validate lengths
      const trimmedName = newLink.name.trim();
      const trimmedUrl = newLink.url.trim();
      
      if (trimmedName.length > MAX_NAME_LENGTH) {
        alert(`Tên không được vượt quá ${MAX_NAME_LENGTH} ký tự`);
        return;
      }
      
      if (trimmedUrl.length > MAX_URL_LENGTH) {
        alert(`URL không được vượt quá ${MAX_URL_LENGTH} ký tự`);
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
      setShowDefaultLinks(false);
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



  const renderLinkIcon = (link: QuickLink) => {
    // For custom links, always use initials
    if (link.isCustom) {
      const initials = getInitials(link.name);
      const bgColor = generateColorFromName(link.name);
      
      return (
        <div 
          className="w-12 h-12 flex items-center justify-center rounded-lg text-white font-bold text-lg"
          style={{ backgroundColor: bgColor }}
        >
          {initials}
        </div>
      );
    }
    
    // For default links, use provided icons
    return (
      <div className="w-12 h-12 flex items-center justify-center">
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

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-8">
      <div className="flex flex-wrap justify-center gap-6">
        {links.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="relative flex flex-col items-center justify-center bg-white/5 rounded-2xl no-underline transition-all duration-150 hover:bg-white/10 hover:shadow-xl hover:-translate-y-0.5 border border-white/5 backdrop-blur-sm w-24 h-28 p-2"
          >
            <div className="flex-1 flex items-center justify-center">
              {renderLinkIcon(link)}
            </div>
            <div className="text-xs text-white/80 text-center mt-2 leading-tight max-w-full">
              <div className="truncate" title={link.name}>
                {truncateText(link.name, 12)}
              </div>
            </div>
            <button
              className="absolute -top-2 -right-2 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-white text-xs opacity-0 hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                removeLink(link.id);
              }}
              aria-label={`Remove ${link.name}`}
            >
              <X size={12} />
            </button>
          </a>
        ))}

        {isAdding ? (
          <div className="relative">
            <div className="bg-white/10 rounded-2xl p-5 flex flex-col gap-4 border border-white/20 backdrop-blur-sm w-80">
              <div className="text-center text-white font-medium mb-2">Add Quick Link</div>
              
              {/* Default Links Grid - Only show if there are default links to add */}
              {getDeletedDefaultLinks().length > 0 && (
                <>
                  <div className="mb-4">
                    <div className="text-sm text-white/70 mb-3">Choose from popular sites:</div>
                    <div className="grid grid-cols-5 gap-3">
                      {getDeletedDefaultLinks().map(link => (
                        <button
                          key={link.id}
                          onClick={() => {
                            setLinks([...links, { 
                              ...link, 
                              id: Date.now().toString(),
                              isCustom: false
                            }]);
                            setIsAdding(false);
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

                  {/* Divider - Only show if there are default links to add */}
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
                      placeholder={newLink.name ? '' : `Name (max ${MAX_NAME_LENGTH} chars)`}
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
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-white/40">
                      {newLink.name.length}/{MAX_NAME_LENGTH}
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      type="url"
                      placeholder={newLink.url && newLink.url !== 'https://' ? '' : `https://example.com (max ${MAX_URL_LENGTH} chars)`}
                      value={newLink.url}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value.length <= MAX_URL_LENGTH) {
                          setNewLink({...newLink, url: value});
                        }
                      }}
                      className="w-full px-4 py-3 bg-black/20 border border-white/20 rounded-lg text-white placeholder-white/50 text-base focus:outline-none focus:ring-2 focus:ring-white/30"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-white/40">
                      {newLink.url.length}/{MAX_URL_LENGTH}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4">
                <button 
                  onClick={() => {
                    if (newLink.name && newLink.url && newLink.url !== 'https://') {
                      // Validate lengths
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

                      const finalName = trimmedName || new URL(trimmedUrl).hostname.replace('www.', '');

                      setLinks([...links, { 
                        id: Date.now().toString(),
                        name: finalName.length > MAX_NAME_LENGTH ? truncateText(finalName, MAX_NAME_LENGTH) : finalName,
                        url: trimmedUrl,
                        icon: 'default',
                        isCustom: true
                      }]);
                      
                      setNewLink({ 
                        name: '', 
                        url: 'https://', 
                        icon: 'default',
                        isCustom: true 
                      });
                      setIsAdding(false);
                    }
                  }}
                  disabled={!newLink.name || !newLink.url || newLink.url === 'https://'}
                  className={`flex-1 py-2.5 px-4 text-base rounded-lg ${
                    !newLink.name || !newLink.url || newLink.url === 'https://'
                      ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed' 
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  } transition-colors`}
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
                  className="flex-1 py-1.5 px-3 text-sm rounded bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button 
            className="flex items-center justify-center bg-white/5 rounded-2xl text-white/70 border-2 border-dashed border-white/20 hover:bg-white/10 hover:text-white hover:border-white/30 transition-all duration-150 w-24 h-28"
            onClick={() => setIsAdding(true)}
            aria-label="Add new quick link"
          >
            <Plus size={32} />
          </button>
        )}
      </div>
    </div>
  );
};

export default QuickLinks;