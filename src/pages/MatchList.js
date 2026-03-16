import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMatches } from "../services/tbaService";

const MatchList = () => {

  const { eventKey } = useParams();
  const navigate = useNavigate();

  const [matches, setMatches] = useState([]);
  const nextMatchRef = useRef(null);

  useEffect(() => {

    if (!eventKey) return;

    async function load() {

      const data = await getMatches(eventKey);

      if (Array.isArray(data)) {

        const sorted = data.sort((a, b) => {
          if (a.comp_level !== b.comp_level) {
            return a.comp_level.localeCompare(b.comp_level);
          }
          return a.match_number - b.match_number;
        });

        setMatches(sorted);

      }

    }

    load();

  }, [eventKey]);

  // ---- SPLIT MATCHES ----

  const qualificationMatches = matches
    .filter(m => m.comp_level === "qm")
    .sort((a,b)=>a.match_number-b.match_number);

  const playoffMatches = matches
    .filter(m => m.comp_level !== "qm")
    .sort((a,b)=>a.match_number-b.match_number);

  // ---- MATCH NAME ----

  function getMatchName(match){

    if(match.comp_level==="qm")
      return `Qualification ${match.match_number}`;

    if(match.comp_level==="qf")
      return `Quarterfinal ${match.set_number}-${match.match_number}`;

    if(match.comp_level==="sf")
      return `Semifinal ${match.set_number}-${match.match_number}`;

    if(match.comp_level==="f")
      return `Final ${match.match_number}`;

    return `Match ${match.match_number}`;
  }

  // ---- MATCH TIME ----

  function getTime(match){

    if(!match.time) return "Time TBD";

    const date = new Date(match.time*1000);

    return date.toLocaleTimeString([],{
      hour:"numeric",
      minute:"2-digit"
    });

  }

  // ---- FIND NEXT MATCH ----

  const now = Date.now()/1000;

  const nextMatch = qualificationMatches.find(
    m => m.time && m.time > now
  );

  useEffect(()=>{
    if(nextMatchRef.current){
      nextMatchRef.current.scrollIntoView({
        behavior:"smooth",
        block:"center"
      });
    }
  },[matches]);

  // ---- MATCH BUTTON ----

  function MatchButton({match}){

    const red = match.alliances?.red?.team_keys || [];
    const blue = match.alliances?.blue?.team_keys || [];

    const isNext = nextMatch && match.key===nextMatch.key;

    return(

      <button
        ref={isNext ? nextMatchRef : null}
        onClick={()=>navigate(`/scout/${eventKey}/${match.match_number}`)}

        style={{
          width:"100%",
          padding:"18px",
          marginBottom:"10px",
          borderRadius:"10px",
          fontSize:"18px",
          textAlign:"left",
          border:"none",
          background:isNext?"#444":"#2c2c2c",
          color:"white"
        }}
      >

        <div style={{fontWeight:"bold",fontSize:"20px"}}>
          {getMatchName(match)}
        </div>

        <div style={{fontSize:"14px",opacity:.8}}>
          {getTime(match)}
        </div>

        <div style={{
          display:"flex",
          marginTop:"10px",
          fontSize:"14px"
        }}>

          <div style={{
            flex:1,
            background:"#c0392b",
            padding:"6px",
            borderRadius:"4px",
            marginRight:"5px"
          }}>
            {red.map(t=>t.replace("frc","")).join(" • ")}
          </div>

          <div style={{
            flex:1,
            background:"#2980b9",
            padding:"6px",
            borderRadius:"4px"
          }}>
            {blue.map(t=>t.replace("frc","")).join(" • ")}
          </div>

        </div>

      </button>

    )

  }

  if(matches.length===0){
    return(
      <div style={{padding:"20px"}}>
        <h1>Matches</h1>
        <p>No matches available.</p>
      </div>
    )
  }

  return(

    <div style={{
      padding:"15px",
      maxWidth:"700px",
      margin:"auto"
    }}>

      <h1 style={{marginBottom:"20px"}}>
        Match Select
      </h1>

      {/* QUALIFICATION */}

      {qualificationMatches.length>0 &&(

        <div style={{marginBottom:"30px"}}>

          <h2 style={{
            borderBottom:"2px solid #555",
            marginBottom:"10px"
          }}>
            Qualification Matches
          </h2>

          {qualificationMatches.map(match=>(
            <MatchButton
              key={match.key}
              match={match}
            />
          ))}

        </div>

      )}

      {/* PLAYOFF */}

      {playoffMatches.length>0 &&(

        <div>

          <h2 style={{
            borderBottom:"2px solid #555",
            marginBottom:"10px"
          }}>
            Playoff Matches
          </h2>

          {playoffMatches.map(match=>(
            <MatchButton
              key={match.key}
              match={match}
            />
          ))}

        </div>

      )}

    </div>

  )

}

export default MatchList;
