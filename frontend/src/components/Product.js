import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import Rating from './Rating';

function Product(props) {
  const { product } = props;
  return (
    <Card>
      <Link to={`/product/${product.slug}`}>
        <img
          src={product.image}
          className='card-img-top product-image img-fluid'
          alt={product.name}
          style={{ height: '350px', width: '4500px', display: 'block' }}
        />
      </Link>
      <Card.Body className='d-flex flex-column align-items-center'>
        <Link to={`/product/${product.slug}`}>
          <Card.Title className='text-center'>{product.name}</Card.Title>
        </Link>
        <Rating rating={product.rating} />
        <Card.Text className='text-center'>{product.price}€</Card.Text>
      </Card.Body>
    </Card>
  );
}

export default Product;
