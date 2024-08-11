import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/Login.vue';
import Register from '../components/Register.vue';  
import Account from '../components/Account.vue';
import Products from '../components/Products.vue';
import UserLogin from '../components/UserLogin.vue';
import App from '../App.vue';
import { watch, ref, inject, Ref } from 'vue'
import PostListing from '../components/PostListing.vue';
import ProductDetails from '../components/ProductDetails.vue';
import ListingDetail from '../components/ListingDetail.vue';
import UserOrderDetail from '../components/UserOrderDetail.vue';

const routes = [
  // login
  {
    path: '/login',
    name: 'Login',
    component: UserLogin,
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
  },
  {
    path: '/account',
    name: 'Account',
    component: Account,
  },
  {
    path: '/',
    name: 'Home',
    component: Products, // Add a route for the products page
    // children: [
    //   {
    //     path: 'products/:id',
    //     name: 'ProductDetails',
    //     component: ProductDetails,
    //   },
    // ],
  },
  {
    path: '/products/:id/',
    name: 'ProductDetails',
    component: ProductDetails,
    props: true
  },
  {
    path: '/post-listing',
    name: 'PostListing',
    component: PostListing,
  },
  {
    path: '/edit-listing/:id',
    name: 'EditListing',
    component: PostListing,
    props: true,
  },
  {
    path: '/listings/:id',
    name: 'ListingDetails',
    component: ListingDetail,
  },
  {
    path: '/orders/:id',
    name: 'OrderDetails',
    component: UserOrderDetail,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});



//Navigation Guard
router.beforeEach((to, from, next) => {
  console.log("im here in beforeeach")
  const publicPages = ['/login', '/', '/register', '/seller', '/seller/inventory','/products', '/products/:id'];  // public
  const authRequired = !publicPages.includes(to.path);  // check if cur path needs login
  // const loggedIn = localStorage.getItem('isAuthenticated');  // this is the code to store JWT token
  
  const user: Ref<any> = inject("user")!
  console.log('user: ', JSON.stringify(user.value));
  if (authRequired && !user.value.user_id) {
    console.log('needs to redirect to login page');
    return next('/login');
  } else {  
    next();
  }
});


export default router;
