import { Router, Request, Response } from 'express';
import { fetchOrders, fetchUsername } from '../services/userService';
import passport from 'passport'
import expressPinoLogger from 'express-pino-logger'
import { Collection, Db, MongoClient, ObjectId } from 'mongodb'
import { Issuer, Strategy, generators } from 'openid-client'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import { checkAuthenticated, checkRole } from '../utils/auth';

import { createListing, updateListing, fetchListingDetail, fetchListings, deleteListing } from '../services/listingService'
import { ADMIN, USER } from '../config/config'
import { IProduct } from '../models/Product';
import { passportStrategies } from '../server';
import { fetchOrderDetail } from '../services/orderService';

const router = Router();

export function setup(passport: any) {
  const router = Router();
  router.get('/login', passport.authenticate(passportStrategies, {
    successReturnToOrRedirect: "/"
  }))   

router.get('/login-callback', passport.authenticate(passportStrategies, {
  successReturnToOrRedirect: '/', // server:8191, ui:8082
  failureRedirect: '/login'
}))

// logout
router.post('/logout', (req, res) => {
  // req.logout
  req.logout(function(err) {
    if (err) {
      console.error("Logout failed:", err);
      return res.status(500).json({ message: "Failed to logout" });
    }
    
    // clear session
    req.session.destroy(err => {
      if (err) {
        console.error("Session destruction failed.");
        return res.status(500).json({ message: "Failed to logout" });
      }

      // clear cookie
      res.clearCookie('connect.sid'); // connect.sid is the default cookie name for express-session
      // redirect to  page
      res.redirect('/');
    });
  });
});

// todo there is problem left 
// router.get('/check-login', (req, res) => {
//   if (req.isAuthenticated()) {
//       console.log('User is authenticated');
//       res.json({ isAuthenticated: true });
//   } else {
//       console.log('User is not authenticated');
//       res.json({ isAuthenticated: false });
//   }
// });

router.get("/check-login", (req, res) => {
  console.log("\n\n\nreq.user\n", req.session)
  res.json(req.user || {})
})

router.get('/users', (req, res) => {
    // print the request object
    console.log(req);
    res.send('User list');
})


// get users's orders by user id, need to check login status
router.get('/orders', checkAuthenticated, async (req, res) => {
  const userId = (req.session as any).passport.user.user_id;

  try {
    const orders = await fetchOrders(userId);
    res.json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: "Failed to retrieve orders" });
  }
})


// get order detail by id
router.get('/orders/:id', checkAuthenticated, async (req, res) => {
  const orderId = req.params.id;
  console.log("in get order id: ", orderId)
  try {
    const order = await fetchOrderDetail(orderId);

    //check if the current user is the seller of the listing
    const userId = (req.session as any).passport.user.user_id;
    if ('buyer_id' in order && order.buyer_id !== userId) {
      res.status(403).json({ message: "You are not the owner of the order" });
      return;
    }
    res.json({ data: order });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: "Failed to retrieve order detail" });
  }
})


// get listings detail by listing id
router.get('/listings/:id', checkAuthenticated, async (req, res) => {
  const listingId = req.params.id;
  console.log("in get listing id: ", listingId)


  try {
    const listings = await fetchListingDetail(listingId);

    //check if the current user is the seller of the listing
    const userId = (req.session as any).passport.user.user_id;
    if ('seller_id' in listings && listings.seller_id !== userId) {
      res.status(403).json({ message: "You are not the seller of the listing" });
      return;
    }
    res.json({ data: listings });
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({ message: "Failed to retrieve listings" });
  }
})

// get user's listings by user id, need to check login status
router.get('/listings', checkAuthenticated, async (req, res) => {
  const userId = (req.session as any).passport.user.user_id;

  try {
    const listings = await fetchListings(userId);
    res.json({ listings });
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({ message: "Failed to retrieve listings" });
  }
})

// post a listing
router.post('/listings', checkAuthenticated, async (req, res) => {
  const userId = (req.session as any).passport.user.user_id;
  const listing = req.body;

  // check if userId or listing is missing
  if (!userId || !listing) {
    res.status(400).json({ message: "Missing userId or listing" });
  }

  try {
    const result = await createListing(userId, listing);
    res.json({ data: result });
  } catch (error) {
    console.error('Error posting listing:', error);
    res.status(500).json({ message: "Failed to post listing" });
  }
})

// update a listing
router.put('/listings/:id', checkAuthenticated, async (req, res) => {
  const listingId = req.params.id;
  const listing = req.body;

  // check if listingId or listing is missing
  if (!listingId || !listing) {
    res.status(400).json({ message: "Missing listingId or listing" });
  }

  // check if current user is the seller of the listing
  const userId = (req.session as any).passport.user.user_id;
  if (listing.seller_id !== userId) {
    res.status(403).json({ message: "You are not the seller of the listing" });
  }

  try {
    const result = await updateListing(listingId, listing);
    res.json({ data: result });
  } catch (error) {
    console.error('Error updating listing:', error);
    res.status(500).json({ message: "Failed to update listing" });
  }
})

// delete a listing
router.delete('/listings/:id', checkAuthenticated, async (req, res) => {
  const listingId = req.params.id;

  // check if listingId is missing
  if (!listingId) {
    res.status(400).json({ message: "Missing listingId" });
    return;
  }

  // check if current user is the seller of the listing
  const userId = (req.session as any).passport.user.user_id;
  
  try {
    const listing = await fetchListingDetail(listingId);
    if (listing instanceof Error) {
      throw new Error('Listing does not exist');
    }
    // check if the current user is the seller of the listing
    if (listing.seller_id !== userId) {
      res.status(403).json({ message: "You are not the seller of the listing" });
      return;
    }

    const result = await deleteListing(listingId);
    res.json({ data: result });
  } catch (error) {
    console.error('Error deleting listing:', error);
    res.status(500).json({ message: "Failed to delete listing" });
  }
})

// get username by id
router.get('/:id', async (req, res) => {
  // print the request object
  const user_id = req.params.id;
  console.log("in get user id", user_id)
  const name = await fetchUsername(user_id);
  // console.log("user name:\n\n\n",name);
  res.json({name});
});

return router
}

// export default router;