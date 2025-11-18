import { db } from '@/db';
import { services } from '@/db/schema';

async function main() {
    const sampleServices = [
        {
            name: 'WhatsApp Automation',
            description: 'Automated WhatsApp messaging and chatbots for customer engagement',
            category: 'Communication',
            icon: null,
            monthlyLimit: 1000,
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Email Automation',
            description: 'Smart email campaigns with AI-powered personalization',
            category: 'Communication',
            icon: null,
            monthlyLimit: 5000,
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Data Analytics',
            description: 'Real-time business intelligence and predictive analytics',
            category: 'Analytics',
            icon: null,
            monthlyLimit: 100,
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Workflow Automation',
            description: 'Custom workflow automation with n8n integration',
            category: 'Workflow',
            icon: null,
            monthlyLimit: 500,
            createdAt: new Date().toISOString(),
        },
        {
            name: 'AI Chatbot',
            description: 'Intelligent chatbot for customer support and lead generation',
            category: 'Communication',
            icon: null,
            monthlyLimit: 2000,
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Document Processing',
            description: 'Automated document extraction and processing with AI',
            category: 'Workflow',
            icon: null,
            monthlyLimit: 200,
            createdAt: new Date().toISOString(),
        }
    ];

    await db.insert(services).values(sampleServices);
    
    console.log('✅ Services seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});