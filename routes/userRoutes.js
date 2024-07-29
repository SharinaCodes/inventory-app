const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  getUsers,
  deleteUser,
  updateUser,
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');
const {
  registerValidationRules,
  loginValidationRules,
} = require('../middleware/validators/authValidators');
const { logAction } = require('../middleware/logMiddleware');

router.post('/', registerValidationRules, validate, protect, logAction('CREATE_USER'), registerUser);
router.post('/login', loginValidationRules, validate, logAction('LOGIN_USER'), loginUser);
router.get('/me', protect, getMe);
router.route('/')
  .get(protect, admin, logAction('GET_USERS'), getUsers);
router.route('/:id')
  .delete(protect, admin, logAction('DELETE_USER'), deleteUser)
  .put(protect, admin, logAction('UPDATE_USER'), updateUser);

module.exports = router;
