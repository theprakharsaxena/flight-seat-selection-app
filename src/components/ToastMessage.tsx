import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react-native';
import { ToastState } from '../context/BookingContext';

interface ToastMessageProps {
  toast: ToastState | null;
  onDismiss: () => void;
}

export const ToastMessage: React.FC<ToastMessageProps> = ({ toast, onDismiss }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 2800);
    return () => clearTimeout(timer);
  }, [toast?.id]);

  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 size={18} color="#059669" />;
      case 'warning':
        return <AlertCircle size={18} color="#D97706" />;
      default:
        return <Info size={18} color="#2563EB" />;
    }
  };

  const getBorderColor = () => {
    switch (toast.type) {
      case 'success':
        return '#A7F3D0';
      case 'warning':
        return '#FDE68A';
      default:
        return '#BFDBFE';
    }
  };

  return (
    <View style={[styles.container, { borderColor: getBorderColor() }]}>
      <View style={styles.iconContainer}>{getIcon()}</View>
      <Text style={styles.messageText} numberOfLines={2}>
        {toast.message}
      </Text>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={onDismiss}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <X size={15} color="#64748B" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 8,
    left: 16,
    right: 16,
    zIndex: 999,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1.5,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  iconContainer: {
    marginRight: 10,
  },
  messageText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    color: '#1E293B',
    lineHeight: 18,
  },
  closeButton: {
    padding: 4,
    marginLeft: 6,
  },
});

