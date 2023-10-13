const express = require('express');
const router = express.Router();
const { getUsers, getUserById, createUser, updateUserProfile, deleteUser } = require('../controllers/users.controller');

router.post('/', createUser);
router.get('/', getUsers);
router.get('/:userId', getUserById);
router.put('/:userId', updateUserProfile);

module.exports = router;
