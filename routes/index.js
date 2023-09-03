// Import the LaunchDarkly client.
var LaunchDarkly = require('launchdarkly-node-server-sdk');

// Set sdkKey to your LaunchDarkly SDK key. 
// Found in https://app.launchdarkly.com/settings/projects/default/environments
const sdkKey = 'ENTER-LAUNCHDARKLY-SDK-KEY';

// Set featureFlagKey to the feature flag key you want to evaluate.
const featureFlagKey = 'display-images';
const ldClient = LaunchDarkly.init(sdkKey);

var express = require('express');
var router = express.Router();

var fs = require('fs');

var Cart = require('../models/cart');
var products = JSON.parse(fs.readFileSync('./data/products.json', 'utf8'));

router.get('/', function (req, res, next) {

	const context = {
	  kind: "user",
	  key: "user-context-key",
	  email: req.session.email
	};
	let pageData = { 
		title: 'Pusateri Produce',
		products: products,
		showImages: false
	};

	ldClient.waitForInitialization().then(function () {
	  ldClient.variation(featureFlagKey, context, false,
		(err, showFeature) => {
		  if (showFeature) {
			pageData.showImages = true;
		  } else {
			pageData.showImages = false;
		  }
		  res.render('index', pageData);
		});
	});

});

router.post('/', function(req, res, next) {
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  let email = req.body.email_login;
  req.session.email = email;
  res.redirect('/');
});


router.get('/add/:id', function(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  var product = products.filter(function(item) {
    return item.id == productId;
  });
  cart.add(product[0], productId);
  req.session.cart = cart;
  res.redirect('/');
});

router.get('/cart', function(req, res, next) {
  if (!req.session.cart) {
    return res.render('cart', {
      products: null
    });
  }
  var cart = new Cart(req.session.cart);
  res.render('cart', {
    title: 'Pusateri Produce',
    products: cart.getItems(),
    totalPrice: cart.totalPrice
  });
});

router.get('/remove/:id', function(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.remove(productId);
  req.session.cart = cart;
  res.redirect('/cart');
});

module.exports = router;
