/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Home from './Home';
import fetch from '../../core/fetch';

export default {

  path: '/',

  async action() {
    const resp = await fetch('/graphql', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: '{posts{key,title,link,author,publishedDate,contentSnippet}}',
      }),
      credentials: 'include',
    });

    const {data} = await resp.json();

    if (!data || !data.posts) {
      throw new Error('Failed to load the posts.');
    } else if (data.posts.length === 0 || data.posts === null) {
      return <div>No posts available.</div>
    } else {
      return <Home posts={data.posts} />;
    }
  },

};
