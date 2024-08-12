const express = require('express');
const {
  createAsset,
  updateAsset,
  listAssetOnMarketplace,
  getAssetDetails,
  getUserAssets,
  getMarketplaceAssets,
  requestToBuyAsset,
  negotiatePurchaseRequest,
  acceptPurchaseRequest,
  denyPurchaseRequest,
  getUserPurchaseRequests,
} = require('../controllers/assetController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, createAsset);
router.put('/:id', authMiddleware, updateAsset);
router.put('/:id/publish', authMiddleware, listAssetOnMarketplace);
router.get('/:id', authMiddleware, getAssetDetails);
router.get('/user/assets', authMiddleware, getUserAssets);
router.get('/marketplace/assets', authMiddleware, getMarketplaceAssets);
router.post('/:id/request', authMiddleware, requestToBuyAsset);
router.put('/request/:id/negotiate', authMiddleware, negotiatePurchaseRequest);
router.put('/request/:id/accept', authMiddleware, acceptPurchaseRequest);
router.put('/request/:id/deny', authMiddleware, denyPurchaseRequest);
router.get('/user/requests', authMiddleware, getUserPurchaseRequests);

module.exports = router;
