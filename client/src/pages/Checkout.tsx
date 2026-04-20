import React, { useState } from 'react';
import { useCartStore } from '../stores/cartStore';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { analytics } from '../lib/analytics';

const Checkout = () => {
  const { items } = useCartStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States'
  });
  const [deliverySpeed, setDeliverySpeed] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('card');

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const deliveryCharges = {
    standard: 0,
    express: 9.99,
    same_day: 19.99
  };
  const deliveryCharge = deliveryCharges[deliverySpeed as keyof typeof deliveryCharges];
  const total = subtotal + tax + deliveryCharge;

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    analytics.formSubmit('shipping_address', true);
    analytics.ctaClick('continue_to_delivery', 'checkout');
    setStep(2);
  };

  const handleDeliverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    analytics.formSubmit('delivery_method', true);
    analytics.ctaClick('continue_to_payment', 'checkout');
    setStep(3);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    analytics.formSubmit('payment_details', true);
    analytics.ctaClick('review_order', 'checkout');
    setStep(4);
  };

  const handlePlaceOrder = () => {
    analytics.purchase('ORD-12345', total);
    analytics.ctaClick('place_order', 'checkout');
    navigate('/order-confirmation/ORD-12345');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-text mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Progress Steps */}
          <div className="flex items-center mb-8">
            {[1, 2, 3, 4].map((s) => (
              <React.Fragment key={s}>
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  s <= step ? 'bg-accent text-primary-foreground' : 'bg-surface border border-border'
                }`}>
                  {s}
                </div>
                {s < 4 && (
                  <div className={`h-1 flex-1 mx-2 ${
                    s < step ? 'bg-accent' : 'bg-border'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Step 1: Shipping Address */}
          {step === 1 && (
            <form onSubmit={handleAddressSubmit} className="bg-surface p-6 rounded-lg border border-border">
              <h2 className="text-xl font-bold mb-6">Shipping Address</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-text_dim text-sm mb-1">First Name</label>
                  <Input 
                    value={address.firstName} 
                    onChange={(e) => setAddress({...address, firstName: e.target.value})}
                    required 
                  />
                </div>
                <div>
                  <label className="block text-text_dim text-sm mb-1">Last Name</label>
                  <Input 
                    value={address.lastName} 
                    onChange={(e) => setAddress({...address, lastName: e.target.value})}
                    required 
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-text_dim text-sm mb-1">Email</label>
                <Input 
                  type="email"
                  value={address.email} 
                  onChange={(e) => setAddress({...address, email: e.target.value})}
                  required 
                />
              </div>

              <div className="mb-4">
                <label className="block text-text_dim text-sm mb-1">Phone</label>
                <Input 
                  type="tel"
                  value={address.phone} 
                  onChange={(e) => setAddress({...address, phone: e.target.value})}
                  required 
                />
              </div>

              <div className="mb-4">
                <label className="block text-text_dim text-sm mb-1">Address</label>
                <Input 
                  value={address.address} 
                  onChange={(e) => setAddress({...address, address: e.target.value})}
                  required 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-text_dim text-sm mb-1">City</label>
                  <Input 
                    value={address.city} 
                    onChange={(e) => setAddress({...address, city: e.target.value})}
                    required 
                  />
                </div>
                <div>
                  <label className="block text-text_dim text-sm mb-1">State</label>
                  <Input 
                    value={address.state} 
                    onChange={(e) => setAddress({...address, state: e.target.value})}
                    required 
                  />
                </div>
                <div>
                  <label className="block text-text_dim text-sm mb-1">ZIP Code</label>
                  <Input 
                    value={address.zip} 
                    onChange={(e) => setAddress({...address, zip: e.target.value})}
                    required 
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-text_dim text-sm mb-1">Country</label>
                <select 
                  value={address.country}
                  onChange={(e) => setAddress({...address, country: e.target.value})}
                  className="w-full border border-border rounded px-3 py-2 bg-background"
                  required
                >
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="United Kingdom">United Kingdom</option>
                </select>
              </div>

              <Button type="submit">Continue to Delivery</Button>
            </form>
          )}

          {/* Step 2: Delivery Method */}
          {step === 2 && (
            <form onSubmit={handleDeliverySubmit} className="bg-surface p-6 rounded-lg border border-border">
              <h2 className="text-xl font-bold mb-6">Delivery Method</h2>
              
              <div className="space-y-4">
                {Object.entries(deliveryCharges).map(([speed, charge]) => (
                  <label key={speed} className="flex items-center space-x-3 p-4 border border-border rounded cursor-pointer hover:bg-surface/50">
                    <input
                      type="radio"
                      name="delivery"
                      value={speed}
                      checked={deliverySpeed === speed}
                      onChange={(e) => setDeliverySpeed(e.target.value)}
                      className="text-accent"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-text">
                        {speed.charAt(0).toUpperCase() + speed.slice(1)} Delivery
                      </div>
                      <div className="text-text_dim text-sm">
                        {speed === 'standard' && '5-7 business days'}
                        {speed === 'express' && '2-3 business days'}
                        {speed === 'same_day' && 'Same day delivery'}
                      </div>
                    </div>
                    <div className="text-primary font-bold">
                      {charge === 0 ? 'Free' : `$${charge.toFixed(2)}`}
                    </div>
                  </label>
                ))}
              </div>

              <div className="flex space-x-4 mt-6">
                <Button type="button" variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button type="submit">Continue to Payment</Button>
              </div>
            </form>
          )}

          {/* Step 3: Payment Method */}
          {step === 3 && (
            <form onSubmit={handlePaymentSubmit} className="bg-surface p-6 rounded-lg border border-border">
              <h2 className="text-xl font-bold mb-6">Payment Method</h2>
              
              <div className="space-y-4 mb-6">
                <label className="flex items-center space-x-3 p-4 border border-border rounded cursor-pointer hover:bg-surface/50">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-accent"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-text">Credit/Debit Card</div>
                    <div className="text-text_dim text-sm">Visa, Mastercard, American Express</div>
                  </div>
                </label>

                <label className="flex items-center space-x-3 p-4 border border-border rounded cursor-pointer hover:bg-surface/50">
                  <input
                    type="radio"
                    name="payment"
                    value="paypal"
                    checked={paymentMethod === 'paypal'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-accent"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-text">PayPal</div>
                    <div className="text-text_dim text-sm">Secure checkout with PayPal</div>
                  </div>
                </label>

                <label className="flex items-center space-x-3 p-4 border border-border rounded cursor-pointer hover:bg-surface/50">
                  <input
                    type="radio"
                    name="payment"
                    value="apple_pay"
                    checked={paymentMethod === 'apple_pay'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-accent"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-text">Apple Pay</div>
                    <div className="text-text_dim text-sm">Fast and secure payment</div>
                  </div>
                </label>
              </div>

              {paymentMethod === 'card' && (
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-text_dim text-sm mb-1">Card Number</label>
                    <Input placeholder="1234 5678 9012 3456" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-text_dim text-sm mb-1">Expiry Date</label>
                      <Input placeholder="MM/YY" required />
                    </div>
                    <div>
                      <label className="block text-text_dim text-sm mb-1">CVV</label>
                      <Input placeholder="123" required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-text_dim text-sm mb-1">Name on Card</label>
                    <Input required />
                  </div>
                </div>
              )}

              <div className="flex space-x-4 mt-6">
                <Button type="button" variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button type="submit">Review Order</Button>
              </div>
            </form>
          )}

          {/* Step 4: Order Review */}
          {step === 4 && (
            <div className="bg-surface p-6 rounded-lg border border-border">
              <h2 className="text-xl font-bold mb-6">Review Your Order</h2>
              
              <div className="space-y-4 mb-6">
                <div>
                  <h3 className="font-semibold text-text mb-2">Shipping Address</h3>
                  <p className="text-text_dim">
                    {address.firstName} {address.lastName}<br />
                    {address.address}<br />
                    {address.city}, {address.state} {address.zip}<br />
                    {address.country}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-text mb-2">Contact Information</h3>
                  <p className="text-text_dim">
                    {address.email}<br />
                    {address.phone}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-text mb-2">Delivery Method</h3>
                  <p className="text-text_dim capitalize">{deliverySpeed} Delivery</p>
                </div>

                <div>
                  <h3 className="font-semibold text-text mb-2">Payment Method</h3>
                  <p className="text-text_dim capitalize">{paymentMethod.replace('_', ' ')}</p>
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <h3 className="font-semibold text-text mb-4">Order Items</h3>
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 mb-4">
                    <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded" />
                    <div className="flex-1">
                      <h4 className="font-medium text-text">{item.title}</h4>
                      <p className="text-text_dim text-sm">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-primary font-bold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-6 space-y-2">
                <div className="flex justify-between">
                  <span className="text-text_dim">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text_dim">Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text_dim">Delivery</span>
                  <span>${deliveryCharge.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-border pt-2">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex space-x-4 mt-6">
                <Button type="button" variant="outline" onClick={() => setStep(3)}>
                  Back
                </Button>
                <Button 
                  className="bg-accent hover:bg-accent/90 text-primary-foreground flex-1"
                  onClick={handlePlaceOrder}
                >
                  Place Order
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-surface p-6 rounded-lg border border-border">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span className="text-text_dim">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text_dim">Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text_dim">Delivery</span>
              <span>${deliveryCharge.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t border-border pt-2">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>