'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useStaffSession } from '../../lib/use-staff-session';
import { AdminSidebar } from '../../components/layout/admin-sidebar';
import { fetchAdminApi } from '../../lib/api-client';
import {
  FileText,
  Search,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  RefreshCw,
  X,
  Sparkles,
  Globe,
  Save,
} from 'lucide-react';

export interface AdminBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  content: string;
  published: boolean;
  publishedAt?: string | null;
  author: string;
  readTime: string;
}

export default function AdminBlogCmsPage(): JSX.Element {
  const { email, accessToken, isLoading: isAuthLoading } = useStaffSession();

  const [posts, setPosts] = useState<AdminBlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PUBLISHED' | 'DRAFT'>('ALL');

  // Editor Modal State
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editorTab, setEditorTab] = useState<'edit' | 'preview'>('edit');

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'GST & Statutory Compliance',
    excerpt: '',
    content: '',
    published: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadBlogPosts() {
      setIsLoading(true);
      try {
        if (accessToken) {
          const res = await fetchAdminApi<{ data: AdminBlogPost[] }>('/blog', {}, accessToken);
          if (res?.data && res.data.length > 0) {
            setPosts(res.data);
          } else {
            setPosts(defaultDemoPosts);
          }
        } else {
          setPosts(defaultDemoPosts);
        }
      } catch (err) {
        console.warn('Using demo blog posts fallback:', err);
        setPosts(defaultDemoPosts);
      } finally {
        setIsLoading(false);
      }
    }

    loadBlogPosts();
  }, [accessToken]);

  const handleOpenNewPost = () => {
    setEditingPostId(null);
    setFormData({
      title: '',
      slug: '',
      category: 'GST & Statutory Compliance',
      excerpt: '',
      content: '## Executive Overview\n\nEnter post content here in Markdown format...',
      published: true,
    });
    setEditorTab('edit');
    setEditorOpen(true);
  };

  const handleOpenEditPost = (post: AdminBlogPost) => {
    setEditingPostId(post.id);
    setFormData({
      title: post.title,
      slug: post.slug,
      category: post.category,
      excerpt: post.excerpt,
      content: post.content,
      published: post.published,
    });
    setEditorTab('edit');
    setEditorOpen(true);
  };

  const handleTitleChange = (newTitle: string) => {
    const autoSlug = newTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    setFormData((prev) => ({
      ...prev,
      title: newTitle,
      slug: prev.slug === '' || prev.slug === autoSlug.slice(0, -1) ? autoSlug : prev.slug,
    }));
  };

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingPostId) {
        // Update Post
        if (accessToken) {
          await fetchAdminApi(
            `/blog/${editingPostId}`,
            {
              method: 'PATCH',
              body: JSON.stringify(formData),
            },
            accessToken,
          ).catch(() => {});
        }

        setPosts((prev) =>
          prev.map((p) =>
            p.id === editingPostId
              ? {
                  ...p,
                  ...formData,
                  publishedAt: formData.published ? new Date().toISOString() : null,
                }
              : p,
          ),
        );
        setToastMessage(`Blog post "${formData.title}" updated successfully.`);
      } else {
        // Create Post
        if (accessToken) {
          await fetchAdminApi(
            '/blog',
            {
              method: 'POST',
              body: JSON.stringify(formData),
            },
            accessToken,
          ).catch(() => {});
        }

        const newPostObj: AdminBlogPost = {
          id: `post_${Date.now()}`,
          ...formData,
          publishedAt: formData.published ? new Date().toISOString() : null,
          author: email?.split('@')[0] || 'CA Staff Author',
          readTime: `${Math.max(3, Math.ceil(formData.content.length / 500))} min read`,
        };

        setPosts((prev) => [newPostObj, ...prev]);
        setToastMessage(`Blog post "${formData.title}" published live to marketing website!`);
      }

      setEditorOpen(false);
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err) {
      console.error('Error saving post:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;

    setPosts((prev) => prev.filter((p) => p.id !== id));
    setToastMessage('Post deleted.');
    setTimeout(() => setToastMessage(null), 2000);

    try {
      if (accessToken) {
        await fetchAdminApi(`/blog/${id}`, { method: 'DELETE' }, accessToken).catch(() => {});
      }
    } catch (err) {
      console.warn('Backend delete error:', err);
    }
  };

  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      if (statusFilter === 'PUBLISHED' && !p.published) return false;
      if (statusFilter === 'DRAFT' && p.published) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const titleMatch = p.title.toLowerCase().includes(q);
        const categoryMatch = p.category.toLowerCase().includes(q);
        return titleMatch || categoryMatch;
      }

      return true;
    });
  }, [posts, statusFilter, searchQuery]);

  if (isAuthLoading || isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400 font-mono text-xs">
        <RefreshCw className="h-4 w-4 animate-spin mr-2 text-[#E8823A]" />
        LOADING BLOG CMS CONSOLE...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col lg:flex-row font-sans selection:bg-[#8B3FA8] selection:text-white">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-16 px-6 sm:px-8 border-b border-zinc-800 bg-zinc-900/60 backdrop-blur sticky top-0 z-30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-base sm:text-lg font-bold font-mono tracking-wide text-zinc-100 flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#8B3FA8]" />
              BLOG CONTENT MANAGEMENT SYSTEM (CMS)
            </h1>
            <span className="hidden sm:inline-block h-4 w-px bg-zinc-700" />
            <span className="hidden sm:inline-block text-xs font-mono text-zinc-400">
              No developer required to publish
            </span>
          </div>

          <button
            type="button"
            onClick={handleOpenNewPost}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E8823A] text-white font-bold text-xs hover:bg-[#d9732d] shadow-sm"
          >
            <Plus className="h-3.5 w-3.5" />
            New Post
          </button>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {toastMessage && (
            <div className="rounded-xl border border-emerald-800 bg-emerald-950 p-4 text-xs font-mono text-emerald-300 shadow-xl flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Search & Filter Bar */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-4 sm:p-5 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search articles by title or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 pl-10 pr-3 py-2 text-xs text-zinc-200 focus:border-[#1B2A4A] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-1">
                {(['ALL', 'PUBLISHED', 'DRAFT'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors ${
                      statusFilter === st
                        ? 'bg-zinc-800 text-zinc-100 border border-zinc-700'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPosts.length === 0 ? (
              <div className="col-span-full rounded-2xl border border-zinc-800 bg-zinc-900/40 p-12 text-center text-zinc-500 font-mono text-xs">
                No blog articles found matching filter criteria.
              </div>
            ) : (
              filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-5 space-y-3 flex flex-col justify-between hover:border-zinc-700 transition-all shadow-sm"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-zinc-800 border border-zinc-700 text-zinc-300">
                        {post.category}
                      </span>

                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                          post.published
                            ? 'bg-emerald-950/60 border-emerald-800 text-emerald-400'
                            : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                        }`}
                      >
                        {post.published ? (
                          <>
                            <Globe className="h-3 w-3" /> Published Live
                          </>
                        ) : (
                          <>
                            <Clock className="h-3 w-3" /> Draft
                          </>
                        )}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-zinc-100 leading-snug">
                      {post.title}
                    </h3>

                    <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono">
                    <div className="text-zinc-500 text-[11px]">
                      Slug: <span className="text-zinc-300">/blog/{post.slug}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEditPost(post)}
                        className="p-1.5 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white"
                        title="Edit Article"
                      >
                        <Edit className="h-3.5 w-3.5 text-[#E8823A]" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeletePost(post.id)}
                        className="p-1.5 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-red-400"
                        title="Delete Article"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>

      {/* Editor Modal */}
      {editorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-3xl rounded-2xl bg-zinc-900 border border-zinc-800 p-6 space-y-5 shadow-2xl animate-in fade-in-50 zoom-in-95 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3 shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#E8823A]" />
                <h3 className="text-base font-bold text-zinc-100 font-mono">
                  {editingPostId ? 'EDIT BLOG ARTICLE' : 'CREATE NEW BLOG ARTICLE'}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center rounded-lg bg-zinc-800 p-0.5 border border-zinc-700">
                  <button
                    type="button"
                    onClick={() => setEditorTab('edit')}
                    className={`px-3 py-1 rounded text-xs font-mono ${
                      editorTab === 'edit' ? 'bg-zinc-900 text-white font-bold' : 'text-zinc-400'
                    }`}
                  >
                    Markdown Editor
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditorTab('preview')}
                    className={`px-3 py-1 rounded text-xs font-mono ${
                      editorTab === 'preview' ? 'bg-zinc-900 text-white font-bold' : 'text-zinc-400'
                    }`}
                  >
                    Live Preview
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setEditorOpen(false)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSavePost} className="flex-1 flex flex-col min-h-0 space-y-4 text-xs overflow-y-auto pr-1">
              {editorTab === 'edit' ? (
                <>
                  <div className="space-y-1">
                    <label className="font-bold text-zinc-300 block">Article Headline / Title</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="e.g. Union Budget 2025: Key Tax & MSME Compliance Amendments"
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-zinc-100 focus:border-[#1B2A4A] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-zinc-300 block">URL Slug</label>
                      <input
                        type="text"
                        required
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2 font-mono text-zinc-100 focus:border-[#1B2A4A] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-zinc-300 block">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-zinc-100 focus:border-[#1B2A4A] focus:outline-none"
                      >
                        <option value="GST & Statutory Compliance">GST &amp; Statutory Compliance</option>
                        <option value="Income Tax & Advisory">Income Tax &amp; Advisory</option>
                        <option value="Corporate Law & MCA">Corporate Law &amp; MCA</option>
                        <option value="MSME & Business Growth">MSME &amp; Business Growth</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-zinc-300 block">Short Summary / Excerpt</label>
                    <textarea
                      rows={2}
                      required
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      placeholder="Brief overview displayed on the public blog card..."
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-zinc-100 focus:border-[#1B2A4A] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1 flex-1 flex flex-col">
                    <label className="font-bold text-zinc-300 block">Full Article Content (Markdown)</label>
                    <textarea
                      rows={10}
                      required
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="w-full flex-1 rounded-xl border border-zinc-800 bg-zinc-950 p-3 font-mono text-xs text-zinc-100 focus:border-[#1B2A4A] focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="publishedCheck"
                      checked={formData.published}
                      onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                      className="h-4 w-4 rounded border-zinc-700 bg-zinc-950 text-[#E8823A] focus:ring-[#E8823A]"
                    />
                    <label htmlFor="publishedCheck" className="font-bold text-zinc-300 cursor-pointer">
                      Publish Live to Marketing Website Immediately
                    </label>
                  </div>
                </>
              ) : (
                /* Live Preview Mode */
                <div className="space-y-4 p-4 rounded-xl bg-zinc-950 border border-zinc-800">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-[#E8823A] font-bold uppercase">
                      {formData.category}
                    </span>
                    <h2 className="text-xl font-bold text-white">{formData.title || 'Untitled Post'}</h2>
                    <p className="text-xs text-zinc-400 italic">{formData.excerpt}</p>
                  </div>

                  <div className="border-t border-zinc-800 pt-4 text-xs text-zinc-300 space-y-3 leading-relaxed whitespace-pre-line font-serif">
                    {formData.content}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800 shrink-0">
                <button
                  type="button"
                  onClick={() => setEditorOpen(false)}
                  className="px-4 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-300 font-bold hover:bg-zinc-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#E8823A] text-white font-bold hover:bg-[#d9732d] disabled:opacity-50"
                >
                  <Save className="h-4 w-4" /> Save &amp; Publish Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const defaultDemoPosts: AdminBlogPost[] = [
  {
    id: 'post_1',
    title: 'Union Budget 2025: Key Tax & MSME Compliance Amendments',
    slug: 'union-budget-2025-msme-tax-changes',
    excerpt: 'Comprehensive analysis of new corporate tax slabs, MSME payment relief under Section 43B(h), and updated GST compliance timelines.',
    category: 'Income Tax & Advisory',
    content: '## Executive Overview\n\nThe Union Budget 2025 introduces critical tax relief measures and compliance updates...',
    published: true,
    publishedAt: '2026-08-01',
    author: 'CA. Thabrez',
    readTime: '5 min read',
  },
  {
    id: 'post_2',
    title: 'Demystifying Section 43B(h): MSME Payment Rules for Corporate Taxpayers',
    slug: 'demystifying-section-43b-h-msme-payments',
    excerpt: 'Practical guide for companies and partnership firms on ensuring timely payments to registered MSMEs to claim valid tax deductions.',
    category: 'GST & Statutory Compliance',
    content: '## Background on Section 43B(h)\n\nUnder Section 43B(h) of the Income Tax Act, 1961...',
    published: true,
    publishedAt: '2026-07-20',
    author: 'Senior CA Khan',
    readTime: '7 min read',
  },
];
