import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Content.scss';
import cssInsert from 'insert-css';

class Content extends Component {

  static contextTypes = {
    insertCss: PropTypes.func.isRequired,
    setTitle: PropTypes.func.isRequired
  };

  static propTypes = {
    content: PropTypes.string.isRequired,
    styles: PropTypes.arrayOf(PropTypes.string),
    title: PropTypes.string,
  };

  componentWillMount() {
    this.context.setTitle(this.props.title);

    const insertCss = this.context.insertCss;

    this.styles = _.map(this.props.styles, style => {
      return insertCss({
        _getCss: () => style,
        _insertCss: () => cssInsert(style)
      });
    });
  }

  componentWillUnmount() {
    _.each(this.styles, removeStyle => {
      removeStyle();
    });
  }

  render() {
    const content = {
      __html: this.props.content || ''
    };

    return <div className={s.root} dangerouslySetInnerHTML={ content } />;
  }

}

export default withStyles(s)(Content);
