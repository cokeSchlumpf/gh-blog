/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Post from '../../components/Post';
import fetch from '../../core/fetch';

export default {

  path: '/post/*',

  async action({path}) { // eslint-disable-line react/prop-types
    const postPath = path.substr('/post/'.length);
    const resp = await fetch('/graphql', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `{post(key:"${postPath}"){title,link,author,publishedDate,contentSnippet,content}}`,
      }),
      credentials: 'include',
    });
    if (resp.status !== 200)
      throw new Error(resp.statusText);
    const {data} = await resp.json();
    if (!data || !data.post || data.post.length != 1) return undefined;

    return <Post {...data.post[0]} />;
  },

};
