const express = require('express');
const router = express.Router();
const { 
  createContact, 
  getContacts, 
  updateContactStatus, 
  deleteContact 
} = require('../controllers/contactController');

// POST /api/contacts - Create new contact
router.post('/', createContact);

// GET /api/contacts - Get all contacts
router.get('/', getContacts);

// PUT /api/contacts/:id - Mark contact as read
router.put('/:id', updateContactStatus);

// DELETE /api/contacts/:id - Delete contact
router.delete('/:id', deleteContact);

module.exports = router;
