import { db } from '@/db';
import { subscriptionPlans } from '@/db/schema';

async function main() {
    const samplePlans = [
        {
            name: 'Free',
            price: 0,
            features: JSON.stringify(['5 Automations/month', 'Basic Support', '1 User']),
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Starter',
            price: 29,
            features: JSON.stringify(['50 Automations/month', 'Email Support', '3 Users', 'Analytics Dashboard']),
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Pro',
            price: 99,
            features: JSON.stringify(['500 Automations/month', 'Priority Support', '10 Users', 'Advanced Analytics', 'Custom Integrations']),
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Enterprise',
            price: 299,
            features: JSON.stringify(['Unlimited Automations', '24/7 Support', 'Unlimited Users', 'White Label', 'Dedicated Account Manager']),
            createdAt: new Date().toISOString(),
        }
    ];

    await db.insert(subscriptionPlans).values(samplePlans);
    
    console.log('✅ Subscription plans seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});