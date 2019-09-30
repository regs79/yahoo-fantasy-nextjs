const Home = ({ user }) => {
  return (
    <div>
      {user ? (
        <div>Hi {user.name}, you're logged in</div>
      ) : (
        <div>You've got to log in <a href="/login">here</a></div>
      )}
    </div>
  );
};

export default Home;