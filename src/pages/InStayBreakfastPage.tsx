import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { mockBreakfastMenu } from '../data/mockBreakfast';
import { BreakfastItem, BreakfastCategory } from '../types';
import { 
  Coffee, Clock, CheckCircle2, ShoppingBag, Plus, 
  Minus, Sparkles, ChefHat, Truck, ArrowRight, X 
} from 'lucide-react';
import { inStayService } from '../services';

export const InStayBreakfastPage: React.FC = () => {
  const { 
    currentUser, currentPersona, isMember, navigateTo, openAuthModal,
    activeStay, breakfastCart, addToBreakfastCart, 
    removeFromBreakfastCart, clearBreakfastCart, 
    activeBreakfastOrder, setActiveBreakfastOrder, 
    advanceBreakfastStatus, addToast 
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedDiet, setSelectedDiet] = useState<string>('ALL');
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [deliveryTime, setDeliveryTime] = useState('08:30 AM - 09:00 AM');
  const [dietaryNote, setDietaryNote] = useState('');

  if (!currentUser?.isMember || currentPersona === 'guest') {
    return (
      <div style={{ backgroundColor: '#f6f3ec', minHeight: '100vh', padding: '60px 20px 80px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="evolve-card" style={{ maxWidth: '600px', width: '100%', padding: '48px 40px', textAlign: 'center' }}>
          <div style={{
            width: '64px',
            height: '64px',
            backgroundColor: '#fcf6eb',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            border: '2px solid #dda943'
          }}>
            <Coffee size={32} color="#997125" />
          </div>
          <span className="eyebrow-text">MEMBER PRIVILEGE EXCLUSIVE</span>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', color: '#17271f', margin: '8px 0 16px' }}>
            Breakfast Ordering is a Member Privilege
          </h2>
          <p style={{ color: '#6e7a76', fontSize: '1rem', lineHeight: 1.6, marginBottom: '32px' }}>
            Complimentary artisan morning breakfast and in-room suite dining are exclusive privileges reserved for registered Evolve Members. Guest reservations and guest accounts do not include breakfast service.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <button
              onClick={() => openAuthModal(currentUser ? 'convert_to_member' : 'signup')}
              className="btn btn-primary"
              style={{ padding: '14px 24px', fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <Sparkles size={18} color="#dda943" />
              <span>{currentUser ? 'Upgrade to Evolve Member' : 'Sign Up to Unlock Breakfast'}</span>
            </button>
            <button
              onClick={() => navigateTo('stays')}
              className="btn btn-secondary"
              style={{ padding: '14px 24px', fontSize: '0.95rem' }}
            >
              View My Stays & Folios
            </button>
          </div>
        </div>
      </div>
    );
  }

  const stayInfo = activeStay || {
    assignedRoomNumber: 'Suite 408',
    propertyName: 'The Evolve Grand Palace Kyoto',
    confirmationCode: 'EV-882910'
  };

  const filteredItems = mockBreakfastMenu.filter(item => {
    if (selectedCategory !== 'ALL' && item.category !== selectedCategory) return false;
    if (selectedDiet !== 'ALL' && !item.dietaryTags.includes(selectedDiet as any)) return false;
    return true;
  });

  const cartTotal = breakfastCart.reduce((sum, i) => sum + (i.item.price * i.quantity), 0);
  const cartItemCount = breakfastCart.reduce((sum, i) => sum + i.quantity, 0);

  const handlePlaceOrder = async () => {
    if (breakfastCart.length === 0) return;

    try {
      const order = await inStayService.placeOrder({
        reservationId: stayInfo.confirmationCode,
        roomNumber: stayInfo.assignedRoomNumber,
        items: breakfastCart,
        deliverySlot: deliveryTime,
        totalAmount: cartTotal,
        isComplimentary: true, // Included in Prestige suite package
        dietaryNote,
      });

      setActiveBreakfastOrder(order);
      clearBreakfastCart();
      setCartDrawerOpen(false);
      addToast('success', 'Breakfast Order Transmitted!', `Order ${order.orderNumber} sent to Executive Kitchen.`);
    } catch (err: any) {
      addToast('error', 'Order Error', err.message);
    }
  };

  return (
    <div style={{ backgroundColor: '#f6f3ec', minHeight: '100vh', padding: '36px 20px 80px' }}>
      <div className="app-container-wide">
        {/* Top In-Stay Room Banner */}
        <div style={{
          backgroundColor: '#173f34',
          color: '#ffffff',
          borderRadius: '20px',
          padding: '24px 32px',
          marginBottom: '36px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#dda943', display: 'inline-block' }} />
              <span style={{ fontSize: '0.75rem', color: '#dda943', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                IN-ROOM DINING • {stayInfo.assignedRoomNumber}
              </span>
            </div>
            <h1 style={{ fontSize: '1.75rem', color: '#ffffff', margin: '4px 0 6px' }}>
              Artisan Morning Breakfast
            </h1>
            <p style={{ fontSize: '0.875rem', color: '#dbdedd', margin: 0 }}>
              {stayInfo.propertyName} • Included with your Evolve Prestige Suite
            </p>
          </div>

          {/* Ordering Window Countdown */}
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '14px',
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <Clock size={20} color="#dda943" />
            <div>
              <div style={{ fontSize: '0.75rem', color: '#dda943', fontWeight: 700 }}>
                ORDERING WINDOW ACTIVE
              </div>
              <div style={{ fontSize: '0.875rem', color: '#ffffff', fontWeight: 600 }}>
                Open until 10:30 AM (48 mins remaining)
              </div>
            </div>
          </div>
        </div>

        {/* ACTIVE ORDER STATUS TRACKER (IF ACTIVE ORDER EXISTS) */}
        {activeBreakfastOrder && (
          <div className="evolve-card" style={{ padding: '28px', marginBottom: '40px', border: '1.5px solid #dda943' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <span className="eyebrow-text">LIVE ORDER #{activeBreakfastOrder.orderNumber}</span>
                <h3 style={{ fontSize: '1.35rem', color: '#17271f', margin: '2px 0' }}>
                  Breakfast Preparation Tracker
                </h3>
                <div style={{ fontSize: '0.8125rem', color: '#6e7a76' }}>
                  Delivering to <strong>{activeBreakfastOrder.roomNumber}</strong> during window <strong>{activeBreakfastOrder.deliverySlot}</strong>
                </div>
              </div>

              {/* Status Simulation Action */}
              <button
                onClick={advanceBreakfastStatus}
                style={{
                  backgroundColor: '#dda943',
                  color: '#17271f',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '8px 16px',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Advance Status (Demo) ➔
              </button>
            </div>

            {/* 4-Stage Timeline Pipeline */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '16px',
              marginTop: '16px'
            }}>
              {[
                { stage: 'RECEIVED', label: '1. Order Received', time: activeBreakfastOrder.orderTime },
                { stage: 'BEING_PREPARED', label: '2. Being Prepared', time: 'Kitchen Preparing' },
                { stage: 'EN_ROUTE', label: '3. En Route to Suite', time: 'Tray Dispatched' },
                { stage: 'DELIVERED', label: '4. Delivered to Bed', time: 'Bon Appétit' },
              ].map((step, idx) => {
                const stages = ['RECEIVED', 'BEING_PREPARED', 'EN_ROUTE', 'DELIVERED'];
                const currentIdx = stages.indexOf(activeBreakfastOrder.status);
                const isPassed = currentIdx >= idx;
                const isCurrent = currentIdx === idx;

                return (
                  <div
                    key={step.stage}
                    style={{
                      backgroundColor: isCurrent ? '#fcf6eb' : (isPassed ? '#eaf5ee' : '#faf9f5'),
                      border: isCurrent ? '2px solid #dda943' : (isPassed ? '1.5px solid #17653e' : '1px solid #eeece5'),
                      borderRadius: '14px',
                      padding: '14px',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: isCurrent ? '#dda943' : (isPassed ? '#17653e' : '#e2ded5'),
                      color: isCurrent ? '#17271f' : '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 8px',
                      fontWeight: 700,
                      fontSize: '0.75rem'
                    }}>
                      {isPassed ? '✓' : idx + 1}
                    </div>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: isCurrent ? '#997125' : (isPassed ? '#17653e' : '#6e7a76') }}>
                      {step.label}
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: '#929b98', marginTop: '2px' }}>
                      {step.time}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Categories & Dietary Filter Bar */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '16px 20px',
          boxShadow: '0 4px 16px rgba(23, 39, 31, 0.05)',
          border: '1px solid #eeece5',
          marginBottom: '32px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Category Tabs */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { id: 'ALL', label: 'Complete Menu' },
              { id: 'CONTINENTAL', label: 'Continental' },
              { id: 'HOT_SPECIALS', label: 'Hot Specials' },
              { id: 'WELLNESS_BOWLS', label: 'Wellness Bowls' },
              { id: 'BEVERAGES', label: 'Coffee & Juices' },
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  padding: '7px 16px',
                  borderRadius: '9999px',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  backgroundColor: selectedCategory === cat.id ? '#173f34' : 'transparent',
                  color: selectedCategory === cat.id ? '#ffffff' : '#6e7a76',
                  border: selectedCategory === cat.id ? 'none' : '1px solid #e2ded5',
                  cursor: 'pointer'
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Cart Drawer Trigger */}
          <button
            onClick={() => setCartDrawerOpen(true)}
            style={{
              backgroundColor: '#dda943',
              color: '#17271f',
              borderRadius: '9999px',
              padding: '9px 20px',
              fontSize: '0.875rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <ShoppingBag size={16} />
            <span>Breakfast Tray ({cartItemCount})</span>
          </button>
        </div>

        {/* Menu Items Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px'
        }}>
          {filteredItems.map(item => (
            <div
              key={item.id}
              className="evolve-card"
              style={{
                borderRadius: '20px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid #eeece5'
              }}
            >
              <div style={{ height: '200px', position: 'relative' }}>
                <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                {item.isIncludedInPackage && (
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    backgroundColor: '#17653e',
                    color: '#ffffff',
                    padding: '3px 10px',
                    borderRadius: '9999px',
                    fontSize: '0.6875rem',
                    fontWeight: 700
                  }}>
                    ✓ In Suite Package ($0)
                  </div>
                )}
              </div>

              <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                    <h4 style={{ fontSize: '1.125rem', color: '#17271f', margin: 0 }}>{item.name}</h4>
                    <span style={{ fontSize: '1.125rem', fontWeight: 800, color: '#173f34' }}>
                      ${item.price}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: '#6e7a76', lineHeight: 1.5, marginBottom: '14px' }}>
                    {item.description}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                    {item.dietaryTags.map(tag => (
                      <span key={tag} style={{ fontSize: '0.6875rem', padding: '2px 8px', borderRadius: '6px', backgroundColor: '#f6f3ec', color: '#6e7a76' }}>
                        {tag.replace('_', ' ')}
                      </span>
                    ))}
                    {item.calories && (
                      <span style={{ fontSize: '0.6875rem', padding: '2px 8px', borderRadius: '6px', backgroundColor: '#faf9f5', color: '#929b98' }}>
                        {item.calories} kcal
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => addToBreakfastCart(item)}
                  className="btn btn-primary btn-full"
                  style={{ padding: '10px' }}
                >
                  <Plus size={16} /> Add to Room Tray
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Past Breakfast Orders */}
        <div style={{ marginTop: '48px', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#17271f', marginBottom: '20px' }}>
            Past Breakfasts Ordered
          </h2>
          <div style={{ overflowX: 'auto', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #eeece5', padding: '20px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #eeece5' }}>
                  <th style={{ padding: '16px', color: '#17271f', fontWeight: 700, fontSize: '0.9rem' }}>Date Placed</th>
                  <th style={{ padding: '16px', color: '#17271f', fontWeight: 700, fontSize: '0.9rem' }}>Property</th>
                  <th style={{ padding: '16px', color: '#17271f', fontWeight: 700, fontSize: '0.9rem' }}>Items (Qty)</th>
                  <th style={{ padding: '16px', color: '#17271f', fontWeight: 700, fontSize: '0.9rem' }}>Total Amount</th>
                  <th style={{ padding: '16px', color: '#17271f', fontWeight: 700, fontSize: '0.9rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #eeece5' }}>
                  <td style={{ padding: '16px', color: '#6e7a76', fontSize: '0.9rem' }}>Sep 05, 2026</td>
                  <td style={{ padding: '16px', color: '#17271f', fontSize: '0.9rem' }}>The Evolve Grand Palace Kyoto</td>
                  <td style={{ padding: '16px', color: '#17271f', fontSize: '0.9rem' }}>2 items</td>
                  <td style={{ padding: '16px', color: '#173f34', fontWeight: 700, fontSize: '0.9rem' }}>$0 (Included)</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '4px 10px', borderRadius: '999px', backgroundColor: '#eaf5ee', color: '#17653e', textTransform: 'uppercase' }}>
                      Delivered
                    </span>
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #eeece5', backgroundColor: '#faf9f5' }}>
                  <td style={{ padding: '16px', color: '#6e7a76', fontSize: '0.9rem' }}>Aug 12, 2026</td>
                  <td style={{ padding: '16px', color: '#17271f', fontSize: '0.9rem' }}>Evolve Resort Bali</td>
                  <td style={{ padding: '16px', color: '#17271f', fontSize: '0.9rem' }}>3 items</td>
                  <td style={{ padding: '16px', color: '#173f34', fontWeight: 700, fontSize: '0.9rem' }}>$45.00</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '4px 10px', borderRadius: '999px', backgroundColor: '#fcf6eb', color: '#997125', textTransform: 'uppercase' }}>
                      Cancelled
                    </span>
                  </td>
                </tr>
                <tr style={{ backgroundColor: '#ffffff' }}>
                  <td style={{ padding: '16px', color: '#6e7a76', fontSize: '0.9rem' }}>Jul 22, 2026</td>
                  <td style={{ padding: '16px', color: '#17271f', fontSize: '0.9rem' }}>Evolve City Central</td>
                  <td style={{ padding: '16px', color: '#17271f', fontSize: '0.9rem' }}>1 item</td>
                  <td style={{ padding: '16px', color: '#173f34', fontWeight: 700, fontSize: '0.9rem' }}>$18.00</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '4px 10px', borderRadius: '999px', backgroundColor: '#eaf5ee', color: '#17653e', textTransform: 'uppercase' }}>
                      Delivered
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* SLIDE-OVER BREAKFAST CART DRAWER */}
        {cartDrawerOpen && (
          <div className="modal-overlay" onClick={() => setCartDrawerOpen(false)}>
            <div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'fixed',
                right: 0,
                top: 0,
                bottom: 0,
                maxWidth: '460px',
                width: '100%',
                borderRadius: '0',
                padding: '32px 24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShoppingBag size={20} color="#173f34" />
                    <h3 style={{ fontSize: '1.25rem', color: '#17271f', margin: 0 }}>
                      Your Morning Tray
                    </h3>
                  </div>
                  <button onClick={() => setCartDrawerOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    <X size={20} color="#6e7a76" />
                  </button>
                </div>

                {breakfastCart.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '48px 0', color: '#6e7a76' }}>
                    <Coffee size={40} color="#929b98" style={{ margin: '0 auto 12px' }} />
                    <p>Your room service tray is empty.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '50vh', overflowY: 'auto' }}>
                    {breakfastCart.map(ci => (
                      <div
                        key={ci.item.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '12px',
                          backgroundColor: '#faf9f5',
                          borderRadius: '12px',
                          border: '1px solid #eeece5'
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 700, color: '#17271f', fontSize: '0.875rem' }}>
                            {ci.item.name}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#6e7a76' }}>
                            Qty: {ci.quantity} • ${ci.item.price * ci.quantity} USD
                          </div>
                        </div>

                        <button
                          onClick={() => removeFromBreakfastCart(ci.item.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#b91c1c',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {breakfastCart.length > 0 && (
                <div style={{ borderTop: '1px solid #eeece5', paddingTop: '20px' }}>
                  <div className="form-group">
                    <label className="form-label">Preferred Delivery Slot</label>
                    <select
                      className="form-select"
                      value={deliveryTime}
                      onChange={(e) => setDeliveryTime(e.target.value)}
                    >
                      <option value="07:30 AM - 08:00 AM">07:30 AM - 08:00 AM</option>
                      <option value="08:00 AM - 08:30 AM">08:00 AM - 08:30 AM</option>
                      <option value="08:30 AM - 09:00 AM">08:30 AM - 09:00 AM</option>
                      <option value="09:00 AM - 09:30 AM">09:00 AM - 09:30 AM</option>
                      <option value="09:30 AM - 10:00 AM">09:30 AM - 10:00 AM</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Kitchen Preparation Notes</label>
                    <input
                      type="text"
                      className="form-input"
                      value={dietaryNote}
                      onChange={(e) => setDietaryNote(e.target.value)}
                      placeholder="E.g., warm oat milk, gluten-conscious, dressing on side"
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.125rem', fontWeight: 800, margin: '16px 0' }}>
                    <span>Folio Total:</span>
                    <span>$0 (Suite Inclusions Applied)</span>
                  </div>

                  <button
                    onClick={handlePlaceOrder}
                    className="btn btn-secondary btn-full"
                    style={{ padding: '14px' }}
                  >
                    Place Breakfast Order for {stayInfo.assignedRoomNumber}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
