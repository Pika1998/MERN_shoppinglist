const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
// Item Model
const Item = require("../../models/Item");

/* 
{
    "description":"Gets a list of items in latest-first order",
    "outputs":{
        "items":"A JSON Array of items"
    }
}
    */

router.get("/", (req, res) => {
  Item.find()
    .sort({ date: -1 })
    .then((items) => res.json(items));
});

/*  
{
    "description":"Creates a new item",
    "inputs":{
        "name":"The name of the item"
    }
}
    */

router.post("/", auth, (req, res) => {
  const newItem = new Item({
    name: req.body.name,
  });

  newItem.save().then((item) => res.json(item));
});

/* 
{
    "description":"Deletes the item",
    "inputs":{
        "id":"Pass the id in param"
    }
}
    */

router.delete("/:id", auth, (req, res) => {
  Item.findById(req.params.id)
    .then((item) =>
      item.remove().then(() => {
        res.json({ success: true });
      })
    )
    .catch((err) => {
      res.status(404).json({ success: false });
    });
});

module.exports = router;
