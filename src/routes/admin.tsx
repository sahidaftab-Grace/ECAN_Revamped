import { createFileRoute, Outlet, Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
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
  Download,
  ClipboardCheck,
  Home,
  BarChart3,
  Sparkles,
  History,
  MapPin
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

type Tab = "home" | "homeStats" | "homePillars" | "aboutPage" | "contactPage" | "news" | "blogs" | "members" | "events" | "board" | "pastBoard" | "branchBoard" | "contact" | "complaints" | "applications";

const SUBMISSION_ENDPOINTS: Partial<Record<Tab, string>> = {
  contact: "/api/submissions/contact",
  complaints: "/api/submissions/complaint",
  applications: "/api/submissions/membership",
};

const TAB_TITLES: Record<Tab, string> = {
  home: "Home Hero",
  homeStats: "Home Stats",
  homePillars: "Home Pillars",
  aboutPage: "About Page",
  contactPage: "Contact Page",
  news: "News Posts",
  blogs: "Blog Posts",
  members: "Member Directory",
  events: "Events",
  board: "Board Members",
  pastBoard: "Past Board Members",
  branchBoard: "Branch Board",
  contact: "Contact Inquiries",
  complaints: "Complaints",
  applications: "Membership Applications",
};

type BoardCategoryFilter = "all" | "officer" | "executive" | "advisory" | "past-presidential";

const BOARD_CATEGORY_LABELS: Record<Exclude<BoardCategoryFilter, "all">, string> = {
  officer: "Executive Officers",
  executive: "Executive Members",
  advisory: "Advisory Board",
  "past-presidential": "Past Presidential Council",
};

const BOARD_CATEGORY_OPTIONS: { value: BoardCategoryFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "officer", label: BOARD_CATEGORY_LABELS.officer },
  { value: "executive", label: BOARD_CATEGORY_LABELS.executive },
  { value: "advisory", label: BOARD_CATEGORY_LABELS.advisory },
  { value: "past-presidential", label: BOARD_CATEGORY_LABELS["past-presidential"] },
];

function isSubmissionTab(tab: Tab) {
  return tab === "contact" || tab === "complaints" || tab === "applications";
}

function isHomeContentTab(tab: Tab) {
  return tab === "home" || tab === "homeStats" || tab === "homePillars" || tab === "aboutPage" || tab === "contactPage";
}

function getCollectionEndpoint(tab: Tab) {
  if (tab === "home") return "/api/home-content/home-hero";
  if (tab === "homeStats") return "/api/home-content/home-stats";
  if (tab === "homePillars") return "/api/home-content/home-pillars";
  if (tab === "aboutPage") return "/api/home-content/about-page";
  if (tab === "contactPage") return "/api/home-content/contact-page";
  if (tab === "news" || tab === "blogs") return `/api/${tab}/all`;
  if (tab === "board") return "/api/board";
  if (tab === "pastBoard") return "/api/past-board";
  if (tab === "branchBoard") return "/api/branch-board";
  return SUBMISSION_ENDPOINTS[tab] || `/api/${tab}`;
}

function getMutationEndpoint(tab: Tab) {
  if (tab === "news") return "/api/news";
  if (tab === "blogs") return "/api/blogs";
  return getCollectionEndpoint(tab);
}

async function getResponseError(res: Response, fallback: string) {
  const contentType = res.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const body = await res.json().catch(() => null);
    if (body && typeof body.error === "string") return body.error;
  }

  const message = await res.text().catch(() => "");
  return message.trim() || fallback;
}

function normalizeCollection(tab: Tab, value: unknown) {
  if (tab === "home" && value && typeof value === "object" && "data" in value) {
    const payload = (value as { data?: Record<string, unknown>; section?: string }).data || {};
    return [{ id: "home-hero", section: "home-hero", ...payload }];
  }

  if (tab === "homeStats" && value && typeof value === "object" && "data" in value) {
    const payload = (value as { data?: Record<string, unknown>; section?: string }).data || {};
    return [{ id: "home-stats", section: "home-stats", title: "Homepage Statistics", ...payload }];
  }

  if (tab === "homePillars" && value && typeof value === "object" && "data" in value) {
    const payload = (value as { data?: Record<string, unknown>; section?: string }).data || {};
    return [{ id: "home-pillars", section: "home-pillars", title: "Four Pillars of Excellence", ...payload }];
  }

  if (tab === "contactPage" && value && typeof value === "object" && "data" in value) {
    const payload = (value as { data?: Record<string, unknown>; section?: string }).data || {};
    return [{ id: "contact-page", section: "contact-page", title: "Contact Page", ...payload }];
  }

  if (tab === "aboutPage" && value && typeof value === "object" && "data" in value) {
    const payload = (value as { data?: Record<string, unknown>; section?: string }).data || {};
    return [{ id: "about-page", section: "about-page", title: "About Page", ...payload }];
  }

  if (tab === "events" && value && typeof value === "object" && "data" in value) {
    const eventData = (value as { data?: unknown }).data;
    return Array.isArray(eventData) ? eventData : [];
  }

  if (!Array.isArray(value)) return [];

  if (tab === "applications") {
    return value.filter((item) => item && typeof item === "object" && "company_name" in item);
  }

  if (tab === "contact" || tab === "complaints") {
    return value.filter((item) => item && typeof item === "object" && ("full_name" in item || "email" in item));
  }

  return value;
}

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("news");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [boardCategoryFilter, setBoardCategoryFilter] = useState<BoardCategoryFilter>("all");
  const [pastBoardTermFilter, setPastBoardTermFilter] = useState("all");
  const [branchBoardFilter, setBranchBoardFilter] = useState("all");
  const [imageLibrary, setImageLibrary] = useState<any[]>([]);
  const [isImageLibraryOpen, setIsImageLibraryOpen] = useState(false);
  const [imageFieldTarget, setImageFieldTarget] = useState("image_url");
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const navigate = useNavigate();
  const routerState = useRouterState();
  const activeTabRef = useRef(activeTab);
  const fetchRequestRef = useRef(0);
  const fetchAbortRef = useRef<AbortController | null>(null);
  
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const handleTabChange = (tab: Tab) => {
    if (tab === activeTabRef.current) return;

    activeTabRef.current = tab;
    fetchAbortRef.current?.abort();
    fetchRequestRef.current += 1;
    setData([]);
    setLoading(true);
    setActiveTab(tab);
  };

  // Determine if we are at the base /admin path
  const isRootAdmin = routerState.location.pathname === '/admin' || routerState.location.pathname === '/admin/';

  const fetchData = async (tab: Tab = activeTab) => {
    if (!isRootAdmin) return;
    
    const requestId = ++fetchRequestRef.current;
    fetchAbortRef.current?.abort();
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 8000);
    fetchAbortRef.current = controller;
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const endpoint = getCollectionEndpoint(tab);

      const res = await fetch(endpoint, {
        signal: controller.signal,
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
      if (requestId !== fetchRequestRef.current || tab !== activeTabRef.current) return;
      setData(normalizeCollection(tab, json));
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      if (requestId !== fetchRequestRef.current || tab !== activeTabRef.current) return;
      console.error("Failed to fetch data:", err);
      toast.error("Failed to connect to database");
    } finally {
      window.clearTimeout(timeoutId);
      if (fetchAbortRef.current === controller) {
        fetchAbortRef.current = null;
      }
      if (requestId === fetchRequestRef.current && tab === activeTabRef.current && !controller.signal.aborted) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    activeTabRef.current = activeTab;
    fetchData(activeTab);
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

  const fetchImageLibrary = async () => {
    setIsLoadingImages(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("/api/upload/images", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error("Failed to load images");
      const json = await res.json();
      setImageLibrary(Array.isArray(json) ? json : []);
    } catch (err) {
      toast.error("Could not load uploaded images");
    } finally {
      setIsLoadingImages(false);
    }
  };

  const openImageLibrary = (field: string) => {
    setImageFieldTarget(field);
    setIsImageLibraryOpen(true);
    fetchImageLibrary();
  };

  const selectImageFromLibrary = (url: string) => {
    setEditingItem({ ...editingItem, [imageFieldTarget]: url });
    setIsImageLibraryOpen(false);
    toast.success("Photo selected");
  };

  const handleEdit = (item: any) => {
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    const item = getEmptyItem(activeTab);
    if (activeTab === "board" && boardCategoryFilter !== "all") {
      item.category = boardCategoryFilter;
    }
    if (activeTab === "pastBoard" && pastBoardTermFilter !== "all") {
      item.term = pastBoardTermFilter;
      const matchingTerm = data.find((row) => row.term === pastBoardTermFilter);
      item.term_sort_order = matchingTerm?.term_sort_order ?? 0;
    }
    if (activeTab === "branchBoard" && branchBoardFilter !== "all") {
      const matchingBranch = data.find((row) => row.branch_slug === branchBoardFilter);
      item.branch_slug = branchBoardFilter;
      item.branch_name = matchingBranch?.branch_name || "";
      item.province = matchingBranch?.province || "";
      item.color = matchingBranch?.color || "from-slate-700 to-slate-900";
      item.accent = matchingBranch?.accent || "bg-slate-500";
      item.contact = matchingBranch?.contact || "";
      item.branch_sort_order = matchingBranch?.branch_sort_order ?? 0;
    }
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const updateHomeStat = (index: number, patch: Record<string, unknown>) => {
    const stats = Array.isArray(editingItem.stats) ? [...editingItem.stats] : getEmptyItem("homeStats").stats;
    stats[index] = { ...stats[index], ...patch };
    setEditingItem({ ...editingItem, stats });
  };

  const updateHomePillar = (index: number, patch: Record<string, unknown>) => {
    const pillars = Array.isArray(editingItem.pillars) ? [...editingItem.pillars] : getEmptyItem("homePillars").pillars;
    pillars[index] = { ...pillars[index], ...patch };
    setEditingItem({ ...editingItem, pillars });
  };

  const updateAboutStat = (index: number, patch: Record<string, unknown>) => {
    const stats = Array.isArray(editingItem.stats) ? [...editingItem.stats] : getEmptyItem("aboutPage").stats;
    stats[index] = { ...stats[index], ...patch };
    setEditingItem({ ...editingItem, stats });
  };

  const updateAboutValue = (index: number, patch: Record<string, unknown>) => {
    const values = Array.isArray(editingItem.values) ? [...editingItem.values] : getEmptyItem("aboutPage").values;
    values[index] = { ...values[index], ...patch };
    setEditingItem({ ...editingItem, values });
  };

  const updateAboutMilestone = (index: number, patch: Record<string, unknown>) => {
    const milestones = Array.isArray(editingItem.milestones) ? [...editingItem.milestones] : getEmptyItem("aboutPage").milestones;
    milestones[index] = { ...milestones[index], ...patch };
    setEditingItem({ ...editingItem, milestones });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    
    const token = localStorage.getItem("token");
    try {
      const baseEndpoint = getMutationEndpoint(activeTab);
      const url = `${baseEndpoint}/${id}`;

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
        throw new Error(await getResponseError(res, "Delete failed"));
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  const handleDeletePastBoardTerm = async (term: string) => {
    const termItems = data.filter((item) => item.term === term);
    if (!termItems.length) return;
    if (!confirm(`Delete the entire ${term} past board term and all ${termItems.length} members inside it?`)) return;

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`/api/past-board/term/${encodeURIComponent(term)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error("Delete term failed");
      const json = await res.json();
      toast.success(`Deleted ${term} term (${json.deleted || termItems.length} members)`);
      setPastBoardTermFilter("all");
      fetchData();
    } catch (err) {
      toast.error("Failed to delete term");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const token = localStorage.getItem("token");
    try {
      const method = isHomeContentTab(activeTab) ? 'PUT' : (isSubmissionTab(activeTab) ? 'PATCH' : (editingItem.id ? 'PUT' : 'POST'));
      
      const baseEndpoint = getMutationEndpoint(activeTab);
      const url = isHomeContentTab(activeTab) ? baseEndpoint : (editingItem.id ? `${baseEndpoint}/${editingItem.id}` : baseEndpoint);
      
      // Handle array conversion for images
      const payload = { ...editingItem };
      if (typeof payload.images === 'string') {
        payload.images = payload.images.split(',').map((s: string) => s.trim()).filter(Boolean);
      }
      if (typeof payload.trust_badges === 'string') {
        payload.trust_badges = payload.trust_badges.split('\n').map((s: string) => s.trim()).filter(Boolean);
      }
      delete payload.id;
      delete payload.section;
      
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(isHomeContentTab(activeTab) ? { data: payload } : payload)
      });

      if (res.ok) {
        toast.success(editingItem.id ? "Updated successfully" : "Created successfully");
        setIsModalOpen(false);
        fetchData();
      } else {
        throw new Error(await getResponseError(res, "Save failed"));
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

  const visibleData = activeTab === "board" && boardCategoryFilter !== "all"
    ? data.filter((item) => (item.category || "officer") === boardCategoryFilter)
    : activeTab === "pastBoard" && pastBoardTermFilter !== "all"
      ? data.filter((item) => item.term === pastBoardTermFilter)
    : activeTab === "branchBoard" && branchBoardFilter !== "all"
      ? data.filter((item) => item.branch_slug === branchBoardFilter)
    : data;

  const pastBoardTerms = Array.from(
    new Map(
      data
        .filter((item) => item.term)
        .map((item) => [item.term, { term: item.term, term_sort_order: item.term_sort_order ?? 0 }])
    ).values()
  ).sort((a, b) => (a.term_sort_order ?? 0) - (b.term_sort_order ?? 0));

  const branchBoardBranches = Array.from(
    new Map(
      data
        .filter((item) => item.branch_slug)
        .map((item) => [
          item.branch_slug,
          {
            branch_slug: item.branch_slug,
            branch_name: item.branch_name || item.branch_slug,
            branch_sort_order: item.branch_sort_order ?? 0,
          },
        ])
    ).values()
  ).sort((a, b) => (a.branch_sort_order ?? 0) - (b.branch_sort_order ?? 0));

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
            <NavBtn label="Home Hero" icon={Home} active={isRootAdmin && activeTab === "home"} onClick={() => handleTabChange("home")} />
            <NavBtn label="Home Stats" icon={BarChart3} active={isRootAdmin && activeTab === "homeStats"} onClick={() => handleTabChange("homeStats")} />
            <NavBtn label="Home Pillars" icon={Sparkles} active={isRootAdmin && activeTab === "homePillars"} onClick={() => handleTabChange("homePillars")} />
            <NavBtn label="About Page" icon={BookOpen} active={isRootAdmin && activeTab === "aboutPage"} onClick={() => handleTabChange("aboutPage")} />
            <NavBtn label="Contact Page" icon={Mail} active={isRootAdmin && activeTab === "contactPage"} onClick={() => handleTabChange("contactPage")} />
            <NavBtn label="News Posts" icon={Newspaper} active={isRootAdmin && activeTab === "news"} onClick={() => handleTabChange("news")} />
            <NavBtn label="Blog Posts" icon={BookOpen} active={isRootAdmin && activeTab === "blogs"} onClick={() => handleTabChange("blogs")} />
            <NavBtn label="Member Directory" icon={Users} active={isRootAdmin && activeTab === "members"} onClick={() => handleTabChange("members")} />
            <NavBtn label="Events" icon={Calendar} active={isRootAdmin && activeTab === "events"} onClick={() => handleTabChange("events")} />
            <NavBtn label="Board Members" icon={UserCircle} active={isRootAdmin && activeTab === "board"} onClick={() => handleTabChange("board")} />
            <NavBtn label="Past Board Members" icon={History} active={isRootAdmin && activeTab === "pastBoard"} onClick={() => handleTabChange("pastBoard")} />
            <NavBtn label="Branch Board" icon={MapPin} active={isRootAdmin && activeTab === "branchBoard"} onClick={() => handleTabChange("branchBoard")} />
            
            <div className="pt-4 mt-4 border-t border-slate-200">
               <p className="px-4 mb-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Submissions</p>
               <NavBtn label="Contact Inquiries" icon={Mail} active={isRootAdmin && activeTab === "contact"} onClick={() => handleTabChange("contact")} />
               <NavBtn label="Complaints" icon={ShieldAlert} active={isRootAdmin && activeTab === "complaints"} onClick={() => handleTabChange("complaints")} />
               <NavBtn label="Membership Applications" icon={ClipboardCheck} active={isRootAdmin && activeTab === "applications"} onClick={() => handleTabChange("applications")} />
            </div>
          </aside>

          {/* Main Content */}
          <main>
            {isRootAdmin ? (
              <Card className="p-6">
	                <div className="flex justify-between items-center mb-6">
	                  <h2 className="text-subheading">{TAB_TITLES[activeTab]}</h2>
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
                    {!isSubmissionTab(activeTab) && !isHomeContentTab(activeTab) && (
                      <Button onClick={handleAddNew} size="sm" className="gap-2 bg-[var(--m3-primary)] hover:bg-[var(--m3-primary)]/90 font-bold text-[14px]">
                        <Plus size={16} /> Add New
                      </Button>
	                    )}
	                  </div>
	                </div>

	                {activeTab === "board" && (
	                  <div className="mb-6 flex flex-wrap gap-2">
	                    {BOARD_CATEGORY_OPTIONS.map((option) => {
	                      const count = option.value === "all"
	                        ? data.length
	                        : data.filter((item) => (item.category || "officer") === option.value).length;
	                      return (
	                        <button
	                          key={option.value}
	                          type="button"
	                          onClick={() => setBoardCategoryFilter(option.value)}
	                          className={`rounded-full border px-4 py-2 text-[13px] font-bold transition-colors ${
	                            boardCategoryFilter === option.value
	                              ? "border-[var(--m3-primary)] bg-[var(--m3-primary)] text-white"
	                              : "border-slate-200 bg-white text-[var(--slate)] hover:border-[var(--m3-primary)] hover:text-[var(--m3-primary)]"
	                          }`}
	                        >
	                          {option.label} <span className="opacity-75">({count})</span>
	                        </button>
	                      );
	                    })}
	                  </div>
	                )}

		                {activeTab === "pastBoard" && (
		                  <div className="mb-6 space-y-3">
		                    <div className="flex flex-wrap gap-2">
		                      <button
		                        type="button"
		                        onClick={() => setPastBoardTermFilter("all")}
		                        className={`rounded-full border px-4 py-2 text-[13px] font-bold transition-colors ${
		                          pastBoardTermFilter === "all"
		                            ? "border-[var(--m3-primary)] bg-[var(--m3-primary)] text-white"
		                            : "border-slate-200 bg-white text-[var(--slate)] hover:border-[var(--m3-primary)] hover:text-[var(--m3-primary)]"
		                        }`}
		                      >
		                        All Terms <span className="opacity-75">({data.length})</span>
		                      </button>
		                      {pastBoardTerms.map((term) => {
		                        const count = data.filter((item) => item.term === term.term).length;
		                        return (
		                          <button
		                            key={term.term}
		                            type="button"
		                            onClick={() => setPastBoardTermFilter(term.term)}
		                            className={`rounded-full border px-4 py-2 text-[13px] font-bold transition-colors ${
		                              pastBoardTermFilter === term.term
		                                ? "border-[var(--m3-primary)] bg-[var(--m3-primary)] text-white"
		                                : "border-slate-200 bg-white text-[var(--slate)] hover:border-[var(--m3-primary)] hover:text-[var(--m3-primary)]"
		                            }`}
		                          >
		                            {term.term} <span className="opacity-75">({count})</span>
		                          </button>
		                        );
		                      })}
		                    </div>
		                    {pastBoardTermFilter !== "all" && (
		                      <Button
		                        type="button"
		                        variant="outline"
		                        size="sm"
		                        onClick={() => handleDeletePastBoardTerm(pastBoardTermFilter)}
		                        className="gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
		                      >
		                        <Trash2 size={15} /> Delete {pastBoardTermFilter} Term
		                      </Button>
		                    )}
		                  </div>
		                )}

	                {activeTab === "branchBoard" && (
	                  <div className="mb-6 flex flex-wrap gap-2">
	                    <button
	                      type="button"
	                      onClick={() => setBranchBoardFilter("all")}
	                      className={`rounded-full border px-4 py-2 text-[13px] font-bold transition-colors ${
	                        branchBoardFilter === "all"
	                          ? "border-[var(--m3-primary)] bg-[var(--m3-primary)] text-white"
	                          : "border-slate-200 bg-white text-[var(--slate)] hover:border-[var(--m3-primary)] hover:text-[var(--m3-primary)]"
	                      }`}
	                    >
	                      All Branches <span className="opacity-75">({data.length})</span>
	                    </button>
	                    {branchBoardBranches.map((branch) => {
	                      const count = data.filter((item) => item.branch_slug === branch.branch_slug).length;
	                      return (
	                        <button
	                          key={branch.branch_slug}
	                          type="button"
	                          onClick={() => setBranchBoardFilter(branch.branch_slug)}
	                          className={`rounded-full border px-4 py-2 text-[13px] font-bold transition-colors ${
	                            branchBoardFilter === branch.branch_slug
	                              ? "border-[var(--m3-primary)] bg-[var(--m3-primary)] text-white"
	                              : "border-slate-200 bg-white text-[var(--slate)] hover:border-[var(--m3-primary)] hover:text-[var(--m3-primary)]"
	                          }`}
	                        >
	                          {branch.branch_name} <span className="opacity-75">({count})</span>
	                        </button>
	                      );
	                    })}
	                  </div>
	                )}

	                {loading ? (
                  <div className="py-20 flex justify-center">
                    <Loader2 className="animate-spin text-[var(--m3-primary)]" />
                  </div>
                ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-slate-50 text-[var(--slate)] font-bold">
                      <tr>
                        {activeTab === 'contact' || activeTab === 'complaints' || activeTab === 'applications' ? (
                          <>
                            <th className="px-4 py-3">{activeTab === 'applications' ? 'Company' : 'Sender'}</th>
                            <th className="px-4 py-3">{activeTab === 'applications' ? 'Membership / Focus' : 'Subject'}</th>
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
	                      {visibleData.map((item) => (
	                        <tr key={item.id} className="hover:bg-slate-50/50">
                          {activeTab === 'contact' || activeTab === 'complaints' || activeTab === 'applications' ? (
                            <>
                              <td className="px-4 py-4">
                                <div className="font-medium text-[var(--navy)]">{activeTab === 'applications' ? item.company_name : item.full_name}</div>
                                <div className="text-[10px] text-slate-400">{activeTab === 'applications' ? item.company_email : item.email}</div>
                              </td>
                              <td className="px-4 py-4 text-[var(--slate)] max-w-[200px] truncate">
                                {activeTab === 'applications' ? `${item.membership_type} · ${item.main_focus_countries}` : item.subject}
                              </td>
                              <td className="px-4 py-4 text-[var(--slate)] whitespace-nowrap">
                                {item.created_at ? new Date(item.created_at).toLocaleDateString() : '-'}
                              </td>
                              <td className="px-4 py-4">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  item.status === 'new' ? 'bg-blue-100 text-blue-700' : 
                                  item.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                                }`}>
                                  {(item.status || 'new').toUpperCase()}
                                </span>
                              </td>
                            </>
                          ) : (
                            <>
	                              <td className="px-4 py-4 font-medium text-[var(--navy)]">
	                                {activeTab === 'board' || activeTab === 'pastBoard' || activeTab === 'branchBoard' ? (
	                                  <div className="flex items-center gap-3">
	                                    {item.image_url ? (
	                                      <img src={item.image_url} alt={item.name || "Board member"} className="h-12 w-12 rounded-lg object-cover border border-slate-200 bg-slate-50" />
	                                    ) : (
	                                      <div className="h-12 w-12 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-400">
	                                        <UserCircle size={22} />
	                                      </div>
	                                    )}
	                                    <div>
	                                      <div>{item.name}</div>
	                                      <div className="text-[11px] text-slate-400 font-semibold">{item.role}</div>
	                                    </div>
	                                  </div>
	                                ) : (
	                                  isHomeContentTab(activeTab) ? item.title : (item.title || item.name)
	                                )}
	                              </td>
	                              <td className="px-4 py-4 text-[var(--slate)]">
	                                {activeTab === 'home' ? item.eyebrow : activeTab === 'homeStats' ? `${item.stats?.length || 0} stat blocks` : activeTab === 'homePillars' ? `${item.pillars?.length || 0} pillar cards` : activeTab === 'aboutPage' ? item.hero_eyebrow : activeTab === 'contactPage' ? item.eyebrow : activeTab === 'board' ? BOARD_CATEGORY_LABELS[(item.category || "officer") as keyof typeof BOARD_CATEGORY_LABELS] || item.category : activeTab === 'pastBoard' ? item.term : activeTab === 'branchBoard' ? item.branch_name : (item.category || item.role || item.membership_type || item.tag)}
                              </td>
                              <td className="px-4 py-4">
                                {activeTab === 'news' || activeTab === 'blogs' ? (
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.published ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                    {item.published ? 'PUBLISHED' : 'DRAFT'}
                                  </span>
                                ) : (
                                  <span className="text-[var(--slate)]">{isHomeContentTab(activeTab) ? 'Editable' : 'Active'}</span>
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
                              { isSubmissionTab(activeTab) ? <BookOpen size={16} /> : <Edit size={16} /> }
                            </button>
                            {!isHomeContentTab(activeTab) && (
                              <button 
                                onClick={() => handleDelete(item.id)}
                                className="p-2 text-[var(--slate)] hover:text-red-600 transition-colors"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
	                      {visibleData.length === 0 && (
                        <tr>
                          <td colSpan={activeTab === 'contact' || activeTab === 'complaints' || activeTab === 'applications' ? 5 : 4} className="px-4 py-10 text-center text-[var(--slate)]">
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
                {activeTab === 'home' ? 'Edit Home Hero' : activeTab === 'homeStats' ? 'Edit Home Stats' : activeTab === 'homePillars' ? 'Edit Home Pillars' : activeTab === 'aboutPage' ? 'Edit About Page' : activeTab === 'contactPage' ? 'Edit Contact Page' : (editingItem?.id ? `Edit ${activeTab.slice(0, -1)}` : `Add New ${activeTab.slice(0, -1)}`)}
              </DialogTitle>
            </DialogHeader>

            <div className="grid gap-6 py-6">
              {editingItem && (
                <div className="grid gap-4">
                  {/* View Only for Submissions */}
                  {(activeTab === 'contact' || activeTab === 'complaints' || activeTab === 'applications') ? (
                    <div className="space-y-4">
                       {activeTab === 'applications' ? (
                         <>
                           <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                              {[
                                ['Company', editingItem.company_name],
                                ['Membership Type', editingItem.membership_type],
                                ['Status', editingItem.status],
                                ['Registration No.', editingItem.registration_number],
                                ['PAN / VAT', editingItem.pan_vat_number],
                                ['Established', editingItem.established_year],
                                ['City', editingItem.city],
                                ['District', editingItem.district],
                                ['Province', editingItem.province],
                                ['Website', editingItem.website_url],
                                ['Office Phone', editingItem.office_phone],
                                ['Company Email', editingItem.company_email],
                                ['Owner', editingItem.owner_name],
                                ['Owner Phone', editingItem.owner_phone],
                                ['Owner Email', editingItem.owner_email],
                                ['Contact Person', editingItem.contact_person_name],
                                ['Contact Role', editingItem.contact_person_role],
                                ['MoEST Status', editingItem.ministry_approval_status],
                              ].map(([label, value]) => (
                                <div key={label}>
                                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{label}</label>
                                  <p className="font-bold text-[var(--navy)] break-words">{value || '-'}</p>
                                </div>
                              ))}
                              <div>
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Submitted On</label>
                                <p className="font-bold text-[var(--navy)]">{new Date(editingItem.created_at).toLocaleString()}</p>
                              </div>
                           </div>
                           <div className="pt-4 border-t grid gap-4">
                             <DetailBlock label="Company Address" value={editingItem.company_address} />
                             <DetailBlock label="Main Focus Countries" value={editingItem.main_focus_countries} />
                             <DetailBlock label="Services Offered" value={editingItem.services_offered} />
                             <DetailBlock label="Destination Partners / Institutions" value={editingItem.destination_partners} />
                             <DetailBlock label="Additional Message" value={editingItem.message} />
                           </div>
                           <div className="pt-4 border-t">
                             <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Uploaded Documents</label>
                             <div className="mt-3 grid sm:grid-cols-2 gap-3">
                               {Object.entries(editingItem.documents || {}).flatMap(([group, docs]: any) =>
                                 (docs || []).map((doc: any, index: number) => (
                                   <a
                                     key={`${group}-${index}`}
                                     href={doc.url}
                                     target="_blank"
                                     rel="noreferrer"
                                     className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm hover:bg-white hover:border-[var(--navy)] transition-colors"
                                   >
                                     <span className="min-w-0">
                                       <span className="block font-bold text-[var(--navy)] truncate">{doc.original_name || group}</span>
                                       <span className="block text-[10px] uppercase tracking-widest text-slate-400">{group.replaceAll('_', ' ')}</span>
                                     </span>
                                     <Download size={16} className="shrink-0 text-[var(--slate)]" />
                                   </a>
                                 ))
                               )}
                             </div>
                           </div>
                         </>
                       ) : (
                         <>
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
                          {activeTab === 'complaints' && (
                            <>
                              <div className="mb-5 grid grid-cols-2 lg:grid-cols-3 gap-4">
                                {[
                                  ['Reference', editingItem.reference_number],
                                  ['Relationship', editingItem.relationship],
                                  ['Preferred Contact', editingItem.communication_method],
                                  ['Consultancy', editingItem.consultancy_name],
                                  ['Branch / Location', editingItem.branch_location],
                                  ['Counselor', editingItem.counselor_name],
                                  ['Submission Type', editingItem.submission_type],
                                  ['Issue Area', editingItem.issue_area],
                                  ['Incident Date', editingItem.incident_date],
                                  ['Study Country', editingItem.study_country],
                                ].map(([label, value]) => (
                                  <div key={label}>
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{label}</label>
                                    <p className="font-bold text-[var(--navy)] break-words">{value || '-'}</p>
                                  </div>
                                ))}
                              </div>
                              <DetailBlock label="Expected Resolution" value={editingItem.expected_resolution} />
                            </>
                          )}
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Message / Description</label>
                          <div className="mt-2 p-6 rounded-2xl bg-slate-50 border border-slate-100 whitespace-pre-wrap text-[15px] leading-relaxed text-slate-700">
                             {editingItem.message || editingItem.description}
                          </div>
                          {activeTab === 'complaints' && Array.isArray(editingItem.documents) && editingItem.documents.length > 0 && (
                            <div className="mt-5">
                              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Uploaded Evidence</label>
                              <div className="mt-3 grid sm:grid-cols-2 gap-3">
                                {editingItem.documents.map((doc: any, index: number) => (
                                  <a
                                    key={`${doc.filename || doc.original_name}-${index}`}
                                    href={doc.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm hover:bg-white hover:border-[var(--navy)] transition-colors"
                                  >
                                    <span className="min-w-0">
                                      <span className="block font-bold text-[var(--navy)] truncate">{doc.original_name || 'Evidence document'}</span>
                                      <span className="block text-[10px] uppercase tracking-widest text-slate-400">{doc.mimetype || 'file'}</span>
                                    </span>
                                    <Download size={16} className="shrink-0 text-[var(--slate)]" />
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}
                       </div>
                       </>
                       )}
                       
                       <div className="pt-4">
                          <label className="text-sm font-semibold mb-2 block">Update Status</label>
                          <select 
                            className="flex h-11 w-full rounded-xl border border-outline bg-surface px-4 py-2 text-sm"
                            value={editingItem.status || "new"}
                            onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value })}
                          >
                            <option value="new">New</option>
                            <option value="read">Read / Investigating</option>
                            {activeTab === 'applications' && <option value="approved">Approved</option>}
                            <option value="resolved">Resolved / Archived</option>
                          </select>
                       </div>
                    </div>
                  ) : (
                    <>
                      {/* Common Fields: Title/Name */}
                      <div className="grid grid-cols-2 gap-4">
                        {(activeTab === 'home' || activeTab === 'news' || activeTab === 'blogs' || activeTab === 'events') && (
                          <div className="grid gap-2">
                            <label className="text-sm font-semibold">Title</label>
                            <Input 
                              value={editingItem.title || ""} 
                              onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })} 
                              required 
                            />
                          </div>
                        )}

                        {(activeTab === 'members' || activeTab === 'board' || activeTab === 'pastBoard' || activeTab === 'branchBoard') && (
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

                      {/* Home Hero Content */}
                      {activeTab === 'home' && (
                        <div className="grid gap-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <label className="text-sm font-semibold">Eyebrow Badge</label>
                              <Input value={editingItem.eyebrow || ""} onChange={(e) => setEditingItem({ ...editingItem, eyebrow: e.target.value })} />
                            </div>
                            <div className="grid gap-2">
                              <label className="text-sm font-semibold">Highlighted Text</label>
                              <Input value={editingItem.highlighted_text || ""} onChange={(e) => setEditingItem({ ...editingItem, highlighted_text: e.target.value })} />
                            </div>
                            <div className="grid gap-2">
                              <label className="text-sm font-semibold">Title Suffix</label>
                              <Input value={editingItem.title_suffix || ""} onChange={(e) => setEditingItem({ ...editingItem, title_suffix: e.target.value })} />
                            </div>
                            <div className="grid gap-2">
                              <label className="text-sm font-semibold">Floating Stat Value</label>
                              <Input value={editingItem.floating_value || ""} onChange={(e) => setEditingItem({ ...editingItem, floating_value: e.target.value })} />
                            </div>
                          </div>

                          <div className="grid gap-2">
                            <label className="text-sm font-semibold">Intro Text</label>
                            <Textarea
                              className="min-h-[120px]"
                              value={editingItem.intro || ""}
                              onChange={(e) => setEditingItem({ ...editingItem, intro: e.target.value })}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <label className="text-sm font-semibold">Primary CTA Label</label>
                              <Input value={editingItem.primary_cta_label || ""} onChange={(e) => setEditingItem({ ...editingItem, primary_cta_label: e.target.value })} />
                            </div>
                            <div className="grid gap-2">
                              <label className="text-sm font-semibold">Primary CTA URL</label>
                              <Input value={editingItem.primary_cta_url || ""} onChange={(e) => setEditingItem({ ...editingItem, primary_cta_url: e.target.value })} />
                            </div>
                            <div className="grid gap-2">
                              <label className="text-sm font-semibold">Secondary CTA Label</label>
                              <Input value={editingItem.secondary_cta_label || ""} onChange={(e) => setEditingItem({ ...editingItem, secondary_cta_label: e.target.value })} />
                            </div>
                            <div className="grid gap-2">
                              <label className="text-sm font-semibold">Secondary CTA URL</label>
                              <Input value={editingItem.secondary_cta_url || ""} onChange={(e) => setEditingItem({ ...editingItem, secondary_cta_url: e.target.value })} />
                            </div>
                            <div className="grid gap-2">
                              <label className="text-sm font-semibold">Overlay Eyebrow</label>
                              <Input value={editingItem.overlay_eyebrow || ""} onChange={(e) => setEditingItem({ ...editingItem, overlay_eyebrow: e.target.value })} />
                            </div>
                            <div className="grid gap-2">
                              <label className="text-sm font-semibold">Floating Stat Label</label>
                              <Input value={editingItem.floating_label || ""} onChange={(e) => setEditingItem({ ...editingItem, floating_label: e.target.value })} />
                            </div>
                          </div>

                          <div className="grid gap-2">
                            <label className="text-sm font-semibold">Overlay Title</label>
                            <Input value={editingItem.overlay_title || ""} onChange={(e) => setEditingItem({ ...editingItem, overlay_title: e.target.value })} />
                          </div>

                          <div className="grid gap-2">
                            <label className="text-sm font-semibold flex justify-between">
                              Trust Badges
                              <span className="text-[10px] text-slate-400 font-normal">One per line, first 3 show on the page</span>
                            </label>
                            <Textarea
                              value={Array.isArray(editingItem.trust_badges) ? editingItem.trust_badges.join('\n') : editingItem.trust_badges || ""}
                              onChange={(e) => setEditingItem({ ...editingItem, trust_badges: e.target.value })}
                            />
                          </div>
                        </div>
                      )}

                      {/* Home Statistics */}
                      {activeTab === 'homeStats' && (
                        <div className="grid gap-5">
                          {(editingItem.stats || []).slice(0, 4).map((stat: any, index: number) => (
                            <div key={index} className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
                              <p className="mb-4 text-xs font-black uppercase tracking-widest text-slate-400">
                                Stat Block {index + 1}
                              </p>
                              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                                <div className="grid gap-2">
                                  <label className="text-sm font-semibold">Number</label>
                                  <Input
                                    type="number"
                                    value={stat.target ?? 0}
                                    onChange={(e) => updateHomeStat(index, { target: Number(e.target.value) })}
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <label className="text-sm font-semibold">Suffix</label>
                                  <Input
                                    value={stat.suffix || ""}
                                    onChange={(e) => updateHomeStat(index, { suffix: e.target.value })}
                                    placeholder="+, K+"
                                  />
                                </div>
                                <div className="grid gap-2 lg:col-span-2">
                                  <label className="text-sm font-semibold">Main Label</label>
                                  <Input
                                    value={stat.label || ""}
                                    onChange={(e) => updateHomeStat(index, { label: e.target.value })}
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <label className="text-sm font-semibold">Color</label>
                                  <select
                                    className="flex h-11 w-full rounded-xl border border-outline bg-surface px-4 py-2 text-sm"
                                    value={stat.color || "primary"}
                                    onChange={(e) => updateHomeStat(index, { color: e.target.value })}
                                  >
                                    <option value="primary">Primary</option>
                                    <option value="navy">Navy</option>
                                  </select>
                                </div>
                              </div>
                              <div className="mt-4 grid gap-2">
                                <label className="text-sm font-semibold">Subtitle</label>
                                <Input
                                  value={stat.sub || ""}
                                  onChange={(e) => updateHomeStat(index, { sub: e.target.value })}
                                  placeholder="ESTABLISHED 1997"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Home Pillars */}
                      {activeTab === 'homePillars' && (
                        <div className="grid gap-5">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <label className="text-sm font-semibold">Eyebrow</label>
                              <Input value={editingItem.eyebrow || ""} onChange={(e) => setEditingItem({ ...editingItem, eyebrow: e.target.value })} />
                            </div>
                            <div className="grid gap-2">
                              <label className="text-sm font-semibold">Highlighted Word</label>
                              <Input value={editingItem.highlighted_text || ""} onChange={(e) => setEditingItem({ ...editingItem, highlighted_text: e.target.value })} />
                            </div>
                          </div>
                          <div className="grid gap-2">
                            <label className="text-sm font-semibold">Section Title</label>
                            <Input value={editingItem.title || ""} onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })} />
                          </div>
                          <div className="grid gap-2">
                            <label className="text-sm font-semibold">Intro Text</label>
                            <Textarea
                              className="min-h-[120px]"
                              value={editingItem.intro || ""}
                              onChange={(e) => setEditingItem({ ...editingItem, intro: e.target.value })}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <label className="text-sm font-semibold">CTA Label</label>
                              <Input value={editingItem.cta_label || ""} onChange={(e) => setEditingItem({ ...editingItem, cta_label: e.target.value })} />
                            </div>
                            <div className="grid gap-2">
                              <label className="text-sm font-semibold">CTA URL</label>
                              <Input value={editingItem.cta_url || ""} onChange={(e) => setEditingItem({ ...editingItem, cta_url: e.target.value })} />
                            </div>
                          </div>

                          {(editingItem.pillars || []).slice(0, 4).map((pillar: any, index: number) => (
                            <div key={index} className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
                              <p className="mb-4 text-xs font-black uppercase tracking-widest text-slate-400">
                                Pillar {index + 1}
                              </p>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                  <label className="text-sm font-semibold">Title</label>
                                  <Input value={pillar.title || ""} onChange={(e) => updateHomePillar(index, { title: e.target.value })} />
                                </div>
                                <div className="grid gap-2">
                                  <label className="text-sm font-semibold">Link URL</label>
                                  <Input value={pillar.href || ""} onChange={(e) => updateHomePillar(index, { href: e.target.value })} />
                                </div>
                                <div className="grid gap-2">
                                  <label className="text-sm font-semibold">Icon</label>
                                  <select
                                    className="flex h-11 w-full rounded-xl border border-outline bg-surface px-4 py-2 text-sm"
                                    value={pillar.icon || "badge-check"}
                                    onChange={(e) => updateHomePillar(index, { icon: e.target.value })}
                                  >
                                    <option value="badge-check">Badge Check</option>
                                    <option value="globe">Globe</option>
                                    <option value="library">Library</option>
                                    <option value="pen-line">Pen Line</option>
                                  </select>
                                </div>
                                <div className="grid gap-2">
                                  <label className="text-sm font-semibold">Card Number</label>
                                  <Input value={`Pillar 0${index + 1}`} disabled />
                                </div>
                              </div>
                              <div className="mt-4 grid gap-2">
                                <label className="text-sm font-semibold">Body Text</label>
                                <Textarea
                                  className="min-h-[100px]"
                                  value={pillar.body || ""}
                                  onChange={(e) => updateHomePillar(index, { body: e.target.value })}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* About Page */}
                      {activeTab === 'aboutPage' && (
                        <div className="grid gap-5">
                          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-4">
                            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Hero Header</p>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="grid gap-2">
                                <label className="text-sm font-semibold">Hero Eyebrow</label>
                                <Input value={editingItem.hero_eyebrow || ""} onChange={(e) => setEditingItem({ ...editingItem, hero_eyebrow: e.target.value })} />
                              </div>
                              <div className="grid gap-2">
                                <label className="text-sm font-semibold">Highlighted Text</label>
                                <Input value={editingItem.hero_highlighted_text || ""} onChange={(e) => setEditingItem({ ...editingItem, hero_highlighted_text: e.target.value })} />
                              </div>
                            </div>
                            <div className="grid gap-2">
                              <label className="text-sm font-semibold">Hero Title</label>
                              <Input value={editingItem.hero_title || ""} onChange={(e) => setEditingItem({ ...editingItem, hero_title: e.target.value })} />
                            </div>
                            <div className="grid gap-2">
                              <label className="text-sm font-semibold">Hero Intro</label>
                              <Textarea className="min-h-[100px]" value={editingItem.hero_intro || ""} onChange={(e) => setEditingItem({ ...editingItem, hero_intro: e.target.value })} />
                            </div>
                          </div>

                          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-4">
                            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Identity Section</p>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="grid gap-2">
                                <label className="text-sm font-semibold">Section Eyebrow</label>
                                <Input value={editingItem.identity_eyebrow || ""} onChange={(e) => setEditingItem({ ...editingItem, identity_eyebrow: e.target.value })} />
                              </div>
                              <div className="grid gap-2">
                                <label className="text-sm font-semibold">Highlighted Text</label>
                                <Input value={editingItem.identity_highlighted_text || ""} onChange={(e) => setEditingItem({ ...editingItem, identity_highlighted_text: e.target.value })} />
                              </div>
                            </div>
                            <div className="grid gap-2">
                              <label className="text-sm font-semibold">Section Title</label>
                              <Input value={editingItem.identity_title || ""} onChange={(e) => setEditingItem({ ...editingItem, identity_title: e.target.value })} />
                            </div>
                            <div className="grid gap-2">
                              <label className="text-sm font-semibold">Main Intro</label>
                              <Textarea className="min-h-[100px]" value={editingItem.identity_intro || ""} onChange={(e) => setEditingItem({ ...editingItem, identity_intro: e.target.value })} />
                            </div>
                            <div className="grid gap-2">
                              <label className="text-sm font-semibold">Body Text</label>
                              <Textarea className="min-h-[100px]" value={editingItem.identity_body || ""} onChange={(e) => setEditingItem({ ...editingItem, identity_body: e.target.value })} />
                            </div>
                            <div className="grid gap-2">
                              <label className="text-sm font-semibold">Identity Image URL</label>
                              <Input value={editingItem.identity_image || ""} onChange={(e) => setEditingItem({ ...editingItem, identity_image: e.target.value })} placeholder="Leave blank to use current president image" />
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                              {(editingItem.stats || []).slice(0, 2).map((stat: any, index: number) => (
                                <div key={index} className="rounded-xl border border-slate-200 bg-white p-4">
                                  <p className="mb-3 text-xs font-black uppercase tracking-widest text-slate-400">Stat {index + 1}</p>
                                  <div className="grid gap-3">
                                    <Input value={stat.value || ""} onChange={(e) => updateAboutStat(index, { value: e.target.value })} placeholder="27+" />
                                    <Input value={stat.label || ""} onChange={(e) => updateAboutStat(index, { label: e.target.value })} placeholder="Years of Service" />
                                    <select
                                      className="flex h-11 w-full rounded-xl border border-outline bg-surface px-4 py-2 text-sm"
                                      value={stat.color || "navy"}
                                      onChange={(e) => updateAboutStat(index, { color: e.target.value })}
                                    >
                                      <option value="navy">Navy</option>
                                      <option value="primary">Primary</option>
                                    </select>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-4">
                            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Values Section</p>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="grid gap-2">
                                <label className="text-sm font-semibold">Section Eyebrow</label>
                                <Input value={editingItem.values_eyebrow || ""} onChange={(e) => setEditingItem({ ...editingItem, values_eyebrow: e.target.value })} />
                              </div>
                              <div className="grid gap-2">
                                <label className="text-sm font-semibold">Highlighted Text</label>
                                <Input value={editingItem.values_highlighted_text || ""} onChange={(e) => setEditingItem({ ...editingItem, values_highlighted_text: e.target.value })} />
                              </div>
                            </div>
                            <div className="grid gap-2">
                              <label className="text-sm font-semibold">Section Title</label>
                              <Input value={editingItem.values_title || ""} onChange={(e) => setEditingItem({ ...editingItem, values_title: e.target.value })} />
                            </div>
                            <div className="grid gap-2">
                              <label className="text-sm font-semibold">Section Intro</label>
                              <Textarea className="min-h-[100px]" value={editingItem.values_intro || ""} onChange={(e) => setEditingItem({ ...editingItem, values_intro: e.target.value })} />
                            </div>
                            {(editingItem.values || []).slice(0, 4).map((value: any, index: number) => (
                              <div key={index} className="rounded-xl border border-slate-200 bg-white p-4">
                                <p className="mb-3 text-xs font-black uppercase tracking-widest text-slate-400">Value Card {index + 1}</p>
                                <div className="grid grid-cols-2 gap-4">
                                  <Input value={value.title || ""} onChange={(e) => updateAboutValue(index, { title: e.target.value })} placeholder="Integrity" />
                                  <select
                                    className="flex h-11 w-full rounded-xl border border-outline bg-surface px-4 py-2 text-sm"
                                    value={value.icon || "award"}
                                    onChange={(e) => updateAboutValue(index, { icon: e.target.value })}
                                  >
                                    <option value="award">Award</option>
                                    <option value="shield-check">Shield Check</option>
                                    <option value="trending-up">Trending Up</option>
                                    <option value="check-circle">Check Circle</option>
                                  </select>
                                </div>
                                <Textarea className="mt-4 min-h-[90px]" value={value.body || ""} onChange={(e) => updateAboutValue(index, { body: e.target.value })} placeholder="Card description" />
                              </div>
                            ))}
                          </div>

                          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-4">
                            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Timeline Section</p>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="grid gap-2">
                                <label className="text-sm font-semibold">Section Eyebrow</label>
                                <Input value={editingItem.timeline_eyebrow || ""} onChange={(e) => setEditingItem({ ...editingItem, timeline_eyebrow: e.target.value })} />
                              </div>
                              <div className="grid gap-2">
                                <label className="text-sm font-semibold">Highlighted Text</label>
                                <Input value={editingItem.timeline_highlighted_text || ""} onChange={(e) => setEditingItem({ ...editingItem, timeline_highlighted_text: e.target.value })} />
                              </div>
                            </div>
                            <div className="grid gap-2">
                              <label className="text-sm font-semibold">Section Title</label>
                              <Input value={editingItem.timeline_title || ""} onChange={(e) => setEditingItem({ ...editingItem, timeline_title: e.target.value })} />
                            </div>
                            <div className="grid gap-2">
                              <label className="text-sm font-semibold">Section Intro</label>
                              <Textarea className="min-h-[80px]" value={editingItem.timeline_intro || ""} onChange={(e) => setEditingItem({ ...editingItem, timeline_intro: e.target.value })} />
                            </div>
                            {(editingItem.milestones || []).slice(0, 4).map((milestone: any, index: number) => (
                              <div key={index} className="grid grid-cols-[120px_1fr] gap-4 rounded-xl border border-slate-200 bg-white p-4">
                                <Input value={milestone.year || ""} onChange={(e) => updateAboutMilestone(index, { year: e.target.value })} placeholder="1997" />
                                <Textarea value={milestone.text || ""} onChange={(e) => updateAboutMilestone(index, { text: e.target.value })} placeholder="Timeline text" />
                              </div>
                            ))}
                          </div>

                          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-4">
                            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Bottom CTA</p>
                            <div className="grid gap-2">
                              <label className="text-sm font-semibold">CTA Title</label>
                              <Input value={editingItem.cta_title || ""} onChange={(e) => setEditingItem({ ...editingItem, cta_title: e.target.value })} />
                            </div>
                            <div className="grid gap-2">
                              <label className="text-sm font-semibold">CTA Intro</label>
                              <Textarea className="min-h-[90px]" value={editingItem.cta_intro || ""} onChange={(e) => setEditingItem({ ...editingItem, cta_intro: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="grid gap-2">
                                <label className="text-sm font-semibold">Primary Button Label</label>
                                <Input value={editingItem.primary_cta_label || ""} onChange={(e) => setEditingItem({ ...editingItem, primary_cta_label: e.target.value })} />
                              </div>
                              <div className="grid gap-2">
                                <label className="text-sm font-semibold">Primary Button URL</label>
                                <Input value={editingItem.primary_cta_url || ""} onChange={(e) => setEditingItem({ ...editingItem, primary_cta_url: e.target.value })} />
                              </div>
                              <div className="grid gap-2">
                                <label className="text-sm font-semibold">Secondary Button Label</label>
                                <Input value={editingItem.secondary_cta_label || ""} onChange={(e) => setEditingItem({ ...editingItem, secondary_cta_label: e.target.value })} />
                              </div>
                              <div className="grid gap-2">
                                <label className="text-sm font-semibold">Secondary Button URL</label>
                                <Input value={editingItem.secondary_cta_url || ""} onChange={(e) => setEditingItem({ ...editingItem, secondary_cta_url: e.target.value })} />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Contact Page */}
                      {activeTab === 'contactPage' && (
                        <div className="grid gap-5">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <label className="text-sm font-semibold">Eyebrow</label>
                              <Input value={editingItem.eyebrow || ""} onChange={(e) => setEditingItem({ ...editingItem, eyebrow: e.target.value })} />
                            </div>
                            <div className="grid gap-2">
                              <label className="text-sm font-semibold">Highlighted Word</label>
                              <Input value={editingItem.highlighted_text || ""} onChange={(e) => setEditingItem({ ...editingItem, highlighted_text: e.target.value })} />
                            </div>
                          </div>
                          <div className="grid gap-2">
                            <label className="text-sm font-semibold">Page Title</label>
                            <Input value={editingItem.title || ""} onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })} />
                          </div>
                          <div className="grid gap-2">
                            <label className="text-sm font-semibold">Page Intro</label>
                            <Textarea className="min-h-[100px]" value={editingItem.intro || ""} onChange={(e) => setEditingItem({ ...editingItem, intro: e.target.value })} />
                          </div>

                          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-4">
                            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Sidebar Information</p>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="grid gap-2">
                                <label className="text-sm font-semibold">Sidebar Eyebrow</label>
                                <Input value={editingItem.side_eyebrow || ""} onChange={(e) => setEditingItem({ ...editingItem, side_eyebrow: e.target.value })} />
                              </div>
                              <div className="grid gap-2">
                                <label className="text-sm font-semibold">Sidebar Title</label>
                                <Input value={editingItem.side_title || ""} onChange={(e) => setEditingItem({ ...editingItem, side_title: e.target.value })} />
                              </div>
                            </div>
                            <div className="grid gap-2">
                              <label className="text-sm font-semibold">Sidebar Intro</label>
                              <Textarea value={editingItem.side_intro || ""} onChange={(e) => setEditingItem({ ...editingItem, side_intro: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="grid gap-2">
                                <label className="text-sm font-semibold">Address Label</label>
                                <Input value={editingItem.address_label || ""} onChange={(e) => setEditingItem({ ...editingItem, address_label: e.target.value })} />
                              </div>
                              <div className="grid gap-2">
                                <label className="text-sm font-semibold">Address</label>
                                <Input value={editingItem.address || ""} onChange={(e) => setEditingItem({ ...editingItem, address: e.target.value })} />
                              </div>
                              <div className="grid gap-2">
                                <label className="text-sm font-semibold">Phone Label</label>
                                <Input value={editingItem.phone_label || ""} onChange={(e) => setEditingItem({ ...editingItem, phone_label: e.target.value })} />
                              </div>
                              <div className="grid gap-2">
                                <label className="text-sm font-semibold">Phone</label>
                                <Input value={editingItem.phone || ""} onChange={(e) => setEditingItem({ ...editingItem, phone: e.target.value })} />
                              </div>
                              <div className="grid gap-2">
                                <label className="text-sm font-semibold">Email Label</label>
                                <Input value={editingItem.email_label || ""} onChange={(e) => setEditingItem({ ...editingItem, email_label: e.target.value })} />
                              </div>
                              <div className="grid gap-2">
                                <label className="text-sm font-semibold">Email</label>
                                <Input value={editingItem.email || ""} onChange={(e) => setEditingItem({ ...editingItem, email: e.target.value })} />
                              </div>
                              <div className="grid gap-2">
                                <label className="text-sm font-semibold">Hours Label</label>
                                <Input value={editingItem.hours_label || ""} onChange={(e) => setEditingItem({ ...editingItem, hours_label: e.target.value })} />
                              </div>
                              <div className="grid gap-2">
                                <label className="text-sm font-semibold">Hours</label>
                                <Input value={editingItem.hours || ""} onChange={(e) => setEditingItem({ ...editingItem, hours: e.target.value })} />
                              </div>
                            </div>
                          </div>

                          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-4">
                            <p className="text-xs font-black uppercase tracking-widest text-slate-400">General Form</p>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="grid gap-2">
                                <label className="text-sm font-semibold">Form Title</label>
                                <Input value={editingItem.form_title || ""} onChange={(e) => setEditingItem({ ...editingItem, form_title: e.target.value })} />
                              </div>
                              <div className="grid gap-2">
                                <label className="text-sm font-semibold">Success Title</label>
                                <Input value={editingItem.success_title || ""} onChange={(e) => setEditingItem({ ...editingItem, success_title: e.target.value })} />
                              </div>
                            </div>
                            <div className="grid gap-2">
                              <label className="text-sm font-semibold">Form Intro</label>
                              <Textarea value={editingItem.form_intro || ""} onChange={(e) => setEditingItem({ ...editingItem, form_intro: e.target.value })} />
                            </div>
                            <div className="grid gap-2">
                              <label className="text-sm font-semibold">Success Message</label>
                              <Textarea value={editingItem.success_message || ""} onChange={(e) => setEditingItem({ ...editingItem, success_message: e.target.value })} />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Branch Metadata */}
                      {activeTab === 'branchBoard' && (
                        <div className="grid gap-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <label className="text-sm font-semibold">Branch Slug</label>
                              <Input value={editingItem.branch_slug || ""} onChange={(e) => setEditingItem({ ...editingItem, branch_slug: e.target.value })} placeholder="chitwan" required />
                            </div>
                            <div className="grid gap-2">
                              <label className="text-sm font-semibold">Branch Name</label>
                              <Input value={editingItem.branch_name || ""} onChange={(e) => setEditingItem({ ...editingItem, branch_name: e.target.value })} placeholder="Chitwan" required />
                            </div>
                            <div className="grid gap-2">
                              <label className="text-sm font-semibold">Province</label>
                              <Input value={editingItem.province || ""} onChange={(e) => setEditingItem({ ...editingItem, province: e.target.value })} />
                            </div>
                            <div className="grid gap-2">
                              <label className="text-sm font-semibold">Contact</label>
                              <Input value={editingItem.contact || ""} onChange={(e) => setEditingItem({ ...editingItem, contact: e.target.value })} />
                            </div>
                            <div className="grid gap-2">
                              <label className="text-sm font-semibold">Gradient Color Classes</label>
                              <Input value={editingItem.color || ""} onChange={(e) => setEditingItem({ ...editingItem, color: e.target.value })} placeholder="from-blue-700 to-blue-900" />
                            </div>
                            <div className="grid gap-2">
                              <label className="text-sm font-semibold">Accent Class</label>
                              <Input value={editingItem.accent || ""} onChange={(e) => setEditingItem({ ...editingItem, accent: e.target.value })} placeholder="bg-blue-500" />
                            </div>
                          </div>
                        </div>
                      )}

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
                        {(activeTab === 'board' || activeTab === 'pastBoard' || activeTab === 'branchBoard') && (
                          <>
                            <div className="grid gap-2">
                              <label className="text-sm font-semibold">Role</label>
                              {activeTab === 'branchBoard' ? (
                                <select
                                  className="flex h-11 w-full rounded-xl border border-outline bg-surface px-4 py-2 text-sm"
                                  value={editingItem.role || "Executive Member"}
                                  onChange={(e) => setEditingItem({ ...editingItem, role: e.target.value })}
                                  required
                                >
                                  <option value="Founder President">Founder President</option>
                                  <option value="President">President</option>
                                  <option value="Immediate Past President">Immediate Past President</option>
                                  <option value="Vice President">Vice President</option>
                                  <option value="General Secretary">General Secretary</option>
                                  <option value="Secretary">Secretary</option>
                                  <option value="Treasurer">Treasurer</option>
                                  <option value="Joint Treasurer">Joint Treasurer</option>
                                  <option value="Executive Member">Executive Member</option>
                                </select>
                              ) : (
                                <Input value={editingItem.role || ""} onChange={(e) => setEditingItem({ ...editingItem, role: e.target.value })} required />
                              )}
                            </div>
                            {activeTab === 'board' && (
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
                            )}
                            {activeTab !== 'branchBoard' && (
                              <div className="grid gap-2">
                                <label className="text-sm font-semibold">Term</label>
                                <Input value={editingItem.term || (activeTab === 'board' ? "current" : "")} onChange={(e) => setEditingItem({ ...editingItem, term: e.target.value })} required={activeTab === 'pastBoard'} />
                              </div>
                            )}
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
                        {(activeTab === 'board' || activeTab === 'pastBoard' || activeTab === 'branchBoard') && (
                          <div className="grid gap-2">
                            <label className="text-sm font-semibold">Member Sort Order</label>
                            <Input type="number" value={editingItem.sort_order || 0} onChange={(e) => setEditingItem({ ...editingItem, sort_order: parseInt(e.target.value) })} />
                          </div>
                        )}
                        {activeTab === 'pastBoard' && (
                          <div className="grid gap-2">
                            <label className="text-sm font-semibold">Term Sort Order</label>
                            <Input type="number" value={editingItem.term_sort_order || 0} onChange={(e) => setEditingItem({ ...editingItem, term_sort_order: parseInt(e.target.value) })} />
                          </div>
                        )}
                        {activeTab === 'branchBoard' && (
                          <div className="grid gap-2">
                            <label className="text-sm font-semibold">Branch Sort Order</label>
                            <Input type="number" value={editingItem.branch_sort_order || 0} onChange={(e) => setEditingItem({ ...editingItem, branch_sort_order: parseInt(e.target.value) })} />
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

                      {/* Board Contact Details */}
                      {activeTab === 'board' && (
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <label className="text-sm font-semibold">Email</label>
                            <Input type="email" value={editingItem.email || ""} onChange={(e) => setEditingItem({ ...editingItem, email: e.target.value })} />
                          </div>
                          <div className="grid gap-2">
                            <label className="text-sm font-semibold">Phone</label>
                            <Input value={editingItem.phone || ""} onChange={(e) => setEditingItem({ ...editingItem, phone: e.target.value })} />
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
	                      {(activeTab === 'board' || activeTab === 'pastBoard' || activeTab === 'branchBoard' || activeTab === 'members') && (
                        <div className="grid gap-2">
                          <label className="text-sm font-semibold">{activeTab === 'members' ? 'Logo' : 'Portrait/Featured Image'}</label>
                          <div className="flex gap-2">
	                            <Input 
		                              value={activeTab === 'members' ? (editingItem.logo_url || "") : (editingItem.image_url || "")} 
		                              onChange={(e) => setEditingItem({ ...editingItem, [activeTab === 'members' ? 'logo_url' : 'image_url']: e.target.value })} 
	                              placeholder="URL or upload →"
	                            />
		                            {(activeTab === 'board' || activeTab === 'pastBoard' || activeTab === 'branchBoard') && (
	                              <button
	                                type="button"
	                                onClick={() => openImageLibrary('image_url')}
	                                className="flex h-11 w-11 items-center justify-center rounded-xl border border-outline bg-surface hover:bg-slate-50 transition-colors"
	                                title="Choose existing photo"
	                              >
	                                <ImageIcon size={18} />
	                              </button>
	                            )}
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

                      {/* Board Page Copy */}
                      {activeTab === 'board' && (
                        <div className="grid gap-4">
                          <div className="grid gap-2">
                            <label className="text-sm font-semibold">Bio</label>
                            <Textarea
                              value={editingItem.bio || ""}
                              onChange={(e) => setEditingItem({ ...editingItem, bio: e.target.value })}
                              className="min-h-[120px]"
                              placeholder="Short profile text shown on officer cards"
                            />
                          </div>
                          <div className="grid gap-2">
                            <label className="text-sm font-semibold">Quote</label>
                            <Textarea
                              value={editingItem.quote || ""}
                              onChange={(e) => setEditingItem({ ...editingItem, quote: e.target.value })}
                              className="min-h-[90px]"
                              placeholder="Optional quote shown on officer cards"
                            />
                          </div>
                        </div>
                      )}

                      {/* Gallery Images for News/Blogs */}
                      {(activeTab === 'home' || activeTab === 'news' || activeTab === 'blogs') && (
                        <div className="grid gap-2">
                          <label className="text-sm font-semibold flex justify-between">
                            {activeTab === 'home' ? 'Hero Slideshow Images' : 'Gallery Images'}
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

	      {/* Image Library Modal */}
	      <Dialog open={isImageLibraryOpen} onOpenChange={setIsImageLibraryOpen}>
	        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
	          <DialogHeader>
	            <DialogTitle className="text-xl font-bold">Choose Member Photo</DialogTitle>
	          </DialogHeader>
	          <div className="py-4">
	            {isLoadingImages ? (
	              <div className="py-16 flex justify-center">
	                <Loader2 className="animate-spin text-[var(--m3-primary)]" />
	              </div>
	            ) : imageLibrary.length > 0 ? (
	              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
	                {imageLibrary.map((image) => (
	                  <button
	                    key={image.url}
	                    type="button"
	                    onClick={() => selectImageFromLibrary(image.url)}
	                    className="group rounded-xl border border-slate-200 bg-white p-2 text-left hover:border-[var(--m3-primary)] hover:shadow-md transition-all"
	                  >
	                    <img src={image.url} alt={image.filename || "Uploaded image"} className="h-36 w-full rounded-lg object-cover bg-slate-50" />
	                    <div className="mt-2 truncate text-[11px] font-semibold text-[var(--slate)] group-hover:text-[var(--m3-primary)]">
	                      {image.filename}
	                    </div>
	                  </button>
	                ))}
	              </div>
	            ) : (
	              <div className="py-16 text-center text-[var(--slate)]">
	                No uploaded images found yet. Upload a portrait first, then reopen this picker.
	              </div>
	            )}
	          </div>
	          <DialogFooter className="border-t pt-6">
	            <Button type="button" variant="ghost" onClick={() => setIsImageLibraryOpen(false)}>Close</Button>
	            <Button type="button" variant="outline" onClick={fetchImageLibrary} className="gap-2">
	              <ImageIcon size={16} /> Refresh Images
	            </Button>
	          </DialogFooter>
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
      type="button"
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

function DetailBlock({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div>
      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{label}</label>
      <div className="mt-2 p-4 rounded-xl bg-slate-50 border border-slate-100 whitespace-pre-wrap text-[14px] leading-relaxed text-slate-700">
        {value}
      </div>
    </div>
  );
}

function getEmptyItem(tab: Tab) {
  const common = { id: null };
  switch (tab) {
    case 'home':
      return {
        ...common,
        id: 'home-hero',
        eyebrow: "Shaping the Nation's Future Through Global Education",
        title: "Empowering Nepal's",
        highlighted_text: 'Future Leaders',
        title_suffix: 'to Reach the World.',
        intro: "ECAN is the national heartbeat of Nepal's educational consultancies. Since 1997, we've guided over 100,000 students to international success through integrity and professional excellence.",
        primary_cta_label: 'Become a Member',
        primary_cta_url: '/contact',
        secondary_cta_label: 'Find a Consultancy',
        secondary_cta_url: '/members',
        trust_badges: ['Govt. Registered', 'Global Network', '600+ Members'],
        overlay_eyebrow: 'Our impact in focus',
        overlay_title: 'Bridging aspirations to global opportunities.',
        floating_value: '27+',
        floating_label: 'Years of Excellence',
        images: [],
      };
    case 'homeStats':
      return {
        ...common,
        id: 'home-stats',
        title: 'Homepage Statistics',
        stats: [
          { target: 27, suffix: '+', label: 'Years of Trust', sub: 'Established 1997', color: 'primary' },
          { target: 600, suffix: '+', label: 'Accredited Members', sub: 'Verified Agencies', color: 'navy' },
          { target: 40, suffix: '+', label: 'Global Destinations', sub: 'Across 6 Continents', color: 'primary' },
          { target: 100, suffix: 'K+', label: 'Successful Students', sub: 'Global Impact', color: 'navy' },
        ],
      };
    case 'homePillars':
      return {
        ...common,
        id: 'home-pillars',
        title: 'Four Pillars of Excellence',
        eyebrow: 'The Foundation of Trust',
        highlighted_text: 'Excellence',
        intro: "ECAN is the heartbeat of Nepal's educational consultancy sector. We don't just monitor — we lead, providing a platform where students can dream with absolute confidence.",
        cta_label: 'Learn More About Our Mission',
        cta_url: '/about',
        pillars: [
          {
            title: 'Verified Excellence',
            body: "Access Nepal's only vetted network of certified educational consultancies — every member held to ECAN's uncompromising code of ethics.",
            href: '/members',
            icon: 'badge-check',
          },
          {
            title: 'Industry Pulse',
            body: 'Stay ahead with global summits, policy dialogues, and professional workshops that define the future of outbound education.',
            href: '/events',
            icon: 'globe',
          },
          {
            title: 'Knowledge Hub',
            body: 'Master your practice with exclusive country briefs, counsellor handbooks, and research that keeps you at the cutting edge.',
            href: '/about',
            icon: 'library',
          },
          {
            title: 'Seamless Testing',
            body: 'Secure your future with our streamlined, member-trusted IELTS portal — built for speed, reliability, and student confidence.',
            href: '/contact',
            icon: 'pen-line',
          },
        ],
      };
    case 'aboutPage':
      return {
        ...common,
        id: 'about-page',
        title: 'About Page',
        hero_eyebrow: 'The ECAN Heritage',
        hero_title: 'A Vision for Students, A Tool for the Nation.',
        hero_highlighted_text: 'A Tool for the Nation.',
        hero_intro: 'ECAN is more than an association; it is a promise of integrity to students, parents, and education providers worldwide since 1997.',
        identity_eyebrow: 'Our Core Identity',
        identity_title: "Nepal's Authoritative Voice in International Education.",
        identity_highlighted_text: 'International Education.',
        identity_intro: "Every year, thousands of young Nepalis leave home in pursuit of global opportunities. Behind every journey lies a dream, a family's trust, and a nation's future.",
        identity_body: 'We are committed to ensuring that this journey is guided by transparency, accountability, and student-centered protection. Our vision is clear: to create an international education ecosystem where opportunity and security go hand in hand, empowering our youth to achieve their ambitions with confidence and peace of mind.',
        identity_image: '',
        stats: [
          { value: '27+', label: 'Years of Service', color: 'navy' },
          { value: '600+', label: 'Member Agencies', color: 'primary' },
        ],
        values_eyebrow: 'Guiding Principles',
        values_title: 'The Values that Define Us.',
        values_highlighted_text: 'Define Us.',
        values_intro: "Our commitment to ethical guidance ensures that every student's journey is handled with the highest standard of professionalism.",
        values: [
          { title: 'Integrity', body: 'Honest counsel before commercial interest, every time.', icon: 'award' },
          { title: 'Stewardship', body: 'Monitoring members so the sector keeps its standards high.', icon: 'shield-check' },
          { title: 'Advocacy', body: 'Speaking for Nepali students in policy rooms at home and abroad.', icon: 'trending-up' },
          { title: 'Care', body: "Treating every student's journey as a family decision.", icon: 'check-circle' },
        ],
        timeline_eyebrow: 'Historical Timeline',
        timeline_title: 'Twenty-Seven Years of Impactful Moments.',
        timeline_highlighted_text: 'Impactful Moments.',
        timeline_intro: 'Evolving from a local group to the national authority for educational consultancies.',
        milestones: [
          { year: '1997', text: 'Founded under the Chief District Administration Office, Kathmandu.' },
          { year: '2005', text: "Recognized by overseas education providers as Nepal's representative body." },
          { year: '2018', text: 'Launch of the ECAN mobile app for verified member discovery.' },
          { year: '2024', text: 'A renewed focus on transparent, accountable, and student-centered global education guidance.' },
        ],
        cta_title: 'Join the National Network',
        cta_intro: "If you are a consultancy committed to ethics and professional standards, become a part of Nepal's largest educational association.",
        primary_cta_label: 'Apply for Membership',
        primary_cta_url: '/contact',
        secondary_cta_label: 'View Member Directory',
        secondary_cta_url: '/members',
      };
    case 'contactPage':
      return {
        ...common,
        id: 'contact-page',
        title: 'Get in Touch',
        eyebrow: 'Contact ECAN',
        highlighted_text: 'Touch',
        intro: 'Send a general inquiry to the ECAN secretariat. Our team will review your message and respond through the appropriate channel.',
        side_eyebrow: 'Secretariat',
        side_title: 'General Information',
        side_intro: 'Use this page for general questions, coordination, official communication, and secretariat support.',
        address_label: 'Office Address',
        address: 'Hattisar, Kathmandu, Nepal',
        phone_label: 'Phone',
        phone: '+977-4521487 · +977-4522267',
        email_label: 'Email',
        email: 'info@ecan.org.np',
        hours_label: 'Office Hours',
        hours: 'Sunday to Friday, 10:00 AM - 5:00 PM',
        form_title: 'Send a Message',
        form_intro: 'Fill out the form below and the ECAN team will receive your inquiry in the admin backend.',
        success_title: 'Message Sent',
        success_message: 'Thank you. Your inquiry has been received by ECAN.',
      };
    case 'news':
      return { ...common, slug: '', title: '', excerpt: '', content: '', author: 'ECAN Secretariat', category: 'announcement', date: new Date().toISOString(), published: false, layout: 'classic', cover_image: '', images: [] };
    case 'blogs':
      return { ...common, slug: '', title: '', excerpt: '', content: '', author: 'ECAN Editorial', category: 'guide', date: new Date().toISOString(), published: false, read_time: 5, layout: 'classic', cover_image: '', images: [] };
    case 'members':
      return { ...common, name: '', city: '', focus: '', est: new Date().getFullYear(), email: '', phone: '', website: '', address: '', membership_type: 'Full Member', logo_url: '', published: true };
    case 'events':
      return { ...common, title: '', event_type: 'general', status: 'upcoming', starts_at: '', ends_at: '', location: '', description: '', is_featured: false };
    case 'board':
      return { ...common, name: '', role: '', term: 'current', image_url: '', category: 'officer', sort_order: 0, email: '', phone: '', bio: '', quote: '' };
    case 'pastBoard':
      return { ...common, term: '', name: '', role: '', image_url: '', sort_order: 0, term_sort_order: 0 };
    case 'branchBoard':
      return {
        ...common,
        branch_slug: '',
        branch_name: '',
        province: '',
        color: 'from-slate-700 to-slate-900',
        accent: 'bg-slate-500',
        contact: '',
        name: '',
        role: 'Executive Member',
        image_url: '',
        sort_order: 0,
        branch_sort_order: 0,
      };
    default:
      return { ...common };
  }
}
