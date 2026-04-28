import { useState } from 'react';
import { MessageSquare, Heart, MessageCircle as CommentIcon, Share2, PlusCircle, Search, MapPin, Clock, Bookmark } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';
import { Button, Badge, Card, PageHeader, SearchInput, Modal, Avatar } from '@/components/ui';
import { useAuthStore } from '@/store/authStore';

const categories = ['All', 'Success Story', 'Tip', 'Question', 'Discussion'];

export default function Community() {
  const { communityPosts, likePost, showToast } = useStore();
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [showPostModal, setShowPostModal] = useState(false);
  const [newPost, setNewPost] = useState('');
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  const filtered = communityPosts.filter(p => {
    const matchSearch = p.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = activeCategory === 'All' || p.category === activeCategory;
    return matchSearch && matchCat;
  });

  const handleLike = (postId: string) => {
    if (likedPosts.has(postId)) return;
    likePost(postId);
    setLikedPosts(prev => new Set([...prev, postId]));
  };

  const handlePost = () => {
    if (!newPost.trim()) {
      showToast('Kuch likhein pehle!', 'error');
      return;
    }
    showToast('Post published!');
    setNewPost('');
    setShowPostModal(false);
  };

  const trendingTopics = ['#DiwaliOffer', '#UdhaarTips', '#GST2026', '#KiranaDigital', '#DukanDost'];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8 animate-[pageIn_0.3s_ease]">
      <PageHeader
        title="Dukaan Community"
        subtitle="Dukaan maalik ek saath — share, seekhein, badhen."
        icon={<MessageSquare size={20} />}
        action={
          <Button icon={<PlusCircle size={16} />} onClick={() => setShowPostModal(true)}>
            Post Karein
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Posts dhundhen..." className="sm:w-64" />
            <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    'px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all',
                    activeCategory === cat
                      ? 'bg-[#FF6B00] text-white shadow-md'
                      : 'bg-white border border-slate-200 text-slate-600 hover:border-orange-300'
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Posts */}
          {filtered.map(post => (
            <Card key={post.id} className="p-5 hover:shadow-md transition-shadow">
              {/* Author */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Avatar name={post.author} initials={post.avatar} colorClass={post.avatarColor} size="md" />
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{post.author}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-2">
                      <MapPin size={10} /> {post.location}
                      <span>·</span>
                      <Clock size={10} /> {post.time}
                    </p>
                  </div>
                </div>
                <Badge status={
                  post.category === 'Success Story' ? 'success' :
                  post.category === 'Tip' ? 'info' :
                  post.category === 'Question' ? 'warning' : 'neutral'
                }>
                  {post.category}
                </Badge>
              </div>

              {/* Content */}
              <p className="text-sm text-slate-700 leading-relaxed mb-4">{post.content}</p>

              {/* Actions */}
              <div className="flex items-center gap-4 pt-3 border-t border-slate-100">
                <button
                  onClick={() => handleLike(post.id)}
                  className={cn(
                    'flex items-center gap-1.5 text-sm font-semibold transition-colors',
                    likedPosts.has(post.id) ? 'text-red-500' : 'text-slate-500 hover:text-red-500'
                  )}
                >
                  <Heart size={16} className={likedPosts.has(post.id) ? 'fill-red-500' : ''} />
                  {post.likes + (likedPosts.has(post.id) ? 1 : 0)}
                </button>
                <button className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-blue-500 transition-colors">
                  <CommentIcon size={16} />
                  {post.comments}
                </button>
                <button
                  onClick={() => showToast('Post shared!')}
                  className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-green-500 transition-colors"
                >
                  <Share2 size={16} />
                  Share
                </button>
                <button className="ml-auto text-slate-400 hover:text-amber-500 transition-colors">
                  <Bookmark size={16} />
                </button>
              </div>
            </Card>
          ))}

          {filtered.length === 0 && (
            <Card className="p-12 text-center">
              <MessageSquare size={40} className="text-slate-300 mx-auto mb-3" />
              <p className="font-bold text-slate-600">Koi post nahi mila</p>
              <p className="text-sm text-slate-400 mt-1">Category ya search change karein</p>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Your Profile */}
          <Card className="p-5">
            <h3 className="font-display font-bold text-slate-900 mb-4">Aapka Profile</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF6B00] to-[#FF8C3A] flex items-center justify-center text-white font-bold text-sm">
                {(user?.fullName || 'DD').substring(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-slate-900">{user?.fullName || 'Shop Owner'}</p>
                <p className="text-xs text-slate-500">{user?.businessName || 'Digital Dukaan'} · {user?.address?.split(',').pop()?.trim() || 'India'}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-slate-50 rounded-xl p-2">
                <p className="font-bold text-slate-900 text-lg">0</p>
                <p className="text-[10px] text-slate-500">Posts</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-2">
                <p className="font-bold text-slate-900 text-lg">0</p>
                <p className="text-[10px] text-slate-500">Followers</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-2">
                <p className="font-bold text-slate-900 text-lg">0</p>
                <p className="text-[10px] text-slate-500">Likes</p>
              </div>
            </div>
          </Card>

          {/* Trending Topics */}
          <Card className="p-5">
            <h3 className="font-display font-bold text-slate-900 mb-4">🔥 Trending Topics</h3>
            <div className="space-y-4 py-4 text-center">
              <MessageSquare size={32} className="text-slate-200 mx-auto opacity-50" />
              <p className="text-sm text-slate-400">Trading topics jald hi yahan dikhenge!</p>
            </div>
          </Card>

          {/* Community Tips */}
          <Card className="p-5 bg-gradient-to-br from-[#1A1A2E] to-[#252550] text-white">
            <h3 className="font-display font-bold mb-3">💡 Community Tip</h3>
            <p className="text-sm text-white/80 leading-relaxed">
              "Har hafte apne stock ka review zaroor karein. Fast-moving items ka reorder lagao before they run out!"
            </p>
            <p className="text-xs text-white/50 mt-3">— Aggarwal Grocery, Delhi</p>
          </Card>
        </div>
      </div>

      {/* Create Post Modal */}
      <Modal
        isOpen={showPostModal}
        onClose={() => setShowPostModal(false)}
        title="Post Karein"
        subtitle="Community ke saath share karein"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowPostModal(false)}>Cancel</Button>
            <Button onClick={handlePost} icon={<MessageSquare size={15} />}>Publish</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6B00] to-[#FF8C3A] flex items-center justify-center text-white font-bold text-sm">
              {(user?.fullName || 'DD').substring(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">{user?.fullName || 'User'}</p>
              <p className="text-xs text-slate-500">{user?.businessName || 'Business'}</p>
            </div>
          </div>
          <textarea
            value={newPost}
            onChange={e => setNewPost(e.target.value)}
            placeholder="Kya share karna chahte hain aaj? Tips, success stories, ya sawaal..."
            className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/15 resize-none"
            rows={5}
          />
          <div className="flex gap-2">
            {['Success Story', 'Tip', 'Question'].map(cat => (
              <button key={cat} className="px-3 py-1.5 bg-orange-50 text-orange-600 border border-orange-200 rounded-lg text-xs font-semibold">
                {cat}
              </button>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}
