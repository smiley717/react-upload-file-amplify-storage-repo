import React, {useEffect, useState} from "react";
import {Storage} from "@aws-amplify/storage";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MovieIcon from '@material-ui/icons/Movie';
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  list: {
    maxHeight: theme.spacing(72),
    overflow: 'auto'
  }
}))


function VideoList(itemList) {
  const classes = useStyles();
  const [selectedIndex, setSelectedIndex] = React.useState(1);

  const handleListItemClick = async (event, index, key) => {
    setSelectedIndex(index);
    console.log('clicked', index);
    const signedURL = await Storage.get(key); // get key from Storage.list
    console.log(signedURL);
  };

  return(
    <Grid className={classes.list}>
      <List component="nav" aria-label="main mailbox folders">
        {itemList.data.map((item, key) => (
          <Grid key={key}>
            <ListItem
              button
              selected={selectedIndex === key}
              onClick={(e) => handleListItemClick(e, key, item.key)}>
              <ListItemIcon><MovieIcon /></ListItemIcon>
              <ListItemText primary="Hello world" />
            </ListItem>
            <Divider />
          </Grid>
          )
        )}
      </List>
    </Grid>
  )
}
export default VideoList;