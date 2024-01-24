import * as React from 'react';
import Map, {NavigationControl, Marker } from 'react-map-gl';
import {useState, useEffect} from 'react';
import Navbar from './components/navbar.js';
import maplibregl from 'maplibre-gl';
import {HiOutlineDocumentReport} from 'react-icons/hi';
import Pino from './assets/location-pin.png';
import areaPin from './assets/placeholder.png';
import popPin from './assets/place2.png';
import {AiOutlineClose} from 'react-icons/ai'
import 'maplibre-gl/dist/maplibre-gl.css';
import AllDetails from './components/AllDetails/AllDetails.js';
import axios from 'axios';
import Airports from './components/airPorts/airports.json'
import './App.css';

function App() {

  const [countryName, setCountryName] = useState("");
  const [areaState, setAreaState] = useState(null);
  const [populationState, setPopulationState] = useState(null);
  const [currency, setCurrency] = useState("");
  const [city, setCity] = useState("");
  const [title, setTitle] = useState("");
  const [wasClicked, setWasClicked] = useState(false);
  const [marker, setMarker] = useState(null);
  const [allInfo, setAllInfo] = useState(null);
  const [allAirports, setAllAirports] = useState(null);
  const [allFlights, setAllFlights] = useState(null);
  const [helpClicked, setHelpClicked] = useState(false);
  const [countryCode, setCountryCode] = useState('');
  const [fromCountryCode, setFromCountryCode] = useState('');
  const [makeSearch, setMakeSearch] = useState(false)

  useEffect(() => {
    if (makeSearch && fromCountryCode) {
      fetchFlights();
    }
  }, [makeSearch, fromCountryCode]);

  let getAirports = (cn) => {
    let AirportsObject = [];
    for (let airportdetails of Airports){
      if (cn.toLowerCase() === airportdetails.Country.toLowerCase()){
        AirportsObject.push({
          Latitude: airportdetails.Latitude,
          Longitude: airportdetails.Longitude
        });
      }
    }
    return AirportsObject;
  }

  
  let GetCountry = async (event) => {     
    let latitude = event.lngLat.lat;
    let longitude = event.lngLat.lng;
    let response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=26f94121ac184dc283107698ea6443fb`);
    setCountryName(response.data.results[0].components.country);
    let cn = response.data.results[0].components.country_code;
    setFromCountryCode(cn);
    setCurrency(response.data.results[0].annotations.currency.name);
    setCity(response.data.results[0].components.city);
    setTitle(response.data.results[0].formatted);
    setMarker({
      longitude: event.lngLat.lng,
      latitude: event.lngLat.lat
    });
    let AirportsObject = await getAirports(cn);
    setAllAirports(AirportsObject);
    console.log("🚀 ~ file: App.js:58 ~ GetCountry ~ response.data.results[0]:", response.data.results[0])
  }


  let getInfo = async () => {
    let response;
    try {
      response = await axios.get(`https://countryapi.io/api/name/${countryName}`, {
        headers: {
          Authorization: `Bearer GA3Fd7mWrjeAaWx8KDIaECRRhaOuAFxUEDYm3WQ5`,
        },
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setAllInfo(response.data);
    setWasClicked(true);
  }

  let closePopUp = () => {
    setMarker(false);
    setAllAirports(null);
  }

  let fetchFlights = async() => {
    const options = {
      method: 'GET',
      url: 'https://skyscanner50.p.rapidapi.com/api/v1/searchFlightEverywhereDetails',
      params: {
        origin: fromCountryCode,
        CountryId: countryCode,
        anytime: 'true',
        oneWay: 'false',
        currency: 'USD',
        countryCode: 'US',
        market: 'en-US'
      },
      headers: {
        'X-RapidAPI-Key': process.env.REACT_APP_FLIGHTS_API_KEY,
        'X-RapidAPI-Host': process.env.REACT_APP_FLIGHTS_API_HOST
      }
    };
    
    try {
      const response = await axios.request(options);
      setAllFlights(response.data.data)
      console.log(response.data.data);
    } catch (error) {
      console.error(error);
    }
  }

  //#-0.1/-5.93794/150.86761

  return (
    <div className="App">
        <Navbar area={setAreaState} population={setPopulationState} helpState={setHelpClicked}/>
        <div className='detailsContainer'>
          <Map mapLib={maplibregl} 
            initialViewState={{
              longitude: 35.22604209908286,
              latitude: 31.781112908465275,
              zoom: 14
            }}
            style={{width: "100%", height: " calc(100vh - 77px)"}}
            mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=MqBRk7cB15al80D4sxeL`}
            onClick={GetCountry}
          >
            <NavigationControl position="top-left" />


              {marker && (
                <Marker longitude={marker.longitude} latitude={marker.latitude} offsetLeft={-20} offsetTop={-10}>
                    <div className='pinContainerWithCloseButton'>   
                      <div className='pinContainer'>
                        <p>Country: {countryName}</p>
                        <p>City: {city}</p>
                        <p>Currency: {currency}</p>
                        <p>Location: {title}</p>
                        <button onClick={() => getInfo(countryName)}>More Info</button>
                      </div>  
                      <button onClick={closePopUp}><AiOutlineClose/></button>
                    </div>
                </Marker>
              )}

              {allAirports && allAirports.map((item, index) => {
                return(
                  <Marker key={index} longitude={item.Longitude} latitude={item.Latitude} offsetLeft={-20} offsetTop={-10}>
                      <img src={Pino} alt={Pino}/>
                  </Marker>
                );
              })}

              {areaState && areaState.map((item, index) => {
                return(
                  <Marker key={index} longitude={item.Longitude} latitude={item.Latitude} offsetLeft={-20} offsetTop={-10}>
                      <img src={areaPin} alt={areaPin}/>
                  </Marker>
                );
              })}

              {populationState && populationState.map((item) => {
                return(
                  <Marker longitude={item.Longitude} latitude={item.Latitude} offsetLeft={-20} offsetTop={-10}>
                      <img src={popPin} alt={popPin}/>
                  </Marker>
                );
              })}

          </Map>

          {wasClicked && (
            <div className='testo'>
              <h1><HiOutlineDocumentReport/> All Details:</h1>
              <AllDetails info={allInfo} code={setCountryCode} makeCheck={setMakeSearch}/>
              <button onClick={() => {setWasClicked(false); setMakeSearch(false); setAllFlights(null)}}>Cancel</button>
            </div>
          )}

          {helpClicked ? 
            <div className='helpSection'>
              <h2>How To use The Website</h2>
              <p>You can use our website by <b>clicking</b> on the map, when u click on it, it will show the details about the clicked country,
               then u will see a button for more information about the country.</p>
            </div> 
            : 
            <></>
          }

        </div>

            <div className='flightsContainer'>
              {allFlights && allFlights.map((flight) => {
                return(
                  <div className='singleFlightContainer'>
                      <img
                        alt="pic"
                        src={flight.imageUrl}
                        style={{width: 300, height: 230}}
                      />
                      <h4>{flight.title}</h4>
                      <p>Departure Date: {flight.outboundDepartureDate}</p>
                      <hr/>
                      <h4>Price: ${flight.price}</h4>
                  </div>
                );
              })}
            </div>

    </div>
  );
}

export default App;
