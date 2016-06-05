/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */
import _ from 'lodash';
import { Base64 } from 'js-base64';
import React from 'react';
import NodeCache from 'node-cache';
import fetch from '../../core/fetch-graphql';
import s from 'stripmargin';

import Content from './Content.js';

const blogQuery = (owner, repo) => s.stripMargin(
  `{
  |  blog(owner: "${owner}", repo: "${repo}") {
  |    title,
  |    url,
  |    baseUrl,
  |    user,
  |    repo,
  |    owner {
  |      name,
  |      url,
  |      company,
  |      location,
  |      avatar,
  |      twitter,
  |      github
  |    },
  |    template {
  |      styles
  |      titles {
  |        file,
  |         title
  |      }
  |    }
  |  }
  }`);

const posts = (page) => (owner, repo) => {
  return new Promise((resolve, reject) => {
    try {
      const postsQuery = s.stripMargin(
        `{
        |  posts(owner: "${owner}", repo: "${repo}", page: ${page || 1}) {
        |    posts {
        |      key,
        |      title,
        |      link,
        |      author,
        |      publishedDate,
        |      contentSnippet
        |    },
        |    pages,
        |    page,
        |    nextUrl,
        |    prevUrl
        |  }
        }`);

      const renderQuery = s.stripMargin(
        `{
        |  render(
        |    owner: "${owner}",
        |    repo: "${repo}",
        |    queries: [
        |      "${Base64.encode(blogQuery(owner, repo))}",
        |      "${Base64.encode(postsQuery)}"
        |    ]
        |    templates: [
        |      ".template/posts.jade",
        |      ".template/index.jade"
        |    ]
        |    selects: [
        |      "blog.title",
        |      "blog.template.styles"
        |    ]) {
        |      data,
        |      result
        |    }
        }`);

      resolve(fetch(renderQuery).then(res => {
        const data = JSON.parse(Base64.decode(res.data.render.data));
        return <Content content={ res.data.render.result } title={ data.blog.title } styles={ data.blog.template.styles } />;
      }));
    } catch (error) {
      reject(error);
    }
  });
};

export default {

  path: '/blogs/:owner/:repo',

  async action({next, params}) {
    const child = await next();
    return child(params.owner, params.repo).catch(e => {
      console.log(e);
      console.error(e);
      console.log(e.stack);
      return <Content content="is nicht" title="IS NICHT!" />
    });
  },

  children: [
    {
      path: '/',

      async action({params}) {
        return posts(1);
      }
    },
    {
      path: '/history/:page',

      async action({params}) {
        return posts(params.page);
      }
    },
    {
      path: '/static/:id*',

      async action({params}) {
        return (owner, repo) => {
          return new Promise((resolve, reject) => {
            const renderQuery = s.stripMargin(
              `{
                |  render(
                |    owner: "${owner}",
                |    repo: "${repo}",
                |    queries: [
                |      "${Base64.encode(blogQuery(owner, repo))}"
                |    ],
                |    templates: [
                |      ".static/${params.id}.jade",
                |      ".template/index.jade"
                |    ]
                |    selects: [
                |      "blog.title",
                |      "blog.template.styles"
                |      "blog.template.titles"
                |    ]) {
                |      data,
                |      result
                |    }
                }`);

            resolve(fetch(renderQuery).then(res => {
              const data = JSON.parse(Base64.decode(res.data.render.data));
              let title = data.blog.title;

              if (data.blog.template.titles) {
                const titleObj = _.find(data.blog.template.titles, ({file}) => file === params.id);
                if (titleObj) {
                  title = `${titleObj.title} - ${title}`;
                }
              }

              return <Content content={ res.data.render.result } title={ `${title}` } styles={ data.blog.template.styles } />;
            }));
          });
        }
      }
    },
    {
      path: '/posts/:id*',

      async action(context) {
        const params = context.params;

        return (owner, repo) => {
          return new Promise((resolve, reject) => {
            const postQuery = s.stripMargin(
              `{
               |  post(owner: "${owner}", repo: "${repo}", key: "${context.params.id}") {
               |    key,
               |    title,
               |    link,
               |    author,
               |    publishedDate,
               |    lastModifiedDate,
               |    contentSnippet,
               |    content
               |  }
               }`);

            const renderQuery = s.stripMargin(
              `{
                |  render(
                |    owner: "${owner}",
                |    repo: "${repo}",
                |    queries: [
                |      "${Base64.encode(blogQuery(owner, repo))}",
                |      "${Base64.encode(postQuery)}"
                |    ]
                |    templates: [
                |      ".template/post.jade",
                |      ".template/index.jade"
                |    ]
                |    selects: [
                |      "blog.title",
                |      "blog.template.styles",
                |      "post.title"
                |    ]) {
                |      data,
                |      result
                |    }
                }`);

            resolve(fetch(renderQuery).then(res => {
              const data = JSON.parse(Base64.decode(res.data.render.data));
              return <Content content={ res.data.render.result } title={ `${data.post.title} - ${data.blog.title}` } styles={ data.blog.template.styles } />;
            }));
          });
        };
      }

    }
  ]

};
