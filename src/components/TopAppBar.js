import React from "react";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from '@material-ui/core/styles';
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import ExitApp from "@material-ui/icons/ExitToApp"
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  customizeToolbar: {
    minHeight: theme.spacing(10)
  }
}));

const TopAppBar = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar variant="dense" className={classes.customizeToolbar}>
          <Grid container justify='space-between'>
            <Typography variant="h4" color="inherit">
              Amplify Video Upload & Player
            </Typography>
            <Button color="inherit">
              <ExitApp fontSize='large' />
            </Button>
          </Grid>
        </Toolbar>
      </AppBar>
    </div>
    )
}

export default TopAppBar