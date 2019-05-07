const router = require('express').Router();
const User = require('../models/user');
const Product = require('../models/products');


Product.createMapping(function(err,mapping){
    if(err){
        console.log('error creating mapping');
        console.log(err);
    } else {
        console.log('Mapping created');
        console.log(mapping);
    }
});

var stream = Product.synchronize();
var count = 0;

stream.on('data', function(){
    count++;
})

stream.on('close', function(){
    console.log("Indexed" + count + "documents");
})

stream.on('error', function(){
    console.log(err);
})



router.get('/', (req,res) => {
    res.render('main/home');
  
  });
  
  router.get('/about',(req,res) => {
      res.render('main/about');
  });

  router.get('/products/:id', function(req,res,next){
      Product
      .find({category: req.params.id})
      .populate('category')
      .exec(function(err,products){
          if(err) return next(err);
          res.render('main/category', {
              products : products
          });
      });
  });

router.get('/product/:id')

module.exports = router;