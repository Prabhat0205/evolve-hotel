import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bell, User as UserIcon, Sparkles, Coffee, 
  ChevronDown, Menu, X, ArrowUpRight, ShieldCheck, 
  Compass, Calendar, Heart, Award, LogOut 
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    currentRoute, navigateTo, currentUser, isMember, 
    activeStay, openAuthModal, unreadNotifsCount, notifications, 
    markNotifAsRead, currentPersona, signOut 
  } = useApp();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const memberProfile = currentUser?.memberProfile;

  return (
    <>
      {/* Optional In-Stay Notification Strip if user is currently checked-in member */}
      {activeStay && currentUser?.isMember && (
        <div style={{
          backgroundColor: '#173f34',
          color: '#ffffff',
          padding: '8px 16px',
          fontSize: '0.8125rem',
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 auto' }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#dda943',
              display: 'inline-block',
              boxShadow: '0 0 6px #dda943'
            }} />
            <span>Currently In-Stay: <strong>{activeStay.assignedRoomNumber}</strong> at {activeStay.propertyName}</span>
            <button 
              onClick={() => navigateTo('in-stay-breakfast')}
              style={{
                background: '#dda943',
                color: '#17271f',
                border: 'none',
                padding: '3px 12px',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 700,
                marginLeft: '8px',
                cursor: 'pointer'
              }}
            >
              Order Breakfast 🥐
            </button>
          </div>
        </div>
      )}

      {/* Main Header Bar (Matching the top bar from user reference image) */}
      <header style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #eeece5',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 1px 4px rgba(23, 39, 31, 0.04)'
      }}>
        <div className="app-container-wide" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '74px',
        }}>
          {/* Brand Logo */}
          <div 
            onClick={() => navigateTo('landing')}
            style={{ 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px' 
            }}
          >
            <div style={{
              width: '38px',
              height: '38px',
              backgroundColor: '#173f34',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#dda943',
              fontFamily: 'Playfair Display, serif',
              fontWeight: 700,
              fontSize: '1.25rem',
              boxShadow: '0 2px 8px rgba(23, 63, 52, 0.2)'
            }}>
              E
            </div>
            <div>
              <span style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: '1.35rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                color: '#17271f',
                lineHeight: 1
              }}>
                EVOLVE
              </span>
              <span style={{
                display: 'block',
                fontSize: '0.625rem',
                letterSpacing: '0.18em',
                color: '#997125',
                fontWeight: 700,
                textTransform: 'uppercase',
                marginTop: '2px'
              }}>
                Hotels & Resorts
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links matching user reference screenshot */}
          <nav className="desktop-nav" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            {currentUser || currentPersona === 'guest' ? (
              <>
                <button
                  onClick={() => navigateTo('corporate-booking')}
                  style={{
                    backgroundColor: '#dda943',
                    color: '#17271f',
                    padding: '9px 16px',
                    borderRadius: '9999px',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginRight: '8px',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#c99632')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#dda943')}
                >
                  Group Booking / Corporate Rate <ArrowUpRight size={15} strokeWidth={2.5} />
                </button>
                <button
                  onClick={() => navigateTo('landing')}
                  style={{
                    backgroundColor: '#173f34',
                    color: '#ffffff',
                    padding: '8px 18px',
                    borderRadius: '9999px',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Home
                </button>
                {['Book', 'My Bookings', 'My Rewards', 'Breakfast']
                  .filter(item => {
                    if (currentPersona === 'guest' || !currentUser) {
                      return item !== 'My Rewards' && item !== 'Breakfast';
                    }
                    if (!currentUser.isMember) {
                      return item !== 'Breakfast';
                    }
                    return true;
                  })
                  .map(item => (
                  <button
                    key={item}
                    onClick={() => {
                      if (item === 'Book') navigateTo('search');
                      if (item === 'My Bookings') navigateTo('stays');
                      if (item === 'My Rewards') navigateTo('membership');
                      if (item === 'Breakfast') navigateTo('in-stay-breakfast');
                    }}
                    style={{
                      backgroundColor: 'transparent',
                      color: '#5b6763',
                      padding: '6px 10px',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'color 0.2s, background-color 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#173f34';
                      e.currentTarget.style.backgroundColor = '#f6f3ec';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#5b6763';
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    {item}
                  </button>
                ))}
              </>
            ) : (
              <>
                {['Overview', 'Suites', 'Amenities', 'Dining', 'Spa', 'Rewards', 'Location', 'Contact'].map(item => {
                  const idMap: Record<string, string> = {
                    'Overview': 'difference',
                    'Suites': 'rooms',
                    'Amenities': 'amenities',
                    'Breakfast': 'breakfast',
                    'Dining': 'dining',
                    'Spa': 'wellness',
                    'Rewards': 'rewards',
                    'Location': 'location',
                    'Contact': 'contact'
                  };
                  const targetId = idMap[item];
                  
                  return (
                    <button
                      key={item}
                      onClick={() => {
                        if (currentRoute !== 'landing') {
                          navigateTo('landing');
                          setTimeout(() => document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' }), 100);
                        } else {
                          document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      style={{
                        backgroundColor: 'transparent',
                        color: '#5b6763',
                        padding: '6px 10px',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'color 0.2s, background-color 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#173f34';
                        e.currentTarget.style.backgroundColor = '#f6f3ec';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#5b6763';
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      {item}
                    </button>
                  );
                })}

                {/* Group Booking / Corporate Rate */}
                <button
                  onClick={() => navigateTo('corporate-booking')}
                  style={{
                    backgroundColor: '#dda943',
                    color: '#17271f',
                    padding: '9px 16px',
                    borderRadius: '9999px',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    marginLeft: '4px'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#c99632')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#dda943')}
                >
                  Group Rates & Booking <ArrowUpRight size={15} strokeWidth={2.5} />
                </button>
              </>
            )}
          </nav>

          {/* Right Action Icons & User Profile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Notification Bell Dropdown (Only shown when user is logged in) */}
            {currentUser && (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: notifDropdownOpen ? '#f6f3ec' : '#ffffff',
                    border: '1px solid #e2ded5',
                    color: '#173f34',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                  aria-label="Notifications"
                >
                  <Bell size={18} />
                  {unreadNotifsCount > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: '2px',
                      right: '2px',
                      width: '16px',
                      height: '16px',
                      backgroundColor: '#dda943',
                      color: '#17271f',
                      borderRadius: '50%',
                      fontSize: '0.625rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {unreadNotifsCount}
                    </span>
                  )}
                </button>

                {/* Notification Popover */}
                {notifDropdownOpen && (
                  <div style={{
                    position: 'absolute',
                    right: 0,
                    top: '48px',
                    width: '320px',
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    boxShadow: '0 12px 32px rgba(23, 39, 31, 0.12)',
                    border: '1px solid #e2ded5',
                    padding: '16px',
                    zIndex: 200,
                    animation: 'slideUp 0.2s ease-out'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingBottom: '10px',
                      borderBottom: '1px solid #eeece5',
                      marginBottom: '10px'
                    }}>
                      <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#17271f' }}>Notifications</span>
                      <span style={{ fontSize: '0.75rem', color: '#997125', fontWeight: 600 }}>{unreadNotifsCount} New</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto' }}>
                      {notifications.map(n => (
                        <div 
                          key={n.id}
                          onClick={() => {
                            markNotifAsRead(n.id);
                            if (n.linkAction) navigateTo(n.linkAction as any);
                            setNotifDropdownOpen(false);
                          }}
                          style={{
                            padding: '10px',
                            borderRadius: '10px',
                            backgroundColor: n.isRead ? '#ffffff' : '#fcf6eb',
                            cursor: 'pointer',
                            border: '1px solid',
                            borderColor: n.isRead ? '#eeece5' : '#dda94340'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#17271f' }}>{n.title}</span>
                            <span style={{ fontSize: '0.6875rem', color: '#929b98' }}>{n.timestamp}</span>
                          </div>
                          <p style={{ fontSize: '0.75rem', color: '#6e7a76', margin: 0 }}>{n.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Authenticated User / Guest / Member Chip or Sign-In Button */}
            {(currentUser || currentPersona === 'guest') ? (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '6px 14px 6px 8px',
                    borderRadius: '9999px',
                    backgroundColor: '#ffffff',
                    border: '1.5px solid #e2ded5',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: isMember ? '#dda943' : '#173f34',
                    color: isMember ? '#17271f' : '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.8125rem'
                  }}>
                    {currentUser ? `${currentUser.firstName.charAt(0)}${currentUser.lastName.charAt(0)}` : 'G'}
                  </div>
                  <div style={{ textAlign: 'left', lineHeight: 1.15 }}>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#17271f' }}>
                      {currentUser ? currentUser.firstName : 'Guest'}
                    </div>
                    {isMember && memberProfile ? (
                      <div style={{ fontSize: '0.6875rem', color: '#997125', fontWeight: 600 }}>
                        {memberProfile.tier} • {memberProfile.unusedRewardNights} Reward Nights
                      </div>
                    ) : (
                      <div style={{ fontSize: '0.6875rem', color: '#6e7a76' }}>
                        Active Session
                      </div>
                    )}
                  </div>
                  <ChevronDown size={14} color="#6e7a76" />
                </button>

                {/* User Dropdown Menu */}
                {userMenuOpen && (
                  <div style={{
                    position: 'absolute',
                    right: 0,
                    top: '48px',
                    width: '260px',
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    boxShadow: '0 12px 32px rgba(23, 39, 31, 0.12)',
                    border: '1px solid #e2ded5',
                    padding: '12px',
                    zIndex: 200,
                    animation: 'slideUp 0.2s ease-out'
                  }}>
                    {/* Header info */}
                    <div style={{ padding: '8px 10px 12px', borderBottom: '1px solid #eeece5' }}>
                      <div style={{ fontWeight: 700, color: '#17271f', fontSize: '0.9375rem' }}>
                        {currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Guest User'}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#6e7a76', marginTop: '2px' }}>
                        {currentUser ? currentUser.email : 'Unregistered Profile'}
                      </div>
                      {isMember && memberProfile && (
                        <div style={{
                          marginTop: '8px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          backgroundColor: '#fcf6eb',
                          color: '#997125',
                          padding: '4px 10px',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: 700
                        }}>
                          <Sparkles size={12} /> {memberProfile.tier} Member ({memberProfile.memberId})
                        </div>
                      )}
                    </div>

                    {/* Menu items */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', padding: '8px 0' }}>
                      {currentPersona === 'guest' ? (
                        <button
                          onClick={() => { openAuthModal('convert_to_member'); setUserMenuOpen(false); }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '8px 10px',
                            borderRadius: '8px',
                            fontSize: '0.875rem',
                            color: '#173f34',
                            fontWeight: 700,
                            textAlign: 'left',
                            cursor: 'pointer',
                            width: '100%',
                            backgroundColor: '#eaf5ee'
                          }}
                        >
                          <Sparkles size={16} color="#173f34" /> Convert to Member
                        </button>
                      ) : (
                        <button
                          onClick={() => { navigateTo('profile'); setUserMenuOpen(false); }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '8px 10px',
                            borderRadius: '8px',
                            fontSize: '0.875rem',
                            color: '#17271f',
                            textAlign: 'left',
                            cursor: 'pointer',
                            width: '100%',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f6f3ec')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        >
                          <UserIcon size={16} color="#173f34" /> Profile & Payment Methods
                        </button>
                      )}

                      {activeStay && currentUser?.isMember && (
                        <button
                          onClick={() => { navigateTo('in-stay-breakfast'); setUserMenuOpen(false); }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '8px 10px',
                            borderRadius: '8px',
                            fontSize: '0.875rem',
                            color: '#173f34',
                            fontWeight: 600,
                            textAlign: 'left',
                            cursor: 'pointer',
                            width: '100%',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f6f3ec')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        >
                          <Coffee size={16} color="#173f34" /> In-Stay Breakfast & Room Folio
                        </button>
                      )}

                      <button
                        onClick={() => { navigateTo('support'); setUserMenuOpen(false); }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '8px 10px',
                          borderRadius: '8px',
                          fontSize: '0.875rem',
                          color: '#17271f',
                          textAlign: 'left',
                          cursor: 'pointer',
                          width: '100%',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f6f3ec')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <ShieldCheck size={16} color="#173f34" /> Questions and supports
                      </button>
                    </div>

                    <div style={{ borderTop: '1px solid #eeece5', paddingTop: '8px' }}>
                      <button
                        onClick={() => { signOut(); setUserMenuOpen(false); }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '8px 10px',
                          borderRadius: '8px',
                          fontSize: '0.875rem',
                          color: '#b91c1c',
                          textAlign: 'left',
                          cursor: 'pointer',
                          width: '100%',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fef2f2')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <LogOut size={16} color="#b91c1c" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div 
                style={{ position: 'relative' }} 
                onMouseEnter={() => setUserMenuOpen(true)} 
                onMouseLeave={() => setUserMenuOpen(false)}
              >
                <button
                  style={{
                    backgroundColor: 'transparent',
                    color: '#17271f',
                    border: 'none',
                    padding: '8px 12px',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  SIGN IN &nbsp;&nbsp;OR&nbsp;&nbsp; JOIN <ChevronDown size={14} />
                </button>

                {userMenuOpen && (
                  <div style={{
                    position: 'absolute',
                    right: 0,
                    top: '100%',
                    width: '300px',
                    backgroundColor: '#f6f3ec',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    padding: '24px',
                    zIndex: 200,
                    borderTop: '4px solid #dda943', // Evolve Gold top border
                  }}>
                    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                      <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px', color: '#17271f' }}>
                        EVOLVE REWARDS
                      </div>
                      <h3 style={{ fontSize: '1.5rem', fontWeight: 400, color: '#17271f', margin: 0 }}>Welcome!</h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <button
                        onClick={() => { openAuthModal('signin'); setUserMenuOpen(false); }}
                        style={{
                          backgroundColor: '#173f34',
                          color: '#ffffff',
                          border: 'none',
                          padding: '14px',
                          fontSize: '1rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          width: '100%',
                          textAlign: 'center',
                          borderRadius: '8px'
                        }}
                      >
                        Login as member
                      </button>
                      <button
                        onClick={() => { openAuthModal('signup'); setUserMenuOpen(false); }}
                        style={{
                          backgroundColor: '#dda943',
                          color: '#17271f',
                          border: 'none',
                          padding: '14px',
                          fontSize: '1rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          width: '100%',
                          textAlign: 'center',
                          borderRadius: '8px'
                        }}
                      >
                        Create a member account
                      </button>
                      <button
                        onClick={() => { openAuthModal('guest_login'); setUserMenuOpen(false); }}
                        style={{
                          backgroundColor: '#ffffff',
                          color: '#17271f',
                          border: '1px solid #e2ded5',
                          padding: '12px',
                          fontSize: '0.9375rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          width: '100%',
                          textAlign: 'center',
                          borderRadius: '8px',
                          marginTop: '4px'
                        }}
                      >
                        Sign in as Guest
                      </button>
                    </div>

                    <div style={{ marginTop: '24px', fontSize: '0.875rem', color: '#17271f', textAlign: 'left', lineHeight: 1.5 }}>
                      Already a member but don't have an online account? <span style={{ color: '#173f34', cursor: 'pointer', fontWeight: 700, textDecoration: 'underline' }}>Set Up Your Account</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="mobile-nav-toggle"
              style={{
                display: 'none', // Overridden in responsive CSS below
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                border: '1px solid #e2ded5',
                cursor: 'pointer',
                color: '#173f34'
              }}
              aria-label="Toggle Menu"
            >
              {mobileNavOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileNavOpen && (
          <div style={{
            backgroundColor: '#ffffff',
            borderTop: '1px solid #eeece5',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <button
              onClick={() => { navigateTo('corporate-booking'); setMobileNavOpen(false); }}
              style={{
                backgroundColor: '#dda943',
                color: '#17271f',
                padding: '12px 18px',
                borderRadius: '12px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: 'none'
              }}
            >
              <span>Group Booking / Corporate Rate</span>
              <ArrowUpRight size={18} />
            </button>

            <button
              onClick={() => { navigateTo('landing'); setMobileNavOpen(false); }}
              style={{
                padding: '12px 16px',
                textAlign: 'left',
                fontWeight: 600,
                color: currentRoute === 'landing' ? '#173f34' : '#17271f',
                backgroundColor: currentRoute === 'landing' ? '#f6f3ec' : 'transparent',
                borderRadius: '10px'
              }}
            >
              Home
            </button>

            <button
              onClick={() => { navigateTo('search'); setMobileNavOpen(false); }}
              style={{
                padding: '12px 16px',
                textAlign: 'left',
                fontWeight: 600,
                color: currentRoute === 'search' ? '#173f34' : '#17271f',
                backgroundColor: currentRoute === 'search' ? '#f6f3ec' : 'transparent',
                borderRadius: '10px'
              }}
            >
              Book Stays
            </button>

            {(currentUser || currentPersona === 'guest') && (
              <button
                onClick={() => { navigateTo('stays'); setMobileNavOpen(false); }}
                style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  fontWeight: 600,
                  color: currentRoute === 'stays' ? '#173f34' : '#17271f',
                  backgroundColor: currentRoute === 'stays' ? '#f6f3ec' : 'transparent',
                  borderRadius: '10px'
                }}
              >
                My Bookings & Stays
              </button>
            )}

            {isMember && (
              <button
                onClick={() => { navigateTo('membership'); setMobileNavOpen(false); }}
                style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  fontWeight: 600,
                  color: '#997125',
                  backgroundColor: '#fcf6eb',
                  borderRadius: '10px'
                }}
              >
                Evolve Rewards & Tiers
              </button>
            )}

            {activeStay && isMember && (
              <button
                onClick={() => { navigateTo('in-stay-breakfast'); setMobileNavOpen(false); }}
                style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  fontWeight: 600,
                  color: '#173f34',
                  backgroundColor: '#e8edea',
                  borderRadius: '10px'
                }}
              >
                In-Stay Breakfast & Room Folio
              </button>
            )}

            <button
              onClick={() => { navigateTo('support'); setMobileNavOpen(false); }}
              style={{
                padding: '12px 16px',
                textAlign: 'left',
                fontWeight: 600,
                color: '#17271f',
                borderRadius: '10px'
              }}
            >
              Support Concierge
            </button>
          </div>
        )}
      </header>

      {/* Responsive CSS override for desktop vs mobile toggle */}
      <style>{`
        @media (max-width: 900px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-nav-toggle {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
};
