import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, hashHistory, Link, IndexLink } from 'react-router';
import './css/bootstrap.min.css';
import { Grid, Row, Col } from 'react-bootstrap';
import { Navs } from 'react-bootstrap';
import './css/main.css';
import './css/songbook.css';
import SongBook from './songbook.jsx';
import {AllReducers} from './songbook.jsx';
import shortid from 'shortid';
import {createStore} from 'redux';
import {Provider} from 'react-redux';

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
        <NavLink className="MyMenuItem" to="/phptest">PHPtest</NavLink>
        <NavLink className="MyMenuItem" to="/repos">Repos</NavLink>
        <NavLink className="MyMenuItem" to="/store/petr/documents">Store</NavLink>
        <NavLink className="MyMenuItem" to="/songs">Songs</NavLink>
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

class PHPtest extends React.Component {

  content = [];

  makeQuery() {
    let xmlhttp = new XMLHttpRequest();
    let url = "http://www.vackovi.com/rest/rest.php?sql=select * from news where id<11 and jazyk='CZ'";

    xmlhttp.onreadystatechange = () => {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        this.processSQLResult(xmlhttp.responseText);
      }
    };
    xmlhttp.overrideMimeType('text/html; charset=windows-1250');
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
  }

  processSQLResult(aResponse) {
    this.content = JSON.parse(aResponse);
    this.forceUpdate();
  }

  render() {
/*
    this.content.map( (record) => {
      console.log(record.popis)
    });
*/
    return (
      <div>
        <div>PHP test page</div>
        <button onClick={this.makeQuery.bind(this)}> SQL </button>
        <div>
          <table className="NewsTable">
            <thead>
              <tr>
                <th>{'id'}</th>
                <th>{'nadpis'}</th>
                <th>{'popis'}</th>
              </tr>
            </thead>
            <tbody>
            {this.content.map( (record) => {
              return(
                <tr key={shortid.generate()}>
                  <td>{record.id}</td>
                  <td>{record.nadpis}</td>
                  <td>{record.popis}</td>
                </tr>
              )
            }
            )}
            </tbody>
          </table>
        </div>
      </div>
    )
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
  <Provider store={createStore( AllReducers() )}>
    <Router history={hashHistory}>
        <Route path="/" component={ResponsiveNavigator}>
          <IndexRoute component={Home}/>
          <Route path="/repos" component={Repos}/>
          <Route path="/store/:userName/:reposName" component={Store}/>
          <Route path="/phptest" component={PHPtest}/>
          <Route path="/songs" component={SongBook}/>
      </Route>
    </Router>
  </Provider>
, document.body.appendChild(document.createElement('div')));

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////

