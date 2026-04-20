import React, { useState, useEffect } from 'react';
import { useCheckoutStore } from '../../stores/checkoutStore';
import { useAuthStore } from '../../stores/authStore';
import { apiClient } from '../../lib/api';
import { Button } from '../ui/button';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Address } from '../../types';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const AddressSelector: React.FC = () => {
  const { addresses, selectedAddress, selectAddress, addAddress, updateAddress, removeAddress } = useCheckoutStore();
  const { user } = useAuthStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  useEffect(() => {
    const loadAddresses = async () => {
      if (!user) return;
      try {
        const data = await apiClient('/users/addresses');
        useCheckoutStore.getState().setAddresses(data);
      } catch (err) {
        console.error('Failed to load addresses:', err);
      }
    };
    loadAddresses();
  }, [user]);

  const handleAddNew = () => {
    setEditingAddress({
      id: 'new',
      type: 'home',
      line1: '',
      line2: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'US',
      is_default: false,
      created_at: new Date().toISOString(),
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (address: Address) => {
    setEditingAddress({ ...address });
    setIsDialogOpen(true);
  };

  const handleRemove = (id: string) => {
    if (window.confirm('Are you sure you want to remove this address?')) {
      removeAddress(id);
      if (selectedAddress?.id === id) {
        // Select first address if current one is removed
        const remaining = addresses.filter(a => a.id !== id);
        if (remaining.length > 0) {
          selectAddress(remaining[0].id);
        }
      }
    }
  };

  const handleSave = () => {
    if (!editingAddress) return;

    if (editingAddress.id === 'new') {
      addAddress(editingAddress);
      selectAddress(editingAddress.id);
    } else {
      updateAddress(editingAddress);
    }
    
    setIsDialogOpen(false);
    setEditingAddress(null);
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setEditingAddress(null);
  };

  const handleInputChange = (field: keyof Address, value: string) => {
    if (editingAddress) {
      setEditingAddress({
        ...editingAddress,
        [field]: value
      });
    }
  };

  return (
    <div className="space-y-4">
      <RadioGroup
        value={selectedAddress?.id || ''}
        onValueChange={(id) => selectAddress(id)}
        className="space-y-3"
      >
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className={cn(
              'flex items-start space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50 relative',
              selectedAddress?.id === addr.id ? 'border-accent bg-muted/30' : 'border-border'
            )}
            onClick={() => selectAddress(addr.id)}
          >
            <RadioGroupItem value={addr.id} id={addr.id} className="mt-0.5" />
            <div className="flex-1 min-w-0">
              <Label htmlFor={addr.id} className="cursor-pointer block">
                <div className="font-medium capitalize flex items-center">
                  {addr.type} Address
                  {addr.is_default && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-accent/20 text-accent">
                      Default
                    </span>
                  )}
                </div>
                <div className="text-text_dim text-sm mt-1">
                  {addr.line1}, {addr.line2 && `${addr.line2}, `} {addr.city}, {addr.state} {addr.postal_code}, {addr.country}
                </div>
              </Label>
            </div>
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-text_dim hover:text-text"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(addr);
                }}
                aria-label="Edit address"
              >
                <Edit className="h-4 w-4" />
              </Button>
              {addresses.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-text_dim hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(addr.id);
                  }}
                  aria-label="Remove address"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </RadioGroup>
      
      <Button 
        type="button" 
        variant="outline" 
        onClick={handleAddNew}
        className="w-full flex items-center justify-center space-x-2 py-3"
        aria-label="Add new address"
      >
        <Plus className="h-4 w-4" />
        <span>Add New Address</span>
      </Button>

      {/* Address Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingAddress?.id === 'new' ? 'Add New Address' : 'Edit Address'}</DialogTitle>
          </DialogHeader>
          {editingAddress && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Type
                </Label>
                <Select 
                  value={editingAddress.type} 
                  onValueChange={(value) => handleInputChange('type', value as any)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home">Home</SelectItem>
                    <SelectItem value="work">Work</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="line1" className="text-right">
                  Street
                </Label>
                <Input
                  id="line1"
                  value={editingAddress.line1}
                  onChange={(e) => handleInputChange('line1', e.target.value)}
                  className="col-span-3"
                  placeholder="123 Main St"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="line2" className="text-right">
                  Apt/Suite
                </Label>
                <Input
                  id="line2"
                  value={editingAddress.line2 || ''}
                  onChange={(e) => handleInputChange('line2', e.target.value)}
                  className="col-span-3"
                  placeholder="Apt 4B"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="city" className="text-right">
                  City
                </Label>
                <Input
                  id="city"
                  value={editingAddress.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="col-span-3"
                  placeholder="New York"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="state" className="text-right">
                  State
                </Label>
                <Input
                  id="state"
                  value={editingAddress.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className="col-span-3"
                  placeholder="NY"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="postal_code" className="text-right">
                  ZIP Code
                </Label>
                <Input
                  id="postal_code"
                  value={editingAddress.postal_code}
                  onChange={(e) => handleInputChange('postal_code', e.target.value)}
                  className="col-span-3"
                  placeholder="10001"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="country" className="text-right">
                  Country
                </Label>
                <Select 
                  value={editingAddress.country} 
                  onValueChange={(value) => handleInputChange('country', value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="US">United States</SelectItem>
                    <SelectItem value="CA">Canada</SelectItem>
                    <SelectItem value="UK">United Kingdom</SelectItem>
                    {/* Add more countries as needed */}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_default"
                  checked={editingAddress.is_default}
                  onChange={(e) => handleInputChange('is_default', e.target.checked.toString() as any)}
                  className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
                />
                <Label htmlFor="is_default">Set as default address</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleSave}>Save Address</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddressSelector;
```

```typescript