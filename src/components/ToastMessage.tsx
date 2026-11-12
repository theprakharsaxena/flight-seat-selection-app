import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react-native';
import { ToastState } from '../context/BookingContext';

interface ToastMessageProps {
  toast: ToastState | null;
  onDismiss: () => void;
}

export const ToastMessage: React.FC<ToastMessageProps> = ({ toast, onDismiss }) => {
  const insets = useSafeAreaInsets();

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
        return <CheckCircle2 size={16} color="#059669" strokeWidth={2.5} />;
      case 'warning':
        return <AlertCircle size={16} color="#D97706" strokeWidth={2.5} />;
      default:
        return <Info size={16} color="#2563EB" strokeWidth={2.5} />;
    }
  };

  const getBorderColor = () => {
    switch (toast.type) {
      case 'success':
        return '#86EFAC';
      case 'warning':
        return '#FDE68A';
      default:
        return '#BFDBFE';
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          // Places it comfortably below the top navigation bar and well away from the phone clock / Dynamic Island
          top: 92,
          borderColor: getBorderColor(),
        },
      ]}
    >
      <View style={styles.iconContainer}>{getIcon()}</View>
      <Text style={styles.messageText} numberOfLines={2}>
        {toast.message}
      </Text>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={onDismiss}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        activeOpacity={0.7}
      >
        <X size={14} color="#64748B" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
  },
  iconContainer: {
    marginRight: 8,
  },
  messageText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 16,
  },
  closeButton: {
    padding: 3,
    marginLeft: 6,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
  },
});
