import { createFileRoute } from '@tanstack/react-router';
import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { 
  CalendarDays, 
  MapPin, 
  Plus, 
  Edit, 
  Trash2, 
  ExternalLink, 
  Search, 
  Filter,
  Loader2,
  X,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEvents, useSaveEvent, useDeleteEvent } from '@/hooks/useEvents';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

const EVENT_TYPES = {
  annual_day: 'Annual Day',
  picnic: 'Picnic',
  policy_dialogue: 'Policy Dialogue',
  workshop: 'Workshop',
  general: 'General'
};

const STATUSES = {
  upcoming: { label: 'Upcoming', class: 'bg-blue-100 text-blue-700 hover:bg-blue-100' },
  ongoing: { label: 'Ongoing', class: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' },
  past: { label: 'Past', class: 'bg-slate-100 text-slate-700 hover:bg-slate-100' },
  cancelled: { label: 'Cancelled', class: 'bg-red-100 text-red-700 hover:bg-red-100' }
};

export const Route = createFileRoute('/admin/events')({
  component: AdminEventsPage
});

function AdminEventsPage() {
  const [filters, setFilters] = useState({ status: '', type: '', page: 1 });
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const { data, isLoading } = useEvents(filters);
  const deleteMutation = useDeleteEvent();

  const filteredData = useMemo(() => {
    if (!data?.data) return [];
    return data.data.filter((item) => 
      item.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(deleting.id);
      toast.success('Event deleted successfully');
      setDeleting(null);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-white min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--navy)]">Events Management</h1>
          <p className="text-slate-500">Create and manage upcoming activities, workshops, and association events.</p>
        </div>
        <Button onClick={() => setEditing({})} className="bg-[var(--crimson)] hover:bg-[var(--crimson)]/90">
          <Plus className="w-4 h-4 mr-2" /> Add Event
        </Button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-wrap items-center gap-4 bg-slate-50 p-4 rounded-xl border">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Search events by title..." 
            className="pl-10 bg-white border-slate-200"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <Select value={filters.status} onValueChange={(val) => setFilters({...filters, status: val === 'all' ? '' : val, page: 1})}>
          <SelectTrigger className="w-[160px] bg-white border-slate-200">
            <Filter className="w-3 h-3 mr-2 text-slate-400" />
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {Object.entries(STATUSES).map(([val, info]) => (
              <SelectItem key={val} value={val}>{info.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.type} onValueChange={(val) => setFilters({...filters, type: val === 'all' ? '' : val, page: 1})}>
          <SelectTrigger className="w-[160px] bg-white border-slate-200">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {Object.entries(EVENT_TYPES).map(([val, label]) => (
              <SelectItem key={val} value={val}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 border-b">
              <TableHead className="w-[35%] font-bold text-[var(--navy)]">Title</TableHead>
              <TableHead className="font-bold text-[var(--navy)]">Type</TableHead>
              <TableHead className="font-bold text-[var(--navy)]">Date</TableHead>
              <TableHead className="font-bold text-[var(--navy)]">Location</TableHead>
              <TableHead className="font-bold text-[var(--navy)]">Status</TableHead>
              <TableHead className="text-right font-bold text-[var(--navy)]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-3/4" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : (
              <AnimatePresence mode="popLayout">
                {filteredData.map((event) => (
                  <motion.tr
                    key={event.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="group hover:bg-slate-50/50 transition-colors border-b"
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {event.title}
                        {event.is_featured && (
                          <Badge className="bg-amber-50 text-amber-600 hover:bg-amber-50 border-amber-200 px-1.5 py-0 text-[10px] font-bold">
                            <Star className="w-2.5 h-2.5 mr-1 fill-current" /> FEATURED
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="capitalize text-slate-600 text-sm">
                      {EVENT_TYPES[event.event_type] || event.event_type}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <CalendarDays className="w-4 h-4 text-slate-400" />
                        {format(new Date(event.starts_at), 'd MMM yyyy')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-slate-500 text-sm truncate max-w-[150px]" title={event.location}>
                        <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        {event.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${STATUSES[event.status]?.class} border-none font-semibold text-[10px]`}>
                        {STATUSES[event.status]?.label || event.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {event.reg_url && (
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-[var(--navy)]" asChild>
                            <a href={event.reg_url} target="_blank" rel="noreferrer">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-[var(--navy)]" onClick={() => setEditing(event)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50" onClick={() => setDeleting(event)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            )}
            {!isLoading && filteredData.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-slate-400">
                  No events found matching your criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {!isLoading && data?.total > data?.limit && (
          <div className="p-4 border-t flex items-center justify-between bg-slate-50/50">
            <p className="text-xs text-slate-500">
              Showing <span className="font-bold text-slate-700">{filteredData.length}</span> of <span className="font-bold text-slate-700">{data.total}</span> events
            </p>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 text-xs"
                disabled={filters.page === 1}
                onClick={() => setFilters({...filters, page: filters.page - 1})}
              >
                Previous
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 text-xs"
                disabled={filters.page * data.limit >= data.total}
                onClick={() => setFilters({...filters, page: filters.page + 1})}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Forms & Dialogs */}
      {editing !== null && (
        <EventForm 
          event={editing} 
          onClose={() => setEditing(null)} 
        />
      )}

      <Dialog open={deleting !== null} onOpenChange={() => setDeleting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Event</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <span className="font-bold text-slate-900">"{deleting?.title}"</span>? This action cannot be undone and will remove the event from the website.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setDeleting(null)}>Cancel</Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Delete Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function EventForm({ event, onClose }) {
  const isEditing = !!event.id;
  const saveMutation = useSaveEvent();
  const [formData, setFormData] = useState({
    title: event.title || '',
    event_type: event.event_type || 'general',
    status: event.status || 'upcoming',
    starts_at: event.starts_at ? format(new Date(event.starts_at), "yyyy-MM-dd'T'HH:mm") : '',
    ends_at: event.ends_at ? format(new Date(event.ends_at), "yyyy-MM-dd'T'HH:mm") : '',
    location: event.location || '',
    map_url: event.map_url || '',
    description: event.description || '',
    reg_url: event.reg_url || '',
    is_featured: event.is_featured || false,
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(event.cover_image || '');
  const [errors, setErrors] = useState({});

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.starts_at) newErrors.starts_at = 'Start date is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const data = new FormData();
    if (isEditing) data.append('id', event.id);
    data.append('title', formData.title);
    data.append('event_type', formData.event_type);
    data.append('status', formData.status);
    data.append('starts_at', formData.starts_at);
    if (formData.ends_at) data.append('ends_at', formData.ends_at);
    data.append('location', formData.location);
    data.append('map_url', formData.map_url);
    data.append('description', formData.description);
    data.append('reg_url', formData.reg_url);
    data.append('is_featured', String(formData.is_featured));
    if (file) data.append('cover_image', file);

    try {
      await saveMutation.mutateAsync(data);
      toast.success(isEditing ? 'Event updated' : 'Event created');
      onClose();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[var(--navy)]">
            {isEditing ? 'Edit Event' : 'Add New Event'}
          </DialogTitle>
          <DialogDescription>
            Enter the details for the association event. Required fields are marked with *.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div className="col-span-full space-y-2">
              <Label htmlFor="title" className="font-semibold">Title *</Label>
              <Input 
                id="title" 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})}
                placeholder="e.g. 27th ECAN Annual Day"
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && <p className="text-xs text-red-500 font-medium">{errors.title}</p>}
            </div>

            {/* Type & Status */}
            <div className="space-y-2">
              <Label className="font-semibold">Event Type</Label>
              <Select value={formData.event_type} onValueChange={val => setFormData({...formData, event_type: val})}>
                <SelectTrigger className="bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(EVENT_TYPES).map(([val, label]) => (
                    <SelectItem key={val} value={val}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="font-semibold">Status</Label>
              <Select value={formData.status} onValueChange={val => setFormData({...formData, status: val})}>
                <SelectTrigger className="bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(STATUSES).map(([val, info]) => (
                    <SelectItem key={val} value={val}>{info.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Timestamps */}
            <div className="space-y-2">
              <Label htmlFor="starts_at" className="font-semibold">Starts At *</Label>
              <Input 
                id="starts_at" 
                type="datetime-local" 
                value={formData.starts_at}
                onChange={e => setFormData({...formData, starts_at: e.target.value})}
                className={errors.starts_at ? 'border-red-500' : ''}
              />
              {errors.starts_at && <p className="text-xs text-red-500 font-medium">{errors.starts_at}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="ends_at" className="font-semibold">Ends At (Optional)</Label>
              <Input 
                id="ends_at" 
                type="datetime-local" 
                value={formData.ends_at}
                onChange={e => setFormData({...formData, ends_at: e.target.value})}
              />
            </div>

            {/* Location & Map */}
            <div className="space-y-2">
              <Label htmlFor="location" className="font-semibold">Location</Label>
              <Input 
                id="location" 
                value={formData.location}
                onChange={e => setFormData({...formData, location: e.target.value})}
                placeholder="e.g. Hotel Everest, Kathmandu"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="map_url" className="font-semibold">Google Maps URL</Label>
              <Input 
                id="map_url" 
                value={formData.map_url}
                onChange={e => setFormData({...formData, map_url: e.target.value})}
                placeholder="https://goo.gl/maps/..."
              />
            </div>

            {/* Description */}
            <div className="col-span-full space-y-2">
              <Label htmlFor="description" className="font-semibold">Description</Label>
              <Textarea 
                id="description" 
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                rows={4}
                placeholder="Tell more about the event..."
              />
            </div>

            {/* Registration URL */}
            <div className="col-span-full space-y-2">
              <Label htmlFor="reg_url" className="font-semibold">Registration Link (External)</Label>
              <Input 
                id="reg_url" 
                value={formData.reg_url}
                onChange={e => setFormData({...formData, reg_url: e.target.value})}
                placeholder="https://forms.gle/..."
              />
            </div>

            {/* Cover Image */}
            <div className="col-span-full space-y-2">
              <Label htmlFor="cover" className="font-semibold">Cover Image</Label>
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <Input id="cover" type="file" accept="image/*" onChange={handleFileChange} className="bg-white" />
                  <p className="text-[10px] text-slate-500 mt-1">Recommended size: 1200x630px. Max 2MB.</p>
                </div>
                {preview && (
                  <div className="relative w-32 h-20 rounded-lg border overflow-hidden bg-slate-50 shadow-inner">
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      type="button" 
                      onClick={() => { setFile(null); setPreview(''); }}
                      className="absolute top-1 right-1 bg-white/90 rounded-full p-1 shadow-sm hover:bg-white"
                    >
                      <X className="w-3 h-3 text-red-500" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Featured Switch */}
            <div className="col-span-full flex items-center justify-between p-4 border rounded-xl bg-slate-50/50">
              <div className="space-y-0.5">
                <Label htmlFor="featured" className="font-bold text-slate-700">Featured Event</Label>
                <p className="text-xs text-slate-500">Highlight this event on the homepage and show a featured badge.</p>
              </div>
              <Switch 
                id="featured" 
                checked={formData.is_featured} 
                onCheckedChange={val => setFormData({...formData, is_featured: val})} 
              />
            </div>
          </div>

          <DialogFooter className="sticky bottom-0 bg-white pt-4 border-t">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button 
              type="submit" 
              disabled={saveMutation.isPending}
              className="bg-[var(--crimson)] hover:bg-[var(--crimson)]/90 min-w-[120px]"
            >
              {saveMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                isEditing ? 'Update Event' : 'Create Event'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
