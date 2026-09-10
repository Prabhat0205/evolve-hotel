import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/Toast';
import { AuthModal } from './components/common/AuthModal';

import { LandingPage } from './pages/LandingPage';
import { SearchPage } from './pages/SearchPage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ConfirmationPage } from './pages/ConfirmationPage';
import { MyStaysPage } from './pages/MyStaysPage';
import { MembershipPage } from './pages/MembershipPage';
import { RewardsCatalogPage } from './pages/RewardsCatalogPage';
import { InStayBreakfastPage } from './pages/InStayBreakfastPage';
import { AccountPage } from './pages/AccountPage';
import { SupportPage } from './pages/SupportPage';
import { CorporateBookingPage } from './pages/CorporateBookingPage';

const AppContent: React.FC = () => {
  const { currentRoute } = useApp();

  const renderCurrentPage = () => {
    switch (currentRoute) {
      case 'landing':
        return <LandingPage />;
      case 'search':
        return <SearchPage />;
      case 'property-detail':
        return <PropertyDetailPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'confirmation':
        return <ConfirmationPage />;
      case 'stays':
        return <MyStaysPage />;
      case 'membership':
        return <MembershipPage />;
      case 'rewards-catalog':
        return <RewardsCatalogPage />;
      case 'in-stay-breakfast':
        return <InStayBreakfastPage />;
      case 'profile':
        return <AccountPage />;
      case 'support':
        return <SupportPage />;
      case 'corporate-booking':
        return <CorporateBookingPage />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <main style={{ flex: 1 }}>
        {renderCurrentPage()}
      </main>
      <Footer />
      <ToastContainer />
      <AuthModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
