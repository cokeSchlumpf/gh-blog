/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* eslint-disable max-len */
/* jscs:disable maximumLineLength */

/* Fetch Bluemix URLs */
const fetchUrl = () => {
  const vcap = JSON.parse(process.env.VCAP_APPLICATION);
  return vcap.application_uris[0];
}

export const port = process.env.VCAP_APP_PORT || process.env.PORT || 3000;
export const host = process.env.VCAP_APP_PORT ? fetchUrl() : process.env.WEBSITE_HOSTNAME || `localhost:${port}`;

export const analytics = {

  // https://analytics.google.com/
  google: {
    trackingId: process.env.GOOGLE_TRACKING_ID || 'UA-XXXXX-X'
  },

};

export const application = {

  debug: process.env.NODE_ENV !== 'production',

  github: {
    api_url: 'https://api.github.com',
    user: 'cokeSchlumpf',
    repo: 'wellnr-blog',
    client_id: 'd381568f0f063b08ed17',
    client_secret: '364fe0c7c2a9822121c15ff2acd14bc2f0b9d4e4'
  }

}
