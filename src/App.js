import './App.css';
import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import TopAppBar from "./components/TopAppBar";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Fab from "@material-ui/core/Fab";
import Input from '@material-ui/core/Input';
import AddIcon from "@material-ui/icons/Add";
import Typography from "@material-ui/core/Typography";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import CloseIcon from '@material-ui/icons/Close';
import Divider from '@material-ui/core/Divider';
import LinearProgress from "@material-ui/core/LinearProgress/LinearProgress";
import CircularProgress from "@material-ui/core/CircularProgress";
import VideoList from "./components/VideoList";
import ReactPlayer from "react-player";

import Amplify, { Storage } from 'aws-amplify';
import {
  AmplifyAuthenticator,
  AmplifySignOut,
  AmplifySignIn,
  AmplifySignUp,
  withAuthenticator
} from '@aws-amplify/ui-react'
import './aws-exports';
import Container from "@material-ui/core/Box/Box";

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  upload: {
    margin: theme.spacing(5),
    padding: theme.spacing(2),
    width: '100%'
  },
  uploadButton: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3)
  },
  fileName: {
    marginRight: '10px'
  },
  videoPlayer: {
    padding: theme.spacing(2)
  }
}));


function App() {
  const classes = useStyles();
  const [name, setName] = useState('');
  const [file, setFile] = useState('');
  const [list, setList] = useState([]);
  const [progress, setProgress] = useState(0);
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);


  useEffect(async () => {
    setIsLoading(true);
    Storage.list('', {level: ''}) // for listing ALL files without prefix, pass '' instead
      .then(result => {
        console.log(result);
        setIsLoading(false);
        setList(result)
      })
      .catch(err => {
        console.log(err)
        setIsLoading(false);
      });
  }, []);

  const onChange = (e) => {
    e.preventDefault();
    if (e.target.files[0] !== null) {
      setFile(e.target.files[0]);
      setName(e.target.files[0].name)
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (file) {
      setResponse(`Uploading...`);
      console.log(name + ":" + file.type)
      let folder = '';
      await Storage.put(folder + name, file, {
        contentType: file.type,
        progressCallback(progress) {
          console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
          setProgress((progress.loaded/progress.total*100).toFixed())
        },
      })
        .then((result) => {
          console.log(result);
          setProgress(0);
          setResponse(`Success uploading file: ${name}!`)
        })
        .then(() => {
          document.getElementById('file-input').value = null;
          setFile(null)
          setName('')
        })
        .catch((err) => {
          console.log(err);
          setResponse(`Can't upload file: ${err}`)
        })
    } else {
      setResponse(`Files needed!`)
    }
  };

  const onCancelUpload = (e) => {
    e.preventDefault();
    setProgress(0);
    document.getElementById('file-input').value = null;
    setFile(null)
    setName('')
  }

  return (
    <Box color="text.primary" component="span" m={0}>
      <TopAppBar />
      <Grid container>
        <Grid item xs={6} container justify='center'>
          <Paper elevation={3} className={classes.upload}>
            <Typography variant="h5">Video Upload</Typography>
            <Divider />
            <form onSubmit={(e) => onSubmit(e)}>
              <Grid container justify='center'>
                <Grid>
                  <Divider/>
                </Grid>
                <Grid container className={classes.uploadButton} justify='flex-end'>
                  <Typography variant="h5" className={classes.fileName}>
                    {name}
                  </Typography>
                  <label htmlFor="file-input">
                    <Input
                      style={{ display: 'none' }}
                      id="file-input"
                      name="input-video"
                      type="file"
                      onChange={(e) => onChange(e)}
                    />
                    <Fab
                      color="secondary"
                      size="small"
                      component="span"
                      aria-label="add"
                      variant="extended"
                    >
                      <AddIcon /> Select file
                    </Fab>
                  </label>
                </Grid>
                <Grid>
                  {
                    progress ? (
                      <Button
                        variant="contained"
                        type='submit'
                        color='default'
                        className={classes.button}
                        startIcon={<CloseIcon />}
                      >
                        Cancel
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        type='submit'
                        color="primary"
                        className={classes.button}
                        startIcon={<CloudUploadIcon />}
                      >
                        Upload
                      </Button>
                    )
                  }
                </Grid>
              </Grid>
            </form>
            { progress ? <LinearProgress variant="determinate" value={Number(progress)} /> : null }
            <Grid container justify='center'>
              <Typography variant='h6'>
                {response}
              </Typography>
            </Grid>
          </Paper>

          <Paper elevation={3} className={classes.upload}>
            <Typography variant='h5'>Video List</Typography>
            <Divider/>
            {
              isLoading ? (
                <Grid container justify='center'>
                  <CircularProgress />
                </Grid>
                ) : (<VideoList data={list} />)
            }

          </Paper>
        </Grid>
        <Grid item xs={6} className={classes.videoPlayer}>
          <AmplifySignOut/>
          <ReactPlayer url={'https://s3.amazonaws.com/codecademy-content/courses/React/react_video-fast.mp4'}
                       playing={false}
                       width='100%'
                       height='auto'
                       controls
                       config={{
                         file: {
                           attributes: {
                             controlsList: "nodownload"
                           }
                         }
                       }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}


export default withAuthenticator(App);
