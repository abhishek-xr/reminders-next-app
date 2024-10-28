import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const reminder = await prisma.reminder.update({
      where: { id: params.id },
      data: {
        name: body.name,
        description: body.description,
        date: new Date(body.date),
        time: body.time,
        priority: body.priority,
        category: body.category,
        completed: body.completed
      }
    });
    return NextResponse.json(reminder);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update reminder' }, 
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.reminder.delete({
      where: { id: params.id }
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete reminder' }, 
      { status: 400 }
    );
  }
}