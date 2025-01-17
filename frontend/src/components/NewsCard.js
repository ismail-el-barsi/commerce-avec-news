import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';

function NewsCard(props) {
  const { news } = props;
  return (
    <Card>
      <Link to={`/news/${news.slug}`}>
        <Card.Body>
          <Card.Title>{news.title}</Card.Title>
          <Card.Text>{news.content.slice(0, 100)}...</Card.Text>
        </Card.Body>
      </Link>
    </Card>
  );
}

export default NewsCard;
