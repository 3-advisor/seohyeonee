const express = require('express');

const Restaurant = require('../model/Restaurant');

const router = express.Router();

router.get('/restaurant', (req, res) => {
  Restaurant.find((err, list) => {
    if (err) return res.status(500).send({
      error: 'database failure',
    });
    res.json(list);
  });
});

router.post('/restaurant', express.json(), (req, res) => {
  const entity = new Restaurant(req.body);

  entity.save((err) => {
    if (err) return res.status(500).send({
      error: 'database failure',
    });
    res.json({
      message: 'ok',
    });
  });
});

router.get('/restaurant/tag/:tag', (req, res) => {
  const options = { tags: { $in: [req.params.tag] } };
  Restaurant.find(options, (err, list) => {
    if (err) return res.status(500).send({
      error: 'database failure',
    });
    res.json(list);
  });
});

module.exports = router;
