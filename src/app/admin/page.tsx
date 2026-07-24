'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  LayoutDashboard, Users, Heart, AlertOctagon, UserCheck,
  ShieldAlert, Ban, Download, CheckCircle, Trash2, Edit3, X, Save, UserPlus, PlusCircle, AlertTriangle,
  BookOpen, FileEdit, Newspaper, Bold, Italic, Underline, Link as LinkIcon, List, Eye, Image as ImageIcon, Upload
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Post {
  id: string;
  created_at: string;
  title: string;
  content: string;
  photo_url?: string;
  status: 'draft' | 'published';
  is_featured: boolean;
  author: string;
  format?: 'html' | 'text' | 'markdown';
  summary?: string;
  source?: string;
}

interface FraudLog {
  id: string;
  teamName: string;
  ip: string;
  fingerprint: string;
  timestamp: string;
  score: number;
  status: 'valid' | 'flagged' | 'voided';
}

interface Team {
  id: string;
  created_at: string;
  team_name: string;
  organization?: string;
  member_count?: string;
  representative_name: string;
  phone: string;
  email: string;
  category: 'dan_ca' | 'dan_vu' | 'both';
  performance_title: string;
  duration: string;
  description: string;
  technical_requirements: string;
  audio_url?: string;
  video_url?: string;
  photo_url?: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  has_pending_update?: boolean;
  pending_changes?: any;
}

interface Judge {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [authHeader, setAuthHeader] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<'monitoring' | 'teams' | 'pending_updates' | 'judges' | 'rankings' | 'posts'>('monitoring');

