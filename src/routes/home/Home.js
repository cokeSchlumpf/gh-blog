/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Home.scss';
import PostSnippet from '../../components/PostSnippet';
import { application as Config } from '../../config';

const title = 'React Starter Kit';

function Home({posts}, context) {
  context.setTitle(Config.name);

  const postsRendered = posts.map((item, index) => (
    <PostSnippet {...item} key={ item.key } />
  ));

  return (
    <div>
      { postsRendered }
    </div>);
}

Home.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    publishedDate: PropTypes.string.isRequired,
    contentSnippet: PropTypes.string.isRequired
  })).isRequired,
};

Home.contextTypes = {
  setTitle: PropTypes.func.isRequired
};

export default withStyles(s)(Home);
