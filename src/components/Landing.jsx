import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';

import Button from '@material-ui/core/Button';

/* The Landing page is the page our users are presented with on login or signup. Here, we 
meant to render our current favorites in cards that might provide additional details for the campsites 
our users have favorited as well as a button that takes them to our Query page in Query.jsx in order to find 
potential campgrounds via the Active API. */

const Landing = props => {
  const { hasFavs } = props;
  const favs = [];

  let favsheader;

  if (hasFavs === true) {
    favsheader = <h3>Your Favorites</h3>;
  }

  return (
    <div
      style={{
        backgroundImage:
          'url(' + 'https://i.ibb.co/GJb8v8N/Tent-Canyon-Lg.jpg' + ')',
        position: 'fixed',
        top: 0,
        left: 0,
        minWidth: '100%',
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        color: 'whitesmoke',
      }}
    >

      {/* <h1>Let's Go Camping</h1>
      <h1>Let's Go Camping</h1>

      <Link to="/camp">
        <Button size="large" variant="contained" color="primary">
          Find Camps
        </Button>
      </Link> */}

      {favsheader}
      {favs}
    </div>
  );
};

export default Landing;
