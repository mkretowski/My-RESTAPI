import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Progress, Alert } from 'reactstrap';
import { getSeats, loadSeats, loadSeatsRequest, getRequests } from '../../../redux/seatsRedux';
import './SeatChooser.scss';
import io from 'socket.io-client';

const SeatChooser = ({ chosenDay, chosenSeat, updateSeat }) => {
  const [socket, setSocket] = useState(undefined);
  const seats = useSelector(getSeats);
  const dispatch = useDispatch();
  const requests = useSelector(getRequests);
  const [freeSeats, setFreeSeats] = useState(0);

  useEffect(() => {
    setFreeSeats(50 - seats.filter((item) => item.day === chosenDay).map((item) => item.seat).length);
  }, [seats, chosenDay]);

  useEffect(() => {
    dispatch(loadSeatsRequest());
    const newSocket = io(process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8000');
    setSocket(newSocket);
    newSocket.on('seatsUpdated', (seats_) => {
      dispatch(loadSeats(seats_));
    });
    return () => {
      newSocket.disconnect(); // disconnect from the server when the component unmounts
    };
  }, [dispatch]);

  const isTaken = (seatId) => {
    return seats.some((item) => item.seat === seatId && item.day === chosenDay);
  };

  const prepareSeat = (seatId) => {
    if (seatId === chosenSeat)
      return (
        <Button key={seatId} className='seats__seat' color='primary'>
          {seatId}
        </Button>
      );
    else if (isTaken(seatId))
      return (
        <Button key={seatId} className='seats__seat' disabled color='secondary'>
          {seatId}
        </Button>
      );
    else
      return (
        <Button key={seatId} color='primary' className='seats__seat' outline onClick={(e) => updateSeat(e, seatId)}>
          {seatId}
        </Button>
      );
  };

  return (
    <div>
      <h3>Pick a seat</h3>
      <small id='pickHelp' className='form-text text-muted ml-2'>
        <Button color='secondary' /> – seat is already taken
      </small>
      <small id='pickHelpTwo' className='form-text text-muted ml-2 mb-4'>
        <Button outline color='primary' /> – it's empty
      </small>
      {requests['LOAD_SEATS'] && requests['LOAD_SEATS'].success && (
        <>
          <div className='seats'>{[...Array(50)].map((x, i) => prepareSeat(i + 1))}</div>
          <div className='free_seats'>
            <p>Free seats: {freeSeats}/50</p>
          </div>
        </>
      )}
      {requests['LOAD_SEATS'] && requests['LOAD_SEATS'].pending && <Progress animated color='primary' value={50} />}
      {requests['LOAD_SEATS'] && requests['LOAD_SEATS'].error && <Alert color='warning'>Couldn't load seats...</Alert>}
    </div>
  );
};

export default SeatChooser;
