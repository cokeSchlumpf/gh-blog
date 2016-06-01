/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component, PropTypes } from 'react';
import emptyFunction from 'fbjs/lib/emptyFunction';
import s from './style/App.scss';
import cx from 'classnames';

class App extends Component {

  static propTypes = {
    context: PropTypes.shape({
      insertCss: PropTypes.func,
      setTitle: PropTypes.func,
      setMeta: PropTypes.func,
    }),
    children: PropTypes.element.isRequired,
    error: PropTypes.object,
  };

  static childContextTypes = {
    insertCss: PropTypes.func.isRequired,
    setTitle: PropTypes.func.isRequired,
    setMeta: PropTypes.func.isRequired,
  };

  getChildContext() {
    const context = this.props.context;
    return {
      insertCss: context.insertCss || emptyFunction,
      setTitle: context.setTitle || emptyFunction,
      setMeta: context.setMeta || emptyFunction,
    };
  }

  componentWillMount() {
    const {insertCss} = this.props.context;
    this.removeCss = insertCss(s);
  }

  componentWillUnmount() {
    this.removeCss();
  }

  render() {
    return (
      <div>
        <header className={ s["site-header"]}>
          <h2><a className={ cx(s.logo, s.ir) } href="#" title="reTHINKit">reTHINKit</a></h2>
        </header>
        <div className={ cx(s.container, s.clearfix) }>
          <main role="main" className={ cx(s['content']) }>
            {this.props.children}
          </main>
          <aside className={ s.author }>

            <img className={ s["profile-image"]} src={ require('./img/profile-image.jpg') } alt="Michael Wellner" />
            <p className={ s.name }>by <strong>Michael Wellner</strong></p>
            <p className={ s.address }>Munich, Germany</p>
            <p className={ s.link }><a href="http://www.michaelwellner.de" title="Michael Wellner">michaelwellner.de</a></p>

            <ul className={ s.social }>
              <li><a className={ cx(s["icon-twitter"], 'icon-dummy') } href="http://twitter.com/cokeSchlumpf" title="Follow me on Twitter" target="_blank"></a></li>
              <li><a className={ cx(s["icon-github"], 'icon-dummy') } href="http://github.com/cokeSchlumpf" title="cokeSchlumpf@Github" target="_blank"></a></li>
            </ul>

          </aside>
        </div>
        <footer className={ s["main-footer"]}>
          <div className={ cx(s.container, s.clearfix) }>
            <p>All content copyright <a href="http://www.michaelwellner.de" title="Michael Wellner">michaelwellner.de</a> © 2015. All rights reserved.</p>
            <p>Proudly published with Ghost. Theme designed and built by <a href="http://rriegger.com" title="Raphael Riegger - UI/UX Designer">Raphael Riegger</a></p>
          </div>
        </footer>
      </div>);
  }

}

export default App;
