import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const guestSchema = z.object({
  invitationId: z.string(),
  name: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  guestCount: z.number().min(1).default(1),
  relationship: z.string().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

// Get all guests for an invitation
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const invitationId = searchParams.get('invitationId');
    const slug = searchParams.get('slug');

    if (!invitationId && !slug) {
      return NextResponse.json(
        { success: false, error: 'Invitation ID or slug is required' },
        { status: 400 }
      );
    }

    // Find invitation and verify ownership
    const invitation = await prisma.invitation.findFirst({
      where: invitationId
        ? { id: invitationId, userId: session.user.id }
        : { slug: slug!, userId: session.user.id },
      select: { id: true },
    });

    if (!invitation) {
      return NextResponse.json(
        { success: false, error: 'Invitation not found or unauthorized' },
        { status: 404 }
      );
    }

    // Get all guests
    const guests = await prisma.guest.findMany({
      where: { invitationId: invitation.id },
      orderBy: [
        { rsvpStatus: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    // Calculate statistics
    const stats = {
      total: guests.length,
      accepted: guests.filter((g) => g.rsvpStatus === 'ACCEPTED').length,
      declined: guests.filter((g) => g.rsvpStatus === 'DECLINED').length,
      maybe: guests.filter((g) => g.rsvpStatus === 'MAYBE').length,
      pending: guests.filter((g) => g.rsvpStatus === 'PENDING' || g.rsvpStatus === 'NO_RESPONSE').length,
      totalGuestCount: guests.reduce((sum, g) => sum + g.guestCount, 0),
      acceptedGuestCount: guests
        .filter((g) => g.rsvpStatus === 'ACCEPTED')
        .reduce((sum, g) => sum + g.guestCount, 0),
      checkedIn: guests.filter((g) => g.checkedIn).length,
    };

    return NextResponse.json({
      success: true,
      data: { guests, stats },
    });
  } catch (error) {
    console.error('Get guests error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get guests',
      },
      { status: 500 }
    );
  }
}

// Add a guest manually
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = guestSchema.parse(body);

    // Verify invitation ownership
    const invitation = await prisma.invitation.findFirst({
      where: {
        id: validatedData.invitationId,
        userId: session.user.id,
      },
    });

    if (!invitation) {
      return NextResponse.json(
        { success: false, error: 'Invitation not found or unauthorized' },
        { status: 404 }
      );
    }

    // Create guest
    const guest = await prisma.guest.create({
      data: {
        invitationId: validatedData.invitationId,
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        guestCount: validatedData.guestCount,
        relationship: validatedData.relationship,
        notes: validatedData.notes,
        tags: validatedData.tags ? JSON.stringify(validatedData.tags) : null,
        rsvpStatus: 'PENDING',
      },
    });

    return NextResponse.json({
      success: true,
      data: { guest },
    });
  } catch (error) {
    console.error('Add guest error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to add guest',
      },
      { status: 500 }
    );
  }
}

// Update guest
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { guestId, ...updates } = body;

    if (!guestId) {
      return NextResponse.json(
        { success: false, error: 'Guest ID is required' },
        { status: 400 }
      );
    }

    // Verify guest belongs to user's invitation
    const guest = await prisma.guest.findFirst({
      where: {
        id: guestId,
        invitation: {
          userId: session.user.id,
        },
      },
    });

    if (!guest) {
      return NextResponse.json(
        { success: false, error: 'Guest not found or unauthorized' },
        { status: 404 }
      );
    }

    // Update guest
    const updatedGuest = await prisma.guest.update({
      where: { id: guestId },
      data: {
        ...updates,
        tags: updates.tags ? JSON.stringify(updates.tags) : undefined,
      },
    });

    return NextResponse.json({
      success: true,
      data: { guest: updatedGuest },
    });
  } catch (error) {
    console.error('Update guest error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update guest',
      },
      { status: 500 }
    );
  }
}

// Delete guest
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const guestId = searchParams.get('guestId');

    if (!guestId) {
      return NextResponse.json(
        { success: false, error: 'Guest ID is required' },
        { status: 400 }
      );
    }

    // Verify guest belongs to user's invitation
    const guest = await prisma.guest.findFirst({
      where: {
        id: guestId,
        invitation: {
          userId: session.user.id,
        },
      },
    });

    if (!guest) {
      return NextResponse.json(
        { success: false, error: 'Guest not found or unauthorized' },
        { status: 404 }
      );
    }

    // Delete guest
    await prisma.guest.delete({
      where: { id: guestId },
    });

    return NextResponse.json({
      success: true,
      message: 'Guest deleted successfully',
    });
  } catch (error) {
    console.error('Delete guest error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete guest',
      },
      { status: 500 }
    );
  }
}
