import { createTheme } from '@mui/material/styles';
import {
  AppBar,
  Badge,
  Box,
  Button,
  Container,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  InputBase,
  Link,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Switch,
  ThemeProvider,
  Toolbar,
  Typography,
  useMediaQuery,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import CancelIcon from '@mui/icons-material/Cancel';
import Head from 'next/head';
import NextLink from 'next/link';
import classes from '../utils/classes';
import React, {  useCallback, useContext, useEffect, useState } from 'react';
import { Store } from '../utils/Store';
import jsCookie from 'js-cookie';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { getError } from '../utils/error';
// import alanBtn from '@alan-ai/alan-sdk-web';
import ReactDOM from 'react-dom';
import useAlan from './useAlan';

// window.onload = (event) => {
//    const formm = document.getElementById('products-sec');
//   formm.style.display = 'none';
//   window.location = "/test"
// };
// const alanKey = '8a2abea919ba88ed014702bcada1f8ea2e956eca572e1d8b807a3e2338fdd0dc/stage';
// useEffect(() => {
//   alanBtn({
//     key: alanKey,
//     // onCommand: () => {

//     // }
//   })
// }, [])

export default function Layout({ title, description, children }) {
  //alan code
  //key: "8a2abea919ba88ed014702bcada1f8ea2e956eca572e1d8b807a3e2338fdd0dc/stage",

  useAlan()
  const [firstLoad, setFirstLoad] = useState(true);
  useEffect(() => {
    if (firstLoad) {
      setFirstLoad(false);
    }
  }, [firstLoad]); 
  const router = useRouter();
//   useEffect(() => {
//     if (firstLoad) {
//       window.onload = (event) => {
   
//   window.location = "/info"
// };
//     } else {
//       // Redirect to "/" thereafter
//       window.location.href = "/";
//     }
//   }, [firstLoad]);

  const { state, dispatch } = useContext(Store);
  const { darkMode, cart, userInfo } = state;
  const theme = createTheme({
    components: {
      MuiLink: {
        defaultProps: {
          underline: 'hover',
        },
      },
    },
    typography: {
      h1: {
        fontSize: '1.6rem',
        fontWeight: 400,
        margin: '1rem 0',
        
      },
      h2: {
        fontSize: '1.4rem',
        fontWeight: 400,
        margin: '1rem 0',
      },
    },
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
       main: '#191970',
      
      },
      secondary: {
        main: '#FFFFFF',
        
        //main: '#191970',
      },
    },
  });
  const darkModeChangeHandler = () => {
    dispatch({ type: darkMode ? 'DARK_MODE_OFF' : 'DARK_MODE_ON' });
    const newDarkMode = !darkMode;
    jsCookie.set('darkMode', newDarkMode ? 'ON' : 'OFF');
  };
  const [anchorEl, setAnchorEl] = useState(null);
  const loginMenuCloseHandler = (e, redirect) => {
    setAnchorEl(null);
    if (redirect) {
      router.push(redirect);
    }
  };
  const loginClickHandler = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const logoutClickHandler = () => {
    setAnchorEl(null);
    dispatch({ type: 'USER_LOGOUT' });
    jsCookie.remove('userInfo');
    jsCookie.remove('cartItems');
    jsCookie.remove('shippingAddress');
    jsCookie.remove('paymentMethod');
    router.push('/');
  };

  const [sidbarVisible, setSidebarVisible] = useState(false);
  const sidebarOpenHandler = () => {
    setSidebarVisible(true);
  };
  const sidebarCloseHandler = () => {
    setSidebarVisible(false);
  };

  const { enqueueSnackbar } = useSnackbar();
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`);
        setCategories(data);
      } catch (err) {
        enqueueSnackbar(getError(err), { variant: 'error' });
      }
    };
    fetchCategories();
  }, [enqueueSnackbar]);

  const isDesktop = useMediaQuery('(min-width:600px)');

  const [query, setQuery] = useState('');
  const queryChangeHandler = (e) => {
    setQuery(e.target.value);
  };
  const submitHandler = (e) => {
    e.preventDefault();
    router.push(`/search?query=${query}`);
    
  };

  return (
    <>
      <Head>
        <title>{title ? `${title} - Pharmacy` : 'pharmacy'}</title>
        {description && <meta name="description" content={description}></meta>}
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {/* <AppBar display="none"position="static" sx={classes.appbar}> */}
        <AppBar  position="fixed" >
          <Toolbar sx={classes.toolbar} className='header'>
            <Box display="flex"  alignItems="center" >
              <IconButton
                edge="start"
                aria-label="open drawer"
                onClick={sidebarOpenHandler}
                sx={classes.menuButton}
              >
                {/* <MenuIcon sx={classes.navbarButton} /> */}
                <MenuIcon sx={classes.navbarButton} />
              </IconButton>
              
              {/* load pharmacy info screen */}
              <NextLink href="/info" passHref>
                <Link>
                 <Typography  color='#FFFFFF' id="pharmbtn">Pharmacy</Typography> 
                </Link>
              </NextLink>

               {/* load medication screen */}
              <NextLink href="/" passHref >
                <Link>
                  <Typography className='products' color='#FFFFFF' id="prodbtn" >Products</Typography> 
                </Link>
              </NextLink>
              
            </Box>
            <Drawer
              anchor="left"
              open={sidbarVisible}
              onClose={sidebarCloseHandler}
            >
              <List>
                <ListItem className="category">
                  <Box 
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Typography ><b>Shopping by category</b></Typography>
                    <IconButton  className='icon' 
                      aria-label="close"
                      onClick={sidebarCloseHandler}
                    >
                      <CancelIcon />
                    </IconButton>
                  </Box>
                </ListItem>
                <Divider light />
                {categories.map((category) => (
                  <NextLink 
                    key={category}
                    href={`/search?category=${category}`}
                    passHref
                  >
                    <ListItem 
                      button
                      component="a"
                      onClick={sidebarCloseHandler}
                    >
                      <ListItemText primary={category}></ListItemText>
                    </ListItem>
                  </NextLink>
                ))}
              </List>
            </Drawer>
            <Box sx={isDesktop ? classes.visible : classes.hidden}>
              <form onSubmit={submitHandler}>
                <Box sx={classes.searchForm} className='search'>
                  <InputBase
                    name="query"
                    sx={classes.searchInput}
                    placeholder="Search products"
                    onChange={queryChangeHandler}
                  />
                  <IconButton className='search2'
                    type="submit"
                    
                    aria-label="search"
                    
                  >
                    <SearchIcon />
                  </IconButton>
                </Box>
              </form>
            </Box>

            <Box className='box'>
              {/* <Switch
                checked={darkMode}
                onChange={darkModeChangeHandler}
                
              ></Switch> */}
              <NextLink href="/cart" passHref>
                <Link>
                  <Typography className='cart' margin-right='2px'component="span">
                    {cart.cartItems.length > 0 ? (
                      <Badge className='badge'  
                      //color='#1b60f5'
                        badgeContent={cart.cartItems.length}
                      >
                        Cart
                      </Badge>
                    ) : (
                      'Cart'
                    )}
                  </Typography>
                </Link>
              </NextLink>
              {userInfo ? (
                <>
                  <Button
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    sx={classes.navbarButton}
                    onClick={loginClickHandler}
                  >
                    {userInfo.name}
                  </Button>
                  <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={loginMenuCloseHandler}
                  >
                    <MenuItem color='#FFFFFF'
                      onClick={(e) => loginMenuCloseHandler(e, '/profile')}
                    >
                      Profile
                    </MenuItem>
                    <MenuItem
                      onClick={(e) =>
                        loginMenuCloseHandler(e, '/order-history')
                      }
                    >
                      Order History
                    </MenuItem>
                    <MenuItem color='#FFFFFF'onClick={logoutClickHandler}>Logout</MenuItem>
                  </Menu>
                </>
              ) : (
                <NextLink href="/login" passHref>
                  <Link className='log'>Login</Link>
                </NextLink>
              )}
            </Box>
          </Toolbar>
        </AppBar>
       
        <Container component="main" sx={classes.main} id="products-sec" >
          
          {children }
        </Container>
        
         <Box className ='footer'component="footer">
          <Typography className ='footerT'> All rights reserved</Typography>
        </Box>
      </ThemeProvider>
    </>
  );



}
