// Mock API for simulating backend responses
import { generateRandomAmount, generateRandomDate, formatCurrency } from './utils';
import { sendMessageToGemini } from './gemini';

// Generate realistic financial data based on user profile
const generateFinancialProfile = () => {
  const monthlyIncome = generateRandomAmount(50000, 150000); // ₹50K to ₹1.5L
  const expenseRatio = 0.6 + Math.random() * 0.25; // 60-85% of income
  const monthlyExpenses = Math.floor(monthlyIncome * expenseRatio);
  const savingsRate = monthlyIncome - monthlyExpenses;
  
  return {
    monthlyIncome,
    monthlyExpenses,
    savingsRate,
    balance: generateRandomAmount(50000, 500000) // Account balance
  };
};

const generateTransactions = (monthlyIncome: number, monthlyExpenses: number) => {
  const categories = [
    { name: 'Salary Credit', type: 'income', amount: monthlyIncome },
    { name: 'Rent Payment', type: 'housing', amount: -Math.floor(monthlyExpenses * 0.3) },
    { name: 'Groceries', type: 'food', amount: -generateRandomAmount(5000, 15000) },
    { name: 'Transportation', type: 'transport', amount: -generateRandomAmount(800, 3000) },
    { name: 'Entertainment', type: 'entertainment', amount: -generateRandomAmount(500, 2000) }
  ];
  
  return categories.map((cat, index) => ({
    id: index + 1,
    description: cat.name,
    amount: cat.amount,
    date: generateRandomDate(30),
    category: cat.type
  }));
};

const generateInvestmentData = () => {
  const stocks = [
    { symbol: 'RELIANCE', basePrice: 2400 },
    { symbol: 'TCS', basePrice: 3100 },
    { symbol: 'INFY', basePrice: 1400 },
    { symbol: 'HDFC', basePrice: 2700 },
    { symbol: 'ICICI', basePrice: 800 }
  ];
  
  let totalInvestment = 0;
  let totalValue = 0;
  
  const holdings = stocks.map(stock => {
    const quantity = generateRandomAmount(10, 50);
    const priceVariation = 0.8 + Math.random() * 0.4; // ±20% from base price
    const avgPrice = Math.floor(stock.basePrice * priceVariation);
    const currentPriceVariation = 0.9 + Math.random() * 0.2; // ±10% from avg price
    const currentPrice = Math.floor(avgPrice * currentPriceVariation);
    const value = quantity * currentPrice;
    
    totalInvestment += quantity * avgPrice;
    totalValue += value;
    
    return {
      symbol: stock.symbol,
      quantity,
      avgPrice,
      currentPrice,
      value
    };
  });
  
  const totalReturns = totalValue - totalInvestment;
  const returnsPercent = ((totalReturns / totalInvestment) * 100);
  
  return {
    totalValue,
    totalInvestment,
    totalReturns,
    returnsPercent: Math.round(returnsPercent * 100) / 100,
    holdings
  };
};

export const mockApi = {
  // Simulate Fi Money connection
  connectFi: async () => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    const profile = generateFinancialProfile();
    
    return {
      success: true,
      data: {
        balance: profile.balance,
        monthlyIncome: profile.monthlyIncome,
        monthlyExpenses: profile.monthlyExpenses,
        transactions: generateTransactions(profile.monthlyIncome, profile.monthlyExpenses)
      }
    };
  },

  // Simulate Zerodha connection
  connectZerodha: async () => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    const investmentData = generateInvestmentData();
    
    return {
      success: true,
      data: investmentData
    };
  },

  // Simulate chat message responses
  sendChatMessage: async (message: string, userProfile: any, connectedAccounts: string[] = []) => {
    try {
      // Try to use the API route first
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          userProfile,
          connectedAccounts,
          messageHistory: [] // You can pass conversation history here if needed
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.error('API route error, trying Gemini directly:', error);
    }

    // Fallback to direct Gemini API if API route fails
    try {
      if (process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
        const response = await sendMessageToGemini(message, {
          userProfile,
          connectedAccounts: connectedAccounts.length > 0 ? connectedAccounts : ['Fi Money', 'Zerodha'],
          messageHistory: []
        });
        return response;
      }
    } catch (error) {
      console.error('Gemini API error, falling back to mock response:', error);
    }

    // Fallback to mock response if all else fails
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate dynamic financial profile for responses
    const financialProfile = generateFinancialProfile();
    const savingsAmount = formatCurrency(financialProfile.savingsRate);
    const emergencyFund = formatCurrency(financialProfile.savingsRate * 6);
    const investmentAmount = formatCurrency(Math.floor(financialProfile.savingsRate * 0.7));
    const diningBudget = formatCurrency(generateRandomAmount(8000, 15000));
    const optimizedAmount = formatCurrency(generateRandomAmount(2000, 5000));
    const projectedGains = formatCurrency(generateRandomAmount(1500000, 3500000));
    
    const responses = [
      {
        message: `Oh man, I remember being exactly where you are right now! 😅 Looking at our data, you're saving about ${savingsAmount} per month - that's actually pretty solid, younger me! But here's what I wish I'd known: if we bump that up just a bit and invest smarter, we could build something really special. Trust me, future you will thank present you! 💪`,
        sender: 'future_self' as const,
        futureAge: userProfile.futureAge
      },
      {
        message: `Haha, I can see you're still making some of the same mistakes I made! 😂 But hey, that's why I'm here - to save you from my regrets. Your investment approach isn't bad, but I learned the hard way that diversification is everything. Want me to show you what I wish I'd done differently?`,
        sender: 'future_self' as const,
        futureAge: userProfile.futureAge
      },
      {
        message: `You know what? I'm actually proud of you for asking for help. That's something I wish I'd done more of at your age. Looking at your goals, you've got a solid foundation. Let's make sure you don't repeat my mistakes and actually achieve what we both want! 🎯`,
        sender: 'future_self' as const,
        futureAge: userProfile.futureAge
      }
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  },

  // Get financial scenarios
  getScenarios: () => {
    const baseProfile = generateFinancialProfile();
    const currentYear = new Date().getFullYear();
    const baseNetWorth = generateRandomAmount(400000, 800000);
    
    const generateScenario = (multiplier: number, riskLevel: string, title: string, description: string) => {
      const finalNetWorth = Math.floor(baseNetWorth * multiplier);
      const confidence = riskLevel === 'conservative' ? 85 : riskLevel === 'balanced' ? 78 : 65;
      
      return {
        title,
        description,
        type: riskLevel,
        finalNetWorth,
        confidenceScore: confidence,
        timeline: [
          {
            year: currentYear,
            netWorth: baseNetWorth,
            debt: 0,
            monthlyIncome: baseProfile.monthlyIncome,
            monthlyExpenses: baseProfile.monthlyExpenses,
            milestones: []
          },
          {
            year: currentYear + 6,
            netWorth: Math.floor(finalNetWorth * 0.4),
            debt: 0,
            monthlyIncome: Math.floor(baseProfile.monthlyIncome * 1.4),
            monthlyExpenses: Math.floor(baseProfile.monthlyExpenses * 1.2),
            milestones: [
              { 
                type: 'emergency', 
                title: 'Emergency Fund Complete', 
                description: '6 months expenses saved', 
                value: Math.floor(baseProfile.monthlyExpenses * 6) 
              }
            ]
          },
          {
            year: currentYear + 16,
            netWorth: finalNetWorth,
            debt: 0,
            monthlyIncome: Math.floor(baseProfile.monthlyIncome * 2.1),
            monthlyExpenses: Math.floor(baseProfile.monthlyExpenses * 1.5),
            milestones: [
              { 
                type: 'house', 
                title: 'Dream Home Purchased', 
                description: riskLevel === 'aggressive' ? 'Luxury villa with amenities' : 
                           riskLevel === 'balanced' ? '4BHK with garden' : '3BHK in prime location', 
                value: riskLevel === 'aggressive' ? 15000000 : 
                       riskLevel === 'balanced' ? 12000000 : 8000000 
              },
              { 
                type: 'education', 
                title: riskLevel === 'aggressive' ? 'International Education Fund' : 'Education Fund Ready', 
                description: riskLevel === 'aggressive' ? 'Global education opportunities' :
                           riskLevel === 'balanced' ? 'Premium education secured' : 'Children\'s education secured', 
                value: riskLevel === 'aggressive' ? 6000000 : 
                       riskLevel === 'balanced' ? 4000000 : 2500000 
              }
            ]
          }
        ]
      };
    };
    
    return [
      generateScenario(4.3, 'conservative', 'Conservative Growth', 'Steady, low-risk investments with guaranteed returns'),
      generateScenario(6.6, 'balanced', 'Balanced Portfolio', 'Mix of growth and stability with moderate risk'),
      generateScenario(9.0, 'aggressive', 'Aggressive Growth', 'High-growth investments with higher risk tolerance')
    ].map((scenario, index) => ({
      ...scenario,
      id: `scenario_${Date.now()}_${index}`
    }));
  },

  // Generate new scenarios
  generateNewScenarios: () => {
    // Return slightly different scenarios
    const baseScenarios = mockApi.getScenarios();
    return baseScenarios.map((scenario, index) => ({
      ...scenario,
      id: `scenario_${Date.now()}_new_${index}`,
      finalNetWorth: scenario.finalNetWorth + Math.floor(Math.random() * 500000),
      confidenceScore: Math.max(60, Math.min(90, scenario.confidenceScore + Math.floor(Math.random() * 20) - 10))
    }));
  },

  // Get recommendations
  getRecommendations: () => {
    const baseProfile = generateFinancialProfile();
    const currentSIP = generateRandomAmount(10000, 25000);
    const optimizedSIP = currentSIP + 5000;
    const sipPotentialSavings = Math.floor(optimizedSIP * 12 * 20 * 0.15); // 20 years with 15% returns
    
    const diningExpenses = generateRandomAmount(8000, 15000);
    const optimizedDining = Math.floor(diningExpenses * 0.7); // 30% reduction
    const diningPotentialSavings = Math.floor((diningExpenses - optimizedDining) * 12 * 10); // 10 years
    
    const emergencyFundTarget = Math.floor(baseProfile.monthlyExpenses * 6);
    const monthlyEmergencyContribution = Math.floor(emergencyFundTarget / 12);
    
    const taxSavings = Math.floor(150000 * 0.3); // 30% tax rate on ₹1.5L investment
    
    return [
      {
        id: '1',
        title: 'Increase SIP Amount',
        description: `Boost your monthly SIP from ${formatCurrency(currentSIP)} to ${formatCurrency(optimizedSIP)} to accelerate wealth building`,
        category: 'investment',
        impact: 'high',
        effort: 'low',
        potentialSavings: sipPotentialSavings,
        steps: [
          'Log into your mutual fund platform',
          'Navigate to existing SIP section',
          `Increase amount by ${formatCurrency(5000)}`,
          'Set up auto-debit for the new amount'
        ]
      },
      {
        id: '2',
        title: 'Optimize Dining Expenses',
        description: `Reduce dining out expenses by 30% and redirect savings to investments`,
        category: 'spending',
        impact: 'medium',
        effort: 'medium',
        potentialSavings: diningPotentialSavings,
        steps: [
          'Track current dining expenses for one week',
          `Set a monthly dining budget of ${formatCurrency(optimizedDining)}`,
          'Plan home-cooked meals for weekdays',
          'Limit restaurant visits to weekends only',
          'Invest the saved amount in index funds'
        ]
      },
      {
        id: '3',
        title: 'Build Emergency Fund',
        description: 'Complete your emergency fund to cover 6 months of expenses',
        category: 'savings',
        impact: 'high',
        effort: 'low',
        potentialSavings: 0,
        steps: [
          `Calculate 6 months of total expenses (${formatCurrency(emergencyFundTarget)})`,
          'Open a high-yield savings account',
          `Set up automatic transfer of ${formatCurrency(monthlyEmergencyContribution)} monthly`,
          'Keep funds easily accessible but separate'
        ]
      },
      {
        id: '4',
        title: 'Diversify Investment Portfolio',
        description: 'Add mid-cap and international funds to your portfolio for better diversification',
        category: 'investment',
        impact: 'medium',
        effort: 'medium',
        potentialSavings: generateRandomAmount(500000, 1200000),
        steps: [
          'Research top-performing mid-cap funds',
          'Allocate 20% of new investments to mid-cap',
          'Consider 10% allocation to international funds',
          'Rebalance portfolio quarterly'
        ]
      },
      {
        id: '5',
        title: 'Optimize Credit Card Usage',
        description: 'Use credit cards strategically for rewards while avoiding interest charges',
        category: 'debt',
        impact: 'low',
        effort: 'low',
        potentialSavings: generateRandomAmount(15000, 35000),
        steps: [
          'Set up auto-pay for full credit card balance',
          'Use cards only for planned purchases',
          'Maximize cashback on categories you spend most',
          'Review and redeem rewards monthly'
        ]
      },
      {
        id: '6',
        title: 'Start Tax-Saving Investments',
        description: 'Maximize tax savings through ELSS and other 80C investments',
        category: 'investment',
        impact: 'medium',
        effort: 'low',
        potentialSavings: taxSavings,
        steps: [
          'Calculate remaining 80C limit for this year',
          'Invest in top-rated ELSS funds',
          'Consider PPF for long-term tax-free growth',
          'Plan investments early in the financial year'
        ]
      }
    ];
  },

  // Get progress data
  getProgressData: () => {
    const baseProfile = generateFinancialProfile();
    const healthScore = generateRandomAmount(65, 90);
    const savingsRate = Math.floor((baseProfile.savingsRate / baseProfile.monthlyIncome) * 100);
    
    // Generate dynamic progress metrics
    const monthlyNetWorth = generateRandomAmount(30000, 60000);
    const monthlyGrowthPercent = Number((Math.random() * 15 + 2).toFixed(1)); // 2-17%
    
    const quarterlyNetWorth = monthlyNetWorth * 3;
    const quarterlyGrowthPercent = Number((monthlyGrowthPercent * 2.5).toFixed(1));
    
    const yearlyNetWorth = monthlyNetWorth * 12;
    const yearlyGrowthPercent = Number((monthlyGrowthPercent * 8).toFixed(1));
    
    const investmentReturns = Math.floor(baseProfile.savingsRate * 0.6);
    const returnPercent = Number((Math.random() * 5 + 1).toFixed(1)); // 1-6% monthly
    
    return {
      healthScore,
      monthly: {
        netWorthGrowth: monthlyNetWorth,
        netWorthGrowthPercent: monthlyGrowthPercent,
        totalSaved: baseProfile.savingsRate,
        savingsRate,
        investmentReturns,
        investmentReturnsPercent: returnPercent,
        debtReduction: 0,
        debtReductionPercent: 0
      },
      quarterly: {
        netWorthGrowth: quarterlyNetWorth,
        netWorthGrowthPercent: quarterlyGrowthPercent,
        totalSaved: baseProfile.savingsRate * 3,
        savingsRate,
        investmentReturns: investmentReturns * 3,
        investmentReturnsPercent: returnPercent * 2.5,
        debtReduction: 0,
        debtReductionPercent: 0
      },
      yearly: {
        netWorthGrowth: yearlyNetWorth,
        netWorthGrowthPercent: yearlyGrowthPercent,
        totalSaved: baseProfile.savingsRate * 12,
        savingsRate,
        investmentReturns: investmentReturns * 12,
        investmentReturnsPercent: returnPercent * 8,
        debtReduction: 0,
        debtReductionPercent: 0
      },
      recentAchievements: [
        {
          title: 'Savings Milestone',
          description: `Reached ${formatCurrency(generateRandomAmount(300000, 800000))} in total investments!`,
          date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
          }),
          emoji: '🎉'
        },
        {
          title: 'Consistency Champion',
          description: `Maintained SIP for ${generateRandomAmount(6, 24)} consecutive months`,
          date: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
          }),
          emoji: '🏆'
        },
        {
          title: 'Smart Spender',
          description: `Reduced expenses by ${generateRandomAmount(15, 35)}% last month`,
          date: new Date(Date.now() - Math.random() * 45 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
          }),
          emoji: '💡'
        }
      ],
      goalsProgress: [
        {
          title: 'Emergency Fund',
          progress: generateRandomAmount(60, 90),
          currentAmount: generateRandomAmount(200000, 400000),
          targetAmount: baseProfile.monthlyExpenses * 6,
          targetDate: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
            month: 'long', 
            year: 'numeric' 
          }),
          onTrack: true
        },
        {
          title: 'Dream Home Down Payment',
          progress: generateRandomAmount(25, 50),
          currentAmount: generateRandomAmount(500000, 1200000),
          targetAmount: generateRandomAmount(1500000, 3000000),
          targetDate: new Date(Date.now() + (3 + Math.random() * 2) * 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
            month: 'long', 
            year: 'numeric' 
          }),
          onTrack: true
        },
        {
          title: 'Retirement Fund',
          progress: generateRandomAmount(8, 20),
          currentAmount: generateRandomAmount(400000, 800000),
          targetAmount: generateRandomAmount(4000000, 8000000),
          targetDate: new Date(Date.now() + (20 + Math.random() * 10) * 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
            month: 'long', 
            year: 'numeric' 
          }),
          onTrack: true
        },
        {
          title: 'Children\'s Education',
          progress: generateRandomAmount(5, 15),
          currentAmount: generateRandomAmount(100000, 300000),
          targetAmount: generateRandomAmount(1500000, 2500000),
          targetDate: new Date(Date.now() + (10 + Math.random() * 5) * 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
            month: 'long', 
            year: 'numeric' 
          }),
          onTrack: Math.random() > 0.3 // 70% chance of being on track
        }
      ]
    };
  }
};