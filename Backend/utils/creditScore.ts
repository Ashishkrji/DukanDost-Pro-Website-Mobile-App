import { Document } from "mongoose";

export const calculateCreditScore = (customer: any, transactions: any[]) => {
  let score = 100;
  let insights: string[] = [];

  const balance = customer.balance || 0;
  
  // Penalties for balance
  if (balance > 50000) {
    score -= 25;
    insights.push("Balance bahut high hai (> ₹50k)");
  } else if (balance > 10000) {
    score -= 10;
    insights.push("Balance thoda high hai (> ₹10k)");
  }

  // Transactions analysis
  const now = new Date();
  
  const liyaTxns = transactions.filter(t => t.type === "LIYA").sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const diyaTxns = transactions.filter(t => t.type === "DIYA").sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const lastLiyaDate = liyaTxns.length > 0 ? new Date(liyaTxns[0].date) : null;
  const lastDiyaDate = diyaTxns.length > 0 ? new Date(diyaTxns[0].date) : null;

  if (balance > 0 && lastLiyaDate) {
    const daysSinceLastPayment = Math.floor((now.getTime() - lastLiyaDate.getTime()) / (1000 * 3600 * 24));
    if (daysSinceLastPayment > 60) {
      score -= 30;
      insights.push(`2 mahine se zyada late payment baaki hai (${daysSinceLastPayment} days)`);
    } else if (daysSinceLastPayment > 30) {
      score -= 20;
      insights.push(`1 mahine se late payment chal raha hai (${daysSinceLastPayment} days)`);
    } else {
      score += 15;
      insights.push("Time pe payment kar rahe hain (+15)");
    }
  } else if (balance > 0 && diyaTxns.length > 0 && !lastLiyaDate) {
      const oldestDiya = new Date(diyaTxns[diyaTxns.length - 1].date);
      const daysSinceFirstUdhaar = Math.floor((now.getTime() - oldestDiya.getTime()) / (1000 * 3600 * 24));
      if(daysSinceFirstUdhaar > 60) {
         score -= 30;
         insights.push("Bahut dino se koi payment nahi aayi (> 60 days)");
      } else if (daysSinceFirstUdhaar > 30) {
          score -= 20;
          insights.push("1 mahine se payment ruki hai");
      }
  } else if (balance === 0 && liyaTxns.length > 0) {
      score += 15;
      insights.push("On-time transactions, no dues (+15)");
  }

  // Frequency
  const recentTxns = transactions.filter(t => {
     const daysAge = Math.floor((now.getTime() - new Date(t.date).getTime()) / (1000 * 3600 * 24));
     return daysAge <= 30;
  });

  if (transactions.length > 0) {
    if (recentTxns.length < 2) {
      score -= 10;
      insights.push("Kam aana jana hai (Low Frequency)");
    } else if (recentTxns.length >= 4) {
      score += 10;
      insights.push("Regular customer hai (+10)");
    }
  }

  // Clamp final score 0-100
  score = Math.max(0, Math.min(100, score));

  let risk = "Medium";
  if (score >= 75) risk = "Low";
  else if (score < 40) risk = "High";

  return { score, risk, insights };
};
