'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useTranslations } from 'next-intl';

export default function CheckoutForm({ onAddressSubmit }) {
  const t = useTranslations();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zip: '',
    saveAddress: false,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = t('checkout.firstName') + ' ' + t('common.isRequired');
    if (!formData.lastName) newErrors.lastName = t('checkout.lastName') + ' ' + t('common.isRequired');
    if (!formData.email) newErrors.email = t('checkout.email') + ' ' + t('common.isRequired');
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = t('checkout.email') + ' ' + t('common.isInvalid');
    if (!formData.address) newErrors.address = t('checkout.address') + ' ' + t('common.isRequired');
    if (!formData.city) newErrors.city = t('checkout.city') + ' ' + t('common.isRequired');
    if (!formData.state) newErrors.state = t('checkout.state') + ' ' + t('common.isRequired');
    if (!formData.zip) newErrors.zip = t('checkout.zip') + ' ' + t('common.isRequired');
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast({
        title: t('common.validationError'),
        description: t('common.fillRequiredFields'),
        variant: 'destructive',
      });
      return;
    }
    onAddressSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">{t('checkout.firstName')}</Label>
          <Input
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          {errors.firstName && (
            <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>
          )}
        </div>
        <div>
          <Label htmlFor="lastName">{t('checkout.lastName')}</Label>
          <Input
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          {errors.lastName && (
            <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>
          )}
        </div>
      </div>
      <div>
        <Label htmlFor="email">{t('checkout.email')}</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        {errors.email && (
          <p className="text-sm text-red-500 mt-1">{errors.email}</p>
        )}
      </div>
      <div>
        <Label htmlFor="address">{t('checkout.address')}</Label>
        <Input
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
        />
        {errors.address && (
          <p className="text-sm text-red-500 mt-1">{errors.address}</p>
        )}
      </div>
      <div>
        <Label htmlFor="apartment">{t('checkout.apartment')}</Label>
        <Input
          id="apartment"
          name="apartment"
          value={formData.apartment}
          onChange={handleChange}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="city">{t('checkout.city')}</Label>
          <Input
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          />
          {errors.city && (
            <p className="text-sm text-red-500 mt-1">{errors.city}</p>
          )}
        </div>
        <div>
          <Label htmlFor="state">{t('checkout.state')}</Label>
          <Input
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            required
          />
          {errors.state && (
            <p className="text-sm text-red-500 mt-1">{errors.state}</p>
          )}
        </div>
        <div>
          <Label htmlFor="zip">{t('checkout.zip')}</Label>
          <Input
            id="zip"
            name="zip"
            value={formData.zip}
            onChange={handleChange}
            required
          />
          {errors.zip && (
            <p className="text-sm text-red-500 mt-1">{errors.zip}</p>
          )}
        </div>
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id="saveAddress"
          name="saveAddress"
          checked={formData.saveAddress}
          onChange={handleChange}
          className="rounded border