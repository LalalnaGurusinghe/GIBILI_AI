import React, { useState } from 'react';
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
  Chip,
  Paper,
  Slider,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Palette,
  AutoAwesome,
  Style,
  Tune,
  Send,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';

const GeneratePage = () => {
  const [text, setText] = useState('');
  const [style, setStyle] = useState('general');
  const [advanced, setAdvanced] = useState(false);
  const [steps, setSteps] = useState(30);
  const [guidanceScale, setGuidanceScale] = useState(7);
  const [result, setResult] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const { isLoading, setLoading, setError, addGeneratedImage } = useApp();

  const styles = [
    { value: 'general', label: 'Studio Ghibli', color: '#4CAF50' },
    { value: 'anime', label: 'Anime', color: '#2196F3' },
    { value: 'watercolor', label: 'Watercolor', color: '#9C27B0' },
    { value: 'oil_painting', label: 'Oil Painting', color: '#FF9800' },
    { value: 'digital_art', label: 'Digital Art', color: '#E91E63' },
    { value: 'fantasy', label: 'Fantasy', color: '#673AB7' },
  ];

  const promptSuggestions = [
    'A magical forest with glowing spirits',
    'Flying castle in the clouds',
    'Peaceful village by the sea',
    'Dragon soaring through mountains',
    'Enchanted garden with butterflies',
    'Mystical creature in moonlight',
  ];

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setError('Please enter a description');
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('http://localhost:8080/api/v1/generateGibiliArtFromText', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text, 
          style,
          steps: advanced ? steps : 30,
          guidance_scale: advanced ? guidanceScale : 7,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setResult(imageUrl);

      // Add to generated images
      const newImage = {
        id: Date.now(),
        url: imageUrl,
        prompt: text,
        style,
        createdAt: new Date().toISOString(),
        type: 'text-to-image',
      };
      addGeneratedImage(newImage);

    } catch (err) {
      setError(err.message || 'Failed to generate image');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handlePromptSuggestion = (suggestion) => {
    setText(suggestion);
  };

  const handleDownload = () => {
    if (result) {
      const a = document.createElement('a');
      a.href = result;
      a.download = `gibili-art-${Date.now()}.png`;
      a.click();
    }
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
              background: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Text to Image Generator
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Describe your vision and watch it come to life in stunning Studio Ghibli style
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Input Section */}
          <Grid item xs={12} lg={6}>
            <Card sx={{ height: 'fit-content', position: 'sticky', top: 100 }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Palette sx={{ mr: 2, color: 'primary.main' }} />
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    Create Your Art
                  </Typography>
                </Box>

                <form onSubmit={handleGenerate}>
                  <TextField
                    label="Describe your scene"
                    placeholder="e.g., A magical forest with glowing spirits dancing around ancient trees"
                    fullWidth
                    multiline
                    rows={4}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
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

                  {/* Style Selection */}
                  <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                    <Style sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Art Style
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                    {styles.map((styleOption) => (
                      <motion.div
                        key={styleOption.value}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Chip
                          label={styleOption.label}
                          variant={style === styleOption.value ? 'filled' : 'outlined'}
                          onClick={() => setStyle(styleOption.value)}
                          sx={{
                            cursor: 'pointer',
                            backgroundColor: style === styleOption.value ? styleOption.color : 'transparent',
                            borderColor: styleOption.color,
                            color: style === styleOption.value ? 'white' : styleOption.color,
                            '&:hover': {
                              backgroundColor: styleOption.color,
                              color: 'white',
                            },
                          }}
                        />
                      </motion.div>
                    ))}
                  </Box>

                  {/* Advanced Settings */}
                  <FormControlLabel
                    control={
                      <Switch
                        checked={advanced}
                        onChange={(e) => setAdvanced(e.target.checked)}
                        color="primary"
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Tune sx={{ mr: 1 }} />
                        Advanced Settings
                      </Box>
                    }
                    sx={{ mb: 2 }}
                  />

                  {advanced && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3 }}
                    >
                      <Paper sx={{ p: 3, mb: 3, backgroundColor: 'background.default' }}>
                        <Typography variant="subtitle2" sx={{ mb: 2 }}>
                          Generation Steps: {steps}
                        </Typography>
                        <Slider
                          value={steps}
                          onChange={(_, value) => setSteps(value)}
                          min={10}
                          max={50}
                          marks={[
                            { value: 10, label: '10' },
                            { value: 30, label: '30' },
                            { value: 50, label: '50' },
                          ]}
                          sx={{ mb: 3 }}
                        />

                        <Typography variant="subtitle2" sx={{ mb: 2 }}>
                          Guidance Scale: {guidanceScale}
                        </Typography>
                        <Slider
                          value={guidanceScale}
                          onChange={(_, value) => setGuidanceScale(value)}
                          min={1}
                          max={20}
                          step={0.5}
                          marks={[
                            { value: 1, label: '1' },
                            { value: 7, label: '7' },
                            { value: 20, label: '20' },
                          ]}
                        />
                      </Paper>
                    </motion.div>
                  )}

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      size="large"
                      disabled={isLoading || !text.trim()}
                      startIcon={<AutoAwesome />}
                      sx={{
                        py: 2,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        borderRadius: 3,
                        background: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #2E7D32, #689F38)',
                        },
                      }}
                    >
                      {isLoading ? 'Generating...' : 'Generate Art'}
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
                        Your Masterpiece
                      </Typography>
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
                        Download Image
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
                      Ready to Create Magic?
                    </Typography>
                    <Typography variant="body2">
                      Enter your description and click "Generate Art" to see your vision come to life
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
          Failed to generate image. Please try again.
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default GeneratePage;
