import React, { useState, useCallback } from 'react';
import {
  CircularProgress,
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Paper,
  Alert,
  Snackbar,
  Chip,
} from '@mui/material';
import {
  CloudUpload,
  PhotoCamera,
  AutoAwesome,
  DeleteOutline,
  Send,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { useApp } from '../context/AppContext';

const UploadPage = () => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const { isLoading, setLoading, setError, addGeneratedImage } = useApp();

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        setError('Please upload a valid image file (JPEG, PNG, WebP, or GIF)');
        setSnackbarOpen(true);
        return;
      }

      // Check file size (limit to 10MB)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        setError('Image is too large. Please use an image smaller than 10MB.');
        setSnackbarOpen(true);
        return;
      }

      setImage(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  }, [setError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif']
    },
    multiple: false
  });

  const promptSuggestions = [
    'Transform into Studio Ghibli style',
    'Make it look like an anime scene',
    'Add magical elements and spirits',
    'Convert to watercolor painting',
    'Make it more fantastical and dreamy',
    'Add Totoro characters to the scene',
  ];

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!image) {
      setError('Please upload an image');
      setSnackbarOpen(true);
      return;
    }
    if (!prompt.trim()) {
      setError('Please enter a description');
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('image', image);
      formData.append('prompt', prompt);

      const response = await fetch('http://localhost:8080/api/v1/generate', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        if (response.status === 413) {
          throw new Error('Image file is too large. Please use a smaller image.');
        }
        throw new Error(`Server error: ${response.status}`);
      }

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setResult(imageUrl);

      // Add to generated images
      const newImage = {
        id: Date.now(),
        url: imageUrl,
        prompt,
        originalImage: imagePreview,
        createdAt: new Date().toISOString(),
        type: 'image-to-image',
      };
      addGeneratedImage(newImage);

    } catch (err) {
      setError(err.message || 'Failed to generate image');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleDownload = () => {
    if (result) {
      const a = document.createElement('a');
      a.href = result;
      a.download = `gibili-art-transformation-${Date.now()}.png`;
      a.click();
    }
  };

  const handlePromptSuggestion = (suggestion) => {
    setPrompt(suggestion);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 2,
              background: 'linear-gradient(45deg, #2196F3, #21CBF3)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Image to Image Generator
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Upload your image and transform it into stunning Studio Ghibli-style artwork
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Upload Section */}
          <Grid item xs={12} lg={6}>
            <Card sx={{ height: 'fit-content', position: 'sticky', top: 100 }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <CloudUpload sx={{ mr: 2, color: 'primary.main' }} />
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    Transform Your Image
                  </Typography>
                </Box>

                {/* Image Upload */}
                {!imagePreview ? (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Paper
                      {...getRootProps()}
                      sx={{
                        p: 6,
                        textAlign: 'center',
                        cursor: 'pointer',
                        border: '2px dashed',
                        borderColor: isDragActive ? 'primary.main' : 'grey.300',
                        backgroundColor: isDragActive ? 'primary.light' : 'background.default',
                        transition: 'all 0.3s ease',
                        mb: 3,
                        '&:hover': {
                          borderColor: 'primary.main',
                          backgroundColor: 'primary.light',
                        },
                      }}
                    >
                      <input {...getInputProps()} />
                      <PhotoCamera
                        sx={{
                          fontSize: 60,
                          color: isDragActive ? 'primary.main' : 'grey.400',
                          mb: 2,
                        }}
                      />
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        {isDragActive ? 'Drop your image here' : 'Upload an image'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Drag & drop or click to select • JPEG, PNG, WebP, GIF • Max 10MB
                      </Typography>
                    </Paper>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Paper sx={{ p: 2, mb: 3, position: 'relative' }}>
                      <Box
                        component="img"
                        src={imagePreview}
                        alt="Preview"
                        sx={{
                          width: '100%',
                          maxHeight: 300,
                          objectFit: 'contain',
                          borderRadius: 1,
                        }}
                      />
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        startIcon={<DeleteOutline />}
                        onClick={handleRemoveImage}
                        sx={{
                          position: 'absolute',
                          top: 16,
                          right: 16,
                          borderRadius: 2,
                        }}
                      >
                        Remove
                      </Button>
                    </Paper>
                  </motion.div>
                )}

                <form onSubmit={handleGenerate}>
                  <TextField
                    label="Transformation prompt"
                    placeholder="e.g., Transform this into Studio Ghibli style with magical elements"
                    fullWidth
                    multiline
                    rows={3}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    sx={{ mb: 3 }}
                    InputProps={{
                      sx: { fontSize: '1.1rem' },
                    }}
                  />

                  {/* Prompt Suggestions */}
                  <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
                    Quick Ideas:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                    {promptSuggestions.map((suggestion, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Chip
                          label={suggestion}
                          variant="outlined"
                          onClick={() => handlePromptSuggestion(suggestion)}
                          sx={{
                            cursor: 'pointer',
                            '&:hover': { backgroundColor: 'primary.light', color: 'primary.contrastText' },
                          }}
                        />
                      </motion.div>
                    ))}
                  </Box>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      size="large"
                      disabled={isLoading || !image || !prompt.trim()}
                      startIcon={<AutoAwesome />}
                      sx={{
                        py: 2,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        borderRadius: 3,
                        background: 'linear-gradient(45deg, #2196F3, #21CBF3)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #1976D2, #0288D1)',
                        },
                      }}
                    >
                      {isLoading ? 'Transforming...' : 'Transform Image'}
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </Grid>

          {/* Result Section */}
          <Grid item xs={12} lg={6}>
            <Card sx={{ minHeight: 500 }}>
              <CardContent sx={{ p: 4, height: '100%' }}>
                {isLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
                    <CircularProgress size={60} />
                  </Box>
                ) : result ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                        Transformed Image
                      </Typography>
                      
                      {/* Before/After Comparison */}
                      <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid item xs={6}>
                          <Typography variant="subtitle2" sx={{ mb: 1 }}>Original</Typography>
                          <Box
                            component="img"
                            src={imagePreview}
                            alt="Original"
                            sx={{
                              width: '100%',
                              height: 150,
                              objectFit: 'cover',
                              borderRadius: 1,
                              border: '2px solid',
                              borderColor: 'grey.300',
                            }}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="subtitle2" sx={{ mb: 1 }}>Transformed</Typography>
                          <Box
                            component="img"
                            src={result}
                            alt="Transformed"
                            sx={{
                              width: '100%',
                              height: 150,
                              objectFit: 'cover',
                              borderRadius: 1,
                              border: '2px solid',
                              borderColor: 'primary.main',
                            }}
                          />
                        </Grid>
                      </Grid>

                      <Box
                        component="img"
                        src={result}
                        alt="Generated Art"
                        sx={{
                          width: '100%',
                          maxHeight: 400,
                          objectFit: 'contain',
                          borderRadius: 2,
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                          mb: 3,
                        }}
                      />
                      <Button
                        variant="contained"
                        startIcon={<Send />}
                        onClick={handleDownload}
                        sx={{ borderRadius: 3 }}
                      >
                        Download Transformation
                      </Button>
                    </Box>
                  </motion.div>
                ) : (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                      textAlign: 'center',
                      color: 'text.secondary',
                    }}
                  >
                    <AutoAwesome sx={{ fontSize: 80, mb: 2, opacity: 0.5 }} />
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      Ready to Transform?
                    </Typography>
                    <Typography variant="body2">
                      Upload an image and add your transformation prompt to see the magic happen
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </motion.div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert severity="error" onClose={() => setSnackbarOpen(false)}>
          {snackbarOpen}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default UploadPage;
