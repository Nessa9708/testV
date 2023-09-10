export default {
    name: 'product',
    title: 'Product',
    type: 'document',
    fields: [
        //define fields to be listed in sanity.io
      {
        name: 'name',
        title: 'Name',
        type: 'string',
      },
      {
        name: 'price',
        title: 'Price',
        type: 'number',
      },
      {
        name: 'image',
        title: 'Image',
        type: 'image',
        options: {
          hotspot: true,
        },
      },
      {
        name: 'description',
        title: 'Description',
        type: 'text', 
  of: [{type: 'block'}]
      },
      {
        name: 'slug',
        title: 'Slug',
        type: 'slug',
        options: {
          source: 'name',
          maxLength: 96,
        },
      },
      // {
      //   name: 'brand',
      //   title: 'Brand',
      //   type: 'string',
      // },
      {
        name: 'category',
        title: 'Category',
        type: 'string',
      },
      {
        name: 'dosage',
        title: 'Dosage',
        type: 'text', 
  of: [{type: 'block'}]
      },
    
      {
        name: 'countInStock',
        title: 'CountInStock',
        type: 'number',
      },
      {
        name: 'sideeffects',
        title: 'SideEffects',
        type: 'text', 
  of: [{type: 'block'}]
      },
    ],
  };