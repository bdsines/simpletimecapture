import React, { Component } from "react"
import Button from "@material-ui/core/Button"
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import StatusDialog from './StatusDialog.js'
import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';
// import callRestService from '../utils/restutils.js'
const styles = theme => ({
    gridRoot:{
        flexGrow: 1
    },
    punchinBtn:{
        backgroundColor:green[500]
    },
    punchOutBtn:{
        backgroundColor:red[500]
    },
    card: {
        maxWidth: 800
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    actions: {
        display: 'flex',
    },

});
class CapturePunch extends Component {
    constructor(props) {
        super(props);
        this.state = { timeCaptureCredentials: { personNumber: '', password: '' }, open: false, personNumber: '', password: '', statusMessage:'',subscribedCredentials: this.props.timeCaptureCredentials, };

        this.handlePersonNumberChange = this.handlePersonNumberChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handlePunch = this.handlePunch.bind(this);
        this.handlePunchin = this.handlePunchin.bind(this);
        this.handlePunchOut = this.handlePunchOut.bind(this);
        this.toggleDialog = this.toggleDialog.bind(this);
    }

    componentDidMount() {
        console.log('process.env', process.env);
    }
    
    handlePersonNumberChange(event) {
        this.setState({ personNumber: event.target.value });
    }
    handlePasswordChange(event) {
        this.setState({ password: event.target.value });
    }
    toggleDialog = (flag,message) => {
        console.log("toggling",flag);
        this.setState({
            open: flag,
            statusMessage:message
        });
    }

    handleClose = value => {
        this.setState({ open: false });
    };
    makeheaders() {
        var headers = {};
        headers.Authorization = "Basic " + btoa('dandab@schneidertech.com' + ':' + 'Testing@123');
        headers['X-Requested-By'] = "XMLHttpRequest";
        headers['content-type'] = "application/json";

        return headers;
    }

    handlePunch(punchEvent,personNumber,password,authheaders) {
        return new Promise(function (resolve, reject) {
        // alert('personNumber was submitted: ' + this.state.personNumber);
        // var tmpPersonNumber=this.state.personnumber ;
        fetch('https://efix-dev1.hcm.us6.oraclecloud.com/hcmRestApi/resources/latest/emps?' + 'q=PersonNumber = ' + personNumber + '&expand=personDFF', {

            method: "GET",
            headers: authheaders
        })
            .then((response) => {
                return response.json()
            })
            .then((responseData) => {
                console.log("Response from Call: ", responseData);

                var pin = responseData.items[0].personDFF[0].sniTimeentryPin;

                if (pin == null || pin != password) {
                    reject({status:'Error', data:'Invalid PIN '});
                }
                else {
                    var tmptimeCaptureData = {
                        "sourceId": "CUSTOM_TIME_CAPTURE", "requestNumber": "", "requestTimestamp": "", "timeEvents": [{
                            "reporterIdType": "PERSON", "supplierDeviceEvent": "CUSTOM_TIME_CAPTURE_IN", "reporterId": "", "deviceId": "111", "eventDateTime": "2019-04-22T09:00:00.000+01:00", "timeEventAttributes": [
                                {
                                    "name": "PayrollTimeType",
                                    "value": "Regular Time",
                                }
                            ]
                        }]
                    };
                    // self.timeCaptureData.eventType = "PUNCH IN";
                    // self.timeCaptureData.dateTime = (new Date()).toISOString();


                    tmptimeCaptureData.requestTimestamp = (new Date()).toJSON().replace('Z', '+00:00');
                    //   tmptimeCaptureData.requestNumber = nxgCore.contextId + tmptimeCaptureData.requestTimestamp;
                    tmptimeCaptureData.timeEvents[0].supplierDeviceEvent = punchEvent;
                    tmptimeCaptureData.timeEvents[0].eventDateTime = (new Date()).toJSON().replace('Z', '+00:00');
                    tmptimeCaptureData.requestNumber = personNumber + (new Date()).toJSON() + tmptimeCaptureData.timeEvents[0].supplierDeviceEvent;
                    tmptimeCaptureData.timeEvents[0].reporterId = personNumber;

                    fetch('https://efix-dev1.fa.us6.oraclecloud.com/hcmRestApi/resources/latest/timeEventRequests', {

                        method: "POST",
                        headers: authheaders,
                        body: JSON.stringify(tmptimeCaptureData)
                    })
                        .then((timeEntryResponse) => {
                            return timeEntryResponse.json()
                        })
                        .then((timeEntryResponseData) => {
                            console.log('timeEntryResponse', timeEntryResponseData);
                            resolve({status:'Success',data:timeEntryResponseData})
                        });
                }

            })
            ;
        });

    }
    handlePunchin(event) {
        this.toggleDialog(true,'Punchin in Progress..');
        this.handlePunch('CUSTOM_TIME_CAPTURE_IN',this.state.personNumber,this.state.password,this.makeheaders())
        .then(()=>{
            this.setState({personNumber:'',password:''});
            this.toggleDialog(true,'Punchin Completed!');
        })
        .catch((error)=>{
            this.setState({personNumber:'',password:''});
            this.toggleDialog(true,'Punchin Failed due to: '+error.data)
        })
        ;
        // this.handleClickOpen();
        event.preventDefault();
    }
    handlePunchOut(event) {
        this.toggleDialog(true,'Punchout in Progress..');
        // this.handlePunch('CUSTOM_TIME_CAPTURE_OUT');
        this.handlePunch('CUSTOM_TIME_CAPTURE_OUT',this.state.personNumber,this.state.password,this.makeheaders())
        .then(()=>{
            this.setState({personNumber:'',password:''});
            this.toggleDialog(true,'Punchout Completed!');
        })
        .catch((error)=>{
            console.log(error);
            this.setState({personNumber:'',password:''});
            this.toggleDialog(true,'Punchout Failed due to '+error.data)
        });
        
        // this.toggleDialog(false,'');
        event.preventDefault();
    }
    render() {
        const { classes } = this.props
        return (

            <form >
                <FormControl margin="normal" required fullWidth>
                    <InputLabel  htmlFor="personNumber">Person Number</InputLabel>
                    <Input required id="personNumber" name="personNumber" value={this.state.personNumber} type="text" autoFocus onChange={this.handlePersonNumberChange} />
                </FormControl>
                <FormControl margin="normal" required fullWidth>
                    <InputLabel htmlFor="password">PIN</InputLabel>
                    <Input required name="password" type="password" value={this.state.password} id="password" onChange={this.handlePasswordChange} />
                </FormControl>
                <div className="gridRoot">
                <Grid container spacing={16} justify="center" direction="row" alignItems="center">
                    <Grid item xs={16} sm={8}>
                        <Button
                            onClick={this.handlePunchin}
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.punchinBtn}
                        >
                            Punch In
          </Button>
                    </Grid>
                    <Grid item xs={16} sm={8}>
                        <Button
                            onClick={this.handlePunchOut}
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.punchOutBtn}
                        >
                            Punch Out
          </Button>
                    </Grid>
                </Grid>
                </div>
                <StatusDialog
                    open={this.state.open}
                    onClose={this.handleClose}  
                    message={this.state.statusMessage}                 
                />

            </form>
        );
    }
}
export default withStyles(styles)(CapturePunch);