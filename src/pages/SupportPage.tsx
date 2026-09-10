import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { mockSupportTickets } from '../data/mockSupport';
import { SupportTicket } from '../types';
import { supportService } from '../services';

export const SupportPage: React.FC = () => {
  const { currentUser, addToast } = useApp();
  const [tickets, setTickets] = useState<SupportTicket[]>(mockSupportTickets);
  const [newTicketModal, setNewTicketModal] = useState(false);
  
  // New ticket form state
  const [topic, setTopic] = useState('Rewards question');
  const [reservationNumber, setReservationNumber] = useState('');
  const [concern, setConcern] = useState('');
  const [preferredReply, setPreferredReply] = useState('Text message');

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!concern.trim()) return;

    const sender = currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Guest Visitor';
    // Mapping topic to existing categories
    const categoryMap: any = {
      'Rewards question': 'MEMBERSHIP',
      'Reservation issue': 'RESERVATION',
      'In-stay request': 'IN_STAY',
      'Billing': 'BILLING',
      'Other': 'GENERAL'
    };
    
    const ticket = await supportService.createTicket(
      topic, // Subject
      categoryMap[topic] || 'GENERAL',
      concern,
      sender
    );

    const newTicket = {
      ...ticket,
      reservationNumber: reservationNumber || 'N/A'
    };

    setTickets([newTicket, ...tickets]);
    setNewTicketModal(false);
    setConcern('');
    setReservationNumber('');
    setTopic('Rewards question');
    addToast('success', 'Case Created', `Case #${ticket.ticketNumber} created successfully.`);
  };

  return (
    <div style={{ backgroundColor: '#f6f3ec', minHeight: '100vh', padding: '60px 20px' }}>
      <div className="app-container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '40px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
            <div>
              <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', fontWeight: 800, color: '#17271f', marginBottom: '8px' }}>
                Questions & Support
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

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #eeece5' }}>
                  <th style={{ padding: '16px', color: '#17271f', fontWeight: 700, fontSize: '0.9rem' }}>Ticket No.</th>
                  <th style={{ padding: '16px', color: '#17271f', fontWeight: 700, fontSize: '0.9rem' }}>Topic</th>
                  <th style={{ padding: '16px', color: '#17271f', fontWeight: 700, fontSize: '0.9rem' }}>Reservation No.</th>
                  <th style={{ padding: '16px', color: '#17271f', fontWeight: 700, fontSize: '0.9rem' }}>Description</th>
                  <th style={{ padding: '16px', color: '#17271f', fontWeight: 700, fontSize: '0.9rem' }}>Status</th>
                  <th style={{ padding: '16px', color: '#17271f', fontWeight: 700, fontSize: '0.9rem' }}>Date Opened</th>
                  <th style={{ padding: '16px', color: '#17271f', fontWeight: 700, fontSize: '0.9rem' }}>Date Closed</th>
                </tr>
              </thead>
              <tbody>
                {tickets.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '32px', textAlign: 'center', color: '#6e7a76' }}>
                      No cases found.
                    </td>
                  </tr>
                ) : (
                  tickets.map((ticket, index) => (
                    <tr key={ticket.id} style={{ borderBottom: '1px solid #eeece5', backgroundColor: index % 2 === 0 ? '#ffffff' : '#faf9f5' }}>
                      <td style={{ padding: '16px', color: '#173f34', fontWeight: 600, fontSize: '0.9rem' }}>
                        {ticket.ticketNumber}
                      </td>
                      <td style={{ padding: '16px', color: '#17271f', fontSize: '0.9rem' }}>
                        {ticket.category}
                      </td>
                      <td style={{ padding: '16px', color: '#6e7a76', fontSize: '0.9rem' }}>
                        {(ticket as any).reservationNumber || 'N/A'}
                      </td>
                      <td style={{ padding: '16px', color: '#17271f', fontSize: '0.9rem', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {ticket.subject}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span style={{ 
                          fontSize: '0.75rem', 
                          fontWeight: 700, 
                          padding: '4px 10px', 
                          borderRadius: '999px',
                          backgroundColor: '#f0f0f0',
                          color: '#6e7a76',
                          textTransform: 'uppercase',
                        }}>
                          {ticket.status}
                        </span>
                      </td>
                      <td style={{ padding: '16px', color: '#6e7a76', fontSize: '0.9rem' }}>
                        {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td style={{ padding: '16px', color: '#6e7a76', fontSize: '0.9rem' }}>
                        {ticket.status === 'RESOLVED' ? new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

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
