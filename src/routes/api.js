const express = require('express');

const MenuManager = require('../common/MenuManager');
const menuManager = new MenuManager();

const router = express.Router();

router.get('/restaurant', (req, res) => {
  menuManager.get().then((list) => {
    res.json(list);
  })
    .catch((error) => {
      res.json(error);
    });
});

router.post('/restaurant', express.json(), (req, res) => {
  console.log(req.body);
  menuManager.get(req.body).then((message) => {
    res.json(message);
  })
    .catch((error) => {
      res.json(error);
    });
});

router.get('/restaurant/tag/', (req, res) => {
  console.log(req.query);
  const tags = Array.isArray(req.query.tag) ? req.query.tag : [req.query.tag];
  menuManager.get(tags).then((list) => {
    res.json(list);
  })
    .catch((error) => {
      res.json(error);
    });
});

module.exports = router;
