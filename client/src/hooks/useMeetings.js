import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';

export function useMeetings() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMeetings = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/meetings');
      setMeetings(data.meetings);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMeetings(); }, [fetchMeetings]);

  const createMeeting = async (payload) => {
    const { data } = await api.post('/meetings', payload);
    setMeetings(prev => [data.meeting, ...prev]);
    return data.meeting;
  };

  const updateMeeting = async (id, payload) => {
    const { data } = await api.put(`/meetings/${id}`, payload);
    setMeetings(prev => prev.map(m => m._id === id ? data.meeting : m));
    return data.meeting;
  };

  const deleteMeeting = async (id) => {
    await api.delete(`/meetings/${id}`);
    setMeetings(prev => prev.filter(m => m._id !== id));
  };

  const stats = {
    total: meetings.length,
    actionItems: meetings.reduce((sum, m) => sum + (m.actionItems?.length || 0), 0),
    completed: meetings.reduce((sum, m) => sum + (m.actionItems?.filter(a => a.status === 'done').length || 0), 0),
    pending: meetings.reduce((sum, m) => sum + (m.actionItems?.filter(a => a.status !== 'done').length || 0), 0),
  };

  return { meetings, loading, error, stats, fetchMeetings, createMeeting, updateMeeting, deleteMeeting };
}

export function useMeeting(id) {
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const { data } = await api.get(`/meetings/${id}`);
        setMeeting(data.meeting);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const update = async (payload) => {
    const { data } = await api.put(`/meetings/${id}`, payload);
    setMeeting(data.meeting);
    return data.meeting;
  };

  const summarize = async () => {
    setAiLoading(true);
    try {
      const { data } = await api.post('/ai/summarize', { meetingId: id });
      setMeeting(prev => ({ ...prev, summary: data.summary, status: 'processed' }));
      return data;
    } finally {
      setAiLoading(false);
    }
  };

  const extractActions = async () => {
    setAiLoading(true);
    try {
      const { data } = await api.post('/ai/extract', { meetingId: id });
      setMeeting(prev => ({ ...prev, actionItems: data.actionItems, status: 'processed' }));
      return data;
    } finally {
      setAiLoading(false);
    }
  };

  const toggleActionItem = async (index, status) => {
    const items = [...(meeting.actionItems || [])];
    items[index] = { ...items[index], status };
    const updated = await update({ actionItems: items });
    return updated;
  };

  return { meeting, loading, aiLoading, update, summarize, extractActions, toggleActionItem };
}
