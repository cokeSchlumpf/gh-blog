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
  |    title
  |    user
  |    repo
  |    owner {
  |      name
  |      avatar
  |      twitter
  |      github
  |    }
  |    template {
  |      styles
  |      index
  |      posts
  |      post
  |    }
  |  }
  }`);

export default {

  path: '/blogs/:owner/:repo',

  async action({next, params}) {
    const child = await next();

    const result = child(params.owner, params.repo).catch(e => {
      console.log(e);
      console.error(e);
      console.log(e.stack);
      return <Content content="is nicht" title="IS NICHT!" />
    });

    return result;
  },

  children: [
    {

      path: '/',

      async action(context) {
        return (owner, repo) => {
          return new Promise((resolve, reject) => {
            try {
              const postsQuery = s.stripMargin(
                `{
                |  posts(owner: "${owner}", repo: "${repo}") {
                |    key,
                |    title,
                |    link,
                |    author,
                |    publishedDate,
                |    contentSnippet
                |  }
                }`);

              const renderQuery = s.stripMargin(
                `{
                |  render(
                |    queries: [
                |      "${Base64.encode(blogQuery(owner, repo))}",
                |      "${Base64.encode(postsQuery)}"
                |    ]
                |    templates: [
                |      "blog.template.posts",
                |      "blog.template.index"
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
      }

    },
    {

      path: '/posts/:key',

      async action({params}) {
        return (owner, repo) => {
          return new Promise((resolve, reject) => {
            try {
              const postQuery = s.stripMargin(
                `{
                |  post(owner: "${owner}", repo: "${repo}", key: "${params.key}") {
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
                |    queries: [
                |      "${Base64.encode(blogQuery(owner, repo))}",
                |      "${Base64.encode(postQuery)}"
                |    ]
                |    templates: [
                |      "blog.template.post",
                |      "blog.template.index"
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
            } catch (error) {
              reject(error);
            }
          });
        };
      }

    }
  ]

};
