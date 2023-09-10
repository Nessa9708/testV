import nc from 'next-connect';

const handler = nc();

handler.get(async (req, res) => {
  const categories = ['Cream', 'Gel', 'Lozenge', 'Ointment', 'Powder', 'Spray', 'Syrup', 'Tablet', 'Drops'];
  res.send(categories);
});

export default handler;
