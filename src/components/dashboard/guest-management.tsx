'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Users,
  UserPlus,
  Mail,
  Phone,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Trash2,
  Loader2,
  Download,
  Send,
} from 'lucide-react';

interface Guest {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  guestCount: number;
  rsvpStatus: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'MAYBE' | 'NO_RESPONSE';
  relationship: string | null;
  rsvpDate: string | null;
  checkedIn: boolean;
}

interface GuestManagementProps {
  invitationId?: string;
  invitationSlug?: string;
}

export function GuestManagement({ invitationId, invitationSlug }: GuestManagementProps) {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    accepted: 0,
    declined: 0,
    maybe: 0,
    pending: 0,
    totalGuestCount: 0,
    acceptedGuestCount: 0,
    checkedIn: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    fetchGuests();
  }, [invitationId, invitationSlug]);

  const fetchGuests = async () => {
    try {
      const params = new URLSearchParams();
      if (invitationId) params.set('invitationId', invitationId);
      if (invitationSlug) params.set('slug', invitationSlug);

      const response = await fetch(`/api/guests?${params}`);
      const data = await response.json();

      if (data.success) {
        setGuests(data.data.guests);
        setStats(data.data.stats);
      }
    } catch (error) {
      console.error('Error fetching guests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (guestId: string) => {
    if (!confirm('Are you sure you want to delete this guest?')) return;

    try {
      const response = await fetch(`/api/guests?guestId=${guestId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchGuests();
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handleCheckIn = async (guestId: string, checkedIn: boolean) => {
    try {
      await fetch('/api/guests', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guestId, checkedIn }),
      });

      await fetchGuests();
    } catch (error) {
      console.error('Check-in error:', error);
    }
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Status', 'Guest Count', 'Relationship', 'RSVP Date'];
    const rows = guests.map((g) => [
      g.name,
      g.email || '',
      g.phone || '',
      g.rsvpStatus,
      g.guestCount,
      g.relationship || '',
      g.rsvpDate ? new Date(g.rsvpDate).toLocaleDateString() : '',
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `guests-${Date.now()}.csv`;
    link.click();
  };

  const getStatusIcon = (status: Guest['rsvpStatus']) => {
    switch (status) {
      case 'ACCEPTED':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'DECLINED':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'MAYBE':
        return <HelpCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <HelpCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const filteredGuests = guests.filter((guest) => {
    const matchesSearch =
      guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.phone?.includes(searchQuery);

    const matchesFilter =
      filterStatus === 'all' || guest.rsvpStatus === filterStatus;

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <Card>
        <CardContent className="p-12 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Invites</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold text-green-600">{stats.accepted}</p>
                <p className="text-xs text-muted-foreground">
                  Accepted ({stats.acceptedGuestCount} guests)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-2xl font-bold text-red-600">{stats.declined}</p>
                <p className="text-xs text-muted-foreground">Declined</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Guest List</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={exportToCSV}>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Guest
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Guest</DialogTitle>
                  </DialogHeader>
                  <p className="text-sm text-muted-foreground">
                    Add guest manually to your invitation
                  </p>
                  {/* Add guest form would go here */}
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filter */}
          <div className="flex gap-4">
            <Input
              placeholder="Search guests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 rounded-md border bg-background"
            >
              <option value="all">All Status</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="DECLINED">Declined</option>
              <option value="MAYBE">Maybe</option>
              <option value="PENDING">Pending</option>
            </select>
          </div>

          {/* Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Guests</TableHead>
                  <TableHead>Relationship</TableHead>
                  <TableHead>RSVP Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGuests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No guests found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredGuests.map((guest) => (
                    <TableRow key={guest.id}>
                      <TableCell>{getStatusIcon(guest.rsvpStatus)}</TableCell>
                      <TableCell className="font-medium">{guest.name}</TableCell>
                      <TableCell>
                        <div className="space-y-1 text-sm">
                          {guest.email && (
                            <div className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {guest.email}
                            </div>
                          )}
                          {guest.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {guest.phone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{guest.guestCount}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {guest.relationship || '-'}
                      </TableCell>
                      <TableCell className="text-sm">
                        {guest.rsvpDate
                          ? new Date(guest.rsvpDate).toLocaleDateString()
                          : '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant={guest.checkedIn ? 'default' : 'outline'}
                            onClick={() => handleCheckIn(guest.id, !guest.checkedIn)}
                          >
                            {guest.checkedIn ? 'Checked In' : 'Check In'}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(guest.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
