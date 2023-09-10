import React, { useCallback, useEffect, useState } from 'react'
import NextLink from 'next/link';
import { useSnackbar } from 'notistack';
import { getError } from '../utils/error';
import axios from 'axios';
import {sidebarOpenHandler} from './Layout'

const COMMANDS = {
    OPEN_CART: 'open-cart',
    SHOW_PRODUCTS: 'show-products',
    // SHOW_CREAM: 'show-cream',
    // SHOW_GEL: 'show-gel',
    // SHOW_LOZENGE: 'show-lozenge',
    // SHOW_OINTMENT: 'show-ointment',
    // SHOW_POWDER: 'show-powder',
    // SHOW_SPRAY: 'show-spray',
    // SHOW_TABLET: 'show-tablet',
    // SHOW_ALLERGEX: 'show-allergex',
    // SHOW_POWDER: 'show-powder', 
    // SHOW_ENO: 'show-eno', 
    SHOW_INFO: 'show-info',
    CHECKOUT: 'checkout',
    PO_SCREEN: 'po_screen',
    PM_SCREEN: 'pm_screen',
    TEST: 'test',
}

export default function useAlan() {
    
//alan code
// intent("open cart", p => {
//   p.play({command: 'open-cart'});
//   p.play('Opening') 
// });
const [generatedProductName, setGeneratedProductName] = useState('');
  const [alanInstance, setAlanInstance] = useState()
  const openCart = useCallback(() => {
    //alanInstance.playText("Opening cart")
    window.open("/cart","_top","replace:false");

  }, [alanInstance])

  // Modify the showProducts function to fetch a product name from the serverless function
const showProducts = useCallback(async () => {
  try {
    // Send a request to the Sanity.io custom API route
    const response = await axios.get('/api/generate-product-name'); // Replace with your Sanity.io custom API route

    // Extract the generated product name from the response
    const generatedName = response.data.generatedProductName;

    // Set the generated product name
    setGeneratedProductName(generatedName);

    // Open the URL with the generated product name
    window.open(`/${generatedName}`, '_top', 'replace:false');
  } catch (error) {
    // Handle any errors
    console.error('Error fetching product name:', error);
  }
}, []);


  const selectRadioButton = useCallback((category) => {
    const event = new CustomEvent(COMMANDS.SELECT_RADIO_BUTTON, { detail: { category } });
    window.dispatchEvent(event);
  }, []);

  const showInfo = useCallback(() => {
    //alanInstance.playText("Showing products")
    window.open("/info","_top","replace:false");
    
  }, [alanInstance])

  const showProducts = useCallback(async () => {
    try {
      // Send a request to your backend to generate a product name using GPT-3
      const response = await axios.get('/api/generate-product-name'); // Replace with your backend API endpoint
      const generatedName = response.data.generatedProductName;

      // Set the generated product name
      setGeneratedProductName(generatedName);

      // Open the URL with the generated product name
      window.open(`/${generatedName}`, '_top', 'replace:false');
    } catch (error) {
      // Handle any errors
      console.error('Error fetching product name:', error);
    }
  }, []);

  const checkout = useCallback(() => {
    window.open("/shipping", "_top", "replace:false");
  }, [alanInstance])

  const po_screen = useCallback(() => {
    window.open("/placeorder", "_top", "replace:false");
  }, [alanInstance])

  const pm_screen = useCallback(() => {
    window.open("/payment", "_top", "replace:false");
  }, [alanInstance])

  // const showPowder = useCallback(() => {
  //   alanInstance.playText("Opening")
  //   window.open("http://localhost:3000/search?category=Powder","_top","replace:false");
    
  // }, [alanInstance])

  // const showEno = useCallback(() => {
  //   alanInstance.playText("Opening")
  //   window.open("http://localhost:3000/product/grandpa","_top","replace:false");
    
  // }, [alanInstance])

  // const showCream = useCallback(() => {
  //   alanInstance.playText("Showing cream products")
  //   window.open("http://localhost:3000/search?category=Cream","_top","replace:false");
    
  // }, [alanInstance])

  
  // const showTablet = useCallback(() => {
  //   alanInstance.playText("Showing tablet products")
  //   window.open("http://localhost:3000/search?category=Tablet","_top","replace:false");
    
  // }, [alanInstance])

  // const showAllergex = useCallback(() => {
    
  //   window.open("http://localhost:3000/product/nurofen","_top","replace:false");
  //   //alanInstance.playText("Opening");
  // }, [alanInstance])

  

  useEffect(() => {
    window.addEventListener(COMMANDS.OPEN_CART, openCart)
    window.addEventListener(COMMANDS.SHOW_PRODUCTS, showProducts)
    // window.addEventListener(COMMANDS.SHOW_CREAM, showCream)
    // window.addEventListener(COMMANDS.SHOW_TABLET, showTablet)
    // window.addEventListener(COMMANDS.SHOW_ALLERGEX, showAllergex)
    // window.addEventListener(COMMANDS.SHOW_POWDER, showPowder)
    // window.addEventListener(COMMANDS.SHOW_ENO, showEno)
    window.addEventListener(COMMANDS.SHOW_INFO, showInfo)
    window.addEventListener(COMMANDS.CHECKOUT, checkout)
    window.addEventListener(COMMANDS.PM_SCREEN, pm_screen)
    window.addEventListener(COMMANDS.PO_SCREEN, po_screen)
    
    window.addEventListener(COMMANDS.SELECT_RADIO_BUTTON, (event) => {
      if (event.category.startsWith("payment-")) {
        selectRadioButton(event.category.replace("payment-", ""));
      }
    });


    return () => {
        window.removeEventListener(COMMANDS.OPEN_CART, openCart)
        window.removeEventListener(COMMANDS.SHOW_PRODUCTS, showProducts)
        // window.removeEventListener(COMMANDS.SHOW_CREAM, showCream)
        // window.removeEventListener(COMMANDS.SHOW_TABLET, showTablet)
        // window.removeEventListener(COMMANDS.SHOW_ALLERGEX, showAllergex)
        // window.removeEventListener(COMMANDS.SHOW_POWDER, showPowder)
        // window.removeEventListener(COMMANDS.SHOW_ENO, showEno)
        window.removeEventListener(COMMANDS.SHOW_INFO, showInfo)
        window.removeEventListener(COMMANDS.CHECKOUT, checkout)
        window.removeEventListener(COMMANDS.PM_SCREEN, pm_screen)
        window.removeEventListener(COMMANDS.PO_SCREEN, po_screen)
        
        window.removeEventListener(COMMANDS.SELECT_RADIO_BUTTON, selectRadioButton);
      

    }
  }, [openCart, showProducts,  checkout, pm_screen, po_screen, selectRadioButton])

  useEffect(() => {
    const alanBtn = require('@alan-ai/alan-sdk-web');
    if (alanInstance != null) return
    
    setAlanInstance(
    
    alanBtn({
        
      key: "8a2abea919ba88ed014702bcada1f8ea2e956eca572e1d8b807a3e2338fdd0dc/stage",
      rootEl: document.getElementById("alan-btn"),
      onCommand: ({command}) => {
        window.dispatchEvent(new CustomEvent(command))
        
      }
    }))
  }, [])
  return null
    
  //api for gpt3
  const axios = require('axios');
  const gpt3ApiKey = process.env.GPT3_API_KEY;
  // Define your serverless function
exports.handler = async (event, context) => {
  try {
    // Perform a request to GPT-3 to generate a product name
    const gptResponse = await axios.post('https://api.openai.com/v1/engines/text-davinci-002/completions', {
      prompt: 'Generate a product name for a new product',
      max_tokens: 50, // Adjust this as needed
    }, {
      headers: {
        'Authorization': 'Bearer GPT3_API_KEY',
        'Content-Type': 'application/json',
      },
    });

    // Extract the generated product name from the GPT-3 response
    const generatedProductName = gptResponse.data.choices[0].text;

    // Return the generated product name
    return {
      statusCode: 200,
      body: JSON.stringify({ generatedProductName }),
    };
  } catch (error) {
    // Handle any errors
    console.error('Error generating product name:', error);

    // Return an error response
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error generating product name' }),
    };
  }
};
}

