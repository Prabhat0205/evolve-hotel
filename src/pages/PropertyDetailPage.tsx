import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { mockRoomsByProperty } from '../data/mockProperties';
import { Room, RoomRate } from '../types';
import { 
  MapPin, Star, Users, Check, Sparkles, Coffee, 
  ShieldAlert, Clock, ArrowLeft, ArrowRight, Bed 
} from 'lucide-react';

export const PropertyDetailPage: React.FC = () => {
  const { 
    selectedProperty, setSelectedRoom, setSelectedRate, 
    navigateTo, searchDates, setSearchDates, isMember, openAuthModal 
  } = useApp();

  const rooms = mockRoomsByProperty[selectedProperty.id] || mockRoomsByProperty['evolve-kyoto'];
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  const handleBookRate = (room: Room, rate: RoomRate) => {
    setSelectedRoom(room);
    setSelectedRate(rate);
    navigateTo('checkout');
  };

  return (
    <div style={{ backgroundColor: '#f6f3ec', minHeight: '100vh', padding: '32px 20px 80px' }}>
      <div className="app-container-wide">
        {/* Back Button */}
        <button
          onClick={() => navigateTo('search')}
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
            marginBottom: '20px'
          }}
        >
          <ArrowLeft size={16} /> Back to All Sanctuaries
        </button>

        {/* Property Overview Card */}
        <div className="evolve-card" style={{ padding: '32px', marginBottom: '40px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '36px',
            alignItems: 'center'
          }}>
            {/* Gallery */}
            <div>
              <div style={{ height: '360px', borderRadius: '18px', overflow: 'hidden', marginBottom: '12px' }}>
                <img
                  src={selectedProperty.gallery[selectedPhotoIndex] || selectedProperty.heroImage}
                  alt={selectedProperty.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', overflowX: 'auto' }}>
                {selectedProperty.gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedPhotoIndex(idx)}
                    style={{
                      width: '76px',
                      height: '56px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: selectedPhotoIndex === idx ? '2px solid #173f34' : '1px solid #eeece5',
                      padding: 0,
                      cursor: 'pointer',
                      flexShrink: 0
                    }}
                  >
                    <img src={img} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Overview Details */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: '#fcf6eb',
                  color: '#997125',
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 700
                }}>
                  <Star size={12} fill="#dda943" color="#dda943" />
                  <span>{selectedProperty.reviewScore} ({selectedProperty.reviewCount} reviews)</span>
                </div>
                <span style={{ fontSize: '0.8125rem', color: '#6e7a76' }}>
                  {selectedProperty.city}, {selectedProperty.country}
                </span>
              </div>

              <h1 style={{ fontSize: 'clamp(2rem, 3vw, 2.5rem)', color: '#17271f', marginBottom: '12px' }}>
                {selectedProperty.name}
              </h1>
              <p style={{ fontSize: '1rem', color: '#6e7a76', lineHeight: 1.65, marginBottom: '24px' }}>
                {selectedProperty.description}
              </p>

              {/* Amenities Grid */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#17271f', marginBottom: '10px' }}>
                  Signature Inclusions
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px' }}>
                  {selectedProperty.amenities.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', color: '#173f34' }}>
                      <Check size={14} color="#dda943" strokeWidth={3} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Check-In / Check-Out policy */}
              <div style={{
                display: 'flex',
                gap: '24px',
                padding: '14px 18px',
                backgroundColor: '#faf9f5',
                borderRadius: '12px',
                border: '1px solid #eeece5',
                fontSize: '0.8125rem',
                color: '#6e7a76'
              }}>
                <div>
                  <strong style={{ color: '#17271f' }}>Check-in:</strong> {selectedProperty.checkInTime}
                </div>
                <div>
                  <strong style={{ color: '#17271f' }}>Check-out:</strong> {selectedProperty.checkOutTime}
                </div>
                <div>
                  <strong style={{ color: '#17271f' }}>Direct Guarantee:</strong> 100% Lowest Rate
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Room Selection Heading */}
        <div style={{ marginBottom: '28px' }}>
          <span className="eyebrow-text">ACCOMMODATIONS</span>
          <h2 style={{ fontSize: '1.85rem', color: '#17271f' }}>
            Available Suites & Private Sanctuaries
          </h2>
          <p style={{ color: '#6e7a76', fontSize: '0.9375rem' }}>
            All rooms include high-speed fiber Wi-Fi, handcrafted bath amenities, and evening turndown service.
          </p>
        </div>

        {/* Room List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {rooms.map(room => (
            <div
              key={room.id}
              className="evolve-card"
              style={{
                borderRadius: '24px',
                overflow: 'hidden',
                border: '1px solid #eeece5',
                padding: '28px'
              }}
            >
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '32px',
              }}>
                {/* Room Photo & Specs */}
                <div>
                  <div style={{ height: '240px', borderRadius: '16px', overflow: 'hidden', marginBottom: '14px' }}>
                    <img src={room.images[0]} alt={room.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <h3 style={{ fontSize: '1.4rem', color: '#17271f', marginBottom: '6px' }}>
                    {room.name}
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#6e7a76', lineHeight: 1.5, marginBottom: '14px' }}>
                    {room.description}
                  </p>

                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '12px',
                    fontSize: '0.8125rem',
                    color: '#173f34',
                    fontWeight: 600,
                    marginBottom: '16px'
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Bed size={15} color="#dda943" /> {room.bedConfig}
                    </span>
                    <span>•</span>
                    <span>{room.sizeSqm} m² / {Math.round(room.sizeSqm * 10.76)} sq ft</span>
                    <span>•</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Users size={15} color="#dda943" /> Up to {room.maxGuests} guests
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {room.amenities.map((a, i) => (
                      <span key={i} style={{ fontSize: '0.75rem', padding: '3px 8px', backgroundColor: '#f6f3ec', borderRadius: '6px', color: '#6e7a76' }}>
                        {a}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Rates Comparison Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <h4 style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#17271f', marginBottom: '4px' }}>
                    Select Your Rate Plan:
                  </h4>

                  {room.rates.filter(rate => rate.rateType !== 'CORPORATE' && (isMember ? true : rate.rateType !== 'MEMBER_EXCLUSIVE')).map(rate => {
                    const isMemberRate = rate.rateType === 'MEMBER_EXCLUSIVE';
                    return (
                      <div
                        key={rate.id}
                        style={{
                          backgroundColor: isMemberRate ? '#fcf6eb' : '#faf9f5',
                          border: isMemberRate ? '2px solid #dda943' : '1px solid #eeece5',
                          borderRadius: '16px',
                          padding: '18px 20px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          gap: '12px'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            {isMemberRate && (
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                backgroundColor: '#dda943',
                                color: '#17271f',
                                padding: '2px 8px',
                                borderRadius: '9999px',
                                fontSize: '0.6875rem',
                                fontWeight: 800,
                                marginBottom: '6px'
                              }}>
                                <Sparkles size={11} /> MEMBER EXCLUSIVE • SAVE 15%
                              </span>
                            )}
                            <h5 style={{ fontSize: '1.05rem', color: '#17271f', fontWeight: 700, margin: 0 }}>
                              {rate.title}
                            </h5>
                            <p style={{ fontSize: '0.8125rem', color: '#6e7a76', marginTop: '4px' }}>
                              {rate.description}
                            </p>
                          </div>

                          <div style={{ textAlign: 'right', flexShrink: 0 }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#17271f' }}>
                              ${rate.nightlyPrice}
                            </div>
                            <span style={{ fontSize: '0.75rem', color: '#6e7a76' }}>per night</span>
                          </div>
                        </div>

                        {/* Inclusions & Policies */}
                        <div style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          paddingTop: '10px',
                          borderTop: '1px solid rgba(0,0,0,0.06)',
                          fontSize: '0.75rem',
                          color: '#173f34',
                          gap: '8px'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            {rate.includesBreakfast && isMember && (
                              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600, color: '#17653e' }}>
                                <Coffee size={13} /> Gourmet Breakfast Included
                              </span>
                            )}
                            <span style={{ color: '#6e7a76' }}>
                              Free cancellation up to {rate.cancellationPolicy.deadlineHoursPrior}h
                            </span>
                          </div>

                          <button
                            onClick={() => handleBookRate(room, rate)}
                            style={{
                              backgroundColor: isMemberRate ? '#dda943' : '#173f34',
                              color: isMemberRate ? '#17271f' : '#ffffff',
                              borderRadius: '10px',
                              padding: '8px 20px',
                              fontSize: '0.875rem',
                              fontWeight: 700,
                              border: 'none',
                              cursor: 'pointer',
                              boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                            }}
                          >
                            Book Rate →
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
