import React, { useEffect, useState } from 'react'
import './AllDetails.css';

const AllDetails = (props) => {

    const [objKey, setObjKey] = useState('');
    const [isChecked, setIsChecked] = useState(false);

    useEffect(() => {
        for (let key in props.info) {
            setObjKey(key); 
            props.code(props.info[key].alpha2Code);
            break;
        }
    }, [props.info])

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
        props.makeCheck(!isChecked)
    };

    return (
        <div className='detailsWithoutHeader'>
            <img style={{width: "40%"}} src={props.info[objKey]?.flag.medium} alt={props.info[objKey]?.flag.medium}/>
            <p>Official name: {props.info[objKey]?.official_name}</p> 
            <p>Capital: {props.info[objKey]?.capital}</p>
            <p>Area: {props.info[objKey]?.area} sq.km</p>
            <p>Population: {props.info[objKey]?.population} people</p>
            <p>Time Zone: {props.info[objKey]?.timezones[0]}</p>
            <label>
                <b>Do You Want To Flight Here?</b>
                <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                />
            </label>
            {isChecked && (
                <div className='searchInput'>
                    <p>Please choose your country by clicking on it using the map</p>
                </div>
            )}
        </div>
    )
}

export default AllDetails