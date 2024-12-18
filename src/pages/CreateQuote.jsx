import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { uploadMedia, createQuote } from '../utils/api';
import { 
  Button, 
  TextField, 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Alert, 
  Grid, 
  Paper,
  Snackbar,
  IconButton
} from '@mui/material';
import { CloudUpload, Close } from '@mui/icons-material';

const CreateQuote = () => {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const { token } = useAuth();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        setPreviewUrl(e.target?.result);
      };
      fileReader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !text || !token) return;

    setIsLoading(true);
    setError('');

    try {
      const mediaResponse = await uploadMedia(file);
      const mediaUrl = mediaResponse.url;

      await createQuote(text, mediaUrl, token);
      setSuccessMessage('Quote created successfully!');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError('Failed to create quote. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 'lg', mx: 'auto', px: 3, py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Create a New Quote
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Quote Text"
                  multiline
                  rows={4}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  margin="normal"
                  required
                  variant="outlined"
                />
                <Box sx={{ my: 2 }}>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="raised-button-file"
                    type="file"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="raised-button-file">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<CloudUpload />}
                      fullWidth
                    >
                      Upload Image
                    </Button>
                  </label>
                  {file && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Selected file: {file.name}
                    </Typography>
                  )}
                </Box>
                {error && (
                  <Alert severity="error" sx={{ my: 2 }}>
                    {error}
                  </Alert>
                )}
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={isLoading || !file || !text}
                  sx={{ mt: 2 }}
                >
                  {isLoading ? 'Creating...' : 'Create Quote'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={3} 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center', 
              alignItems: 'center',
              p: 2,
              bgcolor: previewUrl ? 'grey.200' : 'background.paper'
            }}
          >
            {previewUrl ? (
              <Box 
                sx={{ 
                  position: 'relative', 
                  width: '100%', 
                  height: 0, 
                  paddingTop: '75%', 
                  overflow: 'hidden'
                }}
              >
                <Box
                  component="img"
                  src={previewUrl}
                  alt="Quote preview"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    bgcolor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 2,
                  }}
                >
                  <Typography variant="h6" align="center" sx={{ color: 'white' }}>
                    {text || 'Your quote will appear here'}
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Typography variant="body1" color="textSecondary">
                Preview will appear here
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
      <Snackbar
        open={!!successMessage}
        autoHideDuration={2000}
        onClose={() => setSuccessMessage('')}
        message={successMessage}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={() => setSuccessMessage('')}
          >
            <Close fontSize="small" />
          </IconButton>
        }
      />
    </Box>
  );
};

export default CreateQuote;

