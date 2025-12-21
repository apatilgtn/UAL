import { NextRequest, NextResponse } from 'next/server';
import { getTasks } from '@/lib/twenty-client';

/**
 * GET /api/crm/tasks
 * Fetch all tasks from Twenty CRM
 */
export async function GET(request: NextRequest) {
    try {
        // Fetch tasks from Twenty CRM
        const tasks = await getTasks();

        // Transform to our format
        const formattedTasks = tasks.map(task => ({
            id: task.id,
            title: task.title,
            description: task.body || '',
            type: 'task',
            status: task.status || 'pending',
            priority: 'medium', // Can be enhanced with custom fields
            dueDate: task.dueAt ? new Date(task.dueAt) : new Date(),
            assignedTo: task.assignee
                ? `${task.assignee.firstName} ${task.assignee.lastName}`
                : 'Unassigned',
            relatedTo: '',
            createdAt: new Date(task.createdAt),
        }));

        return NextResponse.json({
            success: true,
            data: { tasks: formattedTasks },
        });

    } catch (error: any) {
        console.error('[API /api/crm/tasks] Error:', error);

        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Failed to fetch tasks',
            },
            { status: 500 }
        );
    }
}
