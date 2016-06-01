'use strict';

import _ from 'lodash';
import { Base64 } from 'js-base64';
import jade from 'jade';
import Promise from 'bluebird';
import { GraphQLList as List, GraphQLString as StringType, GraphQLNonNull as NonNull } from 'graphql';

import RenderType from '../types/RenderType';
import Query from '../../core/fetch-graphql';

const render = {
  type: RenderType,

  args: {
    queries: {
      type: new NonNull(new List(StringType))
    },
    templates: {
      type: new NonNull(new List(StringType))
    },
    selects: {
      type: new NonNull(new List(StringType))
    }
  },

  resolve(request, {queries, templates, selects}) {
    return Promise.all(_.map(queries, (queryEncoded) => {
      const query = Base64.decode(queryEncoded);
      return Query(query);
    })).then(results => {
      const data = _.reduce(results, (collect, result) => {
        return _.assign({}, collect, result.data);
      }, {});

      return {
        data: Base64.encode(JSON.stringify(_.reduce(selects, (collect, key) => {
          _.set(collect, key, _.get(data, key));
          return collect;
        }, { }))),
        result: _.reduce(templates, (collect, templateKey) => {
          const template = _.get(data, templateKey);

          return _.assign({}, collect, {
            content: jade.render(template, collect)
          });
        }, data).content
      };
    });
  }
};

export default render;
