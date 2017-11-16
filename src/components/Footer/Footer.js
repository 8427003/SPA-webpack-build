import React, { Component } from 'react';
import './_footer.scss';

class Footer extends Component {
  render() {
    return (
      <footer className="app-footer">
        <span><a href="http://jiedaibao.com">借贷宝</a> &copy; 2017 jiedaibao.com.</span>
        <span className="ml-auto">Powered by <a href="http://wiki.jdb-dev.com/pages/viewpage.action?pageId=12913782">公共平台部</a></span>
      </footer>
    )
  }
}

export default Footer;
