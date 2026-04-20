'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

const steps = ['Address', 'Delivery', 'Payment', 'Review'];

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
    delivery: 'standard',
    cardNumber: '',
    expiry: '',
    cvv: '',
    name: '',
  });
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Order Placed!',
      description: 'Your order has been confirmed. Check your email for details.',
    });
    // In a real app, this would call the API to create the order
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <form onSubmit={(e) => { e.preventDefault(); nextStep(); }}>
            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">ZIP Code</Label>
                    <Input
                      id="zip"
                      name="zip"
                      value={formData.zip}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-between pt-4">
                  <div></div>
                  <Button type="submit">Continue</Button>
                </div>
              </CardContent>
            </Card>
          </form>
        );
      case 1:
        return (
          <form onSubmit={(e) => { e.preventDefault(); nextStep(); }}>
            <Card>
              <CardHeader>
                <CardTitle>Delivery Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup
                  defaultValue="standard"
                  onValueChange={(value) => setFormData({ ...formData, delivery: value })}
                >
                  <div className="flex items-center space-x-2 border p-4 rounded">
                    <RadioGroupItem value="standard" id="standard" />
                    <Label htmlFor="standard">
                      <div className="font-medium">Standard Delivery</div>
                      <div className="text-sm text-gray-500">5-7 business days • Free</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border p-4 rounded">
                    <RadioGroupItem value="express" id="express" />
                    <Label htmlFor="express">
                      <div className="font-medium">Express Delivery</div>
                      <div className="text-sm text-gray-500">2-3 business days • $9.99</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border p-4 rounded">
                    <RadioGroupItem value="same-day" id="same-day" />
                    <Label htmlFor="same-day">
                      <div className="font-medium">Same-Day Delivery</div>
                      <div className="text-sm text-gray-500">Order within 3 hours • $19.99</div>
                    </Label>
                  </div>
                </RadioGroup>
                <div className="flex justify-between pt-4">
                  <Button type="button" variant="outline" onClick={prevStep}>
                    Back
                  </Button>
                  <Button type="submit">Continue</Button>
                </div>
              </CardContent>
            </Card>
          </form>
        );
      case 2:
        return (
          <form onSubmit={(e) => { e.preventDefault(); nextStep(); }}>
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="1234 5678 9012 3456"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      name="expiry"
                      value={formData.expiry}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      placeholder="123"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Name on Card</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="flex justify-between pt-4">
                  <Button type="button" variant="outline" onClick={prevStep}>
                    Back
                  </Button>
                  <Button type="submit">Continue</Button>
                </div>
              </CardContent>
            </Card>
          </form>
        );
      case 3:
        return (
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Review Order</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Shipping Address</h3>
                  <p>{formData.address}</p>
                  <p>{formData.city}, {formData.state} {formData.zip}</p>
                  <p>{formData.country}</p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Delivery Method</h3>
                  <p>
                    {formData.delivery === 'standard' && 'Standard Delivery - Free'}
                    {formData.delivery === 'express' && 'Express Delivery - $9.99'}
                    {formData.delivery === 'same-day' && 'Same-Day Delivery - $19.99'}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Payment Method</h3>
                  <p>Card ending in {formData.cardNumber.slice(-4)}</p>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between font-medium">
                    <span>Subtotal</span>
                    <span>$99.99</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>
                      {formData.delivery === 'standard' && 'Free'}
                      {formData.delivery === 'express' && '$9.99'}
                      {formData.delivery === 'same-day' && '$19.99'}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-lg mt-2">
                    <span>Total</span>
                    <span>$109.98</span>
                  </div>
                </div>
                <div className="flex justify-between pt-4">
                  <Button type="button" variant="outline" onClick={prevStep}>
                    Back
                  </Button>
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    Place Order
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="flex justify-center mb-8">
        <div className="flex items-center">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  index <= currentStep ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {index + 1}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-16 h-1 mx-2 ${
                    index < currentStep ? 'bg-orange-600' : 'bg-gray-200'
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        {renderStep()}
      </div>
    </div>
  );
}