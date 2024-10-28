'use client';

import { useState, useEffect, useMemo } from 'react';
import { ReminderCard } from '@/components/ReminderCard';
import { SearchBar } from '@/components/SearchBar';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Filter, Calendar as CalendarIcon, X } from 'lucide-react';
import { ReminderForm } from '@/components/ReminderForm';
import { format, isSameDay } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { notify } from '@/lib/notifications';
import { Reminder } from '@/lib/types';

interface Reminder {
  id: string;
  name: string;
  description: string;
  date: string | Date;
  time: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  category: string;
  completed: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export default function Home() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [showForm, setShowForm] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filters = [
    { id: 'all', label: 'All Reminders', icon: <Filter /> },
    { id: 'today', label: 'Today', icon: <CalendarIcon /> },
    { id: 'high', label: 'High Priority', color: 'text-red-500' },
    { id: 'medium', label: 'Medium Priority', color: 'text-yellow-500' },
    { id: 'low', label: 'Low Priority', color: 'text-green-500' },
    { id: 'pending', label: 'Pending' },
    { id: 'completed', label: 'Completed' },
  ];

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/reminders');
      if (!response.ok) {
        throw new Error('Failed to fetch reminders');
      }
      const data = await response.json();
      setReminders(data);
      notify.success('Reminders loaded successfully');
    } catch (error) {
      console.error('Failed to fetch reminders:', error);
      notify.error('Failed to load reminders');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    const previousReminders = [...reminders];
    const reminderToDelete = reminders.find(r => r.id === id);
    setReminders(reminders.filter(r => r.id !== id));

    try {
      const response = await fetch(`/api/reminders/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete reminder');

      notify.undo('Reminder deleted', async () => {
        const restoreResponse = await fetch('/api/reminders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reminderToDelete),
        });

        if (restoreResponse.ok) {
          await fetchReminders();
          notify.success('Reminder restored');
        }
      });
    } catch (error) {
      console.error('Failed to delete reminder:', error);
      setReminders(previousReminders);
      notify.error('Failed to delete reminder');
    }
  };

  const handleToggleComplete = async (id: string, completed: boolean) => {
    const reminder = reminders.find(r => r.id === id);
    if (!reminder) return;

    const previousReminders = [...reminders];
    setReminders(reminders.map(r => (r.id === id ? { ...r, completed } : r)));

    try {
      const response = await fetch(`/api/reminders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...reminder, completed }),
      });

      if (!response.ok) throw new Error('Failed to update reminder');
      notify.success(`Reminder marked as ${completed ? 'completed' : 'pending'}`);
      await fetchReminders();
    } catch (error) {
      console.error('Failed to update reminder:', error);
      setReminders(previousReminders);
      notify.error('Failed to update reminder status');
    }
  };

  const handleFormSubmit = async () => {
    await fetchReminders();
    notify.success(editingReminder ? 'Reminder updated' : 'Reminder created');
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingReminder(null);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const filteredReminders = useMemo(() => {
    return reminders
      .filter((reminder) => {
        if (searchQuery) {
          const searchText = searchQuery.toLowerCase();
          if (
            !reminder.name.toLowerCase().includes(searchText) &&
            !reminder.description.toLowerCase().includes(searchText) &&
            !reminder.category.toLowerCase().includes(searchText)
          )
            return false;
        }

        if (showDateFilter && selectedDate) {
          const reminderDate = new Date(reminder.date);
          if (!isSameDay(reminderDate, selectedDate)) return false;
        }

        switch (currentFilter) {
          case 'high':
            return reminder.priority === 'HIGH';
          case 'medium':
            return reminder.priority === 'MEDIUM';
          case 'low':
            return reminder.priority === 'LOW';
          case 'pending':
            return !reminder.completed;
          case 'completed':
            return reminder.completed;
          case 'today':
            return isSameDay(new Date(reminder.date), new Date());
          default:
            return true;
        }
      })
      .sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateA.getTime() - dateB.getTime();
      });
  }, [reminders, searchQuery, currentFilter, showDateFilter, selectedDate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Toaster position="top-right" />
      <main className="container mx-auto p-4 py-8">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              My Reminders
            </h1>
            <p className="text-gray-600 mt-1">
              {showDateFilter && selectedDate
                ? `Showing reminders for ${format(selectedDate, 'MMMM d, yyyy')}`
                : 'Manage your tasks and reminders'}
            </p>
          </div>
          <div className="flex gap-2">
            {showDateFilter && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDateFilter(false);
                    setSelectedDate(new Date());
                  }}
                  className="gap-2"
                >
                  <X className="w-4 h-4" />
                  Clear Date Filter
                </Button>
              </motion.div>
            )}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={() => {
                  setEditingReminder(null);
                  setShowForm(true);
                }}
                className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Plus className="w-4 h-4" />
                New Reminder
              </Button>
            </motion.div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-6">
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
              <Card className="shadow-lg border-none bg-white/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-blue-600" />
                    Calendar
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      setSelectedDate(date);
                      setShowDateFilter(true);
                    }}
                    className="rounded-md border"
                    disabled={(date) =>
                      !reminders.some((reminder) => isSameDay(new Date(reminder.date), date))
                    }
                  />
                  <div className="mt-4">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setShowDateFilter(false);
                        setSelectedDate(new Date());
                      }}
                    >
                      Show All Dates
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
              <Card className="shadow-lg border-none bg-white/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-blue-600" />
                    Filters
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <motion.div
                    className="flex flex-col gap-2"
                    initial="hidden"
                    animate="visible"
                    transition={{ staggerChildren: 0.1 }}
                  >
                    {filters.map((filter) => (
                      <Button
                        key={filter.id}
                        variant={currentFilter === filter.id ? 'default' : 'outline'}
                        className={`w-full justify-start gap-2 ${
                          currentFilter === filter.id
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                            : ''
                        }`}
                        onClick={() => setCurrentFilter(filter.id)}
                      >
                        {filter.icon}
                        {filter.label}
                      </Button>
                    ))}
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {showForm && (
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                >
                  <ReminderForm
                    editingReminder={editingReminder}
                    onClose={handleFormClose}
                    onSubmit={handleFormSubmit}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div className="space-y-4" initial="hidden" animate="visible">
              {loading ? (
                <Card className="border-none shadow-lg bg-white/50 backdrop-blur-sm">
                  <CardContent className="p-8">
                    <div className="flex justify-center items-center">
                      <motion.div
                        className="h-8 w-8 border-b-2 border-blue-600 rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      />
                    </div>
                  </CardContent>
                </Card>
              ) : filteredReminders.length === 0 ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <Card className="border-none shadow-lg bg-white/50 backdrop-blur-sm">
                    <CardContent className="p-12">
                      <div className="text-center">
                        <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          No reminders found
                        </h3>
                        <p className="text-gray-500 mb-4">
                          {showDateFilter
                            ? 'No reminders for the selected date'
                            : 'Create a new reminder to get started'}
                        </p>
                        <Button
                          onClick={() => {
                            setEditingReminder(null);
                            setShowForm(true);
                          }}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                          Create Reminder
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {filteredReminders.map((reminder, index) => (
                    <motion.div
                      key={reminder.id}
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                      layout
                    >
                      <ReminderCard
                        reminder={reminder}
                        onEdit={handleEdit}
                        onDelete={() => handleDelete(reminder.id)}
                        onToggleComplete={handleToggleComplete}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
