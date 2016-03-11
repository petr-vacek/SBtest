import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, hashHistory, Link, IndexLink } from 'react-router';
import './css/bootstrap.min.css';
import { Grid, Row, Col } from 'react-bootstrap';
import { Navs } from 'react-bootstrap';
import './css/main.css';
import './css/songbook.css';
import SongPage from './songbook.jsx';

class NavLink extends React.Component {
  render() {
    return <Link {...this.props} className="MyMenuItem" activeClassName="activeMenuItem" onlyActiveOnIndex/>
  }
}

class Navigator extends React.Component {
  render() {
    return (
      <div className="MyMenu">
        <NavLink className="MyMenuItem" to="/">Home</NavLink>
        <NavLink className="MyMenuItem" to="/about">About</NavLink>
        <NavLink className="MyMenuItem" to="/repos">Repos</NavLink>
        <NavLink className="MyMenuItem" to="/store/petr/documents">Store</NavLink>
        <NavLink className="MyMenuItem" to="/info">Songs</NavLink>
      </div>
    )
  }
}

class ResponsiveNavigator extends React.Component {
  render() {
    return (
      <Grid>
        <Row>
          <Col xs={12} md={2}>
            <Navigator />
          </Col>
          <Col xs={12} md={10}>
            {this.props.children}
          </Col>
        </Row>
      </Grid>
    )
  }
}

class Home extends React.Component {
  render() {
    return <div>This is the homepage.</div>
  }
}

class About extends React.Component {
  render() {
    return <div>About page</div>
  }
}

class Repos extends React.Component {
  render() {
    return <div>
      Repos
    </div>
  }
}

class Store extends React.Component {
  static propTypes = {
    params: React.PropTypes.shape({
      userName: React.PropTypes.string,
      reposName: React.PropTypes.string
    })
  };

  render() {
    return (
      <div>
        Store with params:<br/>
        <h3>User: {this.props.params.userName}</h3>
        <h3>Store: {this.props.params.reposName}</h3>
      </div>
    )
  }
}




ReactDOM.render(
  <Router history={hashHistory}>
      <Route path="/" component={ResponsiveNavigator}>
        <IndexRoute component={Home}/>
        <Route path="/repos" component={Repos}/>
        <Route path="/store/:userName/:reposName" component={Store}/>
        <Route path="/about" component={About}/>
        <Route path="/info" component={SongPage}/>
    </Route>
  </Router>
, document.body.appendChild(document.createElement('div')));

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////

