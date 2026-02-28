import { AppProvider, useApp } from './context/AppContext';
import JoinScreen from './components/JoinScreen';
import Header from './components/Header';
import TabBar from './components/TabBar';
import MyHabits from './components/MyHabits';
import Community from './components/Community';
import HabitDetail from './components/HabitDetail';

function AppContent() {
  const { screen } = useApp();

  if (screen.type === 'join') {
    return <JoinScreen />;
  }

  return (
    <div className="mx-auto min-h-dvh max-w-lg">
      <Header />
      <TabBar />
      {screen.type === 'habits' && <MyHabits />}
      {screen.type === 'community' && <Community />}
      {screen.type === 'habit-detail' && <HabitDetail />}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
