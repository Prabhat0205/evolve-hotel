import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { mockRoomsByProperty } from '../data/mockProperties';
import { Room, RoomRate } from '../types';
import { 
  MapPin, Star, Users, Check, Sparkles, Coffee, 
  ShieldAlert, Clock, ArrowLeft, ArrowRight, Bed,
  ShoppingBag, Plus, Minus, Trash2, ChevronLeft, ChevronRight, X, Calendar
} from 'lucide-react';

export const PropertyDetailPage: React.FC = () => {
  const { 
    selectedProperty, setSelectedRoom, setSelectedRate, 
    selectedRooms, addRoomToOrder, removeRoomFromOrder, updateRoomQuantity, clearRoomOrder,
    navigateTo, searchDates, setSearchDates, isMember, openAuthModal, addToast 
  } = useApp();

  const rooms = mockRoomsByProperty[selectedProperty.id] || mockRoomsByProperty['evolve-kyoto'];
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [roomPhotoIndices, setRoomPhotoIndices] = useState<Record<string, number>>({});
  const [detailModalRoom, setDetailModalRoom] = useState<Room | null>(null);

  const handlePrevPhoto = (roomId: string, maxPhotos: number) => {
    setRoomPhotoIndices(prev => {
      const current = prev[roomId] || 0;
      const nextIndex = current === 0 ? maxPhotos - 1 : current - 1;
      return { ...prev, [roomId]: nextIndex };
    });
  };

  const handleNextPhoto = (roomId: string, maxPhotos: number) => {
    setRoomPhotoIndices(prev => {
      const current = prev[roomId] || 0;
      const nextIndex = (current + 1) % maxPhotos;
      return { ...prev, [roomId]: nextIndex };
    });
  };

  const calculateNights = (inDateStr?: string, outDateStr?: string): number => {
    try {
      if (!inDateStr || !outDateStr) return 1;
      const dIn = new Date(inDateStr);
      const dOut = new Date(outDateStr);
      const diff = Math.round((dOut.getTime() - dIn.getTime()) / (1000 * 60 * 60 * 24));
      return diff > 0 ? diff : 1;
    } catch {
      return 1;
    }
  };

  const nights = calculateNights(searchDates.checkIn, searchDates.checkOut);
  const totalOrderedRooms = selectedRooms.reduce((sum, item) => sum + item.quantity, 0);
  const nightlySubtotal = selectedRooms.reduce((sum, item) => sum + item.rate.nightlyPrice * item.quantity, 0);
  const staySubtotal = nightlySubtotal * nights;
  const estimatedTaxes = Math.round(staySubtotal * 0.12);
  const estimatedTotal = staySubtotal + estimatedTaxes;

  const handleBookRate = (room: Room, rate: RoomRate) => {
    const existing = selectedRooms.find(item => item.room.id === room.id && item.rate.id === rate.id);
    if (!existing) {
      addRoomToOrder(room, rate, 1);
    }
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

        {/* Stay Dates & Duration Bar */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '16px 24px',
          marginBottom: '28px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          border: '1px solid #eeece5',
          boxShadow: '0 2px 10px rgba(23, 39, 31, 0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#173f34', fontWeight: 700, fontSize: '0.9375rem' }}>
              <Calendar size={18} color="#dda943" />
              <span>{searchDates.checkIn} → {searchDates.checkOut}</span>
              <span style={{ backgroundColor: '#f6f3ec', color: '#173f34', padding: '3px 10px', borderRadius: '9999px', fontSize: '0.8125rem' }}>
                {nights} Night{nights > 1 ? 's' : ''}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6e7a76', fontSize: '0.875rem' }}>
              <Users size={16} />
              <span>{searchDates.adults} Adults{searchDates.children > 0 ? `, ${searchDates.children} Children` : ''}</span>
            </div>
          </div>

          {isMember ? (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#fcf6eb',
              color: '#997125',
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '0.8125rem',
              fontWeight: 700
            }}>
              <Sparkles size={14} /> Evolve Member Privilege Rates Active
            </div>
          ) : (
            <button
              onClick={() => openAuthModal('signin')}
              style={{
                backgroundColor: '#fcf6eb',
                color: '#997125',
                border: '1px solid #dda943',
                padding: '6px 14px',
                borderRadius: '9999px',
                fontSize: '0.8125rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Sparkles size={14} /> Sign in as Member for Exclusive Rates
            </button>
          )}
        </div>

        {/* Active Room Order Banner if rooms selected */}
        {selectedRooms.length > 0 && (
          <div style={{
            backgroundColor: '#ffffff',
            border: '2px solid #dda943',
            borderRadius: '20px',
            padding: '24px 28px',
            marginBottom: '32px',
            boxShadow: '0 8px 24px rgba(23, 39, 31, 0.08)'
          }}>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              paddingBottom: '16px',
              borderBottom: '1px solid #eeece5'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: '#fcf6eb',
                  color: '#997125',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <ShoppingBag size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', color: '#17271f', margin: 0, fontWeight: 700 }}>
                    Your Room Order ({totalOrderedRooms} Room{totalOrderedRooms > 1 ? 's' : ''} Selected)
                  </h3>
                  <p style={{ fontSize: '0.8125rem', color: '#6e7a76', margin: '2px 0 0 0' }}>
                    {searchDates.checkIn} → {searchDates.checkOut} ({nights} Nights) • Room Subtotal: ${staySubtotal} USD (+ ${estimatedTaxes} tax = ${estimatedTotal} Total)
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  onClick={clearRoomOrder}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#c53929',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Trash2 size={14} /> Clear Order
                </button>
                <button
                  onClick={() => {
                    setSelectedRoom(selectedRooms[0].room);
                    setSelectedRate(selectedRooms[0].rate);
                    navigateTo('checkout');
                  }}
                  className="btn btn-primary"
                  style={{
                    padding: '10px 22px',
                    fontSize: '0.9375rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  Proceed to Checkout (${staySubtotal} • {nights}N) <ArrowRight size={16} />
                </button>
              </div>
            </div>

            {/* Selected Room Items Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', marginTop: '16px' }}>
              {selectedRooms.map(item => (
                <div 
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    backgroundColor: '#faf9f5',
                    border: '1px solid #eeece5'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                    <img 
                      src={item.room.images[0]} 
                      alt={item.room.name} 
                      style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }} 
                    />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#17271f', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.room.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#997125' }}>
                        {item.rate.title.split(' • ')[0]} · ${item.rate.nightlyPrice}/nt • ${item.rate.nightlyPrice * item.quantity * nights} ({nights}N)
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #d8d6cf',
                      borderRadius: '8px',
                      padding: '2px 6px'
                    }}>
                      <button
                        onClick={() => updateRoomQuantity(item.id, item.quantity - 1)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#17271f' }}
                        title="Reduce quantity"
                      >
                        <Minus size={13} />
                      </button>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 700, minWidth: '16px', textAlign: 'center' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateRoomQuantity(item.id, item.quantity + 1)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#17271f' }}
                        title="Increase quantity"
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeRoomFromOrder(item.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8c8a82', padding: '4px' }}
                      title="Remove from order"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Choose a Suite Section Header (matches screenshot) */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <span style={{
              fontSize: '0.8125rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              color: '#8c7355',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '6px'
            }}>
              AVAILABLE FOR YOUR STAY
            </span>
            <h2 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
              color: '#17271f',
              margin: 0,
              fontWeight: 500,
              lineHeight: 1.15
            }}>
              Choose a suite
            </h2>
          </div>

          <div style={{
            backgroundColor: '#dcece4',
            color: '#173f34',
            padding: '8px 18px',
            borderRadius: '9999px',
            fontSize: '0.875rem',
            fontWeight: 700,
            letterSpacing: '0.01em'
          }}>
            {rooms.length} suite types available
          </div>
        </div>

        {/* Room List - 3-Column Card Layout Matching Screenshot */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {rooms.map(room => {
            const currentPhotoIdx = roomPhotoIndices[room.id] || 0;
            const photoList = room.images && room.images.length > 0 ? room.images : [selectedProperty.heroImage];
            const currentPhoto = photoList[currentPhotoIdx % photoList.length];

            const memberRateObj = room.rates.find(r => r.rateType === 'MEMBER_EXCLUSIVE');
            const standardRateObj = room.rates.find(r => r.rateType === 'BEST_AVAILABLE') || room.rates[0];
            const primaryRate = (isMember && memberRateObj) ? memberRateObj : (memberRateObj || standardRateObj);
            const standardPrice = standardRateObj?.nightlyPrice || Math.round(primaryRate.nightlyPrice * 1.18);
            const memberPrice = memberRateObj?.nightlyPrice || primaryRate.nightlyPrice;
            const orderItem = selectedRooms.find(item => item.room.id === room.id);
            const currentQty = orderItem ? orderItem.quantity : 0;

            return (
              <div
                key={room.id}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  border: currentQty > 0 ? '2px solid #17653e' : '1px solid #e2ded5',
                  display: 'grid',
                  gridTemplateColumns: 'minmax(280px, 340px) 1fr minmax(210px, 240px)',
                  boxShadow: '0 4px 16px rgba(23, 39, 31, 0.04)',
                  alignItems: 'stretch',
                  transition: 'border-color 0.2s, box-shadow 0.2s'
                }}
              >
                {/* Column 1: Photo Carousel (Matches Screenshot) */}
                <div style={{
                  position: 'relative',
                  backgroundColor: '#4e6d62',
                  minHeight: '230px',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <img
                    src={currentPhoto}
                    alt={room.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      filter: 'brightness(0.92)'
                    }}
                  />

                  {/* Centered FINAL HOTEL PHOTO Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: 'rgba(23, 39, 31, 0.82)',
                    color: '#ffffff',
                    padding: '8px 18px',
                    borderRadius: '9999px',
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    pointerEvents: 'none',
                    backdropFilter: 'blur(6px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                  }}>
                    FINAL HOTEL PHOTO
                  </div>

                  {/* Bottom Carousel Controls (Matches Screenshot) */}
                  <div style={{
                    position: 'absolute',
                    bottom: '14px',
                    left: '14px',
                    right: '14px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    zIndex: 2
                  }}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrevPhoto(room.id, photoList.length);
                      }}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(23, 39, 31, 0.85)',
                        color: '#ffffff',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        backdropFilter: 'blur(4px)',
                        transition: 'transform 0.15s, background-color 0.15s'
                      }}
                      title="Previous photo"
                    >
                      <ChevronLeft size={18} />
                    </button>

                    <div style={{
                      backgroundColor: 'rgba(23, 39, 31, 0.85)',
                      color: '#ffffff',
                      padding: '4px 14px',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      backdropFilter: 'blur(4px)',
                      letterSpacing: '0.02em'
                    }}>
                      Photo {currentPhotoIdx + 1} of {photoList.length}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNextPhoto(room.id, photoList.length);
                      }}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(23, 39, 31, 0.85)',
                        color: '#ffffff',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        backdropFilter: 'blur(4px)',
                        transition: 'transform 0.15s, background-color 0.15s'
                      }}
                      title="Next photo"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>

                {/* Column 2: Suite Details (Matches Screenshot) */}
                <div style={{
                  padding: '28px 32px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '16px'
                }}>
                  <div>
                    <h3 style={{
                      fontFamily: 'Playfair Display, serif',
                      fontSize: '1.75rem',
                      color: '#17271f',
                      margin: '0 0 8px 0',
                      fontWeight: 600
                    }}>
                      {room.name}
                    </h3>
                    <p style={{
                      fontSize: '0.9375rem',
                      color: '#5b6763',
                      lineHeight: 1.5,
                      margin: '0 0 16px 0',
                      maxWidth: '480px'
                    }}>
                      {room.description}
                    </p>

                    {/* Features Row */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '20px',
                      fontSize: '0.875rem',
                      color: '#5b6763',
                      fontWeight: 500,
                      flexWrap: 'wrap'
                    }}>
                      <span>{room.maxGuests} adults</span>
                      <span>Smoke-free</span>
                      <span>Free Wi-Fi</span>
                    </div>
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={() => setDetailModalRoom(room)}
                      style={{
                        backgroundColor: '#1b3f35',
                        color: '#ffffff',
                        borderRadius: '10px',
                        padding: '12px 24px',
                        fontSize: '0.875rem',
                        fontWeight: 700,
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(27, 63, 53, 0.18)',
                        transition: 'background-color 0.15s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#133028'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1b3f35'}
                    >
                      View Photos & Suite Details
                    </button>
                  </div>
                </div>

                {/* Column 3: Pricing & Quantity Stepper (Matches Screenshot) */}
                <div style={{
                  borderLeft: '1px solid #eeece5',
                  padding: '30px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    {isMember ? (
                      <>
                        <div style={{
                          fontSize: '0.875rem',
                          color: '#8c8a82',
                          textDecoration: 'line-through',
                          marginBottom: '2px'
                        }}>
                          Standard ${standardPrice}
                        </div>
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          backgroundColor: '#fcf6eb',
                          color: '#997125',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          marginBottom: '6px'
                        }}>
                          <Sparkles size={11} /> Member Privilege (Save ${standardPrice - memberPrice}/nt)
                        </div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                          <span style={{
                            fontSize: '2rem',
                            fontWeight: 800,
                            color: '#17271f',
                            lineHeight: 1
                          }}>
                            ${memberPrice}
                          </span>
                          <span style={{ fontSize: '0.875rem', color: '#6e7a76', fontWeight: 500 }}>
                            / night
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div style={{
                          fontSize: '0.8125rem',
                          color: '#6e7a76',
                          fontWeight: 600,
                          marginBottom: '2px'
                        }}>
                          Standard Rate
                        </div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '6px' }}>
                          <span style={{
                            fontSize: '2rem',
                            fontWeight: 800,
                            color: '#17271f',
                            lineHeight: 1
                          }}>
                            ${standardPrice}
                          </span>
                          <span style={{ fontSize: '0.875rem', color: '#6e7a76', fontWeight: 500 }}>
                            / night
                          </span>
                        </div>
                        {memberRateObj && (
                          <button
                            type="button"
                            onClick={() => openAuthModal('signin')}
                            style={{
                              background: 'none',
                              border: 'none',
                              padding: 0,
                              color: '#997125',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              textAlign: 'left',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <Sparkles size={11} /> Member: ${memberPrice}/nt (Sign in)
                          </button>
                        )}
                      </>
                    )}
                  </div>

                  {/* Quantity Stepper with "[ - ]  1 selected  [ + ]" */}
                  <div style={{ marginTop: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => {
                          if (currentQty > 0 && orderItem) {
                            updateRoomQuantity(orderItem.id, currentQty - 1);
                          }
                        }}
                        disabled={currentQty === 0}
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '8px',
                          border: '1.5px solid #d8d6cf',
                          backgroundColor: '#ffffff',
                          color: currentQty === 0 ? '#b2c0bc' : '#17271f',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: currentQty === 0 ? 'not-allowed' : 'pointer',
                          transition: 'border-color 0.15s, color 0.15s'
                        }}
                        title="Decrease quantity"
                      >
                        <Minus size={16} strokeWidth={2.5} />
                      </button>

                      <div style={{ textAlign: 'center', minWidth: '50px' }}>
                        <div style={{
                          fontSize: '1.25rem',
                          fontWeight: 800,
                          color: '#17271f',
                          lineHeight: 1
                        }}>
                          {currentQty}
                        </div>
                        <div style={{
                          fontSize: '0.6875rem',
                          color: '#6e7a76',
                          marginTop: '3px',
                          fontWeight: 500
                        }}>
                          selected
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (orderItem) {
                            updateRoomQuantity(orderItem.id, currentQty + 1);
                          } else {
                            addRoomToOrder(room, primaryRate, 1);
                            addToast('success', 'Suite Added', `Added 1× ${room.name} to your order.`);
                          }
                        }}
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '8px',
                          border: 'none',
                          backgroundColor: '#1b3f35',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'background-color 0.15s',
                          boxShadow: '0 2px 6px rgba(27, 63, 53, 0.2)'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#133028'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1b3f35'}
                        title="Increase quantity"
                      >
                        <Plus size={16} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Suite Details & Photos Modal */}
        {detailModalRoom && (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: '20px'
          }}>
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              maxWidth: '780px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
              position: 'relative',
              padding: '32px'
            }}>
              <button
                type="button"
                onClick={() => setDetailModalRoom(null)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: '1px solid #eeece5',
                  backgroundColor: '#f6f3ec',
                  color: '#17271f',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>

              <span className="eyebrow-text">SUITE DETAILS & SPECIFICATIONS</span>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', color: '#17271f', margin: '4px 0 12px 0' }}>
                {detailModalRoom.name}
              </h2>
              <p style={{ color: '#6e7a76', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '24px' }}>
                {detailModalRoom.description}
              </p>

              {/* Gallery Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '24px' }}>
                {detailModalRoom.images.map((img, i) => (
                  <div key={i} style={{ height: '160px', borderRadius: '12px', overflow: 'hidden' }}>
                    <img src={img} alt="Suite View" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>

              {/* Amenities & Specs */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px', backgroundColor: '#faf9f5', padding: '20px', borderRadius: '16px' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#929b98', textTransform: 'uppercase', fontWeight: 700 }}>Bed Configuration</div>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#17271f', marginTop: '2px' }}>{detailModalRoom.bedConfig}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#929b98', textTransform: 'uppercase', fontWeight: 700 }}>Floor Space</div>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#17271f', marginTop: '2px' }}>{detailModalRoom.sizeSqm} m² / {Math.round(detailModalRoom.sizeSqm * 10.76)} sq ft</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#929b98', textTransform: 'uppercase', fontWeight: 700 }}>Occupancy</div>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#17271f', marginTop: '2px' }}>Up to {detailModalRoom.maxGuests} adults</div>
                </div>
              </div>

              <div style={{ marginBottom: '28px' }}>
                <h4 style={{ fontSize: '0.875rem', textTransform: 'uppercase', color: '#17271f', marginBottom: '10px' }}>In-Suite Amenities:</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {detailModalRoom.amenities.map((a, i) => (
                    <span key={i} style={{ padding: '6px 12px', backgroundColor: '#f6f3ec', borderRadius: '8px', fontSize: '0.8125rem', color: '#173f34', fontWeight: 500 }}>
                      ✓ {a}
                    </span>
                  ))}
                </div>
              </div>

              {(() => {
                const modalMemberRate = detailModalRoom.rates.find(r => r.rateType === 'MEMBER_EXCLUSIVE');
                const modalStandardRate = detailModalRoom.rates.find(r => r.rateType === 'BEST_AVAILABLE') || detailModalRoom.rates[0];
                const chosenRate = (isMember && modalMemberRate) ? modalMemberRate : (modalMemberRate || modalStandardRate);
                const standardPriceModal = modalStandardRate?.nightlyPrice || 149;
                const memberPriceModal = modalMemberRate?.nightlyPrice || chosenRate.nightlyPrice;

                return (
                  <>
                    {/* Rate & Pricing Card in Modal */}
                    <div style={{
                      backgroundColor: '#faf9f5',
                      border: '1.5px solid #dda943',
                      borderRadius: '16px',
                      padding: '18px 22px',
                      marginBottom: '24px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '14px'
                    }}>
                      <div>
                        <div style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          color: '#997125',
                          letterSpacing: '0.05em',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          <Sparkles size={13} />
                          {isMember ? 'Evolve Member Exclusive Privilege' : 'Standard Best Available Rate'}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
                          {isMember && modalStandardRate && (
                            <span style={{ fontSize: '1.05rem', color: '#8c8a82', textDecoration: 'line-through' }}>
                              ${standardPriceModal}
                            </span>
                          )}
                          <span style={{ fontSize: '1.85rem', fontWeight: 800, color: '#17271f' }}>
                            ${isMember ? memberPriceModal : standardPriceModal}
                          </span>
                          <span style={{ fontSize: '0.875rem', color: '#6e7a76', fontWeight: 500 }}>
                            / night
                          </span>
                          {isMember && modalStandardRate && (
                            <span style={{
                              backgroundColor: '#eaf5ee',
                              color: '#17653e',
                              padding: '3px 10px',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: 700
                            }}>
                              Save ${standardPriceModal - memberPriceModal}/night
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.8125rem', color: '#5b6763', marginTop: '4px' }}>
                          {isMember 
                            ? '✓ Includes complimentary made-to-order breakfast and 2x bonus reward nights' 
                            : '✓ Free cancellation up to 48 hours prior to check-in'}
                        </div>
                      </div>

                      {!isMember && modalMemberRate && (
                        <button
                          type="button"
                          onClick={() => {
                            setDetailModalRoom(null);
                            openAuthModal('signin');
                          }}
                          style={{
                            backgroundColor: '#fcf6eb',
                            color: '#997125',
                            border: '1.5px solid #dda943',
                            borderRadius: '10px',
                            padding: '8px 14px',
                            fontSize: '0.8125rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          Sign in for ${memberPriceModal}/nt rate
                        </button>
                      )}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                      <button
                        type="button"
                        onClick={() => setDetailModalRoom(null)}
                        className="btn btn-outline"
                        style={{ padding: '12px 20px' }}
                      >
                        Close
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          addRoomToOrder(detailModalRoom, chosenRate, 1);
                          setDetailModalRoom(null);
                          addToast('success', 'Suite Added', `Added 1× ${detailModalRoom.name} to your order.`);
                        }}
                        className="btn btn-primary"
                        style={{ padding: '12px 24px', fontWeight: 700 }}
                      >
                        Select this Suite (${isMember ? memberPriceModal : standardPriceModal}/night{isMember ? ' • Member Rate' : ''})
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}

        {/* Floating Order Bar */}
        {selectedRooms.length > 0 && (
          <div style={{
            position: 'fixed',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'min(94%, 960px)',
            backgroundColor: '#17271f',
            color: '#ffffff',
            borderRadius: '18px',
            padding: '16px 24px',
            boxShadow: '0 16px 40px rgba(0,0,0,0.35)',
            zIndex: 1000,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            border: '1.5px solid #dda943'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: '#dda943',
                color: '#17271f',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <ShoppingBag size={20} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#ffffff' }}>
                    {totalOrderedRooms} Room{totalOrderedRooms > 1 ? 's' : ''} in Order
                  </span>
                  <span style={{ backgroundColor: '#2a443b', color: '#dda943', padding: '2px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>
                    ${nightlySubtotal}/nt
                  </span>
                  <span style={{ color: '#ffffff', fontSize: '0.875rem', fontWeight: 700 }}>
                    · ${staySubtotal} Subtotal ({nights}N)
                  </span>
                </div>
                <div style={{ fontSize: '0.8125rem', color: '#b2c0bc', marginTop: '2px' }}>
                  {searchDates.checkIn} → {searchDates.checkOut} • {selectedRooms.map(item => `${item.quantity}× ${item.room.name}`).join(' • ')}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={clearRoomOrder}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#e2ded5',
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                  padding: '6px 8px',
                  textDecoration: 'underline'
                }}
              >
                Clear
              </button>

              <button
                onClick={() => {
                  setSelectedRoom(selectedRooms[0].room);
                  setSelectedRate(selectedRooms[0].rate);
                  navigateTo('checkout');
                }}
                style={{
                  backgroundColor: '#dda943',
                  color: '#17271f',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '0.9375rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(221, 169, 67, 0.35)'
                }}
              >
                Proceed to Checkout • ${estimatedTotal} Total ({nights}N) <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
