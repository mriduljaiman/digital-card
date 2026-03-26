'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Eye, Download, Share2, Edit, Trash } from 'lucide-react';
import Link from 'next/link';

interface Invitation {
  id: string;
  slug: string;
  eventType: string;
  hostName: string;
  coHostName?: string;
  eventDate: string;
  views: number;
  downloads: number;
  shares: number;
  createdAt: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetch('/api/user/invitations')
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setInvitations(data.invitations);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [session]);

  if (status === 'loading' || loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">My Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Welcome back, {session?.user?.name}!
            </p>
          </div>
          <Button asChild size="lg">
            <Link href="/create">
              <Plus className="mr-2 h-5 w-5" />
              Create New Invitation
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Total Invitations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{invitations.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Views</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">
                {invitations.reduce((sum, inv) => sum + inv.views, 0)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Downloads</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">
                {invitations.reduce((sum, inv) => sum + inv.downloads, 0)}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Invitations</CardTitle>
          </CardHeader>
          <CardContent>
            {invitations.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  You haven't created any invitations yet.
                </p>
                <Button asChild>
                  <Link href="/create">Create Your First Invitation</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {invitations.map((inv) => (
                  <div
                    key={inv.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">
                        {inv.hostName}
                        {inv.coHostName && ` & ${inv.coHostName}`}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {inv.eventType} • {new Date(inv.eventDate).toLocaleDateString()}
                      </p>
                      <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {inv.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <Download className="h-4 w-4" />
                          {inv.downloads}
                        </span>
                        <span className="flex items-center gap-1">
                          <Share2 className="h-4 w-4" />
                          {inv.shares}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/invite/${inv.slug}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
