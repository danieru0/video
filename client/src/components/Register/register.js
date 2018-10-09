import React, { Component } from 'react';
import firebase from '../../config/firebase';
import Preloader from '../Preloader/preloader';
import './register.css';

class Register extends Component {
    constructor (props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            emailError: null,
            passwordError: null,
            emailValid: false,
            passwordValid: false,
            formValid: false,
            formSubmitted: null,
        }
    }
    handleUserInput = e => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({[name]: value}, () => {
            this.validateField(name, value);
        });
    }
    validateField = (fieldName, value) => {
        let emailValid = this.state.emailValid,
            passwordValid = this.state.passwordValid,
            emailError = this.state.emailError,
            passwordError = this.state.passwordError;
        switch(fieldName) {
            case 'email':
                emailValid = value.length >= 1;
                emailError = emailValid ? null : 'Email is required!';
                break;
            case 'password':
                passwordValid = value.length >= 6;
                passwordError = passwordValid? null : 'Password is required!';
                break; 
            default:
                break;
        }
        this.setState({
            emailValid: emailValid,
            passwordValid: passwordValid,
            emailError: emailError,
            passwordError: passwordError
        }, this.validateForm);
    }
    validateForm = () => {
        this.setState({
            formValid: this.state.emailValid && this.state.passwordValid
        });
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.setState({formSubmitted: 'success'});
        firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then(() => {
            let newUserFirebase = firebase.database().ref('users/').push();
            newUserFirebase.set({
                email: this.state.email,
                nick: this.state.email.split("@")[0],
                avatar: 'https://image.flaticon.com/icons/svg/149/149071.svg',
                likes: ['zero'],
                dislikes: ['zero'],
                description: `Hello! My name is: ${this.state.email.split("@")[0]}`,
                adminAccess: false
            });
            window.location.href = '/';
        }).catch((error) => {
            console.log(error);
            this.setState({formSubmitted: 'Fail: Email is taken!'});
        });
        
    }
    ifWrong = () => {
        if (this.state.formSubmitted === 'success') {
            return true;
        } else if (this.state.formSubmitted === 'Fail: Email is taken!') {
            return false;
        }
    }
    render() {
        return (
            <div className="center">
                <h2>Register</h2>
                <form method="post" onSubmit={this.handleSubmit} className="form-login">
                    <div className="inputs-group">
                        <input onChange={(event) => this.handleUserInput(event)} value={this.state.email} type="email" name="email" placeholder="Your email"></input>
                        <span>{this.state.emailError}</span>
                    </div>
                    <div className="inputs-group">
                        <input onChange={(event) => this.handleUserInput(event)} value={this.state.password} type="password" name="password" placeholder="Your password"></input>
                        <span>{this.state.passwordError}</span>
                    </div>
                    <button disabled={!this.state.formValid} type="submit" className="button button-primary">Register</button>
                    {
                        this.ifWrong() ? <Preloader /> : <p className="error-message">{this.state.formSubmitted}</p>
                    }
                </form>
            </div>
        )
    }
}

export default Register;