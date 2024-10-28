import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const reminders = await prisma.reminder.findMany({
      orderBy: { date: 'asc' }
    });
    return NextResponse.json(reminders);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch reminders' }, 
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const reminder = await prisma.reminder.create({
      data: {
        name: body.name,
        description: body.description,
        date: new Date(body.date),
        time: body.time,
        priority: body.priority,
        category: body.category || 'general',
        completed: false
      }
    });
    return NextResponse.json(reminder, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create reminder' }, 
      { status: 400 }
    );
  }
}