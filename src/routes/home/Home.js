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

const title = 'React Starter Kit';

function Home({posts}, context) {
  context.setTitle('gh-blog - blogging made simple');

  return (
    <div>
      HOME.
    </div>);
}

Home.contextTypes = {
  setTitle: PropTypes.func.isRequired
};

export default withStyles(s)(Home);
