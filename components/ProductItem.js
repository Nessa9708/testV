import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from '@mui/material';
import NextLink from 'next/link';
import React from 'react';
import { urlForThumbnail } from '../utils/image';

export default function ProductItem({ product, addToCartHandler }) {
  return (
    
    <Card style={{ backgroundColor: '#d5eaf7' }}>
      <NextLink href={`/product/${product.slug.current}`} passHref>
        <CardActionArea id="prodCard">
          <CardMedia
            component="img"
            image={urlForThumbnail(product.image)}
            title={product.name}
          ></CardMedia>
          <CardContent>
            <Typography>{product.name}</Typography>
            {/* <Rating value={product.rating} readOnly></Rating> */}
          </CardContent>
        </CardActionArea>
      </NextLink>
      <CardActions>
        <Typography>R{product.price}</Typography>
        <Button
          size="small"
          color="primary"
          onClick={() => addToCartHandler(product)}
        
        >
          Add to cart
        </Button>
      </CardActions>
    </Card>
  );
}
