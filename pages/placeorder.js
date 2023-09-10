import {
  Button,
  Card,
  CircularProgress,
  Grid,
  Link,
  List,
  ListItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';
import  { useContext, useEffect, useState } from 'react';
import NextLink from 'next/link';
import CheckoutWizard from '../components/CheckoutWizard';
import Layout from '../components/Layout';
import classes from '../utils/classes';
import { Store } from '../utils/Store';
import { useSnackbar } from 'notistack';
import { getError } from '../utils/error';
import axios from 'axios';
import jsCookie from 'js-cookie';
import dynamic from 'next/dynamic';
import React, { useRef } from 'react';
import emailjs from 'emailjs-com';


function PlaceOrderScreen() {


  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const {
    userInfo,
    cart: { cartItems, shippingAddress, paymentMethod, paymentChoice },
  } = state;
  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100; // 123.456 => 123.46
  const itemsPrice = round2(
    cartItems.reduce((a, c) => a + c.price * c.quantity, 0)
  );
  // const shippingPrice = itemsPrice > 200 ? 0 : 15;
  // const taxPrice = round2(itemsPrice * 0.15);
  const totalPrice = round2(itemsPrice);

  useEffect(() => {
    if (!paymentMethod) {
      router.push('/payment');
    }
    if (cartItems.length === 0) {
      router.push('/cart');
    }
  }, [cartItems, paymentMethod, paymentChoice, router]);

  const placeOrderHandler = async () => {
    try {
          setLoading(true);
      const { data } = await axios.post(
        '/api/orders',
        {
          orderItems: cartItems.map((x) => ({
            ...x,
            countInStock: undefined,
            slug: undefined,
          })),
          shippingAddress,
          paymentMethod,
          itemsPrice,
          // shippingPrice,
          // taxPrice,
          totalPrice,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

       // Generate order details for the email
    const orderDetails = cartItems
      .map((item) => `${item.quantity} x ${item.name} - R${item.price}`)
      .join('\n'); 

// Send order summary email
const customerEmailParams  = {
 // to_email: userInfo.email, // Change this to the recipient's email address
  subject: 'Order Confirmation', // Email subject
  message: `Thank you for your order!\n\nPayment Method: ${paymentMethod}\n\nOrder Details:\n${orderDetails}\n\nTotal: R${totalPrice}`,
};

 // Replace with your customer email template ID
 const customerTemplateId = 'template_e1xsd2t';
 

// Replace these values with your actual EmailJS service and template IDs
const serviceId = 'service_y0xz75a';
// const templateId = 'template_e1xsd2t';
const userId = 'ydAo0pv1bIwxcHIlX';
const serviceIdAdmin = 'service_ruicx6j';


// Replace these values with your actual EmailJS service and template IDs
// const serviceIdAdmin = 'service_y0xz75a';
// const templateIdAdmin = 'template_xefuh2r';
// const userIdAdmin = 'ydAo0pv1bIwxcHIlX';


  // Send the customer email
  const customerResponse = await emailjs.send(
    serviceId,
    customerTemplateId,
    customerEmailParams,
    userId
  );

 // Send admin notification email
 const adminEmailParams = {
  to_email: 'aprufo@gmail.com', // Admin's email address
  subject: 'New Order Notification',
  message: `New order received!\n\nPayment Method: ${paymentMethod}\n\nOrder Details:\n${orderDetails}\n\nTotal: R${totalPrice}`,
};

const adminTemplateId = 'template_xefuh2r';

  // Send the admin email
  // const adminResponse = await emailjs.send(
  //   serviceIdAdmin,
  //   adminTemplateId,
  //   adminEmailParams,
  //   userId
  // );


      dispatch({ type: 'CART_CLEAR' });
      jsCookie.remove('cartItems');
      setLoading(false);
      router.push(`/order/${data}`);
    } catch (err) {
      setLoading(false);
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };

  return (
    <Layout id="myText"title="Place Order">
      <CheckoutWizard activeStep={3}></CheckoutWizard>
      <Typography component="h1" variant="h1">
        Place Order
      </Typography>

      <Grid container spacing={1}>
        <Grid item md={9} xs={12}>
        <Card sx={classes.section}>
  <List>
    <ListItem>
      <Typography variant="h2">Payment Method</Typography>
    </ListItem>
    <ListItem>
      {paymentMethod === 'Delivery' && paymentChoice ? (
        <Typography>{paymentMethod} - {paymentChoice}</Typography>
      ) : (
        <Typography>{paymentMethod}</Typography>
      )}
    </ListItem>
    <ListItem>
      <Button
        onClick={() => router.push('/payment')}
        variant="contained"
        color="secondary"
        style={{ border: '1.5px solid #0070f3' }}
      >
        Edit
      </Button>
    </ListItem>
  </List>
</Card>

          <Card sx={classes.section}>
            <List>
              <ListItem>
                <Typography component="h2" variant="h2">
                  Shipping Address
                </Typography>
              </ListItem>
              <ListItem>
                {shippingAddress.fullName}, {' '} {shippingAddress.address}
                {/* {shippingAddress.city}, {shippingAddress.postalCode},{' '}
                {shippingAddress.country} */}
              </ListItem>
              <ListItem>
                <Button
                  onClick={() => router.push('/shipping')}
                  variant="contained"
                  color="secondary"
                  style={{ border: '1.5px solid #0070f3' }}
                >
                  Edit
                </Button>
              </ListItem>
            </List>
          </Card>
          
          <Card sx={classes.section}>
            <List>
              <ListItem>
                <Typography component="h2" variant="h2">
                  Order Items
                </Typography>
              </ListItem>
              <ListItem>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Image</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell align="right">Quantity</TableCell>
                        <TableCell align="right">Price</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {cartItems.map((item) => (
                        <TableRow key={item._key}>
                          <TableCell>
                            <NextLink href={`/product/${item.slug}`} passHref>
                              <Link>
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  width={50}
                                  height={50}
                                ></Image>
                              </Link>
                            </NextLink>
                          </TableCell>
                          <TableCell>
                            <NextLink href={`/product/${item.slug}`} passHref>
                              <Link>
                                <Typography>{item.name}</Typography>
                              </Link>
                            </NextLink>
                          </TableCell>
                          <TableCell align="right">
                            <Typography>{item.quantity}</Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography>R{item.price}</Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </ListItem>
            </List>
          </Card>
        </Grid>
        <Grid item md={3} xs={12}>
          <Card sx={classes.section}>
            <List>
              <ListItem>
                <Typography variant="h2">Order Summary</Typography>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Items:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography align="right">R{itemsPrice}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              {/* <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Shipping:</Typography>
                  </Grid>
                  {/* <Grid item xs={6}>
                    <Typography align="right">R{shippingPrice}</Typography>
                  </Grid> */}
                {/* </Grid>
              </ListItem> */} 
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>
                      <strong>Total:</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography align="right">
                      <strong>R{totalPrice}</strong>
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Button
                  onClick={placeOrderHandler}
                  
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={loading}
                  
                 
                >
                  Place Order
                </Button>
              </ListItem>
              {loading && (
                <ListItem>
                  <CircularProgress />
                </ListItem>
              )}
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(PlaceOrderScreen), { ssr: false });
