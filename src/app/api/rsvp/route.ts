import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

// Validation schema
const rsvpSchema = z.object({
  invitationSlug: z.string(),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  guestCount: z.number().min(1).max(20).default(1),
  rsvpStatus: z.enum(['ACCEPTED', 'DECLINED', 'MAYBE']),
  dietaryRestrictions: z.string().optional(),
  specialRequests: z.string().optional(),
  relationship: z.string().optional(),
});

// Submit RSVP
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = rsvpSchema.parse(body);

    // Find invitation
    const invitation = await prisma.invitation.findUnique({
      where: { slug: validatedData.invitationSlug },
      select: { id: true, userId: true },
    });

    if (!invitation) {
      return NextResponse.json(
        { success: false, error: 'Invitation not found' },
        { status: 404 }
      );
    }

    // Check if guest already exists by email or phone
    let existingGuest = null;
    if (validatedData.email || validatedData.phone) {
      existingGuest = await prisma.guest.findFirst({
        where: {
          invitationId: invitation.id,
          OR: [
            validatedData.email ? { email: validatedData.email } : {},
            validatedData.phone ? { phone: validatedData.phone } : {},
          ],
        },
      });
    }

    let guest;
    if (existingGuest) {
      // Update existing RSVP
      guest = await prisma.guest.update({
        where: { id: existingGuest.id },
        data: {
          name: validatedData.name,
          guestCount: validatedData.guestCount,
          rsvpStatus: validatedData.rsvpStatus,
          rsvpDate: new Date(),
          dietaryRestrictions: validatedData.dietaryRestrictions,
          specialRequests: validatedData.specialRequests,
          relationship: validatedData.relationship,
        },
      });
    } else {
      // Create new RSVP
      guest = await prisma.guest.create({
        data: {
          invitationId: invitation.id,
          name: validatedData.name,
          email: validatedData.email,
          phone: validatedData.phone,
          guestCount: validatedData.guestCount,
          rsvpStatus: validatedData.rsvpStatus,
          rsvpDate: new Date(),
          dietaryRestrictions: validatedData.dietaryRestrictions,
          specialRequests: validatedData.specialRequests,
          relationship: validatedData.relationship,
        },
      });
    }

    // Create notification for invitation owner
    if (invitation.userId) {
      await prisma.notification.create({
        data: {
          userId: invitation.userId,
          type: 'RSVP_RECEIVED',
          title: 'New RSVP',
          message: `${validatedData.name} ${validatedData.rsvpStatus.toLowerCase()} your invitation`,
          link: `/dashboard/invitations/${validatedData.invitationSlug}`,
          data: JSON.stringify({ guestId: guest.id }),
        },
      });
    }

    // Track analytics
    await prisma.analytics.create({
      data: {
        invitationId: invitation.id,
        eventType: 'RSVP_SUBMIT',
        eventData: JSON.stringify({
          status: validatedData.rsvpStatus,
          guestCount: validatedData.guestCount,
        }),
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: guest.id,
        message: 'RSVP submitted successfully',
      },
    });
  } catch (error) {
    console.error('RSVP error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to submit RSVP',
      },
      { status: 500 }
    );
  }
}

// Get RSVP status (for guests to check their RSVP)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const email = searchParams.get('email');
    const phone = searchParams.get('phone');

    if (!slug) {
      return NextResponse.json(
        { success: false, error: 'Invitation slug is required' },
        { status: 400 }
      );
    }

    const invitation = await prisma.invitation.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!invitation) {
      return NextResponse.json(
        { success: false, error: 'Invitation not found' },
        { status: 404 }
      );
    }

    // If email or phone provided, find specific guest
    if (email || phone) {
      const guest = await prisma.guest.findFirst({
        where: {
          invitationId: invitation.id,
          OR: [
            email ? { email } : {},
            phone ? { phone } : {},
          ],
        },
      });

      if (guest) {
        return NextResponse.json({
          success: true,
          data: {
            hasRsvp: true,
            guest: {
              name: guest.name,
              rsvpStatus: guest.rsvpStatus,
              guestCount: guest.guestCount,
              rsvpDate: guest.rsvpDate,
            },
          },
        });
      }

      return NextResponse.json({
        success: true,
        data: { hasRsvp: false },
      });
    }

    // Return RSVP summary
    const guestStats = await prisma.guest.groupBy({
      by: ['rsvpStatus'],
      where: { invitationId: invitation.id },
      _count: true,
      _sum: { guestCount: true },
    });

    const stats = {
      total: 0,
      accepted: 0,
      declined: 0,
      maybe: 0,
      pending: 0,
      totalGuests: 0,
    };

    guestStats.forEach((stat) => {
      stats.total++;
      stats.totalGuests += stat._sum.guestCount || 0;

      switch (stat.rsvpStatus) {
        case 'ACCEPTED':
          stats.accepted = stat._count;
          break;
        case 'DECLINED':
          stats.declined = stat._count;
          break;
        case 'MAYBE':
          stats.maybe = stat._count;
          break;
        case 'PENDING':
        case 'NO_RESPONSE':
          stats.pending = stat._count;
          break;
      }
    });

    return NextResponse.json({
      success: true,
      data: { stats },
    });
  } catch (error) {
    console.error('RSVP GET error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get RSVP data',
      },
      { status: 500 }
    );
  }
}
