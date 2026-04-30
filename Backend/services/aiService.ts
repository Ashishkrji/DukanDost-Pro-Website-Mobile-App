import LedgerEntry from '../models/LedgerEntry.ts';
import Customer from '../models/Customer.ts';
import Transaction from '../models/Transaction.ts';
import Product from '../models/Product.ts';

// ── OpenRouter Integration ──────────────────────────────────
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = 'meta-llama/llama-3-8b-instruct:free'; // or any preferred model

export const processAIChat = async (userId: string, messages: any[]) => {
  try {
    const systemPrompt = `
      You are DukanDost AI, a premium business assistant for small Indian businesses.
      You help shopkeepers manage their "Khata" (ledger), customers, and inventory.
      
      User Context:
      - App: DukanDost Pro
      - Features: Digital Khata, Invoicing, Inventory, Staff Management, Payments.
      - Style: Professional yet friendly, uses Hinglish (Hindi + English) when appropriate.
      
      Capabilities:
      1. Add new customers.
      2. Record "Udhaar" (Credit) or "Payment" (Received).
      3. Generate Invoices.
      4. Show analytics/sales insights.
      5. Answer queries about business health.

      IMPORTANT: If a user wants to perform an action (e.g. "Add Ramu as customer"), 
      identify the intent and return a structured tool call.
    `;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://dukandost.pro',
        'X-Title': 'DukanDost Pro',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: 'system', content: systemPrompt }, ...messages],
        tools: [
          {
            type: 'function',
            function: {
              name: 'add_customer',
              description: 'Add a new customer to the digital khata',
              parameters: {
                type: 'object',
                properties: {
                  name: { type: 'string', description: 'Full name of the customer' },
                  phone: { type: 'string', description: '10-digit mobile number' },
                  initialBalance: { type: 'number', description: 'Starting balance if any' }
                },
                required: ['name', 'phone']
              }
            }
          },
          {
            type: 'function',
            function: {
              name: 'add_transaction',
              description: 'Record a credit or payment entry for a customer',
              parameters: {
                type: 'object',
                properties: {
                  customerName: { type: 'string', description: 'Name of the customer' },
                  amount: { type: 'number', description: 'Amount in Rupees' },
                  type: { type: 'string', enum: ['Udhaar', 'Payment'], description: 'Type of transaction' }
                },
                required: ['customerName', 'amount', 'type']
              }
            }
          },
          {
            type: 'function',
            function: {
              name: 'add_product',
              description: 'Add a new product to inventory',
              parameters: {
                type: 'object',
                properties: {
                  name: { type: 'string', description: 'Product name' },
                  price: { type: 'number', description: 'Selling price' },
                  stock: { type: 'number', description: 'Initial stock quantity' },
                  category: { type: 'string', description: 'Product category' }
                },
                required: ['name', 'price', 'stock']
              }
            }
          }
        ]
      })
    });

    const data = await response.json();
    
    if (data.error) throw new Error(data.error.message || 'AI processing failed');

    const choice = data.choices[0];
    return {
      message: choice.message.content,
      tool_calls: choice.message.tool_calls
    };
  } catch (error: any) {
    console.error('AI Chat Error:', error);
    throw error;
  }
};

export const executeAIAction = async (userId: string, action: string, params: any) => {
  switch (action) {
    case 'add_customer':
      const customer = new Customer({
        userId,
        name: params.name,
        phone: params.phone,
        balance: params.initialBalance || 0,
        status: params.initialBalance > 0 ? 'Udhaar' : 'Up-to-date',
        initials: params.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
      });
      return await customer.save();

    case 'add_transaction':
      const cust = await Customer.findOne({ userId, name: new RegExp(params.customerName, 'i') });
      if (!cust) throw new Error('Customer not found');
      
      const txType = params.type === 'Udhaar' ? 'Diya' : 'Liya';
      const tx = new Transaction({
        userId,
        customerId: cust._id,
        customerName: cust.name,
        amount: params.amount,
        type: txType,
        createdAt: new Date().toISOString()
      });
      
      // Update customer balance
      cust.balance += (params.type === 'Udhaar' ? params.amount : -params.amount);
      await cust.save();
      return await tx.save();

    case 'add_product':
      const product = new Product({
        userId,
        name: params.name,
        price: params.price,
        stock: params.stock,
        category: params.category || 'General',
        sku: 'SKU-' + Date.now().toString().slice(-6),
        status: params.stock > 10 ? 'IN STOCK' : params.stock > 0 ? 'LOW STOCK' : 'OUT OF STOCK'
      });
      return await product.save();

    default:
      throw new Error('Action not supported');
  }
};

