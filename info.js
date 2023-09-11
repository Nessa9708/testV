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
import { useContext, useEffect, useState } from 'react';
import { Store } from '../utils/Store';
import jsCookie from 'js-cookie';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { getError } from '../utils/error';
import useAlan from '../components/useAlan';
//import updateClock from './Clock.js';
import ReactDOM from 'react-dom';


export default function Layout({ title, description, children }) {
  useAlan()
  const router = useRouter();

  function initClock() {
    updateClock();
    global.setInterval(updateClock, 1);
}
global.onload = initClock();

  //clock
 
  function updateClock() {
    var now = new Date();
    var dname = now.getDay(),
    mo = now.getMonth(),
    dnum = now.getDate(),
    yr = now.getFullYear(),
    hou = now.getHours(),
    min = now.getMinutes(),
    sec = now.getSeconds(),
    pe = "AM";
    if(hou > 11) {
      hou = hou - 12;
      pe = "PM";
    }
    if (hou == 0) {
      hou = 12;
    }
    

    Number.prototype.pad = function(digits){
      for(var n = this.toString(); n.length < digits; n = 0 + n);
      return n;
    }

    var months = [" January ", " February ", " March ", " April ", " May ", " June ", " July ", " August ", " September ", " October ", " November ", " December "];
    var week = ["Monday","Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday" ];    
    var ids = ["dayname", "month", "daynum", "year", "hour", "minutes", "seconds", "period"];   
    var values = [week[dname], months[mo], dnum.pad(2), yr, hou.pad(2), min.pad(2), sec.pad(2), pe];      
    
    // for (var i = 0; i < ids.length; i++){
    //   if (typeof window !== 'undefined') {
    //     //ReactDOM.render(<MainWrapper />, document.getElementById("root"));
    //     document.getElementById(ids[i]).firstChild.nodeValue = values[i];
    // }
      
    // }
  }

  
  // const darkModeChangeHandler = () => {
  //   dispatch({ type: darkMode ? 'DARK_MODE_OFF' : 'DARK_MODE_ON' });
  //   const newDarkMode = !darkMode;
  //   jsCookie.set('darkMode', newDarkMode ? 'ON' : 'OFF');
  // };
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
      
        <CssBaseline />
        {/* <AppBar display="none"position="static" sx={classes.appbar}> */}
        <AppBar  position="static"  >
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
              
              <NextLink href="/test" passHref>
                <Link>
                  {/* <Typography className='header' sx={classes.appbar}>Pharmacy</Typography> */} 
                  <Typography  color='#FFFFFF' id="pharmbtn">Pharmacy</Typography>
                  
                </Link>
              </NextLink>
              <NextLink href="/" passHref >
                <Link>
                  {/* <Typography className='header' sx={classes.appbar}>Pharmacy</Typography> */}
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
             
                 <NextLink href="/login" passHref>
                  <Link className='log'>Login</Link>
                </NextLink>
                          </Box>
          </Toolbar>
        </AppBar>
        <Container  id="info-sec">
        <Card className='pharmacy-info' sx={classes.main}>
          <CardContent>
            <Typography><b>Pharmacy Address:</b></Typography>
            <p>790 Euna Plains, Vanderbijlpark</p>
           <img src="https://res.cloudinary.com/du58mcq5f/image/upload/v1669526523/Artefact/map_ytmzuc.png" />
          </CardContent>
        
        </Card>
        <Card className='contact-info' sx={classes.main}>
          <CardContent>
            <Typography><b>Contact Details:</b></Typography>
            <p>Call: XXX XXX XXXX</p>
            <p>Email: Pharmacy@gmail.com</p>
            <img src="https://res.cloudinary.com/du58mcq5f/image/upload/v1669527818/Artefact/contact_itshj5.png"  />
          </CardContent>
        
        </Card>

        <Card className='trading-hours' sx={classes.main} >
          <CardContent>
            <Typography className='heading'><b>Trading Hours:</b></Typography>
           
              <table className='week'>
                <tr><td><strong>Mon - Fri:</strong></td><td>7am - 9pm</td></tr>
                <tr><td><strong>Saturday:</strong></td><td>7am - 9pm</td></tr>
                <tr><td><strong>Sunday:</strong></td><td>7am - 9pm</td></tr>
              </table>
              <img src="https://res.cloudinary.com/du58mcq5f/image/upload/v1678737962/Artefact/clock_kf4dmf.jpg"  />
            {/* <div className='datetime'>
              <div className='date'>
                <span id='dayname'>Day</span>,
                <span id='month'> Month</span>
                <span id='daynum'> 00</span>,  
                 <span id='year'> Year</span>
              </div>
              <div className='time'>
                <span id='hour'>00</span>:
                <span id='minutes'>00</span>:
                <span id='seconds'>00 </span>
                <span id='period'>PM</span>
              </div>
            </div> */}
            
          </CardContent>
        
        </Card>
        </Container>
       
      
    </>
  );
  



}
