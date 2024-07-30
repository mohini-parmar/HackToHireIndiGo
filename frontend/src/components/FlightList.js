import React, { useContext, useEffect, useState } from 'react'
import { Accordion, AccordionBody, AccordionHeader, Button, Modal, Form } from 'react-bootstrap'
import { AuthContext } from './AuthContext'
import axios from 'axios'
import moment from 'moment'

const FlightList = () => {
  const [flightData, setFlightData] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { user } = useContext(AuthContext)

  const getFlightData = async () => {
    const res = await axios.get('http://localhost:3000/api/flights');
    setFlightData(res.data)
  }

  useEffect(() => {
    getFlightData();
  }, [])

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'on time':
        return 'status-on-time';
      case 'delayed':
        return 'status-delayed';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  }

  const handleEditClick = (flight) => {
    setSelectedFlight(flight);
    setShowModal(true);
  }

  const handleClose = () => {
    setShowModal(false);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedFlight((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/api/flights/${selectedFlight.flight_id}`, selectedFlight);
      setShowModal(false);
      setFlightData((prevData) =>
        prevData.map((flight) =>
          flight.flight_id === selectedFlight.flight_id ? selectedFlight : flight
        )
      );
    } catch (error) {
      console.error("Error updating flight data:", error);
    }
  };

  return (
    <>
      <div className='d-flex justify-content-center align-items-center mt-5 mb-5'>
        <Accordion className='w-75'>
          {
            flightData && flightData.map((flight, i) => {
              const statusClass = getStatusClass(flight.status);
              return (
                <Accordion.Item eventKey={i} key={i}>
                  <AccordionHeader>
                    <div className="header-content">
                      <div className="flight-info">
                        <div className="flight-id"><h6>{flight.flight_id}</h6></div>
                        <div className="flight-route">
                          <h4>
                            {(flight.from).split(' ')[0]} <span className='separator'>-----</span> {(flight.to).split(' ')[0]}
                          </h4>
                        </div>
                      </div>
                      <div className="flight-status">
                        <h6 className={statusClass}>
                          {flight.status}
                        </h6>
                      </div>
                    </div>
                  </AccordionHeader>
                  <AccordionBody>
                    <div className='container'>
                      {user &&
                        <div className='row justify-content-end w-100'>
                          <Button className='bs-button' onClick={() => handleEditClick(flight)}>Edit</Button>
                        </div>
                      }
                      <div className='row accordian-hr'>
                        <div className='col-md-6'>
                          <label>Flight Number</label>
                          <h6>{flight.flight_id}</h6>
                        </div>
                        <div className='col-md-6'>
                          <label>Gate Number</label>
                          <h6>{flight.departure_gate}</h6>
                        </div>
                      </div>

                      <div className='row accordian-hr'>
                        <div className='col-md-6'>
                          <label>From</label>
                          <div className='d-flex'>
                            <h5>{(flight.from).split(' ')[0]}  &nbsp;</h5>
                            <h6 className='mt-1'>({(flight.from).split(' ')[1]})</h6>
                          </div>
                        </div>
                        <div className='col-md-6'>
                          <label>To</label>
                          <div className='d-flex'>
                            <h5>{(flight.to).split(' ')[0]}  &nbsp;</h5>
                            <h6 className='mt-1'>({(flight.to).split(' ')[1]})</h6>
                          </div>
                        </div>
                      </div>

                      <div className='row'>
                        <div className='col-md-6'>
                          <label>Scheduled Departure</label>
                          <h6>{moment(flight.scheduled_departure).format("YYYY-MM-DD HH:MM")}</h6>
                        </div>
                        <div className='col-md-6'>
                          <label>Scheduled Arrival</label>
                          <h6>{moment(flight.scheduled_arrival).format("YYYY-MM-DD HH:MM")}</h6>
                        </div>
                      </div>

                      <div>
                        {flight.status === 'Delayed' &&
                          <div className='row accordian-border-top'>
                            <div className='col-md-6'>
                              <label>Actual Departure</label>
                              <h6>{flight.actual_departure ? moment(flight.actual_departure).format("YYYY-MM-DD HH:MM") : '-'}</h6>
                            </div>
                            <div className='col-md-6'>
                              <label>Estimated Arrival</label>
                              <h6>{flight.actual_arrival ? moment(flight.actual_arrival).format("YYYY-MM-DD HH:MM") : '-'}</h6>
                            </div>
                          </div>
                        }
                      </div>
                    </div>
                  </AccordionBody>
                </Accordion.Item>
              )
            })
          }
        </Accordion>
      </div>

      {showModal &&
        <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Flight Data</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="flightId">
                <Form.Label className='modal-form-label'>Flight Number</Form.Label>
                <Form.Control type="text" name="flight_id" value={selectedFlight.flight_id} onChange={handleChange} readOnly />
              </Form.Group><br />
              <Form.Group controlId="status">
                <Form.Label className='modal-form-label'>Status</Form.Label>
                <Form.Select name="status" value={selectedFlight.status} onChange={handleChange}>
                  <option value="">Select Status</option>
                  <option value="On Time">On Time</option>
                  <option value="Delayed">Delayed</option>
                  <option value="Cancelled">Cancelled</option>
                </Form.Select>
              </Form.Group><br />
              <Form.Group controlId="departureGate">
                <Form.Label className='modal-form-label'>Gate Number</Form.Label>
                <Form.Control type="text" name="departure_gate" value={selectedFlight.departure_gate} onChange={handleChange} />
              </Form.Group><br />
              <Form.Group controlId="actualDeparture">
                <Form.Label className='modal-form-label'>Actual Departure</Form.Label>
                <Form.Control type="datetime-local" name="actual_departure" value={selectedFlight.actual_departure ? moment(selectedFlight.actual_departure).format("YYYY-MM-DDTHH:mm") : ''} onChange={handleChange} />
              </Form.Group><br />
              <Form.Group controlId="actualArrival">
                <Form.Label className='modal-form-label'>Estimated Arrival</Form.Label>
                <Form.Control type="datetime-local" name="actual_arrival" value={selectedFlight.actual_arrival ? moment(selectedFlight.actual_arrival).format("YYYY-MM-DDTHH:mm") : ''} onChange={handleChange} />
              </Form.Group>
              <br />
              <Button variant="primary" type="submit">Save Changes</Button>
            </Form>
          </Modal.Body>
        </Modal>
      }
    </>
  )
}

export default FlightList
