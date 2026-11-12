import React from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { BookingProvider, useBooking } from './src/context/BookingContext';
import { Header } from './src/components/Header';
import { StepIndicator } from './src/components/StepIndicator';
import { BottomBar } from './src/components/BottomBar';
import { ToastMessage } from './src/components/ToastMessage';

import { FlightDetailsScreen } from './src/screens/FlightDetailsScreen';
import { PassengerSelectScreen } from './src/screens/PassengerSelectScreen';
import { SeatSelectScreen } from './src/screens/SeatSelectScreen';
import { MealSelectScreen } from './src/screens/MealSelectScreen';
import { BookingSummaryScreen } from './src/screens/BookingSummaryScreen';

const MainApp: React.FC = () => {
  const { currentStep, setCurrentStep, toast, hideToast } = useBooking();

  const renderCurrentScreen = () => {
    switch (currentStep) {
      case 'flight':
        return <FlightDetailsScreen />;
      case 'passengers':
        return <PassengerSelectScreen />;
      case 'seats':
        return <SeatSelectScreen />;
      case 'meals':
        return <MealSelectScreen />;
      case 'summary':
        return <BookingSummaryScreen />;
      default:
        return <FlightDetailsScreen />;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />

      {/* Top Application Bar */}
      <Header />

      {/* Workflow Stepper */}
      <StepIndicator
        currentStep={currentStep}
        onSelectStep={setCurrentStep}
      />

      {/* Floating Action Feedback Toast */}
      <ToastMessage toast={toast} onDismiss={hideToast} />

      {/* Screen Body */}
      <View style={styles.screenContainer}>{renderCurrentScreen()}</View>

      {/* Sticky Bottom Action & Total Bar */}
      <BottomBar />
    </SafeAreaView>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <BookingProvider>
        <MainApp />
      </BookingProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  screenContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
});
