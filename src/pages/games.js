import Link from 'next/link';
import fetch from 'isomorphic-unfetch';

const Games = ({ games }) => {
  return (
    <div>
      <h2>Games</h2>
      <ul>
        {games.map(game => (
          <li key={game.game_id}>
            <Link href="teams/[game_key]" as={`teams/${game.game_key}`}>
              <a>{game.name} ({game.season})</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

Games.getInitialProps = async () => {
  try {
    const response = await fetch(`http://localhost:3000/api/games`);
    const data = await response.json();
    return { games: data };
  } catch (error) {
    console.log(`Games page error: `, error)
  }
}

export default Games;