import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { mockSupportTickets } from '../data/mockSupport';
import { SupportTicket } from '../types';
import { supportService } from '../services';
import { CheckCircle2, Clock, Eye, MessageSquare, X } from 'lucide-react';

export const SupportPage: React.FC = () => {
  const { currentUser, addToast } = useApp();

  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    try {
      const saved = localStorage.getItem('evolve_support_tickets_v1');
      if (saved) {
        return JSON.parse(saved);
      }
      localStorage.setItem('evolve_support_tickets_v1', JSON.stringify(mockSupportTickets));
      return mockSupportTickets;
    } catch {
      return mockSupportTickets;
    }
  });

  const [newTicketModal, setNewTicketModal] = useState(false);
  const [selectedTicketForModal, setSelectedTicketForModal] = useState<SupportTicket | null>(null);

  // Sync support tickets from other tabs / Admin Portal in real time
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'evolve_support_tickets_v1' && e.newValue) {
        try {
          setTickets(JSON.parse(e.newValue));
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // New ticket form state
  const [topic, setTopic] = useState('Rewards question');
  const [reservationNumber, setReservationNumber] = useState('');
  const [concern, setConcern] = useState('');
  const [preferredReply, setPreferredReply] = useState('Text message');

  const getNormalizedStatus = (rawStatus: string): 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' => {
    const s = (rawStatus || '').toUpperCase().replace(/[- ]/g, '_');
    if (s.includes('RESOLV')) return 'RESOLVED';
    if (s.includes('CLOSE')) return 'CLOSED';
    if (s.includes('PROGRESS')) return 'IN_PROGRESS';
    return 'OPEN';
  };

  const getStatusBadge = (rawStatus: string) => {
    const norm = getNormalizedStatus(rawStatus);
    if (norm === 'RESOLVED') {
      return {
        label: 'Resolved',
        bg: '#dcfce7',
        color: '#15803d',
        border: '#86efac',
        icon: <CheckCircle2 size={13} />
      };
    }
    if (norm === 'CLOSED') {
      return {
        label: 'Closed',
        bg: '#f1f5f9',
        color: '#475569',
        border: '#cbd5e1',
        icon: <CheckCircle2 size={13} />
      };
    }
    if (norm === 'IN_PROGRESS') {
      return {
        label: 'In Progress',
        bg: '#eff6ff',
        color: '#1d4ed8',
        border: '#93c5fd',
        icon: <Clock size={13} />
      };
    }
    return {
      label: 'Open',
      bg: '#fef3c7',
      color: '#92400e',
      border: '#fde68a',
      icon: <Clock size={13} />
    };
  };

  const getLatestResolutionNote = (ticket: SupportTicket): string => {
    if (ticket.resolutionNotes) return ticket.resolutionNotes;
    if (ticket.messages && ticket.messages.length > 0) {
      const staffMessages = ticket.messages.filter(m => m.sender === 'CONCIERGE' || m.sender === 'ADMIN');
      if (staffMessages.length > 0) {
        return staffMessages[staffMessages.length - 1].text;
      }
    }
    return '';
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!concern.trim()) return;

    const sender = currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Guest Visitor';
    const categoryMap: any = {
      'Rewards question': 'MEMBERSHIP',
      'Reservation issue': 'RESERVATION',
      'In-stay request': 'IN_STAY',
      'Billing': 'BILLING',
      'Other': 'GENERAL'
    };

    const ticket = await supportService.createTicket(
      topic,
      categoryMap[topic] || 'GENERAL',
      concern,
      sender
    );

    const nowStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const newTicket: SupportTicket = {
      ...ticket,
      status: 'OPEN',
      reservationNumber: reservationNumber || 'N/A',
      dateOpened: nowStr,
      dateClosed: '—',
      resolutionNotes: ''
    };

    const updated = [newTicket, ...tickets];
    setTickets(updated);
    try {
      localStorage.setItem('evolve_support_tickets_v1', JSON.stringify(updated));
    } catch {}

    setNewTicketModal(false);
    setConcern('');
    setReservationNumber('');
    setTopic('Rewards question');
    addToast('success', 'Case Created', `Case #${ticket.ticketNumber} created successfully.`);
  };

  return (
    <div style={{ backgroundColor: '#f6f3ec', minHeight: '100vh', padding: 'clamp(24px, 5vw, 60px) clamp(16px, 4vw, 20px)' }}>
      <div className="app-container" style={{ maxWidth: '1300px', margin: '0 auto' }}>
        
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: 'clamp(20px, 4vw, 40px)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
            <div>
              <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', fontWeight: 800, color: '#17271f', marginBottom: '8px' }}>
                Questions &amp; Support
              </h1>
              <p style={{ color: '#6e7a76', fontSize: '1rem', lineHeight: 1.5 }}>
                Follow every update on your cases here.
              </p>
            </div>
            
            <button 
              onClick={() => setNewTicketModal(true)}
              style={{ 
                backgroundColor: '#173f34', 
                color: '#ffffff', 
                padding: '12px 24px', 
                borderRadius: '8px', 
                fontSize: '1rem', 
                fontWeight: 700, 
                border: 'none', 
                cursor: 'pointer',
              }}
            >
              Open a Case or Ask a Question
            </button>
          </div>

          <div className="table-responsive">
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '980px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #eeece5' }}>
                  <th style={{ padding: '16px', color: '#17271f', fontWeight: 700, fontSize: '0.9rem' }}>Ticket No.</th>
                  <th style={{ padding: '16px', color: '#17271f', fontWeight: 700, fontSize: '0.9rem' }}>Topic</th>
                  <th style={{ padding: '16px', color: '#17271f', fontWeight: 700, fontSize: '0.9rem' }}>Reservation No.</th>
                  <th style={{ padding: '16px', color: '#17271f', fontWeight: 700, fontSize: '0.9rem' }}>Description</th>
                  <th style={{ padding: '16px', color: '#17271f', fontWeight: 700, fontSize: '0.9rem' }}>Status</th>
                  <th style={{ padding: '16px', color: '#17271f', fontWeight: 700, fontSize: '0.9rem' }}>Notes &amp; Resolution</th>
                  <th style={{ padding: '16px', color: '#17271f', fontWeight: 700, fontSize: '0.9rem' }}>Date Opened</th>
                  <th style={{ padding: '16px', color: '#17271f', fontWeight: 700, fontSize: '0.9rem' }}>Date Closed</th>
                  <th style={{ padding: '16px', color: '#17271f', fontWeight: 700, fontSize: '0.9rem', textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {tickets.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ padding: '32px', textAlign: 'center', color: '#6e7a76' }}>
                      No cases found.
                    </td>
                  </tr>
                ) : (
                  tickets.map((ticket, index) => (
                    <tr key={ticket.id} style={{ borderBottom: '1px solid #eeece5', backgroundColor: index % 2 === 0 ? '#ffffff' : '#faf9f5' }}>
                      <td style={{ padding: '16px', color: '#173f34', fontWeight: 700, fontSize: '0.9rem' }}>
                        {ticket.ticketNumber}
                      </td>
                      <td style={{ padding: '16px', color: '#17271f', fontSize: '0.9rem' }}>
                        {ticket.category}
                      </td>
                      <td style={{ padding: '16px', color: '#6e7a76', fontSize: '0.9rem' }}>
                        {(ticket as any).reservationNumber || ticket.reservationReference || 'N/A'}
                      </td>
                      <td style={{ padding: '16px', color: '#17271f', fontSize: '0.9rem', maxWidth: '240px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {ticket.subject}
                      </td>

                      {/* Status updated by admin */}
                      <td style={{ padding: '16px', whiteSpace: 'nowrap' }}>
                        {(() => {
                          const badge = getStatusBadge(ticket.status);
                          return (
                            <span style={{ 
                              fontSize: '0.75rem', 
                              fontWeight: 800, 
                              padding: '5px 12px', 
                              borderRadius: '999px',
                              backgroundColor: badge.bg,
                              color: badge.color,
                              border: `1px solid ${badge.border}`,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px'
                            }}>
                              {badge.icon}
                              {badge.label}
                            </span>
                          );
                        })()}
                      </td>

                      {/* Notes & Resolution Column */}
                      <td style={{ padding: '16px', fontSize: '0.875rem', maxWidth: '280px' }}>
                        {(() => {
                          const norm = getNormalizedStatus(ticket.status);
                          const isResolvedOrClosed = norm === 'RESOLVED' || norm === 'CLOSED';
                          const noteText = getLatestResolutionNote(ticket);

                          if (isResolvedOrClosed) {
                            return (
                              <div style={{
                                backgroundColor: '#f0fdf4',
                                border: '1px solid #bbf7d0',
                                borderRadius: '8px',
                                padding: '8px 10px',
                                color: '#166534',
                                lineHeight: 1.4,
                                fontSize: '0.82rem'
                              }}>
                                <div style={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                                  <CheckCircle2 size={13} color="#15803d" /> Resolution Note
                                </div>
                                <div style={{
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical'
                                }}>
                                  {noteText || 'Case reviewed and verified by management.'}
                                </div>
                              </div>
                            );
                          }
                          
                          if (noteText) {
                            return (
                              <div style={{
                                backgroundColor: '#eff6ff',
                                border: '1px solid #bfdbfe',
                                borderRadius: '8px',
                                padding: '8px 10px',
                                color: '#1e40af',
                                lineHeight: 1.4,
                                fontSize: '0.82rem'
                              }}>
                                <div style={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                                  <Clock size={13} color="#2563eb" /> Staff Note
                                </div>
                                <div style={{
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical'
                                }}>
                                  {noteText}
                                </div>
                              </div>
                            );
                          }

                          return (
                            <span style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '0.82rem' }}>
                              Awaiting admin / staff notes
                            </span>
                          );
                        })()}
                      </td>

                      <td style={{ padding: '16px', color: '#6e7a76', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
                        {ticket.dateOpened || 'Oct 13, 2026'}
                      </td>
                      <td style={{ padding: '16px', color: '#6e7a76', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
                        {(() => {
                          const norm = getNormalizedStatus(ticket.status);
                          if (norm === 'RESOLVED' || norm === 'CLOSED') {
                            return ticket.dateClosed && ticket.dateClosed !== '—' ? ticket.dateClosed : 'Oct 13, 2026';
                          }
                          return '—';
                        })()}
                      </td>

                      <td style={{ padding: '16px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                        <button
                          type="button"
                          onClick={() => setSelectedTicketForModal(ticket)}
                          style={{
                            backgroundColor: '#ffffff',
                            color: '#173f34',
                            border: '1.5px solid #173f34',
                            borderRadius: '8px',
                            padding: '6px 14px',
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <Eye size={14} /> View Notes
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* VIEW NOTES & RESOLUTION MODAL */}
      {selectedTicketForModal && (
        <div 
          className="modal-overlay" 
          onClick={() => setSelectedTicketForModal(null)} 
          style={{ 
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(3px)',
            zIndex: 1100, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            padding: '20px' 
          }}
        >
          <div 
            className="modal-content" 
            onClick={(e) => e.stopPropagation()} 
            style={{ 
              maxWidth: '620px', 
              width: '100%', 
              padding: '32px', 
              borderRadius: '20px', 
              backgroundColor: '#ffffff',
              boxShadow: '0 24px 70px rgba(0,0,0,0.22)',
              position: 'relative',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#997125', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  CASE DETAILS &amp; RESOLUTION HISTORY
                </span>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.75rem', color: '#17271f', margin: '4px 0 0', fontWeight: 800 }}>
                  Case #{selectedTicketForModal.ticketNumber}
                </h2>
                <div style={{ fontSize: '0.9rem', color: '#6e7a76', marginTop: '4px' }}>
                  {selectedTicketForModal.subject}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedTicketForModal(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6e7a76',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Status & Key Meta */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              backgroundColor: '#fbfaf8', 
              padding: '12px 16px', 
              borderRadius: '12px', 
              border: '1px solid #eeece5',
              marginBottom: '20px',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#6e7a76', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
                  Topic / Category
                </span>
                <span style={{ fontWeight: 700, color: '#17271f', fontSize: '0.9rem' }}>
                  {selectedTicketForModal.category}
                </span>
              </div>

              <div>
                <span style={{ fontSize: '0.72rem', color: '#6e7a76', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
                  Reservation Ref
                </span>
                <span style={{ fontWeight: 700, color: '#17271f', fontSize: '0.9rem' }}>
                  {(selectedTicketForModal as any).reservationNumber || selectedTicketForModal.reservationReference || 'N/A'}
                </span>
              </div>

              <div>
                <span style={{ fontSize: '0.72rem', color: '#6e7a76', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
                  Status Updated by Admin
                </span>
                {(() => {
                  const badge = getStatusBadge(selectedTicketForModal.status);
                  return (
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      padding: '3px 10px',
                      borderRadius: '999px',
                      backgroundColor: badge.bg,
                      color: badge.color,
                      border: `1px solid ${badge.border}`
                    }}>
                      {badge.icon}
                      {badge.label}
                    </span>
                  );
                })()}
              </div>
            </div>

            {/* Official Resolution Notes banner (if resolved or closed) */}
            {(() => {
              const normStatus = getNormalizedStatus(selectedTicketForModal.status);
              const isResolvedOrClosed = normStatus === 'RESOLVED' || normStatus === 'CLOSED';
              const resNote = getLatestResolutionNote(selectedTicketForModal);
              
              if (isResolvedOrClosed && resNote) {
                return (
                  <div style={{
                    backgroundColor: '#f0fdf4',
                    border: '1.5px solid #86efac',
                    borderRadius: '12px',
                    padding: '16px 18px',
                    marginBottom: '20px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#15803d', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
                      <CheckCircle2 size={16} /> Official Resolution Notes:
                    </div>
                    <div style={{ fontSize: '0.92rem', color: '#14532d', lineHeight: 1.5, fontWeight: 600 }}>
                      {resNote}
                    </div>
                    {selectedTicketForModal.dateClosed && selectedTicketForModal.dateClosed !== '—' && (
                      <div style={{ fontSize: '0.75rem', color: '#15803d', marginTop: '6px' }}>
                        Closed on {selectedTicketForModal.dateClosed}
                      </div>
                    )}
                  </div>
                );
              }
              return null;
            })()}

            {/* Timeline of all notes / messages added */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <MessageSquare size={16} color="#173f34" />
                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#17271f' }}>
                  All Notes &amp; Communication History
                </h4>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {selectedTicketForModal.messages && selectedTicketForModal.messages.length > 0 ? (
                  selectedTicketForModal.messages.map(msg => {
                    const isStaff = msg.sender === 'CONCIERGE' || msg.sender === 'ADMIN';
                    return (
                      <div
                        key={msg.id}
                        style={{
                          backgroundColor: isStaff ? '#f8fafc' : '#faf9f5',
                          border: isStaff ? '1px solid #cbd5e1' : '1px solid #eeece5',
                          borderRadius: '12px',
                          padding: '14px 16px',
                          borderLeft: isStaff ? '4px solid #173f34' : '4px solid #b3832c'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '6px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: 800, fontSize: '0.88rem', color: '#17271f' }}>
                              {msg.senderName}
                            </span>
                            <span style={{
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              padding: '2px 8px',
                              borderRadius: '4px',
                              backgroundColor: isStaff ? '#e0f2fe' : '#fef3c7',
                              color: isStaff ? '#0369a1' : '#92400e'
                            }}>
                              {isStaff ? 'Staff / Concierge' : 'Guest'}
                            </span>
                          </div>
                          <span style={{ fontSize: '0.75rem', color: '#6e7a76' }}>
                            {msg.timestamp}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.88rem', color: '#17271f', lineHeight: 1.5 }}>
                          {msg.text}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div style={{ padding: '16px', textAlign: 'center', color: '#6e7a76', fontSize: '0.88rem', backgroundColor: '#fbfaf8', borderRadius: '10px' }}>
                    No communication notes recorded yet.
                  </div>
                )}
              </div>
            </div>

            {/* Close button */}
            <button
              type="button"
              onClick={() => setSelectedTicketForModal(null)}
              style={{
                width: '100%',
                backgroundColor: '#173f34',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                padding: '13px 20px',
                fontSize: '0.95rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* NEW INQUIRY MODAL */}
      {newTicketModal && (
        <div className="modal-overlay" onClick={() => setNewTicketModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '32px', maxWidth: '500px', borderRadius: '24px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#997125', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
              EVOLVE GUEST SUPPORT
            </span>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', color: '#17271f', marginBottom: '12px' }}>
              How can we help?
            </h2>
            <p style={{ fontSize: '0.9375rem', color: '#6e7a76', marginBottom: '24px', lineHeight: 1.5 }}>
              Your message becomes a case visible to the Front Desk and Property Manager.
            </p>

            <form onSubmit={handleCreateTicket}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: '#17271f', marginBottom: '8px' }}>Topic</label>
                <select 
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e0ddd6', backgroundColor: '#ffffff', fontSize: '1rem', color: '#17271f' }}
                  value={topic} 
                  onChange={(e) => setTopic(e.target.value)}
                >
                  <option>Rewards question</option>
                  <option>Reservation issue</option>
                  <option>In-stay request</option>
                  <option>Billing</option>
                  <option>Other</option>
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: '#17271f', marginBottom: '8px' }}>Reservation number</label>
                <input
                  type="text"
                  placeholder="Optional"
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e0ddd6', fontSize: '1rem' }}
                  value={reservationNumber}
                  onChange={(e) => setReservationNumber(e.target.value)}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: '#17271f', marginBottom: '8px' }}>Your question or concern</label>
                <textarea
                  rows={4}
                  placeholder="Tell us what happened or what you need"
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e0ddd6', fontSize: '1rem', resize: 'vertical' }}
                  value={concern}
                  onChange={(e) => setConcern(e.target.value)}
                  required
                />
              </div>

              <div style={{ marginBottom: '32px' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: '#17271f', marginBottom: '8px' }}>Preferred reply</label>
                <select 
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e0ddd6', backgroundColor: '#ffffff', fontSize: '1rem', color: '#17271f' }}
                  value={preferredReply} 
                  onChange={(e) => setPreferredReply(e.target.value)}
                >
                  <option>Text message</option>
                  <option>Email</option>
                  <option>Phone call</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button type="submit" style={{ width: '100%', backgroundColor: '#173f34', color: '#ffffff', padding: '14px', borderRadius: '8px', fontSize: '1rem', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                  Submit Case
                </button>
                <button type="button" onClick={() => setNewTicketModal(false)} style={{ width: '100%', backgroundColor: '#ffffff', color: '#173f34', padding: '14px', borderRadius: '8px', fontSize: '1rem', fontWeight: 700, border: '1px solid #e0ddd6', cursor: 'pointer' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
