import React, { useEffect, useState } from "react";
import axios from 'axios';
import MatchCard from './MatchCard/MatchCard'


const MatchList = () => {
    const [matches, setMatches] = useState([]);

    useEffect(() => {
        // Fetch matches from the backend and set them in state
        axios.get('http://localhost:2239/api/matches')
        .then((response) => {
            setMatches(response.data);
        })
        .catch((error) => {
            console.error('Error fetching matches:', error);
        });
    }, []);

  return (
    <div>
        <h1>This is a list of matches!</h1>

    </div>
  )
}

export default MatchList
