// src/components/Dashboard.tsx
import { useState, useEffect } from 'react';
import { getTasks, getStats } from '../services/api';
import type { TaskStats } from '../types/task.types';

export function Dashboard() {
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      try {
        // fetch tasks and stats in parallel, not one after another
        const [, statsResult] = await Promise.all([
          getTasks({ limit: '1' }),
          getStats(),
        ]);

        if (!cancelled) {
          setStats(statsResult);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load stats');
          setLoading(false);
        }
      }
    }

    loadDashboard();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <div className="dashboard">Loading stats...</div>;
  if (error) return <div className="dashboard-error">{error}</div>;
  if (!stats) return null;

  return (
    <div className="dashboard">
      <div className="stat">
        <span className="stat-value">{stats.total}</span>
        <span className="stat-label">Total</span>
      </div>
      <div className="stat">
        <span className="stat-value">{stats.completed}</span>
        <span className="stat-label">Completed</span>
      </div>
      <div className="stat">
        <span className="stat-value">{stats.incomplete}</span>
        <span className="stat-label">Incomplete</span>
      </div>
      <div className="stat">
        <span className="stat-value">{stats.completionRate}%</span>
        <span className="stat-label">Completion rate</span>
      </div>
    </div>
  );
}