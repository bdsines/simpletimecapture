import React, { Component } from "react"
import Button from "@material-ui/core/Button"
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import orange from '@material-ui/core/colors/orange';
// import black from '@material-ui/core/colors/black';
const styles = {
    dialog:{
        backgroundColor: orange[500]
    },
    avatar: {
      backgroundColor: orange[100]
    },
  };
  
class StatusDialog extends React.Component {
    constructor(props) {
        super(props);
        // this.state = { timeCaptureCredentials: { personNumber: '', password: '' }, open: false, personNumber: '', password: '', statusMessage:'',subscribedCredentials: this.props.timeCaptureCredentials, };

        this.handleClose = this.handleClose.bind(this);
    }
    handleClose=event=>{
        this.props.onClose();
    }
    
  render() {
    const { classes,open,onClose,...other } = this.props;
      return (
          
          <React.Fragment>
          
          <Dialog
           
            open={this.props.open}
            close={this.handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle className={classes.dialog} id="alert-dialog-title">{"Time Capture Status"}</DialogTitle>
            <DialogContent  >
              <DialogContentText id="alert-dialog-description">
                Status: {this.props.message}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleClose}>
                OK
              </Button>
            </DialogActions>
          </Dialog>
          </React.Fragment>
      );
    }
  }

//   const StatusDialogWrapped = withStyles(styles)(StatusDialog);

export default withStyles(styles)(StatusDialog);