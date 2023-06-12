import React, {useState, useEffect} from 'react';
import './navbar.css';
import {MdOutlineHelpOutline} from 'react-icons/md';

export default function Navbar(props){

    const [areaCountry, setAreaCountry] = useState(null);
    const [areaClicked, setAreaClicked] = useState(false);
    const [popClicked, setPopClicked] = useState(false);
    const [helpClicked, setHelpClicked] = useState(false);
    const [populationCountry, setPopulationCountry] = useState(null);

    useEffect(() => {
        setAreaCountry(
            [{
                Latitude: '64.2695782',
                Longitude: '99.5609121'
            },
            {
                Latitude: '61.3140579',
                Longitude: '-108.5050371'
            },
            {
                Latitude: '35.2178701',
                Longitude: '93.0808033'
            },
            {
                Latitude: '39.8788194',
                Longitude: '-106.2769881'
            },
            {
                Latitude: '-10.803888',
                Longitude: '-52.7357819'
            }]
        )

        setPopulationCountry(
            [{
                Latitude: '36.9087751',
                Longitude: '93.1602226'
            },
            {
                Latitude: '23.6235052',
                Longitude: '77.7029336'
            },
            {
                Latitude: '40.2407621',
                Longitude: '-103.8225695'
            },
            {
                Latitude: '-1.499583',
                Longitude: '113.2903307'
            },
            {
                Latitude: '28.833333',
                Longitude: '69'
            }]
        )
    }, []);


    let getLargestArea = () => {
        if(areaClicked === false){
            props.area(areaCountry)
        }
        else{
            props.area(null)
        }
        setAreaClicked(!areaClicked)
      }   

    let getLargestPopulation = () => {
        if (popClicked === false){
            props.population(populationCountry);
        }
        else{
            props.population(null)
        }
        setPopClicked(!popClicked)
    }
    
    let ShowHelpSection = () => {
        setHelpClicked(!helpClicked)
       props.helpState(helpClicked)
    }

 return (
  <div className="heading">
    <h1>Bilal, Mahmoud</h1>
    <div>
        <button onClick={getLargestArea}>Show the largest Countries by area </button>
        <button onClick={getLargestPopulation}>Show the largest Countries by population</button>
        <button onClick={ShowHelpSection}><MdOutlineHelpOutline size={25}/> Help</button>
    </div>
  </div>
 );
}