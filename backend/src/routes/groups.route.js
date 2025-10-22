const { Router } = require('express');
const { body } = require('express-validator');
// Auth middleware removed - using Web3 wallet authentication
const { 
  createGroup: createGroupController, 
  joinGroup: joinGroupController, 
  listGroups: listGroupsController,
  deleteGroup: deleteGroupController,
  getGroupDetails: getGroupDetailsController,
  updateGroup: updateGroupController,
} = require('../controllers/groups.controller');
const { validateRequest } = require('../middleware/validateRequest');

const router = Router();

/**
 * @openapi
 * /api/groups:
 *   get:
 *     summary: List groups for current user
 *     tags: [Groups]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of groups
 */
router.get('/', listGroupsController);

/**
 * @openapi
 * /api/groups:
 *   post:
 *     summary: Create a new group
 *     tags: [Groups]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               targetAmount: { type: number }
 *     responses:
 *       201:
 *         description: Created
 */
router.post(
  '/',
  [
    body('name').isString().isLength({ min: 2 }),
    body('description').optional().isString(),
    body('targetAmount').optional().isFloat({ min: 0 }),
    body('walletAddress').optional().isString(),
  ],
  validateRequest,
  createGroupController
);

/**
 * @openapi
 * /api/groups/join:
 *   post:
 *     summary: Join a group via invite code
 *     tags: [Groups]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [inviteCode]
 *             properties:
 *               inviteCode: { type: string }
 *     responses:
 *       200:
 *         description: Joined group
 */
router.post(
  '/join',
  [
    body('inviteCode').isString().isLength({ min: 10, max: 50 }),
    body('walletAddress').optional().isString(),
  ],
  validateRequest,
  joinGroupController
);

/**
 * @openapi
 * /api/groups/{groupId}:
 *   delete:
 *     summary: Delete a group
 *     tags: [Groups]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Group deleted successfully
 *       403:
 *         description: Not authorized to delete group
 *       404:
 *         description: Group not found
 */
router.delete('/:groupId', deleteGroupController);

/**
 * @openapi
 * /api/groups/{groupId}:
 *   get:
 *     summary: Get group details
 *     tags: [Groups]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Group details retrieved successfully
 *       404:
 *         description: Group not found
 */
router.get('/:groupId', getGroupDetailsController);

/**
 * @openapi
 * /api/groups/{groupId}:
 *   put:
 *     summary: Update group details
 *     tags: [Groups]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentAmount: { type: number }
 *               lastDepositAmount: { type: number }
 *               lastDepositTxId: { type: string }
 *               walletAddress: { type: string }
 *     responses:
 *       200:
 *         description: Group updated successfully
 *       404:
 *         description: Group not found
 *       403:
 *         description: Not authorized to update group
 */
router.put('/:groupId', updateGroupController);


module.exports = router;