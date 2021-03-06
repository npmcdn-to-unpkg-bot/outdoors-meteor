import React, { Component } from 'react';
import { connect } from 'react-redux';
import SignIn from '../components/auth/signIn';
import SignUp from '../components/auth/signUp';
import { Accounts } from 'meteor/accounts-base';
import { Link, browserHistory } from 'react-router';
import superagent from 'superagent';

class Home extends Component{
  constructor(props) {
    super(props);

    this.signIn = this.signIn.bind(this);
    this.signUp = this.signUp.bind(this);
    this.toggleSignIn = this.toggleSignIn.bind(this);
    this.toggleSignUp = this.toggleSignUp.bind(this);
    this.dismiss = this.dismiss.bind(this);
  }
  componentWillMount() {
    this.setState({
      signIn: false,
      signUp: false,
      logInBtn: true,
      signUpBtn: true
    });
  }

  dismiss() {
    this.setState({
      signIn: false,
      signUp: false,
      logInBtn: true,
      signUpBtn: true
    })
  }

  toggleSignIn() {
    this.setState({
      signIn: true,
      signUp: false,
      logInBtn: false,
      signUpBtn: false
    });
  }

  toggleSignUp() {
    this.setState({
      signIn: false,
      signUp: true,
      logInBtn: false,
      signUpBtn: false
    });
  }


  signIn(e) {
    e.preventDefault();
    let { dispatch, form } = this.props;
    let user = {
      email: form.signIn.email.value,
      password: form.signIn.password.value
    }
    Meteor.loginWithPassword(user.email, user.password, function(err) {
      if(err) {
        alert(err)
      } else {
        dispatch({
          type: 'SET_USER',
          user: Meteor.user()
        });
        localStorage.setItem( '_id', Meteor.user()._id )
        browserHistory.push('/welcome')
      }
    })
  }

  signUp(e) {
    e.preventDefault();
    let { dispatch, form } = this.props;

    // let data = {
    //   address: form.signUp.email.value,
    //   api_key: 'pubkey-252bed34819a680c8b154bf61ba4128b'
    // }
    // superagent
    //   .get('https://api.mailgun.net/v3/address/validate')
    //
    //   .end((err, res) => {
    //     if(err) {
    //       alert('error: ', err)
    //     } else {
    //       alert('not error: ', res)
    //     }
    //   })
    
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': form.signUp.address.value}, function(res, status) {
      if(status == 'OK') {
        let user = {
          email: form.signUp.email.value,
          password: form.signUp.password.value,
          profile: {
            firstName: form.signUp.firstName.value,
            lastName: form.signUp.lastName.value,
            address: form.signUp.address.value,
            latitude: res[0].geometry.viewport.f.b,
            longitude: res[0].geometry.viewport.b.b,
          }
        }

        Accounts.createUser(user, function(err, res) {
          if(err) {
            console.log('error', err)
            alert('Error Signing Up')
          } else {
            dispatch({
              type: 'SET_USER',
              user: Meteor.user()
            });
            Meteor.call('sendVerificationLink');
            browserHistory.push('/welcome')
          }
        })
      }
    })
  }

  render() {
      return (
        <div>
          <Link to="/about" className="about-link">More Info</Link>
          <div className="homePage">
            <h3>Outdoors</h3>
            <div className="home-buttons">
              <button onClick={this.toggleSignIn} style={{ display: this.state.logInBtn ? "inline-block" : "none" }}>Log In</button>
              <button onClick={this.toggleSignUp} style={{ display: this.state.signUpBtn ? "inline-block" : "none" }}>Sign Up</button>

            </div>
            <div className="signInForm" style={{ display: this.state.signIn ? "block" : "none" }}>
              <SignIn signIn={this.signIn} dismiss={this.dismiss}/>
            </div>
            <div className="signUpForm" style={{ display: this.state.signUp ? "block" : "none" }}>
              <SignUp signUp={this.signUp} dismiss={this.dismiss}/>
            </div>
          </div>
        </div>
      )

  }
}

function mapStateToProps(state) {
  return {
    form: state.form
  }
}

export default connect(mapStateToProps)(Home);
