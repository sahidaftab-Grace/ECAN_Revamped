import { createFileRoute, Outlet, Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/site/PageHeader";
import { 
  Newspaper, 
  BookOpen, 
  Users, 
  Calendar, 
  UserCircle,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Upload,
  Image as ImageIcon,
  LogOut,
  Mail,
  ShieldAlert,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  component: AdminDashboard,
});

type Tab = "news" | "blogs" | "members" | "events" | "board" | "contact" | "complaints";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("news");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();
  const routerState = useRouterState();
  
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);

  // Determine if we are at the base /admin path
  const isRootAdmin = routerState.location.pathname === '/admin' || routerState.location.pathname === '/admin/';

  const fetchData = async () => {
    if (!isRootAdmin) return;
    
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      let endpoint = `/api/${activeTab}`;
      if (activeTab === "news" || activeTab === "blogs") endpoint = `/api/${activeTab}/all`;
      else if (activeTab === "board") endpoint = "/api/board";
      else if (activeTab === "contact") endpoint = "/api/submissions/contact";
      else if (activeTab === "complaints") endpoint = "/api/submissions/complaint";

      const res = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (res.status === 401 || res.status === 400) {
        localStorage.removeItem("token");
        navigate({ to: "/login" });
        return;
      }

      const json = await res.json();
      setData(Array.isArray(json) ? json : []);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      toast.error("Failed to connect to database");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab, isRootAdmin]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate({ to: "/login" });
    toast.success("Logged out successfully");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", file);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });
      const json = await res.json();
      if (json.url) {
        setEditingItem({ ...editingItem, [field]: json.url });
        toast.success("Image uploaded!");
      }
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleMultipleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("/api/upload/multiple", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });
      const json = await res.json();
      if (json.urls) {
        const currentImages = Array.isArray(editingItem.images) ? editingItem.images : [];
        setEditingItem({ ...editingItem, images: [...currentImages, ...json.urls] });
        toast.success(`${json.urls.length} images uploaded!`);
      }
    } catch (err) {
      toast.error("Gallery upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingItem(getEmptyItem(activeTab));
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    
    const token = localStorage.getItem("token");
    try {
      let url = `/api/${activeTab}/${id}`;
      if (activeTab === 'contact') url = `/api/submissions/contact/${id}`;
      else if (activeTab === 'complaints') url = `/api/submissions/complaint/${id}`;

      const res = await fetch(url, { 
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        toast.success("Deleted successfully");
        fetchData();
      } else {
        throw new Error("Delete failed");
      }
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const token = localStorage.getItem("token");
    try {
      const isSubmission = activeTab === 'contact' || activeTab === 'complaints';
      const method = isSubmission ? 'PATCH' : (editingItem.id ? 'PUT' : 'POST');
      
      let url = editingItem.id ? `/api/${activeTab}/${editingItem.id}` : `/api/${activeTab}`;
      if (activeTab === 'contact') url = `/api/submissions/contact/${editingItem.id}`;
      else if (activeTab === 'complaints') url = `/api/submissions/complaint/${editingItem.id}`;
      
      // Handle array conversion for images
      const payload = { ...editingItem };
      if (typeof payload.images === 'string') {
        payload.images = payload.images.split(',').map((s: string) => s.trim()).filter(Boolean);
      }
      
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        toast.success(editingItem.id ? "Updated successfully" : "Created successfully");
        setIsModalOpen(false);
        fetchData();
      } else {
        const errData = await res.json();
        throw new Error(errData.error || "Save failed");
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleBulkUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvFile) return;

    setIsSaving(true);
    const formData = new FormData();
    formData.append("file", csvFile);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("/api/members/bulk-upload", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (res.ok) {
        const json = await res.json();
        toast.success(`Successfully uploaded ${json.count} members!`);
        setIsBulkModalOpen(false);
        setCsvFile(null);
        fetchData();
      } else {
        const errData = await res.json();
        throw new Error(errData.error || "Upload failed");
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20">
      <div className="relative">
        <PageHeader
          eyebrow="Admin Portal"
          title="Content Management"
          intro="Manage your website's dynamic content from this central dashboard."
        />
        <div className="absolute top-8 right-8">
           <Button variant="outline" onClick={handleLogout} className="gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
             <LogOut size={16} /> Logout
           </Button>
        </div>
      </div>

      <div className="container-page mt-10">
        <div className="grid lg:grid-cols-[240px_1fr] gap-8">
          {/* Sidebar */}
          <aside className="space-y-2">
            <Link to="/admin" onClick={() => setActiveTab("news")}>
              <NavBtn label="News Posts" icon={Newspaper} active={isRootAdmin && activeTab === "news"} />
            </Link>
            <Link to="/admin" onClick={() => setActiveTab("blogs")}>
              <NavBtn label="Blog Posts" icon={BookOpen} active={isRootAdmin && activeTab === "blogs"} />
            </Link>
            <Link to="/admin" onClick={() => setActiveTab("members")}>
              <NavBtn label="Member Directory" icon={Users} active={isRootAdmin && activeTab === "members"} />
            </Link>
            <Link to="/admin/events">
              <NavBtn label="Events" icon={Calendar} active={routerState.location.pathname.startsWith('/admin/events')} />
            </Link>
            <Link to="/admin" onClick={() => setActiveTab("board")}>
              <NavBtn label="Board Members" icon={UserCircle} active={isRootAdmin && activeTab === "board"} />
            </Link>
            
            <div className="pt-4 mt-4 border-t border-slate-200">
               <p className="px-4 mb-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Submissions</p>
               <Link to="/admin" onClick={() => setActiveTab("contact")}>
                 <NavBtn label="Contact Inquiries" icon={Mail} active={isRootAdmin && activeTab === "contact"} />
               </Link>
               <Link to="/admin" onClick={() => setActiveTab("complaints")}>
                 <NavBtn label="Complaints" icon={ShieldAlert} active={isRootAdmin && activeTab === "complaints"} />
               </Link>
            </div>
          </aside>

          {/* Main Content */}
          <main>
            {isRootAdmin ? (
              <Card className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-subheading capitalize">{activeTab} Management</h2>
                  <div className="flex gap-3">
                    {activeTab === 'members' && (
                      <Button 
                        onClick={() => setIsBulkModalOpen(true)} 
                        variant="outline" 
                        size="sm" 
                        className="gap-2 border-slate-200 text-[var(--slate)] font-bold text-[14px]"
                      >
                        <Upload size={16} /> Bulk CSV
                      </Button>
                    )}
                    {(activeTab !== 'contact' && activeTab !== 'complaints') && (
                      <Button onClick={handleAddNew} size="sm" className="gap-2 bg-[var(--m3-primary)] hover:bg-[var(--m3-primary)]/90 font-bold text-[14px]">
                        <Plus size={16} /> Add New
                      </Button>
                    )}
                  </div>
                </div>

                {loading ? (
                  <div className="py-20 flex justify-center">
                    <Loader2 className="animate-spin text-[var(--m3-primary)]" />
                  </div>
                ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-slate-50 text-[var(--slate)] font-bold">
                      <tr>
                        {activeTab === 'contact' || activeTab === 'complaints' ? (
                          <>
                            <th className="px-4 py-3">Sender</th>
                            <th className="px-4 py-3">Subject</th>
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3">Status</th>
                          </>
                        ) : (
                          <>
                            <th className="px-4 py-3">Title / Name</th>
                            <th className="px-4 py-3">Category / Role</th>
                            <th className="px-4 py-3">Status</th>
                          </>
                        )}
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y border-t">
                      {data.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/50">
                          {activeTab === 'contact' || activeTab === 'complaints' ? (
                            <>
                              <td className="px-4 py-4">
                                <div className="font-medium text-[var(--navy)]">{item.full_name}</div>
                                <div className="text-[10px] text-slate-400">{item.email}</div>
                              </td>
                              <td className="px-4 py-4 text-[var(--slate)] max-w-[200px] truncate">
                                {item.subject}
                              </td>
                              <td className="px-4 py-4 text-[var(--slate)] whitespace-nowrap">
                                {new Date(item.created_at).toLocaleDateString()}
                              </td>
                              <td className="px-4 py-4">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  item.status === 'new' ? 'bg-blue-100 text-blue-700' : 
                                  item.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                                }`}>
                                  {item.status.toUpperCase()}
                                </span>
                              </td>
                            </>
                          ) : (
                            <>
                              <td className="px-4 py-4 font-medium text-[var(--navy)]">
                                {item.title || item.name}
                              </td>
                              <td className="px-4 py-4 text-[var(--slate)]">
                                {item.category || item.role || item.membership_type || item.tag}
                              </td>
                              <td className="px-4 py-4">
                                {activeTab === 'news' || activeTab === 'blogs' ? (
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.published ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                    {item.published ? 'PUBLISHED' : 'DRAFT'}
                                  </span>
                                ) : (
                                  <span className="text-[var(--slate)]">Active</span>
                                )}
                              </td>
                            </>
                          )}
                          <td className="px-4 py-4 text-right space-x-2 whitespace-nowrap">
                            <button 
                              onClick={() => handleEdit(item)}
                              className="p-2 text-[var(--slate)] hover:text-[var(--navy)] transition-colors"
                              title="View Details"
                            >
                              { (activeTab === 'contact' || activeTab === 'complaints') ? <BookOpen size={16} /> : <Edit size={16} /> }
                            </button>
                            <button 
                              onClick={() => handleDelete(item.id)}
                              className="p-2 text-[var(--slate)] hover:text-red-600 transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {data.length === 0 && (
                        <tr>
                          <td colSpan={activeTab === 'contact' || activeTab === 'complaints' ? 5 : 4} className="px-4 py-10 text-center text-[var(--slate)]">
                            No items found in this category.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                )}
              </Card>
            ) : (
              <Outlet />
            )}
          </main>
        </div>
      </div>

      {/* Editor Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleSave}>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                {editingItem?.id ? `Edit ${activeTab.slice(0, -1)}` : `Add New ${activeTab.slice(0, -1)}`}
              </DialogTitle>
            </DialogHeader>

            <div className="grid gap-6 py-6">
              {editingItem && (
                <div className="grid gap-4">
                  {/* View Only for Submissions */}
                  {(activeTab === 'contact' || activeTab === 'complaints') ? (
                    <div className="space-y-4">
                       <div className="grid grid-cols-2 gap-4">
                          <div>
                             <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Sender</label>
                             <p className="font-bold text-[var(--navy)]">{editingItem.full_name}</p>
                          </div>
                          <div>
                             <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Email</label>
                             <p className="font-bold text-[var(--navy)]">{editingItem.email}</p>
                          </div>
                          {editingItem.phone && (
                            <div>
                               <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Phone</label>
                               <p className="font-bold text-[var(--navy)]">{editingItem.phone}</p>
                            </div>
                          )}
                          <div>
                             <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Submitted On</label>
                             <p className="font-bold text-[var(--navy)]">{new Date(editingItem.created_at).toLocaleString()}</p>
                          </div>
                       </div>
                       <div className="pt-4 border-t">
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Subject</label>
                          <p className="font-bold text-lg text-[var(--navy)] mb-4">{editingItem.subject}</p>
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Message / Description</label>
                          <div className="mt-2 p-6 rounded-2xl bg-slate-50 border border-slate-100 whitespace-pre-wrap text-[15px] leading-relaxed text-slate-700">
                             {editingItem.message || editingItem.description}
                          </div>
                       </div>
                       
                       <div className="pt-4">
                          <label className="text-sm font-semibold mb-2 block">Update Status</label>
                          <select 
                            className="flex h-11 w-full rounded-xl border border-outline bg-surface px-4 py-2 text-sm"
                            value={editingItem.status || "new"}
                            onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value })}
                          >
                            <option value="new">New</option>
                            <option value="read">Read / Investigating</option>
                            <option value="resolved">Resolved / Archived</option>
                          </select>
                       </div>
                    </div>
                  ) : (
                    <>
                      {/* Common Fields: Title/Name */}
                      <div className="grid grid-cols-2 gap-4">
                        {(activeTab === 'news' || activeTab === 'blogs' || activeTab === 'events') && (
                          <div className="grid gap-2">
                            <label className="text-sm font-semibold">Title</label>
                            <Input 
                              value={editingItem.title || ""} 
                              onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })} 
                              required 
                            />
                          </div>
                        )}

                        {(activeTab === 'members' || activeTab === 'board') && (
                          <div className="grid gap-2">
                            <label className="text-sm font-semibold">Name</label>
                            <Input 
                              value={editingItem.name || ""} 
                              onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })} 
                              required 
                            />
                          </div>
                        )}

                        {/* Slug for News/Blogs */}
                        {(activeTab === 'news' || activeTab === 'blogs') && (
                          <div className="grid gap-2">
                            <label className="text-sm font-semibold">Slug (URL identifier)</label>
                            <Input 
                              value={editingItem.slug || ""} 
                              onChange={(e) => setEditingItem({ ...editingItem, slug: e.target.value })} 
                              placeholder="e.g. latest-news-update"
                              required 
                            />
                          </div>
                        )}
                      </div>

                      {/* Category/Role/Tag/Layout */}
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                        {activeTab === 'news' && (
                          <div className="grid gap-2">
                            <label className="text-sm font-semibold">Category</label>
                            <select 
                              className="flex h-11 w-full rounded-xl border border-outline bg-surface px-4 py-2 text-sm"
                              value={editingItem.category || "announcement"}
                              onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                            >
                              <option value="announcement">Announcement</option>
                              <option value="policy">Policy</option>
                              <option value="event">Event</option>
                              <option value="partnership">Partnership</option>
                              <option value="award">Award</option>
                            </select>
                          </div>
                        )}
                        {activeTab === 'blogs' && (
                          <div className="grid gap-2">
                            <label className="text-sm font-semibold">Category</label>
                            <select 
                              className="flex h-11 w-full rounded-xl border border-outline bg-surface px-4 py-2 text-sm"
                              value={editingItem.category || "guide"}
                              onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                            >
                              <option value="guide">Guide</option>
                              <option value="destination">Destination</option>
                              <option value="visa">Visa</option>
                              <option value="scholarship">Scholarship</option>
                              <option value="career">Career</option>
                              <option value="tips">Tips</option>
                            </select>
                          </div>
                        )}
                        {(activeTab === 'news' || activeTab === 'blogs') && (
                          <div className="grid gap-2">
                            <label className="text-sm font-semibold">Layout</label>
                            <select 
                              className="flex h-11 w-full rounded-xl border border-outline bg-surface px-4 py-2 text-sm"
                              value={editingItem.layout || "classic"}
                              onChange={(e) => setEditingItem({ ...editingItem, layout: e.target.value })}
                            >
                              <option value="classic">Classic</option>
                              <option value="hero-image">Hero Image</option>
                              <option value="split">Split</option>
                              <option value="magazine">Magazine</option>
                            </select>
                          </div>
                        )}
                        {activeTab === 'board' && (
                          <>
                            <div className="grid gap-2">
                              <label className="text-sm font-semibold">Role</label>
                              <Input value={editingItem.role || ""} onChange={(e) => setEditingItem({ ...editingItem, role: e.target.value })} required />
                            </div>
                            <div className="grid gap-2">
                              <label className="text-sm font-semibold">Category</label>
                              <select 
                                className="flex h-11 w-full rounded-xl border border-outline bg-surface px-4 py-2 text-sm"
                                value={editingItem.category || "officer"}
                                onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                              >
                                <option value="officer">Officer</option>
                                <option value="executive">Executive Member</option>
                                <option value="advisory">Advisory Board</option>
                                <option value="past-presidential">Past Presidential Council</option>
                              </select>
                            </div>
                            <div className="grid gap-2">
                              <label className="text-sm font-semibold">Term</label>
                              <Input value={editingItem.term || "current"} onChange={(e) => setEditingItem({ ...editingItem, term: e.target.value })} />
                            </div>
                          </>
                        )}

                        {activeTab === 'members' && (
                          <>
                            <div className="grid gap-2">
                              <label className="text-sm font-semibold">City</label>
                              <Input value={editingItem.city || ""} onChange={(e) => setEditingItem({ ...editingItem, city: e.target.value })} required />
                            </div>
                            <div className="grid gap-2">
                              <label className="text-sm font-semibold">Membership Type</label>
                              <Input value={editingItem.membership_type || ""} onChange={(e) => setEditingItem({ ...editingItem, membership_type: e.target.value })} />
                            </div>
                          </>
                        )}
                        
                        {/* Date/Est/Sort */}
                        {(activeTab === 'news' || activeTab === 'blogs') && (
                          <div className="grid gap-2">
                            <label className="text-sm font-semibold">Date</label>
                            <Input 
                              type="date"
                              value={editingItem.date ? editingItem.date.split('T')[0] : ""} 
                              onChange={(e) => setEditingItem({ ...editingItem, date: e.target.value })} 
                              required 
                            />
                          </div>
                        )}
                        {activeTab === 'blogs' && (
                          <div className="grid gap-2">
                            <label className="text-sm font-semibold">Read Time (min)</label>
                            <Input type="number" value={editingItem.read_time || 5} onChange={(e) => setEditingItem({ ...editingItem, read_time: parseInt(e.target.value) })} />
                          </div>
                        )}
                        {activeTab === 'board' && (
                          <div className="grid gap-2">
                            <label className="text-sm font-semibold">Sort Order</label>
                            <Input type="number" value={editingItem.sort_order || 0} onChange={(e) => setEditingItem({ ...editingItem, sort_order: parseInt(e.target.value) })} />
                          </div>
                        )}
                        {activeTab === 'members' && (
                          <div className="grid gap-2">
                            <label className="text-sm font-semibold">Est. Year</label>
                            <Input type="number" value={editingItem.est || ""} onChange={(e) => setEditingItem({ ...editingItem, est: parseInt(e.target.value) })} />
                          </div>
                        )}
                      </div>

                      {/* Member Contact Details */}
                      {activeTab === 'members' && (
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <label className="text-sm font-semibold">Email</label>
                            <Input type="email" value={editingItem.email || ""} onChange={(e) => setEditingItem({ ...editingItem, email: e.target.value })} />
                          </div>
                          <div className="grid gap-2">
                            <label className="text-sm font-semibold">Phone</label>
                            <Input value={editingItem.phone || ""} onChange={(e) => setEditingItem({ ...editingItem, phone: e.target.value })} />
                          </div>
                          <div className="grid gap-2">
                            <label className="text-sm font-semibold">Website</label>
                            <Input value={editingItem.website || ""} onChange={(e) => setEditingItem({ ...editingItem, website: e.target.value })} />
                          </div>
                          <div className="grid gap-2">
                            <label className="text-sm font-semibold">Address</label>
                            <Input value={editingItem.address || ""} onChange={(e) => setEditingItem({ ...editingItem, address: e.target.value })} />
                          </div>
                        </div>
                      )}

                      {/* News/Blogs Author & Meta */}
                      {(activeTab === 'news' || activeTab === 'blogs') && (
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <label className="text-sm font-semibold">Author</label>
                            <Input value={editingItem.author || ""} onChange={(e) => setEditingItem({ ...editingItem, author: e.target.value })} />
                          </div>
                          <div className="grid gap-2">
                            <label className="text-sm font-semibold">Cover Image</label>
                            <div className="flex gap-2">
                              <Input 
                                value={editingItem.cover_image || ""} 
                                onChange={(e) => setEditingItem({ ...editingItem, cover_image: e.target.value })} 
                                placeholder="URL or upload →" 
                              />
                              <label className="flex h-11 w-11 items-center justify-center rounded-xl border border-outline bg-surface cursor-pointer hover:bg-slate-50 transition-colors">
                                <Upload size={18} className={isUploading ? "animate-bounce" : ""} />
                                <input 
                                  type="file" 
                                  className="hidden" 
                                  accept="image/*" 
                                  onChange={(e) => handleFileUpload(e, 'cover_image')} 
                                />
                              </label>
                            </div>
                            {editingItem.cover_image && (
                              <img 
                                src={editingItem.cover_image} 
                                className="mt-2 h-20 w-32 object-cover rounded-lg border" 
                                alt="Preview" 
                              />
                            )}
                          </div>
                        </div>
                      )}

                      {/* Media URLs */}
                      {(activeTab === 'board' || activeTab === 'members') && (
                        <div className="grid gap-2">
                          <label className="text-sm font-semibold">{activeTab === 'members' ? 'Logo' : 'Portrait/Featured Image'}</label>
                          <div className="flex gap-2">
                            <Input 
                              value={activeTab === 'members' ? (editingItem.logo_url || "") : (editingItem.image_url || "")} 
                              onChange={(e) => setEditingItem({ ...editingItem, [activeTab === 'members' ? 'logo_url' : 'image_url']: e.target.value })} 
                              placeholder="URL or upload →"
                            />
                            <label className="flex h-11 w-11 items-center justify-center rounded-xl border border-outline bg-surface cursor-pointer hover:bg-slate-50 transition-colors">
                              <Upload size={18} className={isUploading ? "animate-bounce" : ""} />
                              <input 
                                type="file" 
                                className="hidden" 
                                accept="image/*" 
                                onChange={(e) => handleFileUpload(e, activeTab === 'members' ? 'logo_url' : 'image_url')} 
                              />
                            </label>
                          </div>
                          {(editingItem.logo_url || editingItem.image_url) && (
                            <img 
                              src={editingItem.logo_url || editingItem.image_url} 
                              className="mt-2 h-20 w-20 object-contain rounded-lg border" 
                              alt="Preview" 
                            />
                          )}
                        </div>
                      )}

                      {/* Gallery Images for News/Blogs */}
                      {(activeTab === 'news' || activeTab === 'blogs') && (
                        <div className="grid gap-2">
                          <label className="text-sm font-semibold flex justify-between">
                            Gallery Images 
                            <span className="text-[10px] text-slate-400 font-normal">Comma separated or upload multiple</span>
                          </label>
                          <div className="flex gap-2">
                            <Input 
                              value={Array.isArray(editingItem.images) ? editingItem.images.join(', ') : editingItem.images || ""} 
                              onChange={(e) => setEditingItem({ ...editingItem, images: e.target.value })} 
                            />
                            <label className="flex h-11 w-11 items-center justify-center rounded-xl border border-outline bg-surface cursor-pointer hover:bg-slate-50 transition-colors">
                              <Plus size={18} className={isUploading ? "animate-pulse" : ""} />
                              <input 
                                type="file" 
                                className="hidden" 
                                accept="image/*" 
                                multiple 
                                onChange={handleMultipleUpload} 
                              />
                            </label>
                          </div>
                          {Array.isArray(editingItem.images) && editingItem.images.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {editingItem.images.map((img: string, idx: number) => (
                                <div key={idx} className="relative group">
                                  <img src={img} className="h-14 w-20 object-cover rounded border" alt="" />
                                  <button 
                                    type="button"
                                    onClick={() => setEditingItem({...editingItem, images: editingItem.images.filter((_: any, i: number) => i !== idx)})}
                                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <X size={10} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Content & Descriptions */}
                      {(activeTab === 'news' || activeTab === 'blogs') && (
                        <>
                          <div className="grid gap-2">
                            <label className="text-sm font-semibold">Excerpt (Short Summary)</label>
                            <Textarea 
                              value={editingItem.excerpt || ""} 
                              onChange={(e) => setEditingItem({ ...editingItem, excerpt: e.target.value })} 
                            />
                          </div>
                          <div className="grid gap-2">
                            <label className="text-sm font-semibold">Content (Markdown/Text)</label>
                            <Textarea 
                              className="min-h-[250px]"
                              value={editingItem.content || ""} 
                              onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })} 
                            />
                          </div>
                        </>
                      )}

                      {/* Members Specific */}
                      {activeTab === 'members' && (
                        <div className="grid gap-2">
                          <label className="text-sm font-semibold">Focus Countries</label>
                          <Input value={editingItem.focus || ""} onChange={(e) => setEditingItem({ ...editingItem, focus: e.target.value })} />
                        </div>
                      )}

                      {/* Published Checkbox */}
                      {(activeTab === 'news' || activeTab === 'blogs' || activeTab === 'members') && (
                        <div className="flex items-center gap-2 mt-2">
                          <Checkbox 
                            id="published" 
                            checked={editingItem.published} 
                            onCheckedChange={(checked) => setEditingItem({ ...editingItem, published: !!checked })} 
                          />
                          <label htmlFor="published" className="text-sm font-semibold cursor-pointer">Published (Visible on site)</label>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            <DialogFooter className="border-t pt-6">
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isSaving} className="bg-[var(--m3-primary)] hover:bg-[var(--m3-primary)]/90 min-w-[140px]">
                {isSaving ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Bulk Upload Modal */}
      <Dialog open={isBulkModalOpen} onOpenChange={setIsBulkModalOpen}>
        <DialogContent className="max-w-md">
          <form onSubmit={handleBulkUpload}>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Bulk Upload Members</DialogTitle>
            </DialogHeader>
            <div className="py-8 text-center">
               <div className="mx-auto w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-[var(--primary)] mb-6 border border-slate-100">
                  <Upload size={32} />
               </div>
               <h3 className="text-lg font-bold text-[var(--navy)]">Select CSV File</h3>
               <p className="text-sm text-[var(--slate)] mt-2 mb-8">
                 Ensure your CSV has columns for: <br/> 
                 <span className="font-mono text-xs text-[var(--primary)] bg-slate-50 px-2 py-1 rounded-md inline-block mt-2">
                   name, city, focus, email, phone...
                 </span>
               </p>

               <div className="mb-8">
                  <a 
                    href="/api/members/sample-csv" 
                    download 
                    className="inline-flex items-center gap-2 text-[12px] font-bold text-[var(--primary)] hover:underline"
                  >
                    <Download size={14} /> Download Sample CSV Template
                  </a>
               </div>
               
               <input 
                 type="file" 
                 accept=".csv" 
                 onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                 className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--primary)]/10 file:text-[var(--primary)] hover:file:bg-[var(--primary)]/20 cursor-pointer"
               />
            </div>
            <DialogFooter className="border-t pt-6">
              <Button type="button" variant="ghost" onClick={() => setIsBulkModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={!csvFile || isSaving} className="bg-[var(--m3-primary)]">
                {isSaving ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
                Process CSV
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function NavBtn({ label, icon: Icon, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-body-sm font-medium transition-all ${
        active 
          ? "bg-[var(--m3-primary)] text-white shadow-md shadow-cyan-900/10" 
          : "text-[var(--slate)] hover:bg-white hover:text-[var(--navy)]"
      }`}
    >
      <Icon size={18} />
      {label}
    </button>
  );
}

function getEmptyItem(tab: Tab) {
  const common = { id: null };
  switch (tab) {
    case 'news':
      return { ...common, slug: '', title: '', excerpt: '', content: '', author: 'ECAN Secretariat', category: 'announcement', date: new Date().toISOString(), published: false, layout: 'classic', cover_image: '', images: [] };
    case 'blogs':
      return { ...common, slug: '', title: '', excerpt: '', content: '', author: 'ECAN Editorial', category: 'guide', date: new Date().toISOString(), published: false, read_time: 5, layout: 'classic', cover_image: '', images: [] };
    case 'members':
      return { ...common, name: '', city: '', focus: '', est: new Date().getFullYear(), email: '', phone: '', website: '', address: '', membership_type: 'Full Member', logo_url: '', published: true };
    case 'events':
      return { ...common, title: '', event_type: 'general', status: 'upcoming', starts_at: '', ends_at: '', location: '', description: '', is_featured: false };
    case 'board':
      return { ...common, name: '', role: '', term: 'current', image_url: '', category: 'officer', sort_order: 0 };
    default:
      return { ...common };
  }
}
