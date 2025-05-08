const express = require('express');
const {
  startNewMatch,
  getActiveMatch,
  voteOnMatch, 
  finishMatch, 

} = require('../controllers/matchController');
const { protect } = require('../middleware/authMiddleware'); 

const router = express.Router();

router.post('/start', startNewMatch);

router.get('/active', getActiveMatch);

router.post('/:matchId/vote', protect, voteOnMatch); 
router.post('/:matchId/finish', protect, finishMatch); 


module.exports = router;