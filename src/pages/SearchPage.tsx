import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { mockProperties } from '../data/mockProperties';
import { Property } from '../types';
import { MapPin, Star, Filter, ArrowRight, ShieldCheck, Sparkles, SlidersHorizontal, Check } from 'lucide-react';

export const SearchPage: React.FC = () => {
  const { setSelectedProperty, navigateTo, isMember } = useApp();

  const [selectedDestination, setSelectedDestination] = useState<string>('ALL');

  const availableCities = ['ALL', ...Array.from(new Set(mockProperties.map(p => p.city)))];

  const filteredProperties = mockProperties.filter(prop => {
    if (selectedDestination !== 'ALL' && prop.city !== selectedDestination) return false;
    return true;
  });

  return (
    <div style={{ backgroundColor: '#f6f3ec', minHeight: '100vh', padding: '40px 20px 80px' }}>
      <div className="app-container-wide">
        {/* Header Breadcrumb & Title */}
        <div style={{ marginBottom: '32px' }}>
          <span className="eyebrow-text">BOOK CATEGORY · EXPLORE DESTINATIONS</span>
          <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.5rem)', color: '#17271f', marginTop: '4px' }}>
            Curated Hotels & Suites Across America
          </h1>
          <p style={{ color: '#6e7a76', fontSize: '1rem', marginTop: '6px' }}>
            Flagship retreats in Texarkana, Uptown Dallas, Texas Medical Center Houston, and Little Rock.
          </p>
        </div>

        {/* Destination Filter Toolbar */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '16px 20px',
          boxShadow: '0 4px 16px rgba(23, 39, 31, 0.05)',
          border: '1px solid #eeece5',
          marginBottom: '32px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Destination Pills */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#17271f', marginRight: '4px' }}>
              Destination:
            </span>
            {availableCities.map(dest => (
              <button
                key={dest}
                onClick={() => setSelectedDestination(dest)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  border: '1.5px solid',
                  borderColor: selectedDestination === dest ? '#173f34' : '#e2ded5',
                  backgroundColor: selectedDestination === dest ? '#173f34' : '#ffffff',
                  color: selectedDestination === dest ? '#ffffff' : '#6e7a76',
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                {dest === 'ALL' ? `All Hotels (${mockProperties.length})` : dest}
              </button>
            ))}
          </div>
        </div>

        {/* Properties Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '32px'
        }}>
          {filteredProperties.map(prop => {
            const memberRate = Math.round(prop.startingRate * 0.85);
            return (
              <div
                key={prop.id}
                className="evolve-card evolve-card-interactive"
                style={{
                  borderRadius: '24px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  border: '1px solid #eeece5'
                }}
              >
                {/* Hero Photo */}
                <div style={{ position: 'relative', height: '260px' }}>
                  <img
                    src={prop.heroImage}
                    alt={prop.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    left: '16px',
                    backgroundColor: 'rgba(23, 39, 31, 0.9)',
                    backdropFilter: 'blur(8px)',
                    color: '#ffffff',
                    padding: '5px 12px',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Star size={13} fill="#dda943" color="#dda943" />
                    <span>{prop.reviewScore} ({prop.reviewCount} reviews)</span>
                  </div>

                  <div style={{
                    position: 'absolute',
                    bottom: '16px',
                    left: '16px',
                    backgroundColor: '#ffffff',
                    color: '#17271f',
                    padding: '4px 12px',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}>
                    <MapPin size={12} color="#dda943" />
                    <span>{prop.city}, {prop.country}</span>
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: '26px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '1.4rem', color: '#17271f', marginBottom: '8px' }}>
                      {prop.name}
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: '#6e7a76', lineHeight: 1.55, marginBottom: '20px' }}>
                      {prop.description}
                    </p>

                    {/* Amenity Pills */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '24px' }}>
                      {prop.amenities.slice(0, 3).map((amenity, idx) => (
                        <span
                          key={idx}
                          style={{
                            fontSize: '0.75rem',
                            padding: '4px 10px',
                            backgroundColor: '#f6f3ec',
                            color: '#173f34',
                            borderRadius: '6px',
                            fontWeight: 600
                          }}
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Pricing Box */}
                  <div style={{
                    backgroundColor: '#faf9f5',
                    borderRadius: '16px',
                    padding: '16px',
                    border: '1px solid #eeece5'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      {isMember ? (
                        <>
                          <div>
                            <div style={{ fontSize: '0.6875rem', color: '#929b98', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Standard Rate</div>
                            <div style={{ fontSize: '1.125rem', color: '#6e7a76', textDecoration: 'line-through' }}>
                              ${prop.startingRate}/night
                            </div>
                          </div>

                          <div style={{ textAlign: 'right' }}>
                            <div style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              backgroundColor: '#fcf6eb',
                              color: '#997125',
                              padding: '2px 8px',
                              borderRadius: '9999px',
                              fontSize: '0.6875rem',
                              fontWeight: 700,
                              marginBottom: '2px'
                            }}>
                              <Sparkles size={11} /> Member Rate (15% Off)
                            </div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#17271f' }}>
                              ${memberRate}
                              <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#6e7a76' }}> / night</span>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div>
                          <div style={{ fontSize: '0.6875rem', color: '#929b98', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Standard Rate</div>
                          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#17271f' }}>
                            ${prop.startingRate}
                            <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#6e7a76' }}> / night</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        setSelectedProperty(prop);
                        navigateTo('property-detail');
                      }}
                      className="btn btn-primary btn-full"
                      style={{ padding: '12px' }}
                    >
                      <span>Select Rooms & Rates</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
