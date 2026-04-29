import LedgerEntry from '../models/LedgerEntry.ts';
import Customer from '../models/Customer.ts';

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
