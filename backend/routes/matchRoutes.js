// backend/routes/matchRoutes.js
const express = require('express');
const {
  startNewMatch,
  getActiveMatch,
  voteOnMatch, // <--- voteOnMatch'i import et
  finishMatch, // <--- finishMatch'i import et

} = require('../controllers/matchController');
const { protect } = require('../middleware/authMiddleware'); // Gerekirse diye protect middleware'i

const router = express.Router();

// Yeni bir eşleşme başlatmak için (Belki admin yetkisi gerekebilir ileride)
// Şimdilik testi kolaylaştırmak için public veya protect olmadan bırakabiliriz,
// sonra istersen protect eklersin.
router.post('/start', startNewMatch);

// Aktif bir eşleşmeyi getirmek için (Oylama sayfasında kullanılacak)
router.get('/active', getActiveMatch);

// Bir eşleşmeye oy vermek için (Bu endpoint'i bir sonraki adımda oluşturacağız)
router.post('/:matchId/vote', protect, voteOnMatch); // <--- YENİ ROUTE
router.post('/:matchId/finish', protect, finishMatch); // <--- YENİ ROUTE


module.exports = router;