import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Building2, Users, Calendar, Mail, Phone, Send } from 'lucide-react';

export const CorporateBookingPage: React.FC = () => {
  const { navigateTo, addToast } = useApp();
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    guestCount: '',
    dates: '',
    specialRequirements: ''
  });

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      addToast('success', 'Inquiry Submitted', 'Our corporate events team will contact you shortly.');
      navigateTo('landing');
    }, 1000);
  };

  return (
    <div style={{ backgroundColor: '#f6f3ec', minHeight: '100vh', padding: '32px 20px 80px' }}>
      <div className="app-container" style={{ maxWidth: '800px' }}>
        <button
          onClick={() => navigateTo('landing')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#173f34',
            fontWeight: 700,
            fontSize: '0.875rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            marginBottom: '24px'
          }}
        >
          <ArrowLeft size={16} /> Back to Home
        </button>

        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
          <span className="eyebrow-text">CORPORATE & GROUPS</span>
          <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.5rem)', color: '#17271f', marginTop: '8px' }}>
            Corporate Booking Inquiry
          </h1>
          <p style={{ color: '#6e7a76', fontSize: '1rem', marginTop: '12px', maxWidth: '600px', margin: '12px auto 0' }}>
            Looking to book for a large group or corporate event? Fill out the details below and our dedicated team will manually process your request and provide a tailored proposal.
          </p>
        </div>

        <div className="evolve-card" style={{ padding: '40px' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Building2 size={16} /> Company Name
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  placeholder="e.g. Acme Corp"
                  required
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Primary Contact Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Mail size={16} /> Email Address
                </label>
                <input
                  type="email"
                  className="form-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  required
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Phone size={16} /> Phone Number
                </label>
                <input
                  type="tel"
                  className="form-input"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Users size={16} /> Number of Guests / Rooms
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.guestCount}
                  onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
                  placeholder="e.g. 20 guests, 15 rooms"
                  required
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={16} /> Requested Dates
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.dates}
                  onChange={(e) => setFormData({ ...formData, dates: e.target.value })}
                  placeholder="e.g. Oct 14 - Oct 18"
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '32px' }}>
              <label className="form-label">Special Requirements or Comments</label>
              <textarea
                className="form-textarea"
                rows={4}
                value={formData.specialRequirements}
                onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
                placeholder="Tell us more about your event or group booking needs..."
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={submitting}
              style={{ padding: '16px', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <Send size={20} />
              {submitting ? 'Submitting Inquiry...' : 'Submit Corporate Inquiry'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
