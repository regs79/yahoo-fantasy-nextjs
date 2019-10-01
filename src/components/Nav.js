import React from 'react';
import Link from 'next/link';

const Nav = () => {
  return (
    <nav>
      <ul>
        <li><Link href="/profile"><a>Profile</a></Link></li>
        <li><Link href="/logout"><a>Sign out</a></Link></li>
      </ul>      
      <style jsx>{`
        nav {
          width: 100%;
          padding: 20px;
        }
        ul {
          display: flex;
          list-style-type: none;
          margin: 0;
          padding: 0;
        }
        a {
          padding: 5px 10px; 
        }
      `}</style>
    </nav>
  );
};

export default Nav;