const Home = ({ user }) => {
  return (
    <div>
      {user ? (
        <div>Hi {user.name}, you're logged in</div>
      ) : (
        <a href="/login">Sign in with Yahoo!</a>
      )}
    </div>
  );
};

export default Home;