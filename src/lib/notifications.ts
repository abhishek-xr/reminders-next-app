import toast from 'react-hot-toast';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import React from 'react';

export const notify = {
  success: (message: string) =>
    toast.success(message, {
      style: {
        background: '#10B981',
        color: '#fff',
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#10B981',
      },
    }),

  error: (message: string) =>
    toast.error(message, {
      style: {
        background: '#EF4444',
        color: '#fff',
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#EF4444',
      },
    }),

  promise: (promise: Promise<any>, messages: {
    loading: string;
    success: string;
    error: string;
  }) =>
    toast.promise(promise, messages, {
      loading: {
        style: {
          background: '#3B82F6',
          color: '#fff',
        },
      },
      success: {
        style: {
          background: '#10B981',
          color: '#fff',
        },
      },
      error: {
        style: {
          background: '#EF4444',
          color: '#fff',
        },
      },
    }),

  undo: (message: string, onUndo: () => void) =>
    toast(
      (t) =>
        React.createElement(
          'div',
          { className: 'flex items-center gap-2' },
          React.createElement('span', null, message),
          React.createElement(
            'button',
            {
              className:
                'px-2 py-1 text-sm bg-white/20 rounded hover:bg-white/30 transition-colors',
              onClick: () => {
                onUndo();
                toast.dismiss(t.id);
              },
            },
            'Undo'
          )
        ),
      {
        style: {
          background: '#3B82F6',
          color: '#fff',
        },
      }
    ),
};
