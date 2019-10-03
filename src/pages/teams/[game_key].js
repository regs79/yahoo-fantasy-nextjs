import fetch from 'isomorphic-unfetch';

const Team = ({ games }) => {
  return (
    <div>
      <h2>{games.name} ({games.season})</h2>
      <h3>Teams</h3>
      {console.log(games)}
      {games.teams.map(team => (
        <div key={team.team_key}>{team.name} {team.team_key}</div>
      ))}
    </div>
  );
};

Team.getInitialProps = async ({ query: { game_key }}) => {
  try {
    const response = await fetch(`http://localhost:3000/api/teams/${game_key}`)
    const data = await response.json();
    return { games: data[0] };
  } catch (error) {
    console.log(`Couldn't get the game teams page: `, error)
  }
}

export default Team;
