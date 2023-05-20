import { Alert, Container, Progress } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import { getConcerts, getRequest, loadConcertsRequest } from '../../../redux/concertsRedux';
import { useEffect } from 'react';
const Prices = () => {
  const dispatch = useDispatch();
  const concerts = useSelector(getConcerts);
  const request = useSelector(getRequest);

  useEffect(() => {
    dispatch(loadConcertsRequest());
  }, [dispatch]);

  return (
    <Container>
      <h1>Prices</h1>
      <p>
        Prices may differ according the day of the festival. Remember that ticket includes not only the star
        performance, but also 10+ workshops. We gathered several genre teachers to help you increase your vocal skills,
        as well as self confidence.
      </p>

      <Alert color='info'>
        Attention! <strong>Children under 4 can go freely with you without any other fee!</strong>
      </Alert>

      {request.pending && <Progress animated color='primary' value={50} />}
      {!request.pending && (!request.success || !concerts.length) && <Alert color='info'>No concerts</Alert>}
      {request.error && <Alert color='warning'>{request.error}</Alert>}
      {request.success && (
        <>
          {concerts.map((concert) => (
            <div key={concert._id}>
              <h2>Day {concert.day}</h2>
              <p>Price: {concert.price}$</p>
              <p>
                Workshops:
                {concert.workshops.map((workshop, index) => (
                  <span>
                    {' '}
                    "{workshop.name}"{index < concert.workshops.length - 1 ? ',' : '.'}
                  </span>
                ))}
              </p>
            </div>
          ))}
        </>
      )}
    </Container>
  );
};

export default Prices;