  // Dashboard state loaded from backend APIs
  const [stats, setStats] = useState({
    teamsCount: 0,
    votesCount: 0,
    fraudCount: 0,
    judgesCount: 0,
  });
  const [logs, setLogs] = useState<FraudLog[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [judges, setJudges] = useState<Judge[]>([]);
  const [rankings, setRankings] = useState<any[]>([]);
  const [isLoadingRankings, setIsLoadingRankings] = useState(false);

  // Editing state for Team
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [isSavingTeam, setIsSavingTeam] = useState(false);

  // New Judge creation state
  const [newJudgeEmail, setNewJudgeEmail] = useState('');
  const [newJudgePassword, setNewJudgePassword] = useState('');
  const [newJudgeName, setNewJudgeName] = useState('');
  const [isCreatingJudge, setIsCreatingJudge] = useState(false);
  const [judgeError, setJudgeError] = useState('');

  // Search & Filter & Pagination states
  // 1. Monitoring / logs
  const [monSearch, setMonSearch] = useState('');
  const [monFilter, setMonFilter] = useState<'all' | 'valid' | 'flagged' | 'voided'>('all');
  const [monPage, setMonPage] = useState(1);

  // 2. Teams
  const [teamSearch, setTeamSearch] = useState('');
  const [teamCatFilter, setTeamCatFilter] = useState<string>('all');
  const [teamStatusFilter, setTeamStatusFilter] = useState<string>('all');
  const [teamPage, setTeamPage] = useState(1);

  // 3. Pending updates
  const [pendingSearch, setPendingSearch] = useState('');
  const [pendingPage, setPendingPage] = useState(1);

  // 4. Rankings
  const [rankSearch, setRankSearch] = useState('');
  const [rankCatFilter, setRankCatFilter] = useState<string>('all');
  const [rankPage, setRankPage] = useState(1);

  // 5. Judges
  const [judgeSearch, setJudgeSearch] = useState('');
  const [judgePage, setJudgePage] = useState(1);

  // 6. Posts
  const [posts, setPosts] = useState<Post[]>([]);
  const [postSearch, setPostSearch] = useState('');
  const [postStatusFilter, setPostStatusFilter] = useState<string>('all');
  const [postPage, setPostPage] = useState(1);

  // Form states for creating/editing posts
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isWritingNewPost, setIsWritingNewPost] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postPhotoUrl, setPostPhotoUrl] = useState('');
  const [postStatus, setPostStatus] = useState<'draft' | 'published'>('draft');
  const [postIsFeatured, setPostIsFeatured] = useState(false);
  const [postAuthor, setPostAuthor] = useState('Ban Tổ Chức');
  const [isSavingPost, setIsSavingPost] = useState(false);
  const [postFormat, setPostFormat] = useState<'html' | 'text' | 'markdown'>('html');
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [isUploadingInline, setIsUploadingInline] = useState(false);
  const [postSummary, setPostSummary] = useState('');
  const [postSource, setPostSource] = useState('');
  const editorRef = React.useRef<HTMLDivElement>(null);

  const pageSize = 10;

  const renderPagination = (currentPage: number, totalItems: number, currentPageSize: number, onPageChange: (p: number) => void) => {
    const totalPages = Math.ceil(totalItems / currentPageSize);
    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-4 text-xs font-semibold text-slate-500">
        <div>
          Hiển thị từ {((currentPage - 1) * currentPageSize) + 1} đến {Math.min(currentPage * currentPageSize, totalItems)} trong tổng số {totalItems} dòng
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
          >
            Trước
          </button>
          {Array.from({ length: totalPages }, (_, idx) => {
            const pageNum = idx + 1;
            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => onPageChange(pageNum)}
                className={`w-8 h-8 rounded-lg border font-bold flex items-center justify-center cursor-pointer transition-all ${
                  currentPage === pageNum
                    ? 'border-primary bg-primary text-white'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
          >
            Sau
          </button>
        </div>
      </div>
    );
  };

  // Load state from API when logged in
  useEffect(() => {
    if (isAdminLoggedIn && authHeader) {
      fetchStats();
      fetchTeams();
      fetchJudges();
      fetchRankings();
      fetchPosts();
    }
  }, [isAdminLoggedIn, authHeader, activeTab]);

  // Fetch Blog/News Posts
  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/admin/posts', {
        headers: { Authorization: authHeader },
      });
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
      }
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    }
  };

  // Create or Update Blog Post
  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle || !postContent) {
      alert('Tiêu đề và nội dung bài viết không được để trống.');
      return;
    }
    setIsSavingPost(true);
    try {
      const isEdit = !!editingPost;
      const url = '/api/admin/posts';
      const method = isEdit ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: authHeader,
        },
        body: JSON.stringify({
          id: editingPost?.id,
          title: postTitle,
          content: postContent,
          photo_url: postPhotoUrl,
          status: postStatus,
          is_featured: postIsFeatured,
          author: postAuthor,
          format: postFormat,
          summary: postSummary,
          source: postSource
        }),
      });

      const result = await res.json();
      if (res.ok) {
        alert(isEdit ? 'Cập nhật bài viết thành công!' : 'Tạo bài viết mới thành công!');
        setEditingPost(null);
        setIsWritingNewPost(false);
        setPostTitle('');
        setPostContent('');
        setPostPhotoUrl('');
        setPostStatus('draft');
        setPostIsFeatured(false);
        setPostAuthor('Ban Tổ Chức');
        setPostFormat('html');
        setPostSummary('');
        setPostSource('');
        if (editorRef.current) {
          editorRef.current.innerHTML = '';
        }
        fetchPosts();
      } else {
        alert(result.error || 'Lỗi khi lưu bài viết.');
      }
    } catch (err) {
      console.error('Error saving post:', err);
      alert('Lỗi kết nối máy chủ.');
    } finally {
      setIsSavingPost(false);
    }
  };

  // Handle Banner Image Upload to Supabase Storage
  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingBanner(true);
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
        await new Promise((resolve) => setTimeout(resolve, 800));
        const mockUrl = `https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&auto=format&fit=crop&q=80`;
        setPostPhotoUrl(mockUrl);
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `posts/banners/${fileName}`;

      const { data, error } = await supabase.storage
        .from('photos')
        .upload(filePath, file, { cacheControl: '3600', upsert: true });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('photos')
        .getPublicUrl(filePath);

      setPostPhotoUrl(publicUrl);
    } catch (err: any) {
      console.error('Error uploading post banner:', err);
      alert('Không thể tải ảnh lên: ' + (err.message || 'Lỗi kết nối'));
    } finally {
      setIsUploadingBanner(false);
    }
  };

  // Handle Inline Image Upload & Cursor Insertion
  const handleInlineUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingInline(true);
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
        await new Promise((resolve) => setTimeout(resolve, 800));
        const mockUrl = `https://images.unsplash.com/photo-1472289065668-ce650ac443d2?w=600&auto=format&fit=crop&q=80`;
        
        if (postFormat === 'html') {
          insertTag(`<img src="${mockUrl}" alt="Hình ảnh" class="w-full h-auto rounded-xl my-4 shadow-sm" />`, '');
        } else {
          insertTag(mockUrl, '');
        }
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `posts/inline/${fileName}`;

      const { data, error } = await supabase.storage
        .from('photos')
        .upload(filePath, file, { cacheControl: '3600', upsert: true });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('photos')
        .getPublicUrl(filePath);

      if (postFormat === 'html') {
        insertTag(`<img src="${publicUrl}" alt="Hình ảnh" class="w-full h-auto rounded-xl my-4 shadow-sm" />`, '');
      } else {
        insertTag(publicUrl, '');
      }
    } catch (err: any) {
      console.error('Error uploading inline image:', err);
      alert('Không thể tải ảnh lên: ' + (err.message || 'Lỗi kết nối'));
    } finally {
      setIsUploadingInline(false);
    }
  };

  // Handle Paste event on post textarea to intercept copy-pasted images
  const handleTextareaPaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const clipboardData = e.clipboardData;
    if (!clipboardData) return;

    const items = clipboardData.items;
    let imageFile: File | null = null;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          imageFile = file;
          break;
        }
      }
    }

    if (imageFile) {
      e.preventDefault();
      setIsUploadingInline(true);
      try {
        if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
          await new Promise((resolve) => setTimeout(resolve, 800));
          const mockUrl = `https://images.unsplash.com/photo-1472289065668-ce650ac443d2?w=600&auto=format&fit=crop&q=80`;
          if (postFormat === 'html') {
            insertTag(`<img src="${mockUrl}" alt="Hình ảnh" class="w-full h-auto rounded-xl my-4 shadow-sm" />`, '');
          } else {
            insertTag(mockUrl, '');
          }
          return;
        }

        const fileExt = imageFile.name ? imageFile.name.split('.').pop() : 'png';
        const fileName = `pasted_${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `posts/inline/${fileName}`;

        const { data, error } = await supabase.storage
          .from('photos')
          .upload(filePath, imageFile, { cacheControl: '3600', upsert: true });

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('photos')
          .getPublicUrl(filePath);

        if (postFormat === 'html') {
          insertTag(`<img src="${publicUrl}" alt="Hình ảnh" class="w-full h-auto rounded-xl my-4 shadow-sm" />`, '');
        } else {
          insertTag(publicUrl, '');
        }
      } catch (err: any) {
        console.error('Error uploading pasted image:', err);
        alert('Không thể tải ảnh chèn trực tiếp lên: ' + (err.message || 'Lỗi kết nối'));
      } finally {
        setIsUploadingInline(false);
      }
    }
  };

  // Sync state to contentEditable container initial value (prevents cursor jump)
  useEffect(() => {
    if (postFormat === 'html' && editorRef.current) {
      if (editorRef.current.innerHTML !== postContent) {
        editorRef.current.innerHTML = postContent;
      }
    }
  }, [editingPost, isWritingNewPost, postFormat]);

  // Execute browser commands for contentEditable HTML mode
  const handleEditorCommand = (command: string, value: string = '') => {
    if (postFormat === 'html') {
      document.execCommand(command, false, value);
      if (editorRef.current) {
        setPostContent(editorRef.current.innerHTML);
      }
    }
  };

  // Insert link inside contentEditable or textarea depending on format
  const handleInsertLink = () => {
    const url = prompt('Nhập địa chỉ liên kết (URL):');
    if (!url) return;
    if (postFormat === 'html') {
      document.execCommand('createLink', false, url);
      if (editorRef.current) {
        setPostContent(editorRef.current.innerHTML);
      }
    } else {
      insertTag(url, '');
    }
  };

  // Insert image inside contentEditable or textarea depending on format
  const handleInsertImage = () => {
    const src = prompt('Nhập địa chỉ hình ảnh (URL):');
    if (!src) return;
    if (postFormat === 'html') {
      document.execCommand('insertImage', false, src);
      if (editorRef.current) {
        const imgs = editorRef.current.querySelectorAll(`img[src="${src}"]`);
        imgs.forEach((img) => {
          img.className = "w-full h-auto rounded-xl my-4 shadow-sm inline-block max-w-lg";
        });
        setPostContent(editorRef.current.innerHTML);
      }
    } else {
      insertTag(src, '');
    }
  };

  // Change font color for selection depending on format
  const applyTextColor = (colorHex: string) => {
    if (!colorHex) return;
    if (postFormat === 'html') {
      handleEditorCommand('foreColor', colorHex);
    } else {
      insertTag(`<span style="color: ${colorHex}">`, '</span>');
    }
  };

  // Change font size for selection depending on format
  const applyTextSize = (sizePx: string) => {
    if (!sizePx) return;
    if (postFormat === 'html') {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const span = document.createElement('span');
        span.style.fontSize = sizePx;
        span.appendChild(range.extractContents());
        range.insertNode(span);
        if (editorRef.current) {
          setPostContent(editorRef.current.innerHTML);
        }
      }
    } else {
      insertTag(`<span style="font-size: ${sizePx}">`, '</span>');
    }
  };

  // Intercept paste event on visual editor for pasted image files
  const handleContentEditablePaste = async (e: React.ClipboardEvent<HTMLDivElement>) => {
    const clipboardData = e.clipboardData;
    if (!clipboardData) return;

    const items = clipboardData.items;
    let imageFile: File | null = null;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          imageFile = file;
          break;
        }
      }
    }

    if (imageFile) {
      e.preventDefault();
      setIsUploadingInline(true);
      try {
        if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
          await new Promise((resolve) => setTimeout(resolve, 800));
          const mockUrl = `https://images.unsplash.com/photo-1472289065668-ce650ac443d2?w=600&auto=format&fit=crop&q=80`;
          document.execCommand('insertImage', false, mockUrl);
          if (editorRef.current) {
            const imgs = editorRef.current.querySelectorAll(`img[src="${mockUrl}"]`);
            imgs.forEach((img) => {
              img.className = "w-full h-auto rounded-xl my-4 shadow-sm inline-block max-w-lg";
            });
            setPostContent(editorRef.current.innerHTML);
          }
          return;
        }

        const fileExt = imageFile.name ? imageFile.name.split('.').pop() : 'png';
        const fileName = `pasted_${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `posts/inline/${fileName}`;

        const { data, error } = await supabase.storage
          .from('photos')
          .upload(filePath, imageFile, { cacheControl: '3600', upsert: true });

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('photos')
          .getPublicUrl(filePath);

        document.execCommand('insertImage', false, publicUrl);
        if (editorRef.current) {
          const imgs = editorRef.current.querySelectorAll(`img[src="${publicUrl}"]`);
          imgs.forEach((img) => {
            img.className = "w-full h-auto rounded-xl my-4 shadow-sm inline-block max-w-lg";
          });
          setPostContent(editorRef.current.innerHTML);
        }
      } catch (err: any) {
        console.error('Error pasting image in editor:', err);
        alert('Không thể tải ảnh chèn trực tiếp lên: ' + (err.message || 'Lỗi kết nối'));
      } finally {
        setIsUploadingInline(false);
      }
    }
  };

  // Delete Blog Post
  const handleDeletePost = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bài viết này vĩnh viễn?')) return;
    try {
      const res = await fetch(`/api/admin/posts?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: authHeader },
      });
      if (res.ok) {
        alert('Xóa bài viết thành công!');
        fetchPosts();
      } else {
        alert('Lỗi khi xóa bài viết.');
      }
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  // Fetch Rankings & Grades
  const fetchRankings = async () => {
    setIsLoadingRankings(true);
    try {
      const res = await fetch('/api/admin/scorecards', {
        headers: { Authorization: authHeader },
      });
      if (res.ok) {
        const data = await res.json();
        setRankings(data.rankings || []);
      }
    } catch (err) {
      console.error('Failed to fetch rankings:', err);
    } finally {
      setIsLoadingRankings(false);
    }
  };

  // Fetch Dashboard Stats & Logs
  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats', {
        headers: { Authorization: authHeader },
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setLogs(data.logs);
      }
    } catch (err) {
      console.error('Failed to fetch admin stats:', err);
    }
  };

  // Fetch Teams
  const fetchTeams = async () => {
    try {
      const res = await fetch('/api/admin/teams', {
        headers: { Authorization: authHeader },
      });
      if (res.ok) {
        const data = await res.json();
        setTeams(data.teams);
      }
    } catch (err) {
      console.error('Failed to fetch teams:', err);
    }
  };

  // Fetch Judges
  const fetchJudges = async () => {
    try {
      const res = await fetch('/api/admin/judges', {
        headers: { Authorization: authHeader },
      });
      if (res.ok) {
        const data = await res.json();
        setJudges(data.judges);
      }
    } catch (err) {
      console.error('Failed to fetch judges:', err);
    }
  };

  // Login handler
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    const token = 'Basic ' + btoa(username + ':' + password);
    try {
      const res = await fetch('/api/admin/stats', {
        headers: { Authorization: token },
      });

      if (res.ok) {
        setAuthHeader(token);
        setIsAdminLoggedIn(true);
        // Save token in sessionStorage
        sessionStorage.setItem('admin_auth', token);
      } else {
        setLoginError('Sai tài khoản hoặc mật khẩu quản trị.');
      }
    } catch (err) {
      setLoginError('Lỗi kết nối máy chủ.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Auto-restore session from sessionStorage on mount
  useEffect(() => {
    const cachedToken = sessionStorage.getItem('admin_auth');
    if (cachedToken) {
      setAuthHeader(cachedToken);
      setIsAdminLoggedIn(true);
    }
  }, []);

  // Void a vote
  const handleVoidVote = async (id: string) => {
    try {
      const res = await fetch('/api/admin/stats', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authHeader,
        },
        body: JSON.stringify({ id, is_valid: false }),
      });

      if (res.ok) {
        fetchStats();
      } else {
        alert('Lỗi khi hủy vote.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Clear all vote data for testing
  const handleClearAllVotes = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn XÓA SẠCH toàn bộ dữ liệu bình chọn thử nghiệm để test lại từ đầu?')) return;

    try {
      const res = await fetch('/api/admin/stats', {
        method: 'DELETE',
        headers: {
          Authorization: authHeader,
        },
      });

      if (res.ok) {
        alert('Đã xóa sạch toàn bộ dữ liệu bình chọn thử nghiệm!');
        fetchStats();
      } else {
        alert('Lỗi khi xóa dữ liệu bình chọn.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Approve / Reject a team submission
  const handleUpdateTeamStatus = async (id: string, newStatus: 'approved' | 'rejected') => {
    try {
      const res = await fetch('/api/admin/teams', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authHeader,
        },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (res.ok) {
        fetchTeams();
        fetchStats();
      } else {
        alert('Cập nhật trạng thái đội thi thất bại.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Approve pending profile update request
  const handleApprovePendingUpdate = async (id: string) => {
    try {
      const res = await fetch('/api/admin/teams', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authHeader,
        },
        body: JSON.stringify({ id, action: 'approve_update' }),
      });

      if (res.ok) {
        fetchTeams();
        alert('Đã chấp nhận cập nhật thông tin mới của đội thi!');
      } else {
        alert('Chấp nhận cập nhật thất bại.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Reject pending profile update request
  const handleRejectPendingUpdate = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn TỪ CHỐI các thông tin thay đổi của đội thi này?')) return;

    try {
      const res = await fetch('/api/admin/teams', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authHeader,
        },
        body: JSON.stringify({ id, action: 'reject_update' }),
      });

      if (res.ok) {
        fetchTeams();
        alert('Đã từ chối yêu cầu thay đổi thông tin.');
      } else {
        alert('Từ chối cập nhật thất bại.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Save edited team details
  const handleSaveEditedTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeam) return;

    setIsSavingTeam(true);
    try {
      const res = await fetch('/api/admin/teams', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authHeader,
        },
        body: JSON.stringify(editingTeam),
      });

      if (res.ok) {
        setEditingTeam(null);
        fetchTeams();
      } else {
        alert('Cập nhật thông tin đội thi thất bại.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingTeam(false);
    }
  };

  // Delete a team
  const handleDeleteTeam = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa vĩnh viễn đội thi này khỏi cơ sở dữ liệu?')) return;

    try {
      const res = await fetch(`/api/admin/teams?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: authHeader },
      });

      if (res.ok) {
        fetchTeams();
        fetchStats();
      } else {
        alert('Xóa đội thi thất bại.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Create a new judge account
  const handleCreateJudge = async (e: React.FormEvent) => {
    e.preventDefault();
    setJudgeError('');
    setIsCreatingJudge(true);

    try {
      const res = await fetch('/api/admin/judges', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authHeader,
        },
        body: JSON.stringify({
          email: newJudgeEmail,
          password: newJudgePassword,
          fullName: newJudgeName,
        }),
      });

      const result = await res.json();
      if (res.ok) {
        setNewJudgeEmail('');
        setNewJudgePassword('');
        setNewJudgeName('');
        fetchJudges();
        fetchStats();
        alert('Tạo tài khoản giám khảo thành công.');
      } else {
        setJudgeError(result.error || 'Tạo tài khoản giám khảo thất bại.');
      }
    } catch (err) {
      setJudgeError('Lỗi kết nối máy chủ.');
    } finally {
      setIsCreatingJudge(false);
    }
  };

  // Delete a judge account
  const handleDeleteJudge = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa tài khoản giám khảo này?')) return;

    try {
      const res = await fetch(`/api/admin/judges?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: authHeader },
      });

      if (res.ok) {
        fetchJudges();
        fetchStats();
      } else {
        alert('Xóa tài khoản giám khảo thất bại.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleExport = (format: 'Excel' | 'PDF') => {
    if (rankings.length === 0) {
      alert('Không có dữ liệu để kết xuất.');
      return;
    }

    if (format === 'Excel') {
      let csvContent = '\uFEFF'; // UTF-8 BOM
      csvContent += 'Xếp Hạng,Mã Số,Tên Đội,Thể Loại,Tiết Mục,Giám Khảo Đã Chấm,Ý Tưởng (Trung bình),Kỹ Thuật (Trung bình),Trang Phục (Trung bình),Hiệu Ứng Sân Khấu (Trung bình),Điểm Trung Bình\n';
      
      rankings.forEach((r, index) => {
        const categoryLabel = r.category === 'dan_ca' ? 'Dân Ca' : r.category === 'dan_vu' ? 'Dân Vũ' : 'Dân Ca & Dân Vũ';
        const row = [
          index + 1,
          r.id.substring(0, 8).toUpperCase(),
          `"${r.teamName.replace(/"/g, '""')}"`,
          `"${categoryLabel}"`,
          `"${r.performanceTitle.replace(/"/g, '""')}"`,
          r.gradedCount,
          r.avgConcept,
          r.avgTechnique,
          r.avgCostume,
          r.avgStage,
          r.averageScore
        ];
        csvContent += row.join(',') + '\n';
      });
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `Bang_xep_hang_diem_so_Nhip_buoc_Viet_Nam_2026.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // PDF print
      setActiveTab('rankings');
      setTimeout(() => {
        window.print();
      }, 150);
    }
  };

  // 1. Logs / Monitoring Filter & Paginate
  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.teamName.toLowerCase().includes(monSearch.toLowerCase()) ||
      log.ip.toLowerCase().includes(monSearch.toLowerCase()) ||
      log.fingerprint.toLowerCase().includes(monSearch.toLowerCase());
    const matchesFilter = monFilter === 'all' ? true : log.status === monFilter;
    return matchesSearch && matchesFilter;
  });
  const paginatedLogs = filteredLogs.slice((monPage - 1) * pageSize, monPage * pageSize);

  // 2. Teams Filter & Paginate
  const filteredTeams = teams.filter((t) => {
    const matchesSearch =
      t.team_name.toLowerCase().includes(teamSearch.toLowerCase()) ||
      (t.representative_name || '').toLowerCase().includes(teamSearch.toLowerCase()) ||
      (t.email || '').toLowerCase().includes(teamSearch.toLowerCase()) ||
      (t.phone || '').toLowerCase().includes(teamSearch.toLowerCase()) ||
      (t.performance_title || '').toLowerCase().includes(teamSearch.toLowerCase());
    const matchesCat = teamCatFilter === 'all' ? true : t.category === teamCatFilter;
    const matchesStatus = teamStatusFilter === 'all' ? true : t.status === teamStatusFilter;
    return matchesSearch && matchesCat && matchesStatus;
  });
  const paginatedTeams = filteredTeams.slice((teamPage - 1) * pageSize, teamPage * pageSize);

  // 3. Pending updates Filter & Paginate
  const pendingTeams = teams.filter((t) => t.has_pending_update);
  const filteredPending = pendingTeams.filter((t) => {
    return (
      t.team_name.toLowerCase().includes(pendingSearch.toLowerCase()) ||
      (t.representative_name || '').toLowerCase().includes(pendingSearch.toLowerCase())
    );
  });
  const paginatedPending = filteredPending.slice((pendingPage - 1) * pageSize, pendingPage * pageSize);

  // 4. Rankings Filter & Paginate
  const filteredRankings = rankings.filter((r) => {
    const matchesSearch =
      r.teamName.toLowerCase().includes(rankSearch.toLowerCase()) ||
      (r.performanceTitle || '').toLowerCase().includes(rankSearch.toLowerCase());
    const matchesCat = rankCatFilter === 'all' ? true : r.category === rankCatFilter;
    return matchesSearch && matchesCat;
  });
  const paginatedRankings = filteredRankings.slice((rankPage - 1) * pageSize, rankPage * pageSize);

  // 5. Judges Filter & Paginate
  const filteredJudges = judges.filter((j) => {
    return (
      j.full_name.toLowerCase().includes(judgeSearch.toLowerCase()) ||
      (j.email || '').toLowerCase().includes(judgeSearch.toLowerCase())
    );
  });
  const paginatedJudges = filteredJudges.slice((judgePage - 1) * pageSize, judgePage * pageSize);

  // 6. Posts Filter & Paginate
  const filteredPosts = posts.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(postSearch.toLowerCase()) ||
      p.content.toLowerCase().includes(postSearch.toLowerCase()) ||
      (p.author || '').toLowerCase().includes(postSearch.toLowerCase());
    const matchesStatus = postStatusFilter === 'all' ? true :
                          postStatusFilter === 'featured' ? p.is_featured :
                          p.status === postStatusFilter;
    return matchesSearch && matchesStatus;
  });
  const paginatedPosts = filteredPosts.slice((postPage - 1) * pageSize, postPage * pageSize);

  // Rich Text Editor formatting helper
  const insertTag = (tagOpen: string, tagClose: string) => {
    const textarea = document.getElementById('post-content-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    const replacement = tagOpen + selected + tagClose;

    const newValue = text.substring(0, start) + replacement + text.substring(end);
    setPostContent(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + tagOpen.length, start + tagOpen.length + selected.length);
    }, 0);
  };

  // Parser to convert Markdown / styled text into structured HTML preview
  const parseMarkdownToHtml = (text: string): string => {
    if (!text) return '';
    let html = text;

    // Detect and replace raw Supabase image URLs or standard image URLs that are not inside src/href tags
    const rawImageRegex = /(?<!src=")(https?:\/\/[^\s'"]+(?:\.(?:jpeg|jpg|gif|png|webp|svg)|supabase\.co\/storage\/v1\/object\/public\/photos\/)[^\s'"]*)/gi;
    html = html.replace(rawImageRegex, '<img src="$1" alt="Hình ảnh bài viết" class="w-full h-auto rounded-xl my-4 shadow-sm max-w-lg block border border-slate-200" />');

    // Parse Markdown images: ![alt](url)
    html = html.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="w-full h-auto rounded-xl my-4 shadow-sm max-w-lg block border border-slate-200" />');

    // Parse Markdown links: [text](url)
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-accent underline hover:text-opacity-80 font-semibold" target="_blank">$1</a>');

    // Parse Headers
    html = html.replace(/^### (.*$)/gim, '<h3 class="font-heading font-semibold text-base text-dark-obsidian mt-4 mb-2">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="font-heading font-bold text-lg text-primary mt-5 mb-2">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="font-heading font-extrabold text-xl text-slate-900 leading-snug my-4">$1</h1>');

    // Parse Unordered Lists (bullet points): lines starting with - or *
    html = html.replace(/^\s*[-*]\s+(.*$)/gim, '<li class="text-xs text-dark-slate/90 list-disc ml-5 my-1">$1</li>');

    // Parse Bold: **text**
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Parse Italic: *text*
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Paragraph and Line break formatting
    html = html.replace(/\n\s*\n/g, '</p><p class="text-xs text-dark-slate/90 leading-relaxed mb-3">');
    html = html.replace(/\n/g, '<br/>');

    return html;
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAFA] text-[#0F172A] relative">
      <div className="print:hidden">
        <Navbar />
      </div>

      <main className="flex-grow py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {!isAdminLoggedIn ? (
          /* Secure Admin Login Gate */
          <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-2xl p-8 shadow-md space-y-6 mt-10">
            <div className="text-center space-y-2">
              <span className="inline-block p-3.5 bg-primary/10 border border-primary/20 text-primary rounded-full mb-2">
                <LayoutDashboard className="w-8 h-8" />
              </span>
              <h1 className="font-heading font-bold text-2xl text-slate-900">Bảng điều hành Quản trị viên</h1>
              <p className="text-xs text-slate-500">Cổng truy cập riêng tư dành cho Ban Tổ Chức Festival 2026.</p>
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-primary/10 border border-primary/25 text-primary text-xs font-semibold text-center">
                {loginError}
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Tên đăng nhập *</label>
                <input
                  type="text"
                  required
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:border-accent focus:outline-none transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Mật khẩu *</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:border-accent focus:outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-primary text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl hover:bg-opacity-95 transition-all shadow-sm mt-6 glow-crimson-hover cursor-pointer"
              >
                {isLoggingIn ? 'Đang xác thực...' : 'Đăng nhập Admin'}
              </button>
            </form>
          </div>
        ) : (
          /* Enterprise Admin Dashboard Content */
          <div className="space-y-10">
            {/* Print Only Header */}
            <div className="hidden print:block text-center text-slate-900 mb-6">
              <h1 className="text-xl font-bold uppercase tracking-wider font-heading">FESTIVAL DÂN CA DÂN VŨ QUỐC TẾ 2026</h1>
              <h2 className="text-sm font-semibold uppercase tracking-widest text-[#00695C] mt-1">BÁO CÁO ĐIỂM SỐ & BẢNG XẾP HẠNG CHI TIẾT</h2>
              <p className="text-[10px] text-slate-500 mt-1.5">Xuất từ hệ thống quản trị lúc: {new Date().toLocaleString('vi-VN')}</p>
              <div className="border-b border-slate-300 w-full mt-4" />
            </div>

            {/* Title summary */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-200 pb-6 gap-4 print:hidden">
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-widest text-primary font-semibold">Cổng điều hành Admin</span>
                <h1 className="font-heading font-bold text-3xl text-slate-900">Real-time Analytics Dashboard</h1>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleExport('Excel')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-accent/10 border border-accent/20 rounded-xl text-xs font-semibold text-accent hover:bg-accent/25 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Xuất Excel
                </button>
                <button
                  onClick={() => handleExport('PDF')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary/10 border border-primary/20 rounded-xl text-xs font-semibold text-primary hover:bg-primary/25 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Xuất PDF Điểm
                </button>
                <button
                  onClick={() => {
                    sessionStorage.removeItem('admin_auth');
                    setIsAdminLoggedIn(false);
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs text-slate-600 font-semibold rounded-xl transition-all cursor-pointer"
                >
                  Đăng xuất
                </button>
              </div>
            </div>

            {/* Real-time counters row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 print:hidden">
              {/* Card 1 */}
              <div className="bg-white border border-slate-200 p-6 rounded-2xl flex items-center justify-between shadow-sm">
                <div>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Tổng Đội Dự Thi</span>
                  <span className="block text-3xl font-extrabold text-slate-900 mt-1">{stats.teamsCount}</span>
                </div>
                <Users className="w-8 h-8 text-accent opacity-65" />
              </div>

              {/* Card 2 */}
              <div className="bg-white border border-slate-200 p-6 rounded-2xl flex items-center justify-between shadow-sm">
                <div>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Tổng Lượt Bình Chọn</span>
                  <span className="block text-3xl font-extrabold text-slate-900 mt-1">{stats.votesCount.toLocaleString()}</span>
                </div>
                <Heart className="w-8 h-8 text-primary opacity-65" />
              </div>

              {/* Card 3 */}
              <div className="bg-white border border-slate-200 p-6 rounded-2xl flex items-center justify-between shadow-sm">
                <div>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Lượt Nghi Vấn Fraud</span>
                  <span className="block text-3xl font-extrabold text-secondary mt-1">{stats.fraudCount}</span>
                </div>
                <AlertOctagon className="w-8 h-8 text-secondary opacity-65" />
              </div>

              {/* Card 4 */}
              <div className="bg-white border border-slate-200 p-6 rounded-2xl flex items-center justify-between shadow-sm">
                <div>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Giám Khảo Chấm</span>
                  <span className="block text-3xl font-extrabold text-slate-900 mt-1">{stats.judgesCount}</span>
                </div>
                <UserCheck className="w-8 h-8 text-accent opacity-65" />
              </div>
            </div>

            {/* Dashboard Tab Navigation */}
            <div className="border-b border-slate-200 flex gap-4 print:hidden overflow-x-auto">
              <button
                onClick={() => setActiveTab('monitoring')}
                className={`pb-4 px-2 font-heading font-semibold text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'monitoring' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                Giám Sát Bình Chọn
              </button>
              <button
                onClick={() => setActiveTab('teams')}
                className={`pb-4 px-2 font-heading font-semibold text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'teams' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                Quản Lý Đội Thi ({teams.length})
              </button>
              <button
                onClick={() => setActiveTab('pending_updates')}
                className={`pb-4 px-2 font-heading font-semibold text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                  activeTab === 'pending_updates' ? 'border-amber-600 text-amber-900 font-bold' : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                Yêu Cầu Chỉnh Sửa
                {teams.filter((t) => t.has_pending_update).length > 0 && (
                  <span className="bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                    {teams.filter((t) => t.has_pending_update).length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('rankings')}
                className={`pb-4 px-2 font-heading font-semibold text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'rankings' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                Bảng Điểm & Xếp Hạng
              </button>
              <button
                onClick={() => setActiveTab('judges')}
                className={`pb-4 px-2 font-heading font-semibold text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'judges' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                Tài Khoản Giám Khảo
              </button>
              <button
                onClick={() => setActiveTab('posts')}
                className={`pb-4 px-2 font-heading font-semibold text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'posts' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Newspaper className="w-4 h-4" />
                Tin Tức & Bài Viết ({posts.length})
              </button>
            </div>

            {/* Content for Monitoring Tab */}
            {activeTab === 'monitoring' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-secondary" />
                    <h2 className="font-heading font-bold text-xl text-slate-900">Nhật ký Giám sát Bình chọn bất thường</h2>
                  </div>
                </div>

                {/* Filters Row */}
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 border border-slate-200 rounded-2xl shadow-sm">
                  <div className="w-full sm:flex-1">
                    <input
                      type="text"
                      placeholder="Tìm theo Tiết mục, IP, Fingerprint..."
                      value={monSearch}
                      onChange={(e) => {
                        setMonSearch(e.target.value);
                        setMonPage(1);
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:border-accent focus:outline-none"
                    />
                  </div>
                  <div className="w-full sm:w-48">
                    <select
                      value={monFilter}
                      onChange={(e) => {
                        setMonFilter(e.target.value as any);
                        setMonPage(1);
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:border-accent focus:outline-none"
                    >
                      <option value="all">Tất cả Trạng thái</option>
                      <option value="valid">Hợp lệ</option>
                      <option value="flagged">Nghi vấn</option>
                      <option value="voided">Đã hủy</option>
                    </select>
                  </div>
                </div>

                <div className="glass-panel border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white p-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                        <tr>
                          <th className="px-6 py-4">Thời gian</th>
                          <th className="px-6 py-4">Tiết mục</th>
                          <th className="px-6 py-4">Địa chỉ IP</th>
                          <th className="px-6 py-4">Device Fingerprint</th>
                          <th className="px-6 py-4 text-center">Hệ số reCAPTCHA</th>
                          <th className="px-6 py-4 text-center">Trạng thái</th>
                          <th className="px-6 py-4 text-right">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs">
                        {paginatedLogs.length > 0 ? (
                          paginatedLogs.map((log) => {
                            const isFlagged = log.status === 'flagged';
                            const isVoided = log.status === 'voided';
                            const isLowScore = log.score < 0.3;

                            return (
                              <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                                <td className="px-6 py-4 text-slate-600 font-mono">
                                  {log.timestamp}
                                </td>
                                <td className="px-6 py-4 font-heading font-semibold text-slate-800">
                                  {log.teamName}
                                </td>
                                <td className="px-6 py-4 font-mono text-slate-600">
                                  {log.ip}
                                </td>
                                <td className="px-6 py-4 font-mono text-slate-500">
                                  {log.fingerprint}
                                </td>
                                <td className="px-6 py-4 text-center">
                                  <span className={`font-semibold ${isLowScore ? 'text-primary' : 'text-accent'}`}>
                                    {log.score}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                  {isVoided ? (
                                    <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                                      Đã hủy
                                    </span>
                                  ) : isFlagged ? (
                                    <span className="text-secondary font-semibold uppercase tracking-wider text-[10px] animate-pulse">
                                      Nghi vấn
                                    </span>
                                  ) : (
                                    <span className="text-accent font-semibold uppercase tracking-wider text-[10px]">
                                      Hợp lệ
                                    </span>
                                  )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                  {isFlagged ? (
                                    <button
                                      onClick={() => handleVoidVote(log.id)}
                                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-white text-[10px] font-bold uppercase tracking-wider hover:bg-opacity-90 transition-all shadow-sm cursor-pointer"
                                    >
                                      <Ban className="w-3.5 h-3.5" /> Hủy Vote
                                    </button>
                                  ) : isVoided ? (
                                    <span className="text-slate-400 text-[10px]">Đã hủy</span>
                                  ) : (
                                    <span className="text-accent inline-flex items-center gap-1 text-[10px] font-semibold">
                                      <CheckCircle className="w-3.5 h-3.5" /> An toàn
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={7} className="text-center py-10 text-slate-400 italic">
                              Chưa ghi nhận phiếu bầu nào phù hợp với bộ lọc.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  {renderPagination(monPage, filteredLogs.length, pageSize, setMonPage)}
                </div>
              </div>
            )}

            {/* Content for Teams Management Tab */}
            {activeTab === 'teams' && (
              <div className="space-y-4">
                <h2 className="font-heading font-bold text-xl text-slate-900">Quản Lý Hồ Sơ Đăng Ký</h2>

                {/* Filters Row */}
                <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 border border-slate-200 rounded-2xl shadow-sm">
                  <div className="w-full md:flex-1">
                    <input
                      type="text"
                      placeholder="Tìm theo Tên Đội, Mã Số, Đại Diện, SĐT, Email..."
                      value={teamSearch}
                      onChange={(e) => {
                        setTeamSearch(e.target.value);
                        setTeamPage(1);
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:border-accent focus:outline-none"
                    />
                  </div>
                  <div className="w-full md:w-48">
                    <select
                      value={teamCatFilter}
                      onChange={(e) => {
                        setTeamCatFilter(e.target.value);
                        setTeamPage(1);
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:border-accent focus:outline-none"
                    >
                      <option value="all">Tất cả Thể loại</option>
                      <option value="dan_ca">Dân Ca</option>
                      <option value="dan_vu">Dân Vũ</option>
                      <option value="both">Cả hai</option>
                    </select>
                  </div>
                  <div className="w-full md:w-48">
                    <select
                      value={teamStatusFilter}
                      onChange={(e) => {
                        setTeamStatusFilter(e.target.value);
                        setTeamPage(1);
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:border-accent focus:outline-none"
                    >
                      <option value="all">Tất cả Trạng thái</option>
                      <option value="submitted">Chờ Duyệt</option>
                      <option value="approved">Đã Duyệt</option>
                      <option value="rejected">Từ Chối</option>
                    </select>
                  </div>
                </div>

                <div className="glass-panel border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white p-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                        <tr>
                          <th className="px-6 py-4">Mã số</th>
                          <th className="px-6 py-4">Tên Đội</th>
                          <th className="px-6 py-4">Tiết mục / Thể loại</th>
                          <th className="px-6 py-4">Đại diện & SĐT</th>
                          <th className="px-6 py-4 text-center">Trạng thái</th>
                          <th className="px-6 py-4 text-right">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs">
                        {paginatedTeams.length > 0 ? (
                          paginatedTeams.map((team) => {
                            const isSubmitted = team.status === 'submitted';
                            const isApproved = team.status === 'approved';
                            const isRejected = team.status === 'rejected';

                            return (
                              <tr key={team.id} className="hover:bg-slate-50/60 transition-colors">
                                <td className="px-6 py-4 font-mono font-bold text-slate-500">
                                  {team.id.substring(0, 8).toUpperCase()}
                                </td>
                                <td className="px-6 py-4">
                                  <span className="font-semibold text-slate-800 block">{team.team_name}</span>
                                  {team.organization && <span className="text-[10px] text-slate-500 block">ĐV: {team.organization}</span>}
                                </td>
                                <td className="px-6 py-4">
                                  <span className="font-semibold block">{team.performance_title}</span>
                                  <span className="text-[10px] text-slate-500 block">
                                    {team.category === 'dan_ca' ? 'Dân Ca' : team.category === 'dan_vu' ? 'Dân Vũ' : 'Dân Ca & Dân Vũ'} ({team.duration})
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <span className="block">{team.representative_name}</span>
                                  <span className="text-[10px] font-mono text-slate-500">{team.phone}</span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                  {isApproved ? (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800 uppercase">
                                      Đã Duyệt
                                    </span>
                                  ) : isRejected ? (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 uppercase">
                                      Từ Chối
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 uppercase animate-pulse">
                                      Chờ Duyệt
                                    </span>
                                  )}
                                </td>
                                <td className="px-6 py-4 text-right space-x-1.5 whitespace-nowrap">
                                  {!isApproved && (
                                    <button
                                      onClick={() => handleUpdateTeamStatus(team.id, 'approved')}
                                      className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-[10px] font-bold uppercase transition-all cursor-pointer"
                                    >
                                      Duyệt
                                    </button>
                                  )}
                                  {!isRejected && (
                                    <button
                                      onClick={() => handleUpdateTeamStatus(team.id, 'rejected')}
                                      className="px-2 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-[10px] font-bold uppercase transition-all cursor-pointer"
                                    >
                                      Từ chối
                                    </button>
                                  )}
                                  <button
                                    onClick={() => setEditingTeam(team)}
                                    className="p-1 text-slate-500 hover:text-accent transition-colors cursor-pointer inline-block"
                                    title="Sửa thông tin"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteTeam(team.id)}
                                    className="p-1 text-slate-400 hover:text-primary transition-colors cursor-pointer inline-block"
                                    title="Xóa vĩnh viễn"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={6} className="text-center py-10 text-slate-400 italic">
                              Không tìm thấy đội đăng ký nào phù hợp với bộ lọc.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  {renderPagination(teamPage, filteredTeams.length, pageSize, setTeamPage)}
                </div>
              </div>
            )}

            {/* Content for Pending Updates Tab */}
            {activeTab === 'pending_updates' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <h2 className="font-heading font-bold text-xl text-slate-900 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-amber-600" /> Danh Sách Yêu Cầu Thay Đổi Thông Tin Hồ Sơ
                    </h2>
                    <p className="text-xs text-slate-500">
                      Đội thi đã được duyệt trước đó có thể gửi cập nhật thông tin. Xem so sánh thay đổi và duyệt hoặc từ chối.
                    </p>
                  </div>
                </div>

                {/* Filters Row */}
                <div className="bg-white p-4 border border-slate-200 rounded-2xl shadow-sm">
                  <input
                    type="text"
                    placeholder="Tìm theo Tên Đội, Trưởng đoàn..."
                    value={pendingSearch}
                    onChange={(e) => {
                      setPendingSearch(e.target.value);
                      setPendingPage(1);
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:border-accent focus:outline-none"
                  />
                </div>

                {filteredPending.length === 0 ? (
                  <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400 space-y-2">
                    <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto opacity-50" />
                    <p className="font-semibold text-sm text-slate-600">Hiện tại không có yêu cầu thay đổi thông tin nào phù hợp.</p>
                  </div>
                ) : (
                  <div className="space-y-6 bg-white p-4 border border-slate-200 rounded-2xl shadow-sm">
                    <div className="space-y-6">
                      {paginatedPending.map((team) => {
                        const pending = team.pending_changes || {};
                        return (
                          <div key={team.id} className="bg-white border-2 border-amber-300 rounded-2xl p-6 shadow-md space-y-4">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-4 gap-4">
                              <div>
                                <span className="text-xs font-bold text-amber-900 bg-amber-100 border border-amber-300 px-3 py-1 rounded-full uppercase tracking-wider">
                                  Yêu Cầu Thay Đổi Thông Tin
                                </span>
                                <h3 className="font-heading font-extrabold text-xl text-slate-900 mt-2">
                                  {team.team_name} <span className="text-xs font-mono text-slate-400 font-normal">({team.id.substring(0, 8).toUpperCase()})</span>
                                </h3>
                                <p className="text-xs text-slate-500">Trưởng đoàn: {team.representative_name} | SĐT: {team.phone} | Email: {team.email}</p>
                              </div>

                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => handleApprovePendingUpdate(team.id)}
                                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                                >
                                  <CheckCircle className="w-4 h-4" /> Chấp Nhận Thay Đổi
                                </button>
                                <button
                                  onClick={() => handleRejectPendingUpdate(team.id)}
                                  className="px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs uppercase tracking-wider border border-red-200 transition-all flex items-center gap-1.5 cursor-pointer"
                                >
                                  <X className="w-4 h-4" /> Từ Chối
                                </button>
                              </div>
                            </div>

                            {/* Diff Comparison Table */}
                            <div className="overflow-x-auto">
                              <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                  <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                                    <th className="p-3 w-1/4">Trường Thông Tin</th>
                                    <th className="p-3 w-3/8 text-slate-600 bg-slate-100/50">Thông Tin Hiện Tại (Đã Duyệt Public)</th>
                                    <th className="p-3 w-3/8 text-amber-900 bg-amber-50/80 font-extrabold">Thông Tin Đề Xuất Mới</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                  {Object.keys(pending).map((key) => {
                                    const fieldLabels: Record<string, string> = {
                                      team_name: 'Tên Đội / Nhóm',
                                      organization: 'Đơn vị đại diện',
                                      member_count: 'Số lượng thành viên',
                                      representative_name: 'Trưởng đoàn',
                                      phone: 'Số điện thoại',
                                      email: 'Email',
                                      category: 'Thể loại dự thi',
                                      performance_title: 'Tên tiết mục',
                                      duration: 'Thời lượng dự kiến',
                                      description: 'Nội dung ý tưởng',
                                      technical_requirements: 'Yêu cầu kỹ thuật',
                                      audio_url: 'Link Nhạc Beat (Audio)',
                                      video_url: 'Link Video chạy thử',
                                      photo_url: 'Ảnh đại diện',
                                    };

                                    const label = fieldLabels[key] || key;
                                    const currentValue = (team as any)[key] || '—';
                                    const newValue = pending[key] || '—';

                                    if (currentValue === newValue) return null;

                                    return (
                                      <tr key={key} className="hover:bg-slate-50/50">
                                        <td className="p-3 font-bold text-slate-800">{label}</td>
                                        <td className="p-3 text-slate-600 bg-slate-50/30 break-all">{String(currentValue)}</td>
                                        <td className="p-3 text-amber-950 font-bold bg-amber-50/40 break-all">{String(newValue)}</td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {renderPagination(pendingPage, filteredPending.length, pageSize, setPendingPage)}
                  </div>
                )}
              </div>
            )}

            {/* Content for Judges Tab */}
            {activeTab === 'judges' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: list of judges */}
                <div className="lg:col-span-8 space-y-4">
                  <h2 className="font-heading font-bold text-xl text-slate-900">Danh Sách Giám Khảo</h2>

                  {/* Filters Row */}
                  <div className="bg-white p-4 border border-slate-200 rounded-2xl shadow-sm">
                    <input
                      type="text"
                      placeholder="Tìm theo Tên Giám khảo, Email..."
                      value={judgeSearch}
                      onChange={(e) => {
                        setJudgeSearch(e.target.value);
                        setJudgePage(1);
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:border-accent focus:outline-none"
                    />
                  </div>

                  <div className="glass-panel border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white p-4">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                          <tr>
                            <th className="px-6 py-4">Họ và Tên</th>
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4">Ngày tạo</th>
                            <th className="px-6 py-4 text-right">Thao tác</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs">
                          {paginatedJudges.length > 0 ? (
                            paginatedJudges.map((judge) => (
                              <tr key={judge.id} className="hover:bg-slate-50/60 transition-colors">
                                <td className="px-6 py-4 font-semibold text-slate-800">
                                  {judge.full_name}
                                </td>
                                <td className="px-6 py-4 text-slate-600 font-mono">
                                  {judge.email}
                                </td>
                                <td className="px-6 py-4 text-slate-500">
                                  {new Date(judge.created_at).toLocaleDateString('vi-VN')}
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <button
                                    onClick={() => handleDeleteJudge(judge.id)}
                                    className="p-1 text-slate-400 hover:text-primary transition-colors cursor-pointer inline-block"
                                    title="Xóa tài khoản"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={4} className="text-center py-10 text-slate-400 italic">
                                Chưa có tài khoản giám khảo nào phù hợp với bộ tìm kiếm.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                    {renderPagination(judgePage, filteredJudges.length, pageSize, setJudgePage)}
                  </div>
                </div>

                {/* Right: create judge form */}
                <div className="lg:col-span-4 space-y-4">
                  <h2 className="font-heading font-bold text-xl text-slate-900">Tạo tài khoản Giám khảo</h2>

                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                    {judgeError && (
                      <div className="p-3 bg-primary/10 border border-primary/20 text-primary text-xs rounded-xl text-center font-semibold">
                        {judgeError}
                      </div>
                    )}

                    <form onSubmit={handleCreateJudge} className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Họ và tên *</label>
                        <input
                          type="text"
                          required
                          value={newJudgeName}
                          onChange={(e) => setNewJudgeName(e.target.value)}
                          placeholder="Ví dụ: GS. NSND Lê Văn Minh"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:border-accent focus:outline-none transition-colors"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Email đăng nhập *</label>
                        <input
                          type="email"
                          required
                          value={newJudgeEmail}
                          onChange={(e) => setNewJudgeEmail(e.target.value)}
                          placeholder="giamkhao@nhipbuocvietnam.gov.vn"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:border-accent focus:outline-none transition-colors"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Mật khẩu ban đầu *</label>
                        <input
                          type="password"
                          required
                          value={newJudgePassword}
                          onChange={(e) => setNewJudgePassword(e.target.value)}
                          placeholder="Mật khẩu ít nhất 6 ký tự"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:border-accent focus:outline-none transition-colors"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isCreatingJudge}
                        className="w-full inline-flex items-center justify-center gap-1.5 py-3 bg-accent hover:bg-opacity-95 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm cursor-pointer"
                      >
                        <UserPlus className="w-4 h-4" />
                        {isCreatingJudge ? 'Đang khởi tạo...' : 'Tạo tài khoản'}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* Content for News & Posts Tab */}
            {activeTab === 'posts' && (
              <div className="space-y-6">
                {(isWritingNewPost || editingPost) ? (
                  /* Form Editor View */
                  <form onSubmit={handleSavePost} className="space-y-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-4 gap-4">
                      <div>
                        <h2 className="font-heading font-bold text-xl text-slate-900">
                          {editingPost ? 'Hiệu chỉnh bài viết' : 'Viết bài tin tức mới'}
                        </h2>
                        <p className="text-[11px] text-slate-500 mt-0.5">Soạn thảo bài viết, đính kèm banner hình ảnh và ghim nổi bật.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingPost(null);
                          setIsWritingNewPost(false);
                          // Clear fields
                          setPostTitle('');
                          setPostContent('');
                          setPostPhotoUrl('');
                          setPostStatus('draft');
                          setPostIsFeatured(false);
                          setPostAuthor('Ban Tổ Chức');
                        }}
                        className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        Quay lại danh sách
                      </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      {/* Left: Input Form & Editor */}
                      <div className="lg:col-span-7 space-y-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Tiêu đề bài viết *</label>
                          <input
                            type="text"
                            required
                            value={postTitle}
                            onChange={(e) => setPostTitle(e.target.value)}
                            placeholder="Ví dụ: Đại nhạc hội khai mạc Festival Dân Vũ Quốc Tế..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:border-accent focus:outline-none focus:bg-white transition-all"
                          />
                        </div>

                        {/* Summary (New Field) */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Tóm tắt bài viết (Không bắt buộc)</label>
                          <textarea
                            value={postSummary}
                            onChange={(e) => setPostSummary(e.target.value)}
                            placeholder="Tóm tắt ngắn gọn nội dung bài viết hiển thị ở danh sách tin..."
                            rows={2}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:border-accent focus:outline-none focus:bg-white transition-all resize-none"
                          />
                        </div>

                        {/* Grid with 3 columns (New Layout including source) */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="space-y-1 sm:col-span-1">
                            <div className="flex justify-between items-center">
                              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Link ảnh bìa (URL)</label>
                              <label className="text-[10px] font-bold text-accent hover:underline cursor-pointer flex items-center gap-1">
                                <Upload className="w-3 h-3" />
                                {isUploadingBanner ? 'Đang tải...' : 'Tải ảnh lên'}
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={handleBannerUpload}
                                  disabled={isUploadingBanner}
                                />
                              </label>
                            </div>
                            <input
                              type="text"
                              value={postPhotoUrl}
                              onChange={(e) => setPostPhotoUrl(e.target.value)}
                              placeholder="https://images.unsplash.com/photo-..."
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:border-accent focus:outline-none focus:bg-white transition-all"
                            />
                          </div>
                          <div className="space-y-1 sm:col-span-1">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Tác giả người viết</label>
                            <input
                              type="text"
                              required
                              value={postAuthor}
                              onChange={(e) => setPostAuthor(e.target.value)}
                              placeholder="Ban Tổ Chức"
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:border-accent focus:outline-none focus:bg-white transition-all"
                            />
                          </div>
                          <div className="space-y-1 sm:col-span-1">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Nguồn tin bài (Không bắt buộc)</label>
                            <input
                              type="text"
                              value={postSource}
                              onChange={(e) => setPostSource(e.target.value)}
                              placeholder="Ví dụ: Báo Nhân Dân, VOV..."
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:border-accent focus:outline-none focus:bg-white transition-all"
                            />
                          </div>
                        </div>

                        {/* Format selector option row */}
                        <div className="flex flex-wrap items-center gap-6 py-2 bg-slate-50/50 px-4 rounded-xl border border-slate-200/60">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Chế độ viết bài:</span>
                            <div className="flex bg-slate-200/60 p-0.5 rounded-lg border border-slate-200">
                              <button
                                type="button"
                                onClick={() => setPostFormat('html')}
                                className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                                  postFormat === 'html'
                                    ? 'bg-accent text-white shadow-sm'
                                    : 'text-slate-500 hover:text-slate-800'
                                }`}
                              >
                                HTML (Soạn trực quan)
                              </button>
                              <button
                                type="button"
                                onClick={() => setPostFormat('markdown')}
                                className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                                  postFormat === 'markdown'
                                    ? 'bg-slate-600 text-white shadow-sm'
                                    : 'text-slate-500 hover:text-slate-800'
                                }`}
                              >
                                Markdown
                              </button>
                              <button
                                type="button"
                                onClick={() => setPostFormat('text')}
                                className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                                  postFormat === 'text'
                                    ? 'bg-[#1E293B] text-white shadow-sm'
                                    : 'text-slate-500 hover:text-slate-800'
                                }`}
                              >
                                Văn bản thường
                              </button>
                            </div>
                          </div>

                          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={postIsFeatured}
                              onChange={(e) => setPostIsFeatured(e.target.checked)}
                              className="w-4 h-4 rounded text-accent focus:ring-accent"
                            />
                            Ghim nổi bật
                          </label>

                          <div className="flex items-center gap-2 ml-auto">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Trạng thái:</span>
                            <div className="flex bg-slate-200/60 p-0.5 rounded-lg border border-slate-200">
                              <button
                                type="button"
                                onClick={() => setPostStatus('draft')}
                                className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                                  postStatus === 'draft'
                                    ? 'bg-slate-600 text-white shadow-sm'
                                    : 'text-slate-500 hover:text-slate-800'
                                }`}
                              >
                                Lưu nháp
                              </button>
                              <button
                                type="button"
                                onClick={() => setPostStatus('published')}
                                className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                                  postStatus === 'published'
                                    ? 'bg-accent text-white shadow-sm'
                                    : 'text-slate-500 hover:text-slate-800'
                                }`}
                              >
                                Đăng bài
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Editor Toolbar & Visual/Text Container */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            {postFormat === 'html' ? 'Nội dung bài viết (HTML) *' : postFormat === 'markdown' ? 'Nội dung bài viết (Markdown) *' : 'Nội dung bài viết (Văn bản thường) *'}
                          </label>

                          <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-50 border border-slate-200 border-b-0 rounded-t-xl">
                            <button
                              type="button"
                              onClick={() => {
                                if (postFormat === 'html') handleEditorCommand('bold');
                                else if (postFormat === 'markdown') insertTag('**', '**');
                                else insertTag('<strong>', '</strong>');
                              }}
                              className="p-2 hover:bg-slate-200 rounded text-slate-700 font-bold text-xs cursor-pointer"
                              title="In đậm"
                            >
                              <Bold className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (postFormat === 'html') handleEditorCommand('italic');
                                else if (postFormat === 'markdown') insertTag('*', '*');
                                else insertTag('<em>', '</em>');
                              }}
                              className="p-2 hover:bg-slate-200 rounded text-slate-700 italic text-xs cursor-pointer"
                              title="In nghiêng"
                            >
                              <Italic className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (postFormat === 'html') handleEditorCommand('underline');
                                else insertTag('<u>', '</u>');
                              }}
                              className="p-2 hover:bg-slate-200 rounded text-slate-700 underline text-xs cursor-pointer"
                              title="Gạch chân"
                            >
                              <Underline className="w-3.5 h-3.5" />
                            </button>
                            <div className="w-px h-6 bg-slate-200 mx-1" />
                            <button
                              type="button"
                              onClick={() => {
                                if (postFormat === 'html') handleEditorCommand('formatBlock', 'H2');
                                else if (postFormat === 'markdown') insertTag('## ', '');
                                else insertTag('<h2 class="font-heading font-bold text-lg text-primary mt-5 mb-2">', '</h2>');
                              }}
                              className="px-2 py-1 hover:bg-slate-200 rounded text-slate-700 text-xs font-bold cursor-pointer"
                              title="Tiêu đề 2"
                            >
                              H2
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (postFormat === 'html') handleEditorCommand('formatBlock', 'H3');
                                else if (postFormat === 'markdown') insertTag('### ', '');
                                else insertTag('<h3 class="font-heading font-semibold text-base text-dark-obsidian mt-4 mb-2">', '</h3>');
                              }}
                              className="px-2 py-1 hover:bg-slate-200 rounded text-slate-700 text-xs font-bold cursor-pointer"
                              title="Tiêu đề 3"
                            >
                              H3
                            </button>
                            <div className="w-px h-6 bg-slate-200 mx-1" />
                            <button
                              type="button"
                              onClick={() => {
                                if (postFormat === 'html') handleEditorCommand('insertUnorderedList');
                                else if (postFormat === 'markdown') insertTag('- ', '');
                                else insertTag('<li class="list-disc ml-5 my-1">', '</li>');
                              }}
                              className="p-2 hover:bg-slate-200 rounded text-slate-700 text-xs cursor-pointer"
                              title="Danh sách hoa thị"
                            >
                              <List className="w-3.5 h-3.5" />
                            </button>

                            {/* Font Color Dropdown */}
                            <div className="w-px h-6 bg-slate-200 mx-1" />
                            <select
                              onChange={(e) => {
                                applyTextColor(e.target.value);
                                e.target.value = '';
                              }}
                              defaultValue=""
                              className="bg-slate-50 border border-slate-200 rounded px-1.5 py-1 text-[10px] font-semibold text-slate-700 focus:outline-none cursor-pointer"
                            >
                              <option value="" disabled>Màu chữ</option>
                              <option value="#EF4444" className="text-red-500 font-bold">Đỏ</option>
                              <option value="#10B981" className="text-emerald-500 font-bold">Xanh lá</option>
                              <option value="#3B82F6" className="text-blue-500 font-bold">Xanh dương</option>
                              <option value="#F59E0B" className="text-amber-500 font-bold">Vàng</option>
                              <option value="#64748B" className="text-slate-500 font-bold">Xám</option>
                              <option value="#334155" className="text-slate-800 font-bold">Đen</option>
                            </select>

                            {/* Font Size Dropdown */}
                            <select
                              onChange={(e) => {
                                applyTextSize(e.target.value);
                                e.target.value = '';
                              }}
                              defaultValue=""
                              className="bg-slate-50 border border-slate-200 rounded px-1.5 py-1 text-[10px] font-semibold text-slate-700 focus:outline-none cursor-pointer"
                            >
                              <option value="" disabled>Cỡ chữ</option>
                              <option value="11px">Nhỏ</option>
                              <option value="13px">Vừa</option>
                              <option value="16px">Lớn</option>
                              <option value="20px">Rất lớn</option>
                              <option value="24px">Khổng lồ</option>
                            </select>

                            <div className="w-px h-6 bg-slate-200 mx-1" />
                            <button
                              type="button"
                              onClick={handleInsertLink}
                              className="p-2 hover:bg-slate-200 rounded text-slate-700 text-xs cursor-pointer"
                              title="Chèn liên kết"
                            >
                              <LinkIcon className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={handleInsertImage}
                              className="p-2 hover:bg-slate-200 rounded text-slate-700 text-xs cursor-pointer"
                              title="Chèn hình ảnh từ URL"
                            >
                              <ImageIcon className="w-3.5 h-3.5" />
                            </button>
                            <div className="w-px h-6 bg-slate-200 mx-1" />
                            <label className="p-2 hover:bg-slate-200 rounded text-accent cursor-pointer flex items-center gap-1 text-xs font-semibold" title="Tải ảnh chèn vào bài">
                              <Upload className="w-3.5 h-3.5" />
                              <span>{isUploadingInline ? 'Đang tải...' : 'Tải lên ảnh'}</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleInlineUpload}
                                disabled={isUploadingInline}
                              />
                            </label>
                          </div>

                          {postFormat === 'html' ? (
                            /* Visual contentEditable Editor */
                            <div
                              ref={editorRef}
                              contentEditable
                              onPaste={handleContentEditablePaste}
                              onBlur={(e) => setPostContent(e.currentTarget.innerHTML)}
                              onInput={(e) => setPostContent(e.currentTarget.innerHTML)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-b-xl px-4 py-3 text-xs text-slate-800 focus:border-accent focus:outline-none focus:bg-white transition-all min-h-[300px] max-h-[500px] overflow-y-auto prose prose-slate prose-sm max-w-none text-left"
                              style={{ outline: 'none' }}
                            />
                          ) : (
                            /* Plain textarea for Markdown / Text mode */
                            <textarea
                              id="post-content-textarea"
                              required
                              value={postContent}
                              onChange={(e) => setPostContent(e.target.value)}
                              onPaste={handleTextareaPaste}
                              rows={12}
                              placeholder={
                                postFormat === 'markdown'
                                  ? "Nhập nội dung bài viết bằng Markdown (ví dụ: **chữ đậm**, *chữ nghiêng*, # Tiêu đề). Bạn có thể dùng thanh công cụ trên để soạn nhanh."
                                  : "Nhập nội dung văn bản thường. Bạn gõ thế nào, xuống dòng ra sao thì hệ thống sẽ hiển thị y hệt như vậy ở trang chủ. Bạn vẫn có thể định dạng màu sắc/kích thước bằng thanh công cụ trên."
                              }
                              className="w-full bg-slate-50 border border-slate-200 rounded-b-xl px-4 py-3 text-xs text-slate-800 focus:border-accent focus:outline-none focus:bg-white transition-all font-mono"
                            />
                          )}
                        </div>
                      </div>

                      {/* Right: Live Preview Panel */}
                      <div className="lg:col-span-5 space-y-4">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          <Eye className="w-4 h-4 text-slate-400" />
                          Xem trước nội dung hiển thị (Live Preview)
                        </div>

                        <div className="border border-slate-200 rounded-2xl bg-slate-50 p-5 overflow-y-auto max-h-[580px] space-y-4">
                          {/* Banner Image Preview */}
                          {postPhotoUrl ? (
                            <img
                              src={postPhotoUrl}
                              alt="Banner preview"
                              className="w-full h-44 object-cover rounded-xl shadow-sm border border-slate-200/50"
                            />
                          ) : (
                            <div className="w-full h-44 bg-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-xs border border-dashed border-slate-300">
                              Chưa có ảnh bìa
                            </div>
                          )}

                          {/* Featured badge if featured */}
                          {postIsFeatured && (
                            <span className="inline-block bg-secondary/20 border border-secondary text-secondary-dark text-[10px] font-bold px-2 py-0.5 rounded-md">
                              NỔI BẬT ★
                            </span>
                          )}

                          {/* Title */}
                          <h1 className="font-heading font-extrabold text-xl text-slate-900 leading-snug">
                            {postTitle || <span className="text-slate-400 italic">Tiêu đề bài viết...</span>}
                          </h1>

                          {/* Meta author & date */}
                          <div className="flex items-center gap-2 border-y border-slate-200/60 py-2.5 text-[10px] text-slate-500 font-medium">
                            <span className="bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-full">
                              {postAuthor || 'Ban Tổ Chức'}
                            </span>
                            <span>•</span>
                            <span>{new Date().toLocaleDateString('vi-VN')}</span>
                          </div>

                          {/* Post Summary Preview (New) */}
                          {postSummary && (
                            <div className="text-xs text-slate-500 italic border-l-2 border-slate-300 pl-3 py-0.5 my-3 text-left">
                              {postSummary}
                            </div>
                          )}

                          {/* Content Rendered safely depending on format */}
                          {postFormat === 'html' ? (
                            <div
                              className="prose prose-slate prose-sm text-xs leading-relaxed max-w-none text-slate-800 space-y-3 text-left"
                              dangerouslySetInnerHTML={{
                                __html: postContent || '<p class="text-slate-400 italic">Nhập nội dung vào ô soạn thảo bên trái để hiển thị xem trước tại đây...</p>'
                              }}
                            />
                          ) : (
                            <div
                              className="prose prose-slate prose-sm text-xs leading-relaxed max-w-none text-slate-800 space-y-3 text-left"
                              dangerouslySetInnerHTML={{
                                __html: parseMarkdownToHtml(postContent) || '<p class="text-slate-400 italic">Nhập nội dung vào ô soạn thảo bên trái để hiển thị xem trước tại đây...</p>'
                              }}
                            />
                          )}

                          {/* Post Source Preview (New) */}
                          {postSource && (
                            <div className="text-[10px] text-slate-400 font-semibold mt-4 text-right">
                              Nguồn: {postSource}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingPost(null);
                          setIsWritingNewPost(false);
                          setPostTitle('');
                          setPostContent('');
                          setPostPhotoUrl('');
                          setPostStatus('draft');
                          setPostIsFeatured(false);
                          setPostAuthor('Ban Tổ Chức');
                        }}
                        className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
                      >
                        Hủy bỏ
                      </button>
                      <button
                        type="submit"
                        disabled={isSavingPost}
                        className="inline-flex items-center gap-1.5 px-6 py-2 bg-accent hover:bg-opacity-95 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-sm disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        {isSavingPost ? 'Đang lưu...' : 'Lưu bài viết'}
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Post Listing Table View */
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 border border-slate-200 rounded-2xl shadow-sm">
                      <div className="w-full sm:flex-1">
                        <input
                          type="text"
                          placeholder="Tìm theo tiêu đề bài viết, tác giả..."
                          value={postSearch}
                          onChange={(e) => {
                            setPostSearch(e.target.value);
                            setPostPage(1);
                          }}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:border-accent focus:outline-none"
                        />
                      </div>
                      <div className="w-full sm:w-48">
                        <select
                          value={postStatusFilter}
                          onChange={(e) => {
                            setPostStatusFilter(e.target.value);
                            setPostPage(1);
                          }}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:border-accent focus:outline-none"
                        >
                          <option value="all">Tất cả bài viết</option>
                          <option value="draft">Bản nháp (Draft)</option>
                          <option value="published">Đã đăng (Published)</option>
                          <option value="featured">Đang nổi bật (Featured)</option>
                        </select>
                      </div>
                      <button
                        onClick={() => setIsWritingNewPost(true)}
                        className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-accent hover:bg-opacity-95 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm cursor-pointer whitespace-nowrap"
                      >
                        <PlusCircle className="w-4 h-4" /> Viết bài mới
                      </button>
                    </div>

                    <div className="glass-panel border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white p-4">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm border-collapse">
                          <thead className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                            <tr>
                              <th className="px-6 py-4 w-24">Hình ảnh</th>
                              <th className="px-6 py-4">Tiêu đề bài viết</th>
                              <th className="px-6 py-4">Người viết</th>
                              <th className="px-6 py-4">Ngày tạo</th>
                              <th className="px-6 py-4 text-center">Nổi bật</th>
                              <th className="px-6 py-4 text-center">Trạng thái</th>
                              <th className="px-6 py-4 text-right">Thao tác</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-xs">
                            {paginatedPosts.length > 0 ? (
                              paginatedPosts.map((post) => (
                                <tr key={post.id} className="hover:bg-slate-50/60 transition-colors">
                                  <td className="px-6 py-4">
                                    {post.photo_url ? (
                                      <img
                                        src={post.photo_url}
                                        alt="thumbnail"
                                        className="w-16 h-10 object-cover rounded-lg border border-slate-200"
                                      />
                                    ) : (
                                      <div className="w-16 h-10 bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center text-slate-400 text-[9px]">
                                        Không ảnh
                                      </div>
                                    )}
                                  </td>
                                  <td className="px-6 py-4 font-semibold text-slate-900 max-w-sm truncate">
                                    {post.title}
                                  </td>
                                  <td className="px-6 py-4 text-slate-600">
                                    {post.author}
                                  </td>
                                  <td className="px-6 py-4 text-slate-500">
                                    {new Date(post.created_at).toLocaleDateString('vi-VN')}
                                  </td>
                                  <td className="px-6 py-4 text-center">
                                    {post.is_featured ? (
                                      <span className="bg-secondary/20 border border-secondary text-secondary-dark text-[9px] font-bold px-2 py-0.5 rounded-md">
                                        NỔI BẬT ★
                                      </span>
                                    ) : (
                                      <span className="text-slate-400">-</span>
                                    )}
                                  </td>
                                  <td className="px-6 py-4 text-center">
                                    {post.status === 'published' ? (
                                      <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2.5 py-0.5 rounded-full">
                                        Đã đăng
                                      </span>
                                    ) : (
                                      <span className="bg-slate-100 text-slate-800 text-[9px] font-bold px-2.5 py-0.5 rounded-full">
                                        Bản nháp
                                      </span>
                                    )}
                                  </td>
                                  <td className="px-6 py-4 text-right space-x-2">
                                    <button
                                      onClick={() => {
                                        setEditingPost(post);
                                        setPostTitle(post.title);
                                        setPostContent(post.content);
                                        setPostPhotoUrl(post.photo_url || '');
                                        setPostStatus(post.status);
                                        setPostIsFeatured(post.is_featured);
                                        setPostAuthor(post.author || 'Ban Tổ Chức');
                                        setPostFormat(post.format || 'html');
                                        setPostSummary(post.summary || '');
                                        setPostSource(post.source || '');
                                      }}
                                      className="p-1.5 text-slate-400 hover:text-accent hover:bg-slate-100 rounded-lg transition-colors cursor-pointer inline-block"
                                      title="Chỉnh sửa bài viết"
                                    >
                                      <Edit3 className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDeletePost(post.id)}
                                      className="p-1.5 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors cursor-pointer inline-block"
                                      title="Xóa bài viết"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={7} className="text-center py-12 text-slate-400 italic">
                                  Chưa có bài viết nào phù hợp với bộ lọc tìm kiếm.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                      {renderPagination(postPage, filteredPosts.length, pageSize, setPostPage)}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Content for Rankings Tab */}
            {activeTab === 'rankings' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between print:hidden">
                  <h2 className="font-heading font-bold text-xl text-slate-900">Bảng Điểm Sơ Khảo & Xếp Hạng Đội Thi</h2>
                  <span className="text-xs text-slate-500 font-medium">Sắp xếp theo Điểm Trung Bình giảm dần</span>
                </div>

                {/* Filters Row */}
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 border border-slate-200 rounded-2xl shadow-sm print:hidden">
                  <div className="w-full sm:flex-1">
                    <input
                      type="text"
                      placeholder="Tìm theo Tên Đội, Tiết mục..."
                      value={rankSearch}
                      onChange={(e) => {
                        setRankSearch(e.target.value);
                        setRankPage(1);
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:border-accent focus:outline-none"
                    />
                  </div>
                  <div className="w-full sm:w-48">
                    <select
                      value={rankCatFilter}
                      onChange={(e) => {
                        setRankCatFilter(e.target.value);
                        setRankPage(1);
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:border-accent focus:outline-none"
                    >
                      <option value="all">Tất cả Thể loại</option>
                      <option value="dan_ca">Dân Ca</option>
                      <option value="dan_vu">Dân Vũ</option>
                      <option value="both">Cả hai</option>
                    </select>
                  </div>
                </div>

                <div className="glass-panel border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white p-4 print:border-none print:shadow-none print:bg-white print:text-black">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase tracking-wider text-slate-500 font-bold print:bg-white print:text-black print:border-b-2 print:border-black">
                        <tr>
                          <th className="px-6 py-4 text-center w-16">Xếp Hạng</th>
                          <th className="px-6 py-4">Mã số</th>
                          <th className="px-6 py-4">Tên Đội</th>
                          <th className="px-6 py-4">Tiết mục / Thể loại</th>
                          <th className="px-6 py-4 text-center">GK Đã Chấm</th>
                          <th className="px-6 py-4 text-center hidden md:table-cell print:table-cell">Chi tiết Tiêu chí (Trung bình)</th>
                          <th className="px-6 py-4 text-center font-bold text-slate-800 print:text-black">Điểm Trung Bình</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs print:divide-y print:divide-black/20">
                        {isLoadingRankings ? (
                          <tr>
                            <td colSpan={7} className="text-center py-10 text-slate-400 italic">
                              Đang tính toán bảng điểm và xếp hạng...
                            </td>
                          </tr>
                        ) : paginatedRankings.length > 0 ? (
                          paginatedRankings.map((row) => {
                            const globalRank = rankings.findIndex(r => r.id === row.id) + 1;
                            return (
                              <tr key={row.id} className="hover:bg-slate-50/60 transition-colors print:hover:bg-transparent">
                                <td className="px-6 py-4 text-center font-bold text-sm text-slate-700 print:text-black">
                                  {globalRank}
                                </td>
                                <td className="px-6 py-4 font-mono font-semibold text-slate-500 print:text-black">
                                  {row.id.substring(0, 8).toUpperCase()}
                                </td>
                                <td className="px-6 py-4">
                                  <span className="font-semibold text-slate-900 block print:text-black">{row.teamName}</span>
                                </td>
                                <td className="px-6 py-4">
                                  <span className="font-semibold block text-slate-800 print:text-black">{row.performanceTitle}</span>
                                  <span className="text-[10px] text-slate-500 block print:text-black">
                                    {row.category === 'dan_ca' ? 'Dân Ca' : row.category === 'dan_vu' ? 'Dân Vũ' : 'Dân Ca & Dân Vũ'}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-center font-semibold text-slate-700 print:text-black">
                                  {row.gradedCount} giám khảo
                                </td>
                                <td className="px-6 py-4 text-center hidden md:table-cell print:table-cell text-slate-500 font-medium">
                                  {row.gradedCount > 0 ? (
                                    <div className="flex justify-center gap-3 text-[10px]">
                                      <span title="Nội dung & Ý tưởng">Ý tưởng: {row.avgConcept}/30</span>
                                      <span title="Kỹ thuật biểu diễn">Kỹ thuật: {row.avgTechnique}/40</span>
                                      <span title="Trang phục & Đạo cụ">Trang phục: {row.avgCostume}/20</span>
                                      <span title="Hiệu ứng sân khấu">Hiệu ứng: {row.avgStage}/10</span>
                                    </div>
                                  ) : (
                                    <span className="text-slate-400 italic">Chưa có dữ liệu</span>
                                  )}
                                </td>
                                <td className="px-6 py-4 text-center font-extrabold text-sm text-primary print:text-black">
                                  {row.gradedCount > 0 ? `${row.averageScore} / 100` : 'Chưa chấm'}
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={7} className="text-center py-10 text-slate-400 italic">
                              Chưa có đội thi nào phù hợp với bộ tìm kiếm.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="print:hidden">
                    {renderPagination(rankPage, filteredRankings.length, pageSize, setRankPage)}
                  </div>
                </div>

                {/* Print only sign off */}
                <div className="hidden print:flex justify-between mt-16 text-xs text-slate-800">
                  <div className="text-center w-48">
                    <p className="font-bold">Trưởng Ban Tổ Chức</p>
                    <p className="text-[10px] text-slate-400 mt-12">(Ký và ghi rõ họ tên)</p>
                  </div>
                  <div className="text-center w-48">
                    <p className="font-bold">Đại Diện Hội Đồng Giám Khảo</p>
                    <p className="text-[10px] text-slate-400 mt-12">(Ký và ghi rõ họ tên)</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Edit Team Modal */}
      {editingTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-6 my-8">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-heading font-bold text-lg text-slate-900">Sửa thông tin hồ sơ: {editingTeam.team_name}</h3>
              <button onClick={() => setEditingTeam(null)} className="text-slate-400 hover:text-slate-900 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedTeam} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-500">Tên Đội *</label>
                  <input
                    type="text"
                    required
                    value={editingTeam.team_name}
                    onChange={(e) => setEditingTeam({ ...editingTeam, team_name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-accent text-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-500">Đơn vị đại diện</label>
                  <input
                    type="text"
                    value={editingTeam.organization || ''}
                    onChange={(e) => setEditingTeam({ ...editingTeam, organization: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-accent text-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-500">Số lượng thành viên *</label>
                  <input
                    type="text"
                    required
                    value={editingTeam.member_count}
                    onChange={(e) => setEditingTeam({ ...editingTeam, member_count: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-accent text-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-500">Trưởng đoàn đại diện *</label>
                  <input
                    type="text"
                    required
                    value={editingTeam.representative_name}
                    onChange={(e) => setEditingTeam({ ...editingTeam, representative_name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-accent text-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-500">Số điện thoại *</label>
                  <input
                    type="text"
                    required
                    value={editingTeam.phone}
                    onChange={(e) => setEditingTeam({ ...editingTeam, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-accent text-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-500">Email *</label>
                  <input
                    type="email"
                    required
                    value={editingTeam.email}
                    onChange={(e) => setEditingTeam({ ...editingTeam, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-accent text-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-500">Tên tiết mục *</label>
                  <input
                    type="text"
                    required
                    value={editingTeam.performance_title}
                    onChange={(e) => setEditingTeam({ ...editingTeam, performance_title: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-accent text-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-500">Thời lượng dự kiến *</label>
                  <input
                    type="text"
                    required
                    value={editingTeam.duration}
                    onChange={(e) => setEditingTeam({ ...editingTeam, duration: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-accent text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500">Mô tả ý tưởng</label>
                <textarea
                  value={editingTeam.description || ''}
                  onChange={(e) => setEditingTeam({ ...editingTeam, description: e.target.value })}
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-accent text-slate-800 resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500">Yêu cầu kỹ thuật</label>
                <textarea
                  value={editingTeam.technical_requirements || ''}
                  onChange={(e) => setEditingTeam({ ...editingTeam, technical_requirements: e.target.value })}
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-accent text-slate-800 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingTeam(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSavingTeam}
                  className="inline-flex items-center gap-1.5 px-6 py-2 bg-accent hover:bg-opacity-95 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  {isSavingTeam ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
}
