import React, {Component} from 'react';
import {connect} from "react-redux";
import {Redirect} from "react-router-dom";
import {Alert, Container, Form} from "reactstrap";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {ws} from "../../store/action/actionsChat";


class Main extends Component {
    state = {
        text: '',
    };

    changeField = e => this.setState({[e.target.name]: e.target.value});

    componentDidMount() {
        let url = 'ws://localhost:8000/chat';
        if (this.props.user) {
            url += '?token=' + this.props.user.token
        }

        this.websocket = new WebSocket(url);
        this.websocket.onmessage = (message) => {
            this.props.ws(message.data)
        }

    }

    onSubmitHandler = e => {
        e.preventDefault();

        const message = {
            type: 'CREATE_MESSAGE',
            text: this.state.text
        };

        this.websocket.send(JSON.stringify(message));
    };

    render() {
        if (!this.props.user) {
            return <Redirect to='/login'/>
        }
        return (
            <Container>
                <Box style={{display: 'flex', flexWrap: 'wrap', margin: '0 auto'}} component="div">
                    <Grid item xs={3}>
                        <Box boxShadow={5} style={{border: '3px solid #1565c0', height: '816px', overflowY: 'auto', background: "rgba(230, 230, 230, 0.5)"}}
                             component="div"
                             p={1} m={1}>
                            <h6>Online Users</h6>
                            <hr style={{margin: "5px 0", backgroundColor: '#1976d2', padding: '1px'}}/>
                            {this.props.userOnline.map((user, i) => (
                                <Alert style={{padding: '5px'}} key={i} color="primary">
                                    <h6 style={{margin: '0'}}>{user}</h6>
                                </Alert>
                            ))}
                        </Box>
                    </Grid>
                    <Grid item xs={9}>
                        <Box boxShadow={5} style={{border: '3px solid #1565c0', height: '730px', overflowY: 'auto', background: "rgba(230, 230, 230, 0.5)"}} component="div" p={1} m={1}>
                            <h6>Chat Room</h6>
                            <hr style={{margin: "5px 0", backgroundColor: '#1976d2', padding: '1px'}}/>
                            {this.props.messages.map(mess => (
                                <Alert key={mess._id} color="primary">
                                    <Box style={{display: 'flex', justifyContent: 'space-between'}} component="div">
                                        <h6><b>{mess.user}</b></h6>
                                        <span><i>{new Date(mess.datetime).toLocaleString()}</i></span>
                                    </Box>
                                    <hr style={{margin: '0 0 8px 0'}}/>
                                    <p style={{margin: '0'}}>{mess.message}</p>
                                </Alert>
                            ))}
                        </Box>
                        <Box boxShadow={5} style={{border: '3px solid #1565c0', background: "rgba(230, 230, 230, 0.5)"}} m={1} p={1}>
                            <Form onSubmit={this.onSubmitHandler}>
                                <Box style={{display: 'flex', flexWrap: 'wrap', margin: '0 auto'}} component="div">
                                    <Grid item xs={10}>
                                        <TextField onChange={this.changeField} style={{width: '98%'}} type='text'
                                                   name='text' id="outlined-basic" label="Enter Your Message"
                                                   variant="outlined"/>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Button style={{width: '100%', height: '97%'}} variant="contained"
                                                color="primary" type="submit">Send</Button>
                                    </Grid>
                                </Box>
                            </Form>
                        </Box>
                    </Grid>
                </Box>
            </Container>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.users.user,
        messages: state.chat.messages,
        userOnline: state.chat.userOnline
    }
};

const mapDispatchToProps = dispatch => ({

    ws: (url) => dispatch(ws(url))

});
export default connect(mapStateToProps, mapDispatchToProps)(Main)