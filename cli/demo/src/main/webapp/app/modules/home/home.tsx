import './home.css';

import React from 'react';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';
import { Row, Col, Alert } from 'reactstrap';

import { IRootState } from 'app/shared/reducers';
import { getSession } from 'app/shared/reducers/authentication';

export interface IHomeProp extends StateProps, DispatchProps {}

export class Home extends React.Component<IHomeProp> {
  componentDidMount() {
    this.props.getSession();
  }

  render() {
    const { account } = this.props;
    return (
      <Row>
        <Col md="9">
          <h2>Welcome, Simlife Bot!</h2>
          <p className="lead">This is your homepage</p>
          {account && account.login ? (
            <div>
              <Alert color="success">You are logged in as user {account.login}.</Alert>
            </div>
          ) : (
            <div>
              <Alert color="warning">
                If you want to
                <Link to="/login" className="alert-link">
                  {' '}
                  sign in
                </Link>
                , you can try the default accounts:
                <br />- Administrator (login=&quot;admin&quot; and password=&quot;admin&quot;)
                <br />- User (login=&quot;user&quot; and password=&quot;user&quot;).
              </Alert>

              <Alert color="warning">
                You do not have an account yet?&nbsp;
                <Link to="/register" className="alert-link">
                  Register a new account
                </Link>
              </Alert>
            </div>
          )}
          <p>If you have any question on Simlife:</p>

          <ul>
            <li>
              <a href="https://www.simlife.io/" target="_blank" rel="noopener noreferrer">
                Simlife homepage
              </a>
            </li>
            <li>
              <a href="http://stackoverflow.com/tags/simlife/info" target="_blank" rel="noopener noreferrer">
                Simlife on Stack Overflow
              </a>
            </li>
            <li>
              <a href="https://github.com/simlife/simlife-bot/issues?state=open" target="_blank" rel="noopener noreferrer">
                Simlife bug tracker
              </a>
            </li>
            <li>
              <a href="https://gitter.im/simlife/simlife-bot" target="_blank" rel="noopener noreferrer">
                Simlife public chat room
              </a>
            </li>
            <li>
              <a href="https://twitter.com/java_simlife" target="_blank" rel="noopener noreferrer">
                follow @java_simlife on Twitter
              </a>
            </li>
          </ul>

          <p>
            If you like Simlife, do not forget to give us a star on{' '}
            <a href="https://github.com/simlife/simlife-bot" target="_blank" rel="noopener noreferrer">
              Github
            </a>!
          </p>
        </Col>
        <Col md="3" className="pad">
          <span className="simlife rounded" />
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = storeState => ({
  account: storeState.authentication.account,
  isAuthenticated: storeState.authentication.isAuthenticated
});

const mapDispatchToProps = { getSession };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
