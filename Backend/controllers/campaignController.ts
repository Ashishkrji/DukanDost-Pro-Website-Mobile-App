import Campaign from '../models/Campaign.ts';
import Customer from '../models/Customer.ts';
import whatsappService from '../services/whatsappService.ts';

export const createCampaign = async (req: any, res: any) => {
  try {
    const { title, message, audienceType } = req.body;
    const campaign = await Campaign.create({
      userId: req.ownerId,
      title,
      message,
      audienceType
    });
    res.status(201).json({ success: true, campaign });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to create campaign' });
  }
};

export const getCampaigns = async (req: any, res: any) => {
  try {
    const campaigns = await Campaign.find({ userId: req.ownerId }).sort({ createdAt: -1 });
    res.json({ success: true, campaigns });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch campaigns' });
  }
};

export const sendCampaign = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const campaign = await Campaign.findOne({ _id: id, userId: req.ownerId });
    if (!campaign) return res.status(404).json({ success: false, message: 'Campaign not found' });

    // Ensure only Business plan users can send campaigns (Final safety check)
    if (req.user.plan !== 'Business') {
      return res.status(403).json({ success: false, message: 'Broadcast is a Business Plan feature.' });
    }

    // Update status to Sending
    campaign.status = 'Sending';
    await campaign.save();

    // Determine audience
    let query: any = { userId: req.ownerId, isActive: true };
    
    let customers;
    if (campaign.audienceType === 'Overdue Only') {
      query.balance = { $gt: 0 };
      customers = await Customer.find(query);
    } else if (campaign.audienceType === 'Top Customers') {
      // Logic for top 10 customers by balance or total spent (if we had it)
      // For now, let's say top 10 by balance (most udhaar)
      customers = await Customer.find(query).sort({ balance: -1 }).limit(10);
    } else {
      customers = await Customer.find(query);
    }
    
    campaign.recipientCount = customers.length;

    // Send messages
    // In a real app, this should be an async queue job (BullMQ/RabbitMQ)
    // For now we process it sequentially
    let sentCount = 0;
    let failCount = 0;

    for (const customer of customers) {
      if (customer.phone) {
        const result = await whatsappService.sendTextMessage(customer.phone, campaign.message);
        if (result.success) sentCount++;
        else failCount++;
      }
    }

    campaign.status = 'Completed';
    campaign.sentAt = new Date();
    await campaign.save();

    res.json({ 
      success: true, 
      campaign,
      summary: { total: customers.length, sent: sentCount, failed: failCount }
    });
  } catch (error) {
    console.error('Campaign Send Error:', error);
    res.status(500).json({ success: false, message: 'Failed to send campaign' });
  }
};