export const calculateHealthScore = async (userId: string) => {
  try {
    // 1. Fetch historical data (last 30 days vs previous 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const currentEntries = await LedgerEntry.find({ 
      userId, 
      date: { $gte: thirtyDaysAgo } 
    });

    const previousEntries = await LedgerEntry.find({ 
      userId, 
      date: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } 
    });

    // 2. Revenue Growth (Weight: 40%)
    const currentRev = currentEntries.filter(e => e.transactionType === 'Udhaar Diya').reduce((acc, e) => acc + e.amount, 0);
    const prevRev = previousEntries.filter(e => e.transactionType === 'Udhaar Diya').reduce((acc, e) => acc + e.amount, 0);
    const revGrowth = prevRev > 0 ? (currentRev - prevRev) / prevRev : 1; // 100% if first month
    const revScore = Math.min(Math.max(revGrowth * 100 + 50, 0), 100) * 0.4;

    // 3. Recovery Efficiency (Weight: 30%)
    const currentRec = currentEntries.filter(e => e.transactionType === 'Payment Mila').reduce((acc, e) => acc + e.amount, 0);
    const recoveryRate = currentRev > 0 ? currentRec / currentRev : 1;
    const recoveryScore = Math.min(recoveryRate * 100, 100) * 0.3;

    // 4. Customer Retention/Risk (Weight: 30%)
    const totalCustomers = await Customer.countDocuments({ userId, isActive: true });
    const overdueCustomers = await Customer.countDocuments({ userId, balance: { $gt: 0 }, isActive: true });
    const riskRatio = totalCustomers > 0 ? overdueCustomers / totalCustomers : 0;
    const riskScore = Math.max(100 - (riskRatio * 100), 0) * 0.3;

    const totalScore = Math.round(revScore + recoveryScore + riskScore);

    return {
      score: totalScore,
      loanEligibility: calculateLoanEligibility(totalScore, currentRev),
      riskAlerts: await detectRecoveryRisks(userId),
      upgradeSuggestions: detectUpgradeNeeds(totalScore, currentRev, totalCustomers),
      metrics: {
        revenueGrowth: (revGrowth * 100).toFixed(1),
        recoveryRate: (recoveryRate * 100).toFixed(1),
        riskRatio: (riskRatio * 100).toFixed(1)
      },
      recommendations: generateRecommendations(totalScore, revGrowth, recoveryRate, riskRatio)
    };
  } catch (error) {
    console.error('Health score calc failed:', error);
    return { score: 0, metrics: {}, recommendations: [] };
  }
};

const detectRecoveryRisks = async (userId: string) => {
  // Flag customers with high balance AND no payments in 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const riskyCustomers = await Customer.find({
    userId,
    balance: { $gt: 5000 },
    lastPaymentDate: { $lt: thirtyDaysAgo }
  }).limit(5);

  return riskyCustomers.map(c => ({
    name: c.name,
    amount: c.balance,
    riskLevel: 'HIGH',
    reason: '30+ din se koi payment nahi aayi'
  }));
};

const detectUpgradeNeeds = (score: number, revenue: number, customerCount: number) => {
  const suggestions = [];
  if (revenue > 100000) suggestions.push({ plan: 'Business', reason: 'High revenue business ke liye WhatsApp automation zaroori hai.' });
  if (customerCount > 50) suggestions.push({ plan: 'Pro', reason: 'Large customer base manage karne ke liye advanced reports chahiye.' });
  return suggestions;
};

export const calculateLoanEligibility = (score: number, revenue: number) => {
  // Simple heuristic: Eligibility depends on score > 70 and minimum revenue
  const isEligible = score > 70 && revenue > 50000;
  const maxLoanAmount = isEligible ? Math.round(revenue * 1.5) : 0;
  
  return {
    isEligible,
    maxAmount: maxLoanAmount,
    creditGrade: score > 90 ? 'A+' : score > 80 ? 'A' : score > 70 ? 'B' : 'C'
  };
};

const generateRecommendations = (score: number, growth: number, recovery: number, risk: number) => {
  const recs = [];
  if (growth < 0) recs.push('Sales drop ho rahi hai. Seasonal discounts ya marketing campaigns check karein.');
  if (recovery < 0.7) recs.push('Payment recovery slow hai. WhatsApp reminders automate karein.');
  if (risk > 0.5) recs.push('Aadhe se zyada grahakon ka udhaar pending hai. Credit limit set karein.');
  if (score > 85) recs.push('Business health bahut achhi hai! Growth ke liye naye products add karein.');
  return recs;
};
