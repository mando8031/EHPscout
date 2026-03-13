import { useLocation, useNavigate } from "react-router-dom";

function RobotSelect() {

  const { state } = useLocation();
  const navigate = useNavigate();

  const teams = [
    ...state.alliances.red.team_keys,
    ...state.alliances.blue.team_keys
  ];

  return (

    <div>

      <h1>Select Robot</h1>

      {teams.map((team)=>{

        const number = team.replace("frc","");

        return (

          <div
            key={team}
            onClick={()=>navigate("/scout",{
              state:{
                team:number,
                match:state.match_number
              }
            })}
          >
            Team {number}
          </div>

        );

      })}

    </div>
  );
}

export default RobotSelect;
