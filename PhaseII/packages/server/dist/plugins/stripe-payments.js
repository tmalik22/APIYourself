"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// Mock Stripe API (replace with real Stripe integration)
class MockStripe {
    constructor() {
        this.customers = new Map();
        this.payments = new Map();
        this.subscriptions = new Map();
        this.products = new Map();
        // Add some demo products
        this.products.set('prod_basic', {
            id: 'prod_basic',
            name: 'Basic Plan',
            description: 'Basic subscription plan',
            price: 999, // in cents
            currency: 'usd',
            interval: 'month'
        });
        this.products.set('prod_premium', {
            id: 'prod_premium',
            name: 'Premium Plan',
            description: 'Premium subscription plan',
            price: 1999, // in cents
            currency: 'usd',
            interval: 'month'
        });
    }
    createCustomer(data) {
        const id = `cus_${Date.now()}`;
        const customer = {
            id,
            ...data,
            created: Math.floor(Date.now() / 1000)
        };
        this.customers.set(id, customer);
        return customer;
    }
    getCustomer(id) {
        return this.customers.get(id);
    }
    createPaymentIntent(data) {
        const id = `pi_${Date.now()}`;
        const payment = {
            id,
            ...data,
            status: 'requires_payment_method',
            client_secret: `${id}_secret_${Math.random().toString(36)}`,
            created: Math.floor(Date.now() / 1000)
        };
        this.payments.set(id, payment);
        return payment;
    }
    confirmPayment(id) {
        const payment = this.payments.get(id);
        if (!payment)
            throw new Error('Payment not found');
        payment.status = 'succeeded';
        payment.charges = {
            data: [{
                    id: `ch_${Date.now()}`,
                    amount: payment.amount,
                    currency: payment.currency,
                    status: 'succeeded'
                }]
        };
        return payment;
    }
    createSubscription(data) {
        const id = `sub_${Date.now()}`;
        const subscription = {
            id,
            ...data,
            status: 'active',
            current_period_start: Math.floor(Date.now() / 1000),
            current_period_end: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), // 30 days
            created: Math.floor(Date.now() / 1000)
        };
        this.subscriptions.set(id, subscription);
        return subscription;
    }
    cancelSubscription(id) {
        const subscription = this.subscriptions.get(id);
        if (!subscription)
            throw new Error('Subscription not found');
        subscription.status = 'canceled';
        subscription.canceled_at = Math.floor(Date.now() / 1000);
        return subscription;
    }
    getProducts() {
        return Array.from(this.products.values());
    }
    getPayments() {
        return Array.from(this.payments.values());
    }
    getSubscriptions() {
        return Array.from(this.subscriptions.values());
    }
}
const stripe = new MockStripe();
// Customer management
router.post('/customers', (req, res) => {
    try {
        const { name, email, phone, address } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }
        const customer = stripe.createCustomer({ name, email, phone, address });
        res.json({ success: true, customer });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get('/customers/:id', (req, res) => {
    try {
        const customer = stripe.getCustomer(req.params.id);
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        res.json({ success: true, customer });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Payment Intents
router.post('/payment-intents', (req, res) => {
    try {
        const { amount, currency = 'usd', customer_id, description } = req.body;
        if (!amount || amount < 50) {
            return res.status(400).json({ error: 'Amount must be at least 50 cents' });
        }
        const paymentIntent = stripe.createPaymentIntent({
            amount,
            currency,
            customer_id,
            description
        });
        res.json({ success: true, payment_intent: paymentIntent });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.post('/payment-intents/:id/confirm', (req, res) => {
    try {
        const payment = stripe.confirmPayment(req.params.id);
        res.json({ success: true, payment });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Subscriptions
router.post('/subscriptions', (req, res) => {
    try {
        const { customer_id, price_id, trial_days } = req.body;
        if (!customer_id || !price_id) {
            return res.status(400).json({ error: 'Customer ID and price ID are required' });
        }
        const subscription = stripe.createSubscription({
            customer_id,
            price_id,
            trial_days
        });
        res.json({ success: true, subscription });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.delete('/subscriptions/:id', (req, res) => {
    try {
        const subscription = stripe.cancelSubscription(req.params.id);
        res.json({ success: true, subscription });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Products and Pricing
router.get('/products', (req, res) => {
    const products = stripe.getProducts();
    res.json({ success: true, products });
});
// Webhooks (for handling Stripe events)
router.post('/webhooks', (req, res) => {
    try {
        const { type, data } = req.body;
        console.log(`📧 Stripe webhook received: ${type}`);
        // Handle different event types
        switch (type) {
            case 'payment_intent.succeeded':
                console.log('💰 Payment succeeded:', data.object.id);
                break;
            case 'payment_intent.payment_failed':
                console.log('❌ Payment failed:', data.object.id);
                break;
            case 'customer.subscription.created':
                console.log('🔄 Subscription created:', data.object.id);
                break;
            case 'customer.subscription.deleted':
                console.log('🚫 Subscription canceled:', data.object.id);
                break;
            default:
                console.log('🔔 Unhandled event type:', type);
        }
        res.json({ received: true });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Analytics and Reports
router.get('/analytics', (req, res) => {
    const payments = stripe.getPayments();
    const subscriptions = stripe.getSubscriptions();
    const totalRevenue = payments
        .filter(p => p.status === 'succeeded')
        .reduce((sum, p) => sum + p.amount, 0);
    const activeSubscriptions = subscriptions
        .filter(s => s.status === 'active').length;
    const monthlyRecurring = subscriptions
        .filter(s => s.status === 'active')
        .reduce((sum, s) => {
        const product = stripe.getProducts().find(p => p.id === s.price_id);
        return sum + (product ? product.price : 0);
    }, 0);
    res.json({
        success: true,
        analytics: {
            totalRevenue: totalRevenue / 100, // convert to dollars
            totalPayments: payments.length,
            successfulPayments: payments.filter(p => p.status === 'succeeded').length,
            activeSubscriptions,
            monthlyRecurringRevenue: monthlyRecurring / 100,
            recentPayments: payments.slice(-5)
        }
    });
});
// Refunds
router.post('/refunds', (req, res) => {
    try {
        const { payment_intent_id, amount, reason } = req.body;
        if (!payment_intent_id) {
            return res.status(400).json({ error: 'Payment intent ID is required' });
        }
        // Mock refund creation
        const refund = {
            id: `re_${Date.now()}`,
            payment_intent: payment_intent_id,
            amount,
            reason: reason || 'requested_by_customer',
            status: 'succeeded',
            created: Math.floor(Date.now() / 1000)
        };
        res.json({ success: true, refund });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Test endpoints for development
router.post('/test/charge', (req, res) => {
    try {
        const { amount = 1000, description = 'Test charge' } = req.body;
        // Simulate a successful charge
        const charge = {
            id: `ch_test_${Date.now()}`,
            amount,
            currency: 'usd',
            description,
            status: 'succeeded',
            created: Math.floor(Date.now() / 1000)
        };
        res.json({
            success: true,
            message: 'Test charge successful',
            charge
        });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=stripe-payments.js.map