'use client';

import { useState } from 'react';
import { mockTasks } from '@/lib/crm-mock-data';

type TaskStatus = 'pending' | 'completed';
type TaskPriority = 'high' | 'medium' | 'low';

const priorityColors: Record<TaskPriority, string> = {
    'high': '#ef4444',
    'medium': '#f59e0b',
    'low': '#10b981',
};

const taskTypeIcons: Record<string, string> = {
    'call': '📞',
    'email': '📧',
    'meeting': '📅',
};

export default function TasksPage() {
    const [filter, setFilter] = useState<'all' | 'today' | 'upcoming' | 'completed'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const filteredTasks = mockTasks.filter(task => {
        const matchesSearch = !searchQuery ||
            task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.description.toLowerCase().includes(searchQuery.toLowerCase());

        if (!matchesSearch) return false;

        if (filter === 'completed') return task.status === 'completed';
        if (filter === 'today') {
            const taskDate = new Date(task.dueDate);
            taskDate.setHours(0, 0, 0, 0);
            return taskDate.getTime() === today.getTime() && task.status === 'pending';
        }
        if (filter === 'upcoming') {
            return task.dueDate > today && task.status === 'pending';
        }
        return true;
    });

    const pendingTasks = mockTasks.filter(t => t.status === 'pending').length;
    const completedTasks = mockTasks.filter(t => t.status === 'completed').length;
    const overdueTasks = mockTasks.filter(t => t.status === 'pending' && t.dueDate < today).length;

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
            {/* Page Header */}
            <div className="page-header">
                <h1 style={{ marginBottom: '1rem' }}>Tasks</h1>
                <p style={{ fontSize: '1.125rem', color: 'var(--color-text-secondary)' }}>
                    Manage your daily tasks and follow-ups
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-4 mb-lg">
                <div className="stat-card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                    <div className="stat-value">{pendingTasks}</div>
                    <div className="stat-label">Pending Tasks</div>
                </div>
                <div className="stat-card" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
                    <div className="stat-value">{completedTasks}</div>
                    <div className="stat-label">Completed</div>
                </div>
                <div className="stat-card" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                    <div className="stat-value">{overdueTasks}</div>
                    <div className="stat-label">Overdue</div>
                </div>
                <div className="stat-card" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                    <div className="stat-value">{Math.round((completedTasks / mockTasks.length) * 100)}%</div>
                    <div className="stat-label">Completion Rate</div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="glass-card mb-lg">
                <div className="flex gap-md mb-md">
                    <button
                        className={filter === 'all' ? 'btn btn-primary' : 'btn btn-secondary'}
                        onClick={() => setFilter('all')}
                    >
                        All Tasks
                    </button>
                    <button
                        className={filter === 'today' ? 'btn btn-primary' : 'btn btn-secondary'}
                        onClick={() => setFilter('today')}
                    >
                        Today
                    </button>
                    <button
                        className={filter === 'upcoming' ? 'btn btn-primary' : 'btn btn-secondary'}
                        onClick={() => setFilter('upcoming')}
                    >
                        Upcoming
                    </button>
                    <button
                        className={filter === 'completed' ? 'btn btn-primary' : 'btn btn-secondary'}
                        onClick={() => setFilter('completed')}
                    >
                        Completed
                    </button>
                </div>

                <div className="flex gap-md items-center justify-between">
                    <div className="search-bar" style={{ flex: 1 }}>
                        <svg
                            className="search-icon"
                            width="20"
                            height="20"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search tasks..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button className="btn btn-primary">
                        + Add Task
                    </button>
                </div>
            </div>

            {/* Tasks List */}
            <div className="section">
                <div className="flex justify-between items-center mb-md">
                    <h2 style={{ margin: 0 }}>
                        {filter === 'all' && 'All Tasks'}
                        {filter === 'today' && "Today's Tasks"}
                        {filter === 'upcoming' && 'Upcoming Tasks'}
                        {filter === 'completed' && 'Completed Tasks'}
                    </h2>
                    <span style={{ color: 'var(--color-text-secondary)' }}>
                        {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
                    </span>
                </div>

                {filteredTasks.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {filteredTasks.map(task => {
                            const isOverdue = task.status === 'pending' && task.dueDate < today;

                            return (
                                <div key={task.id} className="glass-card">
                                    <div className="flex items-start gap-md">
                                        <div style={{ paddingTop: '0.25rem' }}>
                                            <input
                                                type="checkbox"
                                                checked={task.status === 'completed'}
                                                readOnly
                                                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                                            />
                                        </div>

                                        <div style={{ flex: 1 }}>
                                            <div className="flex items-center gap-md mb-sm">
                                                <span style={{ fontSize: '1.5rem' }}>{taskTypeIcons[task.type]}</span>
                                                <h4 style={{ margin: 0, flex: 1, textDecoration: task.status === 'completed' ? 'line-through' : 'none' }}>
                                                    {task.title}
                                                </h4>
                                                <span
                                                    className="badge"
                                                    style={{
                                                        background: `${priorityColors[task.priority as TaskPriority]}20`,
                                                        color: priorityColors[task.priority as TaskPriority],
                                                        border: `1px solid ${priorityColors[task.priority as TaskPriority]}`,
                                                    }}
                                                >
                                                    {task.priority}
                                                </span>
                                            </div>

                                            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
                                                {task.description}
                                            </p>

                                            <div className="flex gap-md items-center flex-wrap" style={{ fontSize: '0.875rem' }}>
                                                <span className="badge badge-secondary">
                                                    📅 Due: {task.dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </span>
                                                {isOverdue && (
                                                    <span className="badge" style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #dc2626' }}>
                                                        ⚠️ Overdue
                                                    </span>
                                                )}
                                                <span className="badge badge-secondary">
                                                    👤 {task.assignedTo}
                                                </span>
                                                <span className="badge badge-secondary">
                                                    {task.type}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="glass-card text-center" style={{ padding: '4rem 2rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✓</div>
                        <h3>No tasks found</h3>
                        <p style={{ color: 'var(--color-text-secondary)' }}>
                            {filter === 'completed' ? 'No completed tasks yet' : 'All caught up!'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
