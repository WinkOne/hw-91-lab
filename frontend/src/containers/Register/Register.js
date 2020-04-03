import React, {Component} from 'react';
import '../../App.css'
import {Badge, Col, Form, FormGroup, Input, Label} from "reactstrap";
import {registerUser} from "../../store/action/usersActions";
import {connect} from "react-redux";
import FormElement from "../../components/UI/Form/FormElement";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";

class Register extends Component {
    state = {
        username: '',
        password: '',
        avatar: ''
    };

    inputChangeHandler = event => {
        this.setState({
            [event.target.name]: event.target.value
        })
    };

    fileChangeHandler = event => {
        this.setState({
            [event.target.name]: event.target.files[0]
        })
    };

    submitFormHandler = event => {
        event.preventDefault();

        const formData = new FormData();

        Object.keys(this.state).forEach(key => {
            let value = this.state[key];

            formData.append(key, value);
        });

        this.props.registerUser(formData);
    };

    getFieldError = fieldName => {
        try {
            return this.props.error.errors[fieldName].message;
        } catch (e) {
            return undefined;
        }
    };

    render() {
        return (
            <>
                <h1><Badge color="secondary">Register new user</Badge></h1>
                <hr className="HRColor"/>
                <Paper style={{padding: '25px'}} elevation={3}>
                    <Form onSubmit={this.submitFormHandler}>
                        <FormElement
                            propertyName="username"
                            title="Username"
                            value={this.state.username}
                            onChange={this.inputChangeHandler}
                            error={this.getFieldError('username')}
                            placeholder="Enter username"
                            autoComplete="new-username"
                        />
                        <FormElement
                            propertyName="password"
                            title="Password"
                            type="password"
                            value={this.state.password}
                            onChange={this.inputChangeHandler}
                            error={this.getFieldError('password')}
                            placeholder="Enter password"
                            autoComplete="new-password"
                        />
                        <FormGroup>
                            <Label for="avatar">File</Label>
                            <Input onChange={this.fileChangeHandler} type="file" name="avatar" id="avatar"/>
                        </FormGroup>
                        <FormGroup row>
                            <Col>
                                <Button type="submit" variant="contained" color="primary">
                                    Register
                                </Button>
                            </Col>
                        </FormGroup>
                    </Form>
                </Paper>
            </>
        );
    }
}

const mapStateToProps = state => ({
    error: state.users.registerError,
    loading: state.users.registerLoading,
});

const mapDispatchToProps = dispatch => ({
    registerUser: userData => dispatch(registerUser(userData))
});

export default connect(mapStateToProps, mapDispatchToProps)(Register);