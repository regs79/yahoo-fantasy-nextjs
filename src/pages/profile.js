function Profile({ user }) {
  return (
    <div>
      <img src={user.avatar} alt={user.name} />
      <h2>
         Hi, {user.name}
      </h2>
      <p>This is what we know about you:</p>
      <ul>
        { Object.keys(user).map(key => (
          <li key={key}><strong>{key}:</strong> {user[key].toString()}</li>
        ))}
      </ul>
      <style jsx>{`
        li {
          margin: 0 0 10px 0;
          width: 100%;
          word-break: break-all;
        }
      `}</style>
    </div>
  );
}

export default Profile;
