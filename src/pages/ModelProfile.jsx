import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import {
  ArrowLeft,
  Check,
  Heart,
  Image as ImageIcon,
  LogOut,
  MapPin,
  MessageCircle,
  X,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { useModels } from '../context/ModelContext';
import api from '../services/api';

const FALLBACK_PROFILE_IMAGE =
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80';

const normalizeModel = (response = {}) => {
  const payload = response.data?.model || response.model || response;
  const posts = response.data?.posts || response.posts || [];

  const categories =
    Array.isArray(payload.categories) && payload.categories.length
      ? payload.categories
      : Array.isArray(payload.category)
        ? payload.category
        : [];

  const normalizedPosts = posts.map((post) => {
    const media =
      Array.isArray(post.media) && post.media.length > 0
        ? post.media
        : [
            {
              url:
                post.mediaUrl ||
                post.image ||
                post.video ||
                '',
              type:
                post.mediaType ||
                (post.video ? 'video' : 'image'),
              publicId: post.mediaPublicId || '',
              thumbnailUrl: post.thumbnailUrl || '',
            },
          ];

    const primary = media[0] || {
      url: '',
      type: 'image',
    };

    const isVideo = primary.type === 'video';

    return {
      id: post._id || post.id,
      type: isVideo ? 'video' : 'image',
      image: isVideo ? '' : primary.url,
      video: isVideo ? primary.url : '',
      caption: post.caption || '',
      likes: Number(post.likesCount ?? post.likes ?? 0),
      likesCount: Number(post.likesCount ?? post.likes ?? 0),
      likedByCurrentUser: false,
      media,
    };
  });

  return {
    id: payload._id || payload.id,
    username: payload.username || '',
    name: payload.name || '',
    profileImage: payload.profileImage || '',
    location: payload.location || '',
    bio: payload.bio || '',
    category: categories,
    posts: normalizedPosts,
    stats: {
      posts: Number(
        payload.postsCount ?? normalizedPosts.length ?? 0
      ),
      followers: Number(payload.followersCount ?? 0),
      following: Number(payload.followingCount ?? 0),
    },
  };
};

export default function ModelProfile() {
  const { username } = useParams();

  const [model, setModel] = useState(null);
  const [activeTab, setActiveTab] = useState('posts');
  const [selectedPost, setSelectedPost] = useState(null);

  const { isAuthenticated, logout } = useAuth();
  const { getTotalModelLikes, likePost, unlikePost } = useModels();

  const totalLikes = getTotalModelLikes(model);

  const handleLogout = () => {
    logout();
  };

  const handleLike = async (post) => {
    try {
      const response = post.likedByCurrentUser
        ? await unlikePost(post.id)
        : await likePost(post.id);

      const data = response?.data || response;

      const likesCount = Number(
        data.likesCount ??
          data.likes ??
          (post.likedByCurrentUser
            ? Math.max(Number(post.likes || 0) - 1, 0)
            : Number(post.likes || 0) + 1)
      );

      const liked =
        typeof data.liked === 'boolean'
          ? data.liked
          : !post.likedByCurrentUser;

      setModel((currentModel) => {
        if (!currentModel) return currentModel;

        const updatedPosts = currentModel.posts.map((item) =>
          item.id === post.id
            ? {
                ...item,
                likes: likesCount,
                likesCount,
                likedByCurrentUser: liked,
              }
            : item
        );

        return {
          ...currentModel,
          posts: updatedPosts,
        };
      });

      setSelectedPost((currentPost) =>
        currentPost?.id === post.id
          ? {
              ...currentPost,
              likes: likesCount,
              likesCount,
              likedByCurrentUser: liked,
            }
          : currentPost
      );
    } catch (error) {
      console.error('Failed to like/unlike post:', error);
    }
  };

  useEffect(() => {
    if (!username) return;

    const fetchProfile = async () => {
      try {
        const modelResponse = await api.get(`/models/${username}`);

        let likedPostIds = [];

        if (isAuthenticated) {
          try {
            const likedResponse = await api.get('/model-posts/liked');
            likedPostIds = likedResponse.data?.data || [];
          } catch (error) {
            console.warn('Could not load liked post IDs:', error);
          }
        }

        const likedPostIdSet = new Set(
          likedPostIds.map((id) => String(id))
        );

        const normalizedModel = normalizeModel(modelResponse.data);

        const updatedPosts = normalizedModel.posts.map((post) => ({
          ...post,
          likedByCurrentUser: likedPostIdSet.has(
            String(post.id)
          ),
        }));

        setModel({
          ...normalizedModel,
          posts: updatedPosts,
        });
      } catch (error) {
        console.error('Failed to load model profile:', error);
      }
    };

    fetchProfile();
  }, [username, isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!model) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fff8fb] text-[#8f3f60]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin border border-[#d66a91] border-t-transparent" />

          <p className="text-[10px] uppercase tracking-[0.3em] text-[#a47789]">
            Loading profile
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-100 text-[#8f3f60]">
      {/* Soft pink background accents */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#f8c8da]/30 blur-[140px]" />
        <div className="absolute right-[-180px] top-[25%] h-[500px] w-[500px] rounded-full bg-[#f6d9e5]/40 blur-[150px]" />
        <div className="absolute bottom-[-200px] left-[35%] h-[450px] w-[450px] rounded-full bg-[#f4bfd3]/25 blur-[150px]" />
      </div>

      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-[#f3d5e1]/80 bg-pink-500 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between px-5 lg:px-10">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="group flex h-10 w-10 items-center justify-center rounded-full border border-[#f3d5e1] bg-white text-[#a85b78] shadow-sm transition hover:border-[#d66a91] hover:bg-[#fce7f0] hover:text-[#8f3f60]"
            aria-label="Go back"
          >
            <ArrowLeft
              size={19}
              className="transition-transform group-hover:-translate-x-0.5"
            />
          </button>

          <div className="text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-pink-100">
              {model.name}
            </p>

            <p className="mt-1 text-[9px] uppercase tracking-[0.28em] text-white">
              @{model.username}
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#f3d5e1] bg-white text-[#a85b78] shadow-sm transition hover:border-[#d66a91] hover:bg-[#fce7f0] hover:text-[#8f3f60]"
            aria-label="Logout"
          >
            <LogOut size={17} />
          </button>
        </div>
      </header>

      <main className="relative mx-auto max-w-[1400px] px-5 pb-20 lg:px-10">
        {/* PROFILE SECTION */}
        <section className="border-b border-[#f3d5e1] py-12 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-[240px_1fr] lg:items-center">
            {/* PROFILE PHOTO */}
            <div className="relative mx-auto lg:mx-0">
              <div className="relative h-48 w-40 overflow-hidden rounded-[2rem] border-2 border-[#edb4c9] bg-[#fce7f0] shadow-[0_18px_50px_rgba(214,106,145,0.12)] sm:h-56 sm:w-48 lg:h-64 lg:w-52">
                <img
                  src={model.profileImage || FALLBACK_PROFILE_IMAGE}
                  alt={model.name}
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#8f3f60]/20 to-transparent" />
              </div>
            </div>

            {/* PROFILE CONTENT */}
            <div>
              <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-semibold tracking-[-0.03em] text-[#c6537e] sm:text-4xl lg:text-5xl">
                      {model.name}
                    </h1>

                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#d66a91] text-white shadow-sm">
                      <Check size={12} />
                    </span>
                  </div>

                  <p className="mt-3 text-[11px] uppercase tracking-[0.3em] text-[#b48799]">
                    @{model.username}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      window.location.href = '/client/messages';
                    }}
                    className="flex items-center gap-2 rounded-xl border border-[#edc4d3] bg-white px-5 py-3 text-xs font-medium uppercase tracking-[0.12em] text-[#9a4e6d] shadow-sm transition hover:border-[#d66a91] hover:bg-[#fce7f0]"
                  >
                    <MessageCircle size={16} />
                    Contact
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      window.location.href = '/payment';
                    }}
                    className="rounded-xl border border-[#d66a91] bg-[#d66a91] px-5 py-3 text-xs font-medium uppercase tracking-[0.12em] text-white shadow-[0_8px_20px_rgba(214,106,145,0.18)] transition hover:bg-[#c6537e]"
                  >
                    Payment
                  </button>
                </div>
              </div>

              {/* STATS */}
              <div className="mt-9 flex flex-wrap gap-9 border-y border-[#f3d5e1] py-5">
                <Stat
                  value={model.stats.posts}
                  label="Posts"
                />

                <Stat
                  value={formatNumber(totalLikes)}
                  label="Total Likes"
                />
              </div>

              {/* BIO */}
              <div className="mt-7 max-w-3xl">
                <p className="text-[15px] leading-8 text-[#9b7182]">
                  {model.bio || 'No biography available.'}
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-2">
                  {model.location && (
                    <span className="ml-1 flex items-center gap-2 text-xs text-[#a47789]">
                      <MapPin
                        size={14}
                        className="text-[#d66a91]"
                      />
                      {model.location}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TABS */}
        <div className="flex justify-center border-b border-[#f3d5e1]">
          <TabButton
            active={activeTab === 'posts'}
            onClick={() => setActiveTab('posts')}
            icon={<ImageIcon size={15} />}
            label="Posts"
          />

          <TabButton
            active={activeTab === 'about'}
            onClick={() => setActiveTab('about')}
            label="About"
          />
        </div>

        {/* POSTS */}
        {activeTab === 'posts' && (
          <section className="grid gap-3 py-6 sm:grid-cols-2 lg:grid-cols-3">
            {(model.posts || []).map((post) => {
              const isVideo =
                post.type === 'video' ||
                Boolean(post.video);

              const mediaUrl = isVideo
                ? post.video || post.image
                : post.image;

              return (
                <article
                  key={post.id}
                  className="overflow-hidden rounded-2xl border border-[#f3d5e1] bg-white shadow-[0_10px_30px_rgba(181,92,125,0.06)]"
                >
                  {/* POST MEDIA */}
                  <button
                    type="button"
                    onClick={() => setSelectedPost(post)}
                    className="group relative block aspect-[4/3] w-full overflow-hidden bg-[#fce7f0]"
                  >
                    {isVideo ? (
                      <video
                        src={mediaUrl}
                        muted
                        playsInline
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.02]"
                      />
                    ) : (
                      <img
                        src={mediaUrl}
                        alt={post.caption || 'Model post'}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.02]"
                      />
                    )}

                    {isVideo && (
                      <span className="absolute right-4 top-4 border border-white/60 bg-[#8f3f60]/70 px-3 py-1.5 text-[9px] uppercase tracking-[0.15em] text-white backdrop-blur-sm">
                        Video
                      </span>
                    )}
                  </button>

                  {/* POST DETAILS */}
                  <div className="p-5">
                    {post.caption && (
                      <p className="text-sm leading-7 text-[#9b7182]">
                        {post.caption}
                      </p>
                    )}

                    <div className="mt-5 flex items-center justify-between border-t border-[#f3d5e1] pt-4">
                      <div className="flex items-center gap-2 text-sm">
                        <button
                          type="button"
                          onClick={() => handleLike(post)}
                          className="flex items-center justify-center text-[#d66a91] transition hover:scale-110"
                          aria-label={
                            post.likedByCurrentUser
                              ? 'Unlike post'
                              : 'Like post'
                          }
                        >
                          <Heart
                            size={19}
                            fill={
                              post.likedByCurrentUser
                                ? '#d66a91'
                                : 'none'
                            }
                          />
                        </button>

                        <span className="text-sm text-[#a47789]">
                          {formatNumber(post.likes)}{' '}
                          {Number(post.likes) === 1
                            ? 'Like'
                            : 'Likes'}
                        </span>
                      </div>

                      <span className="text-[9px] uppercase tracking-[0.18em] text-[#bd91a2]">
                        {isVideo ? 'Video post' : 'Photo post'}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}

            {!model.posts?.length && (
              <EmptyState
                icon={<ImageIcon size={25} />}
                text="No posts yet"
              />
            )}
          </section>
        )}

        {/* ABOUT */}
        {activeTab === 'about' && (
          <section className="max-w-4xl py-12">
            <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
              <div>
                <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-[#d66a91]">
                  About the model
                </p>

                <h2 className="text-3xl font-semibold tracking-tight text-[#9a4566]">
                  {model.name}
                </h2>

                <p className="mt-6 max-w-2xl text-[15px] leading-8 text-[#9b7182]">
                  {model.bio || 'No biography available.'}
                </p>
              </div>

              <div className="border-l border-[#f3d5e1] pl-6">
                <InfoRow
                  label="Location"
                  value={model.location || 'Not specified'}
                />

                <InfoRow
                  label="Posts"
                  value={model.stats.posts}
                />
              </div>
            </div>
          </section>
        )}
      </main>

      {/* POST VIEWER */}
      {selectedPost && (
        <PostViewer
          post={selectedPost}
          model={model}
          onLike={handleLike}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </div>
  );
}

/* ================================================= */
/* STAT */
/* ================================================= */

function Stat({ value, label }) {
  return (
    <div>
      <strong className="block text-lg font-semibold text-[#9a4566]">
        {value}
      </strong>

      <span className="text-[9px] uppercase tracking-[0.2em] text-[#b48799]">
        {label}
      </span>
    </div>
  );
}

/* ================================================= */
/* TABS */
/* ================================================= */

function TabButton({
  active,
  onClick,
  icon,
  label,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex items-center gap-2 border-b-2 px-5 py-4 text-[10px] font-medium uppercase tracking-[0.18em] transition ${
        active
          ? 'border-[#d66a91] text-[#c6537e]'
          : 'border-transparent text-[#b48799] hover:text-[#9a4566]'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

/* ================================================= */
/* EMPTY STATE */
/* ================================================= */

function EmptyState({ icon, text }) {
  return (
    <div className="col-span-full flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#edc4d3] bg-transparent">
      <div className="mb-4 text-pink-600">
        {icon}
      </div>

      <p className="text-xs uppercase tracking-[0.2em] text-pink-800">
        {text}
      </p>
    </div>
  );
}

/* ================================================= */
/* INFO ROW */
/* ================================================= */

function InfoRow({ label, value }) {
  return (
    <div className="border-b border-[#f3d5e1] py-4 first:pt-0">
      <p className="text-[9px] uppercase tracking-[0.2em] text-[#b48799]">
        {label}
      </p>

      <p className="mt-2 text-sm leading-6 text-[#9b7182]">
        {value}
      </p>
    </div>
  );
}

/* ================================================= */
/* POST VIEWER */
/* ================================================= */

function PostViewer({
  post,
  model,
  onLike,
  onClose,
}) {
  const isVideo =
    post.type === 'video' ||
    Boolean(post.video);

  const mediaUrl = isVideo
    ? post.video || post.image
    : post.image;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#6e3d52]/30 p-3 backdrop-blur-md sm:p-6"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-5 top-5 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-[#edc4d3] bg-white text-[#a85b78] shadow-md transition hover:bg-[#fce7f0] hover:text-[#8f3f60]"
        aria-label="Close post viewer"
      >
        <X size={19} />
      </button>

      <div
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-[#f3d5e1] bg-white shadow-[0_25px_80px_rgba(143,63,96,0.2)] lg:flex-row"
      >
        {/* MEDIA */}
        <div className="flex min-h-[45vh] flex-1 items-center justify-center bg-[#fff8fb] lg:min-h-[80vh]">
          {isVideo ? (
            <video
              src={mediaUrl}
              controls
              className="max-h-[78vh] max-w-full object-contain"
            />
          ) : (
            <img
              src={mediaUrl}
              alt={post.caption || 'Model post'}
              className="max-h-[78vh] max-w-full object-contain"
            />
          )}
        </div>

        {/* DETAILS */}
        <div className="flex w-full flex-col border-t border-[#f3d5e1] lg:max-w-[340px] lg:border-l lg:border-t-0">
          <div className="flex items-center gap-3 border-b border-[#f3d5e1] p-5">
            <img
              src={model.profileImage || FALLBACK_PROFILE_IMAGE}
              className="h-10 w-10 rounded-full border border-[#edc4d3] object-cover"
              alt={model.name}
            />

            <div>
              <p className="text-sm font-semibold text-[#9a4566]">
                {model.name}
              </p>

              <p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-[#b48799]">
                @{model.username}
              </p>
            </div>
          </div>

          <div className="flex-1 p-5">
            <p className="text-sm leading-7 text-[#9b7182]">
              {post.caption || 'No caption.'}
            </p>
          </div>

          <div className="border-t border-[#f3d5e1] p-5">
            <div className="flex items-center gap-5">
              <button
                type="button"
                onClick={() => onLike(post)}
                className="text-[#d66a91] transition hover:scale-110"
                aria-label={
                  post.likedByCurrentUser
                    ? 'Unlike post'
                    : 'Like post'
                }
              >
                <Heart
                  size={21}
                  fill={
                    post.likedByCurrentUser
                      ? '#d66a91'
                      : 'none'
                  }
                />
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  window.location.href = '/client/messages';
                }}
                className="flex items-center gap-2 text-[#b05b7b] transition hover:text-[#8f3f60]"
              >
                <MessageCircle size={20} />
                <span className="text-xs uppercase tracking-[0.12em]">
                  Message
                </span>
              </button>
            </div>

            <p className="mt-4 text-xs font-semibold text-[#9a4566]">
              {formatNumber(post.likes)} likes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================= */
/* NUMBER FORMAT */
/* ================================================= */

function formatNumber(value) {
  return Number(value || 0).toLocaleString();
}