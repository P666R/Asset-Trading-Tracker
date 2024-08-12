const Asset = require('../models/Asset');
const Request = require('../models/Request');

exports.createAsset = async (req, res) => {
  const { name, description, image, status } = req.body;
  try {
    const asset = new Asset({
      name,
      description,
      image,
      status,
      creator: req.user.id,
      currentHolder: req.user.id,
    });
    await asset.save();
    res
      .status(201)
      .json({ message: 'Asset created successfully', assetId: asset._id });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateAsset = async (req, res) => {
  const { name, description, image, status } = req.body;
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset || asset.creator.toString() !== req.user.id)
      return res.status(404).json({ message: 'Asset not found' });

    asset.name = name;
    asset.description = description;
    asset.image = image;
    asset.status = status;
    await asset.save();

    res
      .status(200)
      .json({ message: 'Asset updated successfully', assetId: asset._id });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.listAssetOnMarketplace = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset || asset.creator.toString() !== req.user.id)
      return res.status(404).json({ message: 'Asset not found' });

    asset.status = 'published';
    await asset.save();

    res.status(200).json({ message: 'Asset published successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAssetDetails = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id).populate(
      'creator currentHolder tradingJourney.holder'
    );
    if (!asset) return res.status(404).json({ message: 'Asset not found' });

    const tradingHistory = asset.tradingJourney.map((trade) => ({
      holder: trade.holder.username,
      date: trade.date,
      price: trade.price,
    }));

    res.status(200).json({
      id: asset._id,
      name: asset.name,
      description: asset.description,
      image: asset.image,
      creator: asset.creator.username,
      currentHolder: asset.currentHolder.username,
      tradingJourney: tradingHistory,
      averageTradingPrice:
        tradingHistory.reduce((sum, trade) => sum + trade.price, 0) /
          tradingHistory.length || 0,
      lastTradingPrice: tradingHistory[tradingHistory.length - 1]?.price || 0,
      numberOfTransfers: tradingHistory.length,
      isListed: asset.status === 'published',
      proposals: await Request.countDocuments({ asset: asset._id }),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserAssets = async (req, res) => {
  try {
    const assets = await Asset.find({ currentHolder: req.user.id }).populate(
      'currentHolder tradingJourney.holder'
    );
    const response = assets.map(async (asset) => {
      const tradingHistory = asset.tradingJourney.map((trade) => ({
        holder: trade.holder.username,
        date: trade.date,
        price: trade.price,
      }));

      return {
        id: asset._id,
        name: asset.name,
        description: asset.description,
        image: asset.image,
        currentHolder: asset.currentHolder.username,
        tradingJourney: tradingHistory,
        averageTradingPrice:
          tradingHistory.reduce((sum, trade) => sum + trade.price, 0) /
            tradingHistory.length || 0,
        lastTradingPrice: tradingHistory[tradingHistory.length - 1]?.price || 0,
        numberOfTransfers: tradingHistory.length,
        isListed: asset.status === 'published',
        proposals: await Request.countDocuments({ asset: asset._id }),
      };
    });

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMarketplaceAssets = async (req, res) => {
  try {
    const assets = await Asset.find({ status: 'published' }).populate(
      'currentHolder'
    );
    const response = assets.map((asset) => ({
      id: asset._id,
      name: asset.name,
      description: asset.description,
      image: asset.image,
      currentHolder: asset.currentHolder.username,
    }));

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.requestToBuyAsset = async (req, res) => {
  const { proposedPrice } = req.body;
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset || asset.status !== 'published')
      return res
        .status(404)
        .json({ message: 'Asset not found or not listed for sale' });

    const request = new Request({
      asset: asset._id,
      buyer: req.user.id,
      proposedPrice,
    });

    await request.save();
    res.status(201).json({
      message: 'Purchase request submitted successfully',
      requestId: request._id,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.negotiatePurchaseRequest = async (req, res) => {
  const { proposedPrice } = req.body;
  try {
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    const asset = await Asset.findById(request.asset);
    if (asset.currentHolder.toString() !== req.user.id)
      return res.status(403).json({ message: 'Unauthorized' });

    request.proposedPrice = proposedPrice;
    await request.save();
    res.status(200).json({ message: 'Purchase request updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.acceptPurchaseRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    const asset = await Asset.findById(request.asset);
    if (asset.currentHolder.toString() !== req.user.id)
      return res.status(403).json({ message: 'Unauthorized' });

    asset.currentHolder = request.buyer;
    asset.tradingJourney.push({
      holder: request.buyer,
      price: request.proposedPrice,
    });
    await asset.save();

    request.status = 'accepted';
    await request.save();
    res.status(200).json({ message: 'Purchase request accepted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.denyPurchaseRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    const asset = await Asset.findById(request.asset);
    if (asset.currentHolder.toString() !== req.user.id)
      return res.status(403).json({ message: 'Unauthorized' });

    request.status = 'denied';
    await request.save();
    res.status(200).json({ message: 'Purchase request denied' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserPurchaseRequests = async (req, res) => {
  try {
    const requests = await Request.find({ buyer: req.user.id }).populate(
      'asset'
    );
    const response = requests.map((request) => ({
      id: request._id,
      assetName: request.asset.name,
      proposedPrice: request.proposedPrice,
      status: request.status,
    }));

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
