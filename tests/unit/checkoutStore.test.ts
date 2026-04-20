import { describe, it, expect } from 'vitest';
import { useCheckoutStore } from '../../src/stores/checkoutStore';

describe('useCheckoutStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useCheckoutStore.setState({
      currentStep: 1,
      addresses: [],
      selectedAddress: null,
      deliveryOption: null,
      paymentMethod: null,
    });
  });

  it('initializes with first step', () => {
    const state = useCheckoutStore.getState();
    expect(state.currentStep).toBe(1);
  });

  it('navigates to next step', () => {
    useCheckoutStore.getState().goToNextStep();
    expect(useCheckoutStore.getState().currentStep).toBe(2);

    useCheckoutStore.getState().goToNextStep();
    expect(useCheckoutStore.getState().currentStep).toBe(3);
  });

  it('navigates to previous step', () => {
    useCheckoutStore.setState({ currentStep: 3 });
    useCheckoutStore.getState().goToPreviousStep();
    expect(useCheckoutStore.getState().currentStep).toBe(2);

    useCheckoutStore.getState().goToPreviousStep();
    expect(useCheckoutStore.getState().currentStep).toBe(1);
  });

  it('does not go below first step', () => {
    useCheckoutStore.getState().goToPreviousStep();
    expect(useCheckoutStore.getState().currentStep).toBe(1);
  });

  it('does not go beyond last step', () => {
    // Assuming 4 steps
    useCheckoutStore.setState({ currentStep: 4 });
    useCheckoutStore.getState().goToNextStep();
    expect(useCheckoutStore.getState().currentStep).toBe(4);
  });

  it('sets addresses correctly', () => {
    const mockAddresses = [
      {
        id: 'addr1',
        type: 'home',
        line1: '123 Main St',
        city: 'New York',
        state: 'NY',
        postal_code: '10001',
        country: 'US',
        is_default: true,
        created_at: '2023-01-01',
      },
    ];

    useCheckoutStore.getState().setAddresses(mockAddresses);
    expect(useCheckoutStore.getState().addresses).toEqual(mockAddresses);
  });

  it('selects address correctly', () => {
    const mockAddresses = [
      {
        id: 'addr1',
        type: 'home',
        line1: '123 Main St',
        city: 'New York',
        state: 'NY',
        postal_code: '10001',
        country: 'US',
        is_default: true,
        created_at: '2023-01-01',
      },
      {
        id: 'addr2',
        type: 'work',
        line1: '456 Office Ave',
        city: 'New York',
        state: 'NY',
        postal_code: '10002',
        country: 'US',
        is_default: false,
        created_at: '2023-01-01',
      },
    ];

    useCheckoutStore.getState().setAddresses(mockAddresses);
    useCheckoutStore.getState().selectAddress('addr2');

    expect(useCheckoutStore.getState().selectedAddress).toEqual(mockAddresses[1]);
  });

  it('adds new address correctly', () => {
    const newAddress = {
      id: 'new',
      type: 'home',
      line1: '789 New St',
      city: 'New York',
      state: 'NY',
      postal_code: '10003',
      country: 'US',
      is_default: false,
      created_at: '2023-01-01',
    };

    useCheckoutStore.getState().addAddress(newAddress);
    expect(useCheckoutStore.getState().addresses).toHaveLength(1);
    expect(useCheckoutStore.getState().addresses[0]).toEqual(newAddress);
  });

  it('selects delivery option correctly', () => {
    useCheckoutStore.getState().selectDeliveryOption('express');

    const state = useCheckoutStore.getState();
    expect(state.deliveryOption).toEqual({
      id: 'express',
      label: 'Express Delivery',
      price: 9.99,
      estimated: '2-3 business days',
    });
  });

  it('sets payment method correctly', () => {
    const mockPaymentMethod = {
      id: 'pm_123',
      type: 'stripe',
      last4: '4242',
      brand: 'visa',
    };

    useCheckoutStore.getState().setPaymentMethod(mockPaymentMethod);
    expect(useCheckoutStore.getState().paymentMethod).toEqual(mockPaymentMethod);
  });

  it('selects payment method correctly', () => {
    useCheckoutStore.getState().selectPaymentMethod('cod');

    const state = useCheckoutStore.getState();
    expect(state.paymentMethod).toEqual({
      type: 'cod',
      id: 'cod',
    });
  });
});