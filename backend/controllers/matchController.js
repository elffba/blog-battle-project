// backend/controllers/matchController.js
const Match = require('../models/Match');
const Post = require('../models/Post');
const asyncHandler = require('express-async-handler');

// @desc    Start a new match
// @route   POST /api/matches/start
// @access  Public (veya Private/Admin)
const startNewMatch = asyncHandler(async (req, res) => {
  console.log('\n--- startNewMatch (Basitleştirilmiş) Başladı ---');
  const { category } = req.body;
  console.log(`İstek Body'si (Kategori): ${category || 'Belirtilmedi'}`);

  // 1. Aktif maçlardaki postları bul
  const activeMatchDocs = await Match.find({ status: 'active' }).select('post1 post2');
  let postsInActiveMatchesIds = [];
  activeMatchDocs.forEach(match => {
    if (match.post1) postsInActiveMatchesIds.push(match.post1.toString());
    if (match.post2) postsInActiveMatchesIds.push(match.post2.toString());
  });
  const uniquePostsInActiveMatchesIds = [...new Set(postsInActiveMatchesIds)];
  console.log('Şu an aktif maçta olan post ID\'leri:', uniquePostsInActiveMatchesIds);

  // 2. Eşleşme için uygun postları bulma kriterleri
  const queryCriteria = {
    _id: { $nin: uniquePostsInActiveMatchesIds }, // Aktif eşleşmede olmayan
    isEliminated: false,                      // Elenmemiş
    isActiveInTournament: true,               // Turnuvada aktif olan
  };
  if (category) {
    queryCriteria.category = category;
    console.log(`Kategori filtresi: ${category}`);
  } else {
    console.log('Kategori filtresi yok.');
  }

  // 3. Uygun postlar arasından rastgele 2 tane seç
  // Not: $match'ten sonra $sample kullanmak için aggregate kullanıyoruz.
  const potentialPosts = await Post.aggregate([
    { $match: queryCriteria },
    { $sample: { size: 2 } }
  ]);
  console.log(`Eşleşme için ${potentialPosts.length} potansiyel post bulundu ve rastgele seçildi.`);

  if (potentialPosts.length < 2) {
    console.log('HATA: Yeni eşleşme için uygun (aktif turnuvada, elenmemiş, boşta) en az 2 post bulunamadı.');
    res.status(400);
    throw new Error('Yeni bir eşleşme için uygun yazı bulunamadı.');
  }

  const post1 = potentialPosts[0];
  const post2 = potentialPosts[1];
  console.log(`Seçilen postlar: ${post1.title} vs ${post2.title}`);

  // 4. Eşleşmeyi oluştur
  const newMatchData = {
    post1: post1._id,
    post2: post2._id,
    status: 'active',
    // round: 1 // Match modelinde round alanı varsa ve default:1 ise otomatik set edilir.
              // Veya bu alanı Match modelinden tamamen kaldırabiliriz. Şimdilik kalsın.
  };
  console.log('Yeni eşleşme oluşturuluyor:', newMatchData);
  const newMatch = await Match.create(newMatchData);

  if (newMatch) {
    console.log('--- startNewMatch (Basitleştirilmiş) Tamamlandı ---');
    res.status(201).json(newMatch);
  } else {
    console.log('HATA: Yeni eşleşme oluşturulamadı (DB Hatası).');
    res.status(400);
    throw new Error('Yeni eşleşme oluşturulamadı (veritabanı hatası).');
  }
});


// @desc    Get a random active match (or the first one found)
// @route   GET /api/matches/active
// @access  Public
const getActiveMatch = asyncHandler(async (req, res) => {
  const activeMatches = await Match.aggregate([
    { $match: { status: 'active' } },
    { $sample: { size: 1 } }
  ]);

  if (activeMatches && activeMatches.length > 0) {
    const activeMatchDoc = activeMatches[0];
    
    // Populate işlemi doğrudan aggregate edilmiş döküman üzerinde çalışmaz.
    // Önce ID ile bulup sonra populate etmek daha güvenilir veya $lookup kullanmak gerekir.
    // Basitlik adına, ID ile bulup populate edelim.
    const populatedMatch = await Match.findById(activeMatchDoc._id)
      .populate({ path: 'post1', select: 'title content imageUrl category author votes wins', populate: { path: 'author', select: 'username'} })
      .populate({ path: 'post2', select: 'title content imageUrl category author votes wins', populate: { path: 'author', select: 'username'} });

    if (!populatedMatch || !populatedMatch.post1 || !populatedMatch.post2) {
        // Eğer populate sonrası post1 veya post2 null ise (örn: postlar silinmişse)
        // bu eşleşmeyi 'finished' yapıp hata verebilir veya farklı bir aktif maç arayabiliriz.
        // Şimdilik: Eğer populate başarısız olursa, o maçı geç ve başka aktif maç ara (veya hata ver)
        console.warn(`Aktif maç ${activeMatchDoc._id} için postlar populate edilemedi, muhtemelen postlar silinmiş.`);
        // Bu durumda, bu 'hayalet' maçı bitmiş sayıp başka bir aktif maç arayabiliriz.
        // Veya basitçe 404 dönebiliriz. Şimdilik 404 dönelim.
        // await Match.findByIdAndUpdate(activeMatchDoc._id, { status: 'finished', winner: null }); // Hayalet maçı bitir
        // return getActiveMatch(req, res); // Rekürsif çağrı dikkatli kullanılmalı
        res.status(404);
        throw new Error('Aktif eşleşme bulundu ancak yazı detayları yüklenemedi.');
    }

    res.status(200).json(populatedMatch);
  } else {
    res.status(404);
    throw new Error('Aktif eşleşme bulunamadı.');
  }
});

// @desc    Vote on a match
// @route   POST /api/matches/:matchId/vote
// @access  Private
const voteOnMatch = asyncHandler(async (req, res) => {
  const { matchId } = req.params;
  const { votedForPostId } = req.body;
  const userId = req.user._id;

  const match = await Match.findById(matchId);

  if (!match) { res.status(404); throw new Error('Eşleşme bulunamadı.'); }
  if (match.status !== 'active') { res.status(400); throw new Error('Bu eşleşme artık aktif değil, oy verilemez.'); }
  if (match.voters.map(vId => vId.toString()).includes(userId.toString())) { res.status(400); throw new Error('Bu eşleşmeye zaten oy verdiniz.'); }

  let postToUpdateVotesOn = null;
  if (match.post1.toString() === votedForPostId) {
    match.votesPost1 += 1;
    postToUpdateVotesOn = match.post1;
  } else if (match.post2.toString() === votedForPostId) {
    match.votesPost2 += 1;
    postToUpdateVotesOn = match.post2;
  } else {
    res.status(400);
    throw new Error('Geçersiz oy. Oy verilen post bu eşleşmede bulunmuyor.');
  }

  match.voters.push(userId);
  const savedMatch = await match.save();

  if (postToUpdateVotesOn) {
    await Post.findByIdAndUpdate(postToUpdateVotesOn, { $inc: { votes: 1 } });
  }

  // Populate for response
  const populatedMatch = await Match.findById(savedMatch._id)
    .populate({ path: 'post1', select: 'title content imageUrl category author votes wins', populate: { path: 'author', select: 'username'} })
    .populate({ path: 'post2', select: 'title content imageUrl category author votes wins', populate: { path: 'author', select: 'username'} });
  
  res.status(200).json(populatedMatch);
});

// @desc    Finish an active match and determine the winner
// @route   POST /api/matches/:matchId/finish
// @access  Private (veya Admin)
const finishMatch = asyncHandler(async (req, res) => {
  const { matchId } = req.params;
  // Populate etmeden önce eşleşmeyi bulalım, ID'leri alalım
  const match = await Match.findById(matchId);

  if (!match) { res.status(404); throw new Error('Eşleşme bulunamadı.'); }
  if (match.status !== 'active') { res.status(400); throw new Error('Sadece aktif eşleşmeler sonlandırılabilir.'); }

  let winnerId = null;
  let loserId = null;
  let isTie = false;

  // Kazananı/Kaybedeni Belirle
  if (match.votesPost1 > match.votesPost2) {
    winnerId = match.post1; // ObjectId
    loserId = match.post2;  // ObjectId
  } else if (match.votesPost2 > match.votesPost1) {
    winnerId = match.post2; // ObjectId
    loserId = match.post1;  // ObjectId
  } else {
    isTie = true;
    console.log(`Maç (${matchId}) berabere bitti.`);
  }

  // Önce Match dökümanını güncelle ve kaydet
  match.winner = winnerId;
  match.status = 'finished';
  const updatedMatchInDB = await match.save(); // Kaydedilmiş maçı al

  // Sonra Post dökümanlarını güncelle (Hata olursa logla ama işlem devam etsin)
  try {
    if (winnerId) {
      await Post.findByIdAndUpdate(winnerId, {
        $inc: { wins: 1, currentRound: 1 }, // Kazanmayı ve turu artır
        $set: { // Boolean alanları açıkça ayarla
          isEliminated: false,
          isActiveInTournament: true,
        }
      });
      console.log(`Post ${winnerId} kazanan olarak güncellendi.`);
    }
    if (loserId) {
      await Post.findByIdAndUpdate(loserId, {
        $set: { // Kaybedenin turu veya kazanması değişmez, sadece elenir
          isEliminated: true,
          isActiveInTournament: false,
        }
      });
      console.log(`Post ${loserId} kaybeden olarak güncellendi.`);
    } else if (isTie) {
      // Beraberlikte ikisi de elensin (PDF "kazanan üst tura çıkar" diyor)
      await Post.findByIdAndUpdate(match.post1, { $set: { isActiveInTournament: false, isEliminated: true } });
      await Post.findByIdAndUpdate(match.post2, { $set: { isActiveInTournament: false, isEliminated: true } });
      console.log(`Beraberlik sonucu Post ${match.post1} ve Post ${match.post2} elendi.`);
    }
  } catch (postUpdateError) {
    // Post güncellerken hata olursa logla, ama maç zaten bitti.
    console.error("Maç sonrası post durumları güncellenirken hata oluştu:", postUpdateError);
    // Bu durumda postların turnuva durumları tutarsız kalabilir,
    // daha gelişmiş bir sistemde bu hatayı ele almak gerekir.
  }

  // Yanıt için populate et
  const populatedResult = await Match.findById(updatedMatchInDB._id)
    .populate({ path: 'post1', select: 'title author votes wins currentRound isEliminated isActiveInTournament', populate: { path: 'author', select: 'username'} })
    .populate({ path: 'post2', select: 'title author votes wins currentRound isEliminated isActiveInTournament', populate: { path: 'author', select: 'username'} })
    .populate({ path: 'winner', select: 'title author', populate: { path: 'author', select: 'username'} });

  res.status(200).json(populatedResult);
});


module.exports = {
  startNewMatch,
  getActiveMatch,
  voteOnMatch,
  finishMatch,
};