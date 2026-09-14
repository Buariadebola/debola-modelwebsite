import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Camera, Check, Edit3, ImagePlus, Trash2, X } from 'lucide-react';
import { useModels } from '../../context/ModelContext';

const normalizeModel = (model = {}) => {
  const categories = Array.isArray(model.categories) && model.categories.length
    ? model.categories
    : Array.isArray(model.category)
      ? model.category
      : [];

  return {
    id: model._id || model.id,
    _id: model._id || model.id,
    username: model.username || '',
    name: model.name || '',
    isDefault: Boolean(model.isDefault),
    profileImage: model.profileImage || '',
    location: model.location || '',
    bio: model.bio || '',
    category: categories,
    posts: Array.isArray(model.posts) ? model.posts : [],
    postsCount: Number(model.postsCount ?? (Array.isArray(model.posts) ? model.posts.length : 0)),
    followersCount: Number(model.followersCount ?? 0),
    followingCount: Number(model.followingCount ?? 0),
  };
};

export default function AdminModelProfile() {
  const { username } = useParams();
  const {
    models,
    fetchModelDetails,
    updateModel,
    updateProfileImage,
    addPost,
    updatePost,
    deletePost,
    setDefaultModel,
  } = useModels();

  const profileInputRef = useRef(null);
  const postInputRef = useRef(null);

  const [model, setModel] = useState(null);
  const [editProfile, setEditProfile] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [profileForm, setProfileForm] = useState({
    name: '',
    username: '',
    location: '',
    bio: '',
    category: '',
  });

  const [postForm, setPostForm] = useState({
    media: [],
    mediaType: 'image',
    caption: '',
    files: [],
  });

  const currentModel = useMemo(
      () => {
        if (model) {
          return model;
        }

        return models.find((item) => item.username === username) || null;
      },
      [model, models, username]
    );

  useEffect(() => {
    const selectedModel = models.find((item) => item.username === username);

    if (selectedModel) {
      setModel(normalizeModel(selectedModel));
      setProfileForm({
        name: selectedModel.name || '',
        username: selectedModel.username || '',
        location: selectedModel.location || '',
        bio: selectedModel.bio || '',
        category: (selectedModel.category || []).join(', '),
      });
      return;
    }

    if (username) {
      fetchModelDetails(username).then((nextModel) => {
        if (nextModel) {
          setModel(normalizeModel(nextModel));
          setProfileForm({
            name: nextModel.name || '',
            username: nextModel.username || '',
            location: nextModel.location || '',
            bio: nextModel.bio || '',
            category: (nextModel.category || []).join(', '),
          });
        }
      });
    }
  }, [username, models, fetchModelDetails]);

  if (!currentModel) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(244,114,182,0.18),_transparent_30%),linear-gradient(135deg,#fffafc_0%,#fdf2ff_35%,#f6ecff_100%)] text-[#311a32]">
        Loading model profile...
      </div>
    );
  }

  const handleProfileImage = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    await updateProfileImage(currentModel.id, file);
  };

  const saveProfile = async () => {
    await updateModel(currentModel.id, {
      name: profileForm.name,
      username: profileForm.username,
      location: profileForm.location,
      bio: profileForm.bio,
      categories: profileForm.category
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    });

    setEditProfile(false);
  };

  const publishPost = async () => {
    if (!postForm.files.length) {
      alert('Please select an image or video');
      return;
    }

    await addPost(currentModel.id, {
      files: postForm.files,
      caption: postForm.caption || (postForm.mediaType === 'video' ? 'New video post' : 'New post'),
      mediaType: postForm.mediaType,
    });

    setPostForm({ media: [], mediaType: 'image', caption: '', files: [] });
    setShowPostModal(false);
  };

  const startEditPost = (post) => {
    setEditingPost(post);
    setPostForm({
      media: post.type === 'video' ? [post.video || post.image] : [post.image || post.video],
      mediaType: post.type === 'video' ? 'video' : 'image',
      caption: post.caption,
      files: [],
    });
    setShowPostModal(true);
  };

  const saveEditedPost = async () => {
    await updatePost(currentModel.id, editingPost.id, {
      files: postForm.files,
      caption: postForm.caption,
      mediaType: postForm.mediaType,
    });

    setEditingPost(null);
    setPostForm({ media: [], mediaType: 'image', caption: '', files: [] });
    setShowPostModal(false);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(244,114,182,0.18),_transparent_30%),linear-gradient(135deg,#fffafc_0%,#fdf2ff_35%,#f6ecff_100%)] text-[#311a32]">
      <header className="sticky top-0 z-40 border-b border-[#f0dff1] bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#9b7a90]">Admin</p>
            <h1 className="text-xl font-bold text-[#311a32]">Model Profile Manager</h1>
          </div>

          <button
            onClick={() => setShowPostModal(true)}
            className="flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#f472b6,#8b5cf6)] px-4 py-2.5 font-semibold text-white shadow-[0_12px_28px_rgba(168,104,185,0.26)] transition hover:-translate-y-0.5"
          >
            <ImagePlus size={18} />
            Add Post
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <section className="rounded-3xl border border-[#f0dff1] bg-white/80 p-6 shadow-[0_18px_40px_rgba(168,104,185,0.08)]">
          <div className="flex flex-col gap-8 md:flex-row">
            <div className="relative mx-auto md:mx-0">
              <img
                src={currentModel.profileImage || 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80'}
                alt={currentModel.name}
                className="h-40 w-40 rounded-full object-cover ring-4 ring-[#f0dff1] shadow-[0_10px_25px_rgba(168,104,185,0.12)]"
              />

              <button
                onClick={() => profileInputRef.current?.click()}
                className="absolute bottom-1 right-1 flex h-11 w-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,#f472b6,#8b5cf6)] text-white shadow-lg"
              >
                <Camera size={19} />
              </button>

              <input ref={profileInputRef} type="file" accept="image/*" onChange={handleProfileImage} className="hidden" />
            </div>

            <div className="flex-1">
              <div className="flex flex-col justify-between gap-4 md:flex-row">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold text-[#311a32]">{currentModel.name}</h2>
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[linear-gradient(135deg,#f472b6,#8b5cf6)]">
                      <Check size={13} className="text-black" />
                    </span>
                  </div>
                  <p className="mt-1 text-[#8f6888]">@{currentModel.username}</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    disabled={Boolean(currentModel.isDefault)}
                    onClick={async () => {
                      try {
                        const updatedModel = await setDefaultModel(currentModel.id);

                        setModel(updatedModel);
                      } catch (error) {
                        console.error('Failed to set default model:', error);
                      }
                    }}
                    className={`rounded-xl px-5 py-2.5 font-medium transition ${
                      currentModel.isDefault
                        ? 'cursor-default bg-emerald-100 text-emerald-700'
                        : 'bg-[#311a32] text-white hover:bg-[#4a2349]'
                    }`}
                  >
                    {currentModel.isDefault
                      ? 'Current Default'
                      : 'Make Default'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditProfile(true)}
                    className="flex items-center justify-center gap-2 rounded-xl border border-[#f0dff1] bg-[#fff7fb] px-5 py-2.5 text-[#5a3658] transition hover:bg-[#fff1fa]"
                  >
                    <Edit3 size={17} />
                    Edit Profile
                  </button>
                </div>
              </div>

              <div className="mt-7 flex gap-10">
                <Stat label="Posts" value={Number(currentModel.postsCount || currentModel.posts?.length || 0)} />
              </div>

              <div className="mt-6">
                <p className="max-w-2xl leading-7 text-[#5d405d]">{currentModel.bio}</p>
                <p className="mt-3 text-sm text-[#8f6888]">{currentModel.location}</p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {(currentModel.category || []).map((category) => (
                    <span key={category} className="rounded-full bg-[#fbe6f5] px-3 py-1 text-xs text-[#7c3aed]">
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#311a32]">Posts</h2>
              <p className="text-sm text-[#8f6888]">Manage this model's content</p>
            </div>

            <button
              onClick={() => setShowPostModal(true)}
              className="flex items-center gap-2 rounded-xl border border-[#f0dff1] bg-[#fff7fb] px-4 py-2 text-sm text-[#5a3658] transition hover:bg-[#fff1fa]"
            >
              <ImagePlus size={17} />
              Upload
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {(currentModel.posts || []).map((post) => {
              const isVideo = post.type === 'video' || Boolean(post.video);

              return (
                <div key={post.id} className="group relative aspect-square overflow-hidden rounded-2xl bg-[#f4d9ee] shadow-[0_10px_25px_rgba(168,104,185,0.10)]">
                  {isVideo ? (
                    <video src={post.video || post.image} className="h-full w-full object-cover" muted playsInline controls />
                  ) : (
                    <img src={post.image} alt={post.caption} className="h-full w-full object-cover" />
                  )}

                  <div className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-black/80 via-transparent p-3 opacity-0 transition group-hover:opacity-100">
                    <button onClick={() => startEditPost(post)} className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-xs backdrop-blur-md hover:bg-white/20">
                      <Edit3 size={14} />
                      Edit
                    </button>

                    <button
                      onClick={async () => {
                        const confirmed = window.confirm('Delete this post?');
                        if (confirmed) {
                          await deletePost(currentModel.id, post.id);
                        }
                      }}
                      className="rounded-lg bg-red-500/20 p-2 text-red-400 backdrop-blur-md hover:bg-red-500/30"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {editProfile && (
        <Modal title="Edit model profile" onClose={() => setEditProfile(false)}>
          <div className="space-y-5">
            <Input label="Name" value={profileForm.name} onChange={(value) => setProfileForm({ ...profileForm, name: value })} />
            <Input label="Username" value={profileForm.username} onChange={(value) => setProfileForm({ ...profileForm, username: value })} />
            <Input label="Location" value={profileForm.location} onChange={(value) => setProfileForm({ ...profileForm, location: value })} />
            <Input label="Categories" value={profileForm.category} onChange={(value) => setProfileForm({ ...profileForm, category: value })} placeholder="Fashion, Commercial, Lifestyle" />

            <div>
              <label className="mb-2 block text-sm font-medium">Bio</label>
              <textarea value={profileForm.bio} onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })} rows={5} className="w-full resize-none rounded-xl border border-white/10 bg-white/5 p-4 outline-none focus:border-emerald-500" />
            </div>

            <button onClick={saveProfile} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#f472b6,#8b5cf6)] py-3 font-semibold text-white">
              <Check size={18} />
              Save Changes
            </button>
          </div>
        </Modal>
      )}

      {showPostModal && (
        <Modal title={editingPost ? 'Edit Post' : 'Create Post'} onClose={() => { setShowPostModal(false); setEditingPost(null); setPostForm({ media: [], mediaType: 'image', caption: '', files: [] }); }}>
          <div className="space-y-5">
            <div>
              {postForm.media.length ? (
                <div className="grid grid-cols-2 gap-3">
                  {postForm.media.map((item, index) => (
                    <div key={`${item}-${index}`} className="relative overflow-hidden rounded-2xl">
                      {postForm.mediaType === 'video' ? (
                        <video src={item} controls className="max-h-[200px] w-full object-cover" />
                      ) : (
                        <img src={item} alt="Preview" className="max-h-[200px] w-full object-cover" />
                      )}

                      <button
                        onClick={() => setPostForm((current) => ({
                          ...current,
                          media: current.media.filter((_, currentIndex) => currentIndex !== index),
                          files: current.files.filter((_, currentIndex) => currentIndex !== index),
                        }))}
                        className="absolute right-2 top-2 rounded-full bg-black/70 p-2"
                      >
                        <X size={17} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <button onClick={() => postInputRef.current?.click()} className="flex h-72 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#f0dff1] bg-[#fff9fc] transition hover:border-[#d96bb4]">
                  <ImagePlus size={35} className="text-[#d96bb4]" />
                  <p className="mt-4 font-medium">Upload photo or video</p>
                  <p className="mt-1 text-sm text-neutral-500">Choose up to 10 files</p>
                </button>
              )}

              <input
                ref={postInputRef}
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={(event) => {
                  const files = Array.from(event.target.files || []);
                  if (!files.length) return;

                  setPostForm((current) => ({
                    ...current,
                    media: files.map((file) => URL.createObjectURL(file)),
                    mediaType: files[0].type.startsWith('video/') ? 'video' : 'image',
                    files,
                  }));
                }}
                className="hidden"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Caption</label>
              <textarea value={postForm.caption} onChange={(e) => setPostForm({ ...postForm, caption: e.target.value })} rows={4} placeholder="Write a caption..." className="w-full resize-none rounded-xl border border-white/10 bg-white/5 p-4 outline-none placeholder:text-neutral-600 focus:border-emerald-500" />
            </div>

            <button onClick={editingPost ? saveEditedPost : publishPost} disabled={!postForm.media.length} className="w-full rounded-xl bg-[linear-gradient(135deg,#f472b6,#8b5cf6)] py-3 font-semibold text-white shadow-[0_12px_28px_rgba(168,104,185,0.25)] disabled:opacity-40">
              {editingPost ? 'Save Post' : 'Publish Post'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <p className="font-bold text-[#311a32]">{value}</p>
      <p className="text-sm text-[#8f6888]">{label}</p>
    </div>
  );
}

function Input({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">{label}</label>
      <input value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 p-3 outline-none focus:border-emerald-500" />
    </div>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2d1634]/75 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-[#f0dff1] bg-[#fffafc]">
        <div className="sticky top-0 flex items-center justify-between border-b border-[#f0dff1] bg-[#fffafc] px-5 py-4">
          <h2 className="font-semibold text-[#311a32]">{title}</h2>
          <button onClick={onClose} className="rounded-full p-2 text-[#5f3d5d] hover:bg-[#fff2fa]">
            <X size={19} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}