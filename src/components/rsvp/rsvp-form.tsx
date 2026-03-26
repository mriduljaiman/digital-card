'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CheckCircle2, Loader2, X } from 'lucide-react';

interface RSVPFormProps {
  invitationSlug: string;
  onSuccess?: () => void;
}

export function RSVPForm({ invitationSlug, onSuccess }: RSVPFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    guestCount: 1,
    rsvpStatus: 'ACCEPTED' as 'ACCEPTED' | 'DECLINED' | 'MAYBE',
    dietaryRestrictions: '',
    specialRequests: '',
    relationship: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invitationSlug,
          ...formData,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        if (onSuccess) {
          setTimeout(onSuccess, 2000);
        }
      } else {
        setError(data.error || 'Failed to submit RSVP');
      }
    } catch (err) {
      setError('Failed to submit RSVP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-12 text-center">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
          <p className="text-muted-foreground">
            Your RSVP has been submitted successfully.
          </p>
          {formData.rsvpStatus === 'ACCEPTED' && (
            <p className="mt-4 text-lg">We look forward to celebrating with you! 🎉</p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>RSVP</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="Your full name"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your@email.com"
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+91 98765 43210"
            />
          </div>

          {/* RSVP Status */}
          <div className="space-y-2">
            <Label htmlFor="rsvpStatus">Will you attend? *</Label>
            <Select
              value={formData.rsvpStatus}
              onValueChange={(value: any) => setFormData({ ...formData, rsvpStatus: value })}
            >
              <SelectTrigger id="rsvpStatus">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACCEPTED">✓ Yes, I'll be there</SelectItem>
                <SelectItem value="DECLINED">✗ Sorry, can't make it</SelectItem>
                <SelectItem value="MAYBE">? Not sure yet</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Guest Count */}
          {formData.rsvpStatus === 'ACCEPTED' && (
            <div className="space-y-2">
              <Label htmlFor="guestCount">Number of Guests *</Label>
              <Select
                value={formData.guestCount.toString()}
                onValueChange={(value) =>
                  setFormData({ ...formData, guestCount: parseInt(value) })
                }
              >
                <SelectTrigger id="guestCount">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? 'Guest' : 'Guests'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Dietary Restrictions */}
          {formData.rsvpStatus === 'ACCEPTED' && (
            <div className="space-y-2">
              <Label htmlFor="dietary">Dietary Restrictions (optional)</Label>
              <Input
                id="dietary"
                value={formData.dietaryRestrictions}
                onChange={(e) =>
                  setFormData({ ...formData, dietaryRestrictions: e.target.value })
                }
                placeholder="Vegetarian, vegan, allergies, etc."
              />
            </div>
          )}

          {/* Special Requests */}
          <div className="space-y-2">
            <Label htmlFor="requests">Special Requests or Message (optional)</Label>
            <Textarea
              id="requests"
              value={formData.specialRequests}
              onChange={(e) =>
                setFormData({ ...formData, specialRequests: e.target.value })
              }
              placeholder="Any special requests or messages for the host..."
              rows={3}
            />
          </div>

          {/* Relationship */}
          <div className="space-y-2">
            <Label htmlFor="relationship">Relationship (optional)</Label>
            <Input
              id="relationship"
              value={formData.relationship}
              onChange={(e) =>
                setFormData({ ...formData, relationship: e.target.value })
              }
              placeholder="Friend, Family, Colleague, etc."
            />
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded">
              <X className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit */}
          <Button type="submit" disabled={loading} className="w-full" size="lg">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit RSVP'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
