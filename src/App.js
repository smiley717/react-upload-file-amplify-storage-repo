import './App.css';
import React, { useState } from 'react'
import './App.css'
import Amplify, { Storage } from 'aws-amplify'
import Container from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import { InputLabel } from '@material-ui/core';

import {
  AmplifyAuthenticator,
  AmplifySignOut,
  AmplifySignIn,
  AmplifySignUp,
  withAuthenticator
} from '@aws-amplify/ui-react'
import './aws-exports'
// Amplify.configure(awsConfig)

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));


function App() {
  const classes = useStyles();
  const [name, setName] = useState('')
  const [file, setFile] = useState('')
  const [response, setResponse] = useState('')

  const onChange = (e) => {
    e.preventDefault()
    if (e.target.files[0] !== null) {
      setFile(e.target.files[0])
      setName(e.target.files[0].name)
    }
  }

  const onSubmit = (e) => {
    e.preventDefault()
    if (file) {
      Storage.put(name, file, {
        /* level: 'protected', */
        contentType: file.type,
      })
        .then((result) => {
          console.log(result)
          setResponse(`Success uploading file: ${name}!`)
        })
        .then(() => {
          document.getElementById('file-input').value = null
          setFile(null)
        })
        .catch((err) => {
          console.log(err)
          setResponse(`Can't upload file: ${err}`)
        })
    } else {
      setResponse(`Files needed!`)
    }
  }
  return (
    <div className="App">
      <Container >
      <div className='video-uploader'>
        <form onSubmit={(e) => onSubmit(e)}>
          <InputLabel htmlFor="file-input"><h1>Select video:</h1></InputLabel>

          <OutlinedInput
            className='video-input'
            type='file'
            id='file-input'
            accept='image/*, video/*'
            onChange={(e) => onChange(e)}
          />
          <Button
            variant="contained"
            type='submit'
            color="secondary"
            className={classes.button}
            startIcon={<CloudUploadIcon />}
          >
            Upload
          </Button>
        </form>
        <h1>{ response }</h1>
      </div>
      <AmplifySignOut/>
      </Container>
    </div>
  );
}

export default withAuthenticator(App);
