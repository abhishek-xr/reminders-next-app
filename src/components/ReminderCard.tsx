import { Reminder } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Clock, Tag, AlertCircle, Edit2, Trash2, CheckCircle, Circle } from 'lucide-react';

interface ReminderCardProps {
  reminder: Reminder;
  onEdit: (reminder: Reminder) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string, completed: boolean) => void;
}

export function ReminderCard({
  reminder,
  onEdit,
  onDelete,
  onToggleComplete,
}: ReminderCardProps) {
  const priorityConfig = {
    HIGH: {
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      hoverBg: 'hover:bg-red-100',
      icon: <AlertCircle className="w-4 h-4 text-red-600" />,
      label: 'High Priority'
    },
    MEDIUM: {
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      hoverBg: 'hover:bg-yellow-100',
      icon: <AlertCircle className="w-4 h-4 text-yellow-600" />,
      label: 'Medium Priority'
    },
    LOW: {
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      hoverBg: 'hover:bg-green-100',
      icon: <AlertCircle className="w-4 h-4 text-green-600" />,
      label: 'Low Priority'
    }
  };

  const priority = priorityConfig[reminder.priority];

  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.995 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      layout
    >
      <Card className={`
        group
        relative
        overflow-hidden
        border-none
        shadow-lg
        bg-white/50
        backdrop-blur-sm
        ${reminder.completed ? 'bg-gray-50/50' : ''}
        transition-all
        duration-200
      `}>
        {/* Priority Indicator Strip */}
        <div className={`
          absolute left-0 top-0 bottom-0 
          w-1
          ${priority.bgColor}
          transition-all
          duration-200
          group-hover:w-2
        `} />

        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              {/* Checkbox */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onToggleComplete(reminder.id, !reminder.completed)}
                className="mt-1 focus:outline-none"
              >
                {reminder.completed ? (
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-400" />
                )}
              </motion.button>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className={`
                    font-medium
                    text-lg
                    ${reminder.completed ? 'line-through text-gray-500' : 'text-gray-900'}
                  `}>
                    {reminder.name}
                  </h3>
                  <span className={`
                    inline-flex items-center gap-1
                    px-2 py-1
                    rounded-full
                    text-xs
                    font-medium
                    ${priority.bgColor}
                    ${priority.color}
                    ${priority.borderColor}
                    border
                    transition-all
                    duration-200
                    ${priority.hoverBg}
                  `}>
                    {priority.icon}
                    {priority.label}
                  </span>
                </div>

                <p className={`
                  mt-1
                  text-gray-600
                  ${reminder.completed ? 'line-through text-gray-400' : ''}
                `}>
                  {reminder.description}
                </p>

                <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {format(new Date(reminder.date), 'MMM dd, yyyy')} at {reminder.time}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Tag className="w-4 h-4" />
                    {reminder.category}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 shrink-0">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(reminder)}
                    className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span className="ml-2 hidden sm:inline">Edit</span>
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this reminder?')) {
                        onDelete(reminder.id);
                      }
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white transition-colors duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="ml-2 hidden sm:inline">Delete</span>
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </CardContent>

        {/* Hover Effect Overlay */}
        <div className="
          absolute inset-0
          bg-gradient-to-r from-transparent to-white/5
          opacity-0
          group-hover:opacity-100
          transition-opacity
          duration-300
          pointer-events-none
        " />
      </Card>
    </motion.div>
  );
}