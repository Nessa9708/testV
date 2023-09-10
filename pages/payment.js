import {
  Button,
  FormControl,
  FormControlLabel,
  List,
  ListItem,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import jsCookie from 'js-cookie';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import CheckoutWizard from '../components/CheckoutWizard';
import Form from '../components/Form';
import Layout from '../components/Layout';
import { Store } from '../utils/Store';
import useAlan from '../components/useAlan';

export default function PaymentScreen() {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentChoice, setPaymentChoice] = useState('');
  const { state, dispatch } = useContext(Store);
  const {
    cart: { shippingAddress },
  } = state;
  const alanInstance = useAlan();
  

  useEffect(() => {
    if (!shippingAddress.address) {
      router.push('/shipping');
    } else {
      setPaymentMethod(jsCookie.get('paymentMethod') || '');
    }
  }, [router, shippingAddress]);

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handlePaymentChoiceChange = (event) => {
    setPaymentChoice(event.target.value);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (!paymentMethod) {
      enqueueSnackbar('Payment method is required', { variant: 'error' });
    } else if (paymentMethod === 'Delivery' && !paymentChoice) {
      enqueueSnackbar('Payment choice is required for delivery', { variant: 'error' });
    } else {
      dispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethod });
      jsCookie.set('paymentMethod', paymentMethod);
      router.push('/placeorder');
    }
  };
  
  return (
    <Layout title="Payment Method">
      <CheckoutWizard activeStep={2}></CheckoutWizard>
      <Form onSubmit={submitHandler}>
        <Typography component="h1" variant="h1">
          Payment Method
        </Typography>
        <List>
          <ListItem>
            <FormControl component="fieldset">
              <RadioGroup
                aria-label="Payment Method"
                name="paymentMethod"
                value={paymentMethod}
                onChange={handlePaymentMethodChange}
                // onChange={(e) => setPaymentMethod(e.target.value)}
              >
                
                <FormControlLabel
  label={`Delivery - Cash`}
  value={`Delivery - Cash`}
  control={<Radio id="payment-cash" />} // Make sure the ID matches the selectRadioButton logic
/>
<FormControlLabel
  label={`Delivery - Card`}
  value={`Delivery - Card`}
  control={<Radio id="payment-card" />} // Make sure the ID matches the selectRadioButton logic
/>
<FormControlLabel
  label="Pickup"
  value="Pickup"
  control={<Radio id="payment-pickup" />} // Make sure the ID matches the selectRadioButton logic
/>
              </RadioGroup>
            </FormControl>
          </ListItem>
          
          <ListItem>
            <Button fullWidth type="submit" variant="contained" color="primary">
              Continue
            </Button>
          </ListItem>
          <ListItem>
            <Button
              fullWidth
              type="button"
              variant="contained"
              color="secondary"
              onClick={() => router.push('/shipping')}
            >
              Back
            </Button>
          </ListItem>
        </List>
      </Form>
    </Layout>
  );
}

