import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  Button,
  Stack,
  Divider,
  Avatar,
  Alert,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@mui/lab';
import {
  Search,
  Delete,
  Restore,
  Download,
  Share,
  Image as ImageIcon,
  PhotoLibrary,
  DeleteForever,
  FilterList,
  Refresh,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';

const History = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('timeline'); // 'timeline' or 'grid'
  const [selectedItems, setSelectedItems] = useState(new Set());
  
  const { generationHistory = [] } = useApp();

  // Mock history data for demonstration
  const mockHistory = [
    {
      id: 1,
      type: 'text-to-image',
      prompt: 'Magical forest with glowing spirits',
      style: 'Studio Ghibli',
      imageUrl: '/api/placeholder/300/200',
      createdAt: '2024-01-20T10:30:00Z',
      status: 'completed',
      processingTime: 15,
      seed: 42,
      model: 'SDXL-1.0',
    },
    {
      id: 2,
      type: 'image-to-image',
      prompt: 'Transform to fantasy castle',
      style: 'Fantasy',
      imageUrl: '/api/placeholder/300/200',
      originalUrl: '/api/placeholder/150/100',
      createdAt: '2024-01-20T09:15:00Z',
      status: 'completed',
      processingTime: 23,
      seed: 123,
      model: 'SDXL-1.0',
    },
    {
      id: 3,
      type: 'text-to-image',
      prompt: 'Dragon soaring through stormy clouds',
      style: 'Anime',
      imageUrl: '/api/placeholder/300/200',
      createdAt: '2024-01-19T16:45:00Z',
      status: 'completed',
      processingTime: 18,
      seed: 789,
      model: 'SDXL-1.0',
    },
    {
      id: 4,
      type: 'text-to-image',
      prompt: 'Peaceful village by the sea at sunset',
      style: 'Watercolor',
      imageUrl: '/api/placeholder/300/200',
      createdAt: '2024-01-19T14:22:00Z',
      status: 'failed',
      error: 'Content policy violation',
      model: 'SDXL-1.0',
    },
    {
      id: 5,
      type: 'image-to-image',
      prompt: 'Add magical elements',
      style: 'Fantasy',
      imageUrl: '/api/placeholder/300/200',
      originalUrl: '/api/placeholder/150/100',
      createdAt: '2024-01-18T11:30:00Z',
      status: 'completed',
      processingTime: 31,
      seed: 456,
      model: 'SDXL-1.0',
    },
    {
      id: 6,
      type: 'text-to-image',
      prompt: 'Enchanted garden with butterflies',
      style: 'Studio Ghibli',
      imageUrl: '/api/placeholder/300/200',
      createdAt: '2024-01-17T08:45:00Z',
      status: 'completed',
      processingTime: 12,
      seed: 321,
      model: 'SDXL-1.0',
    },
  ];

  const allHistory = [...generationHistory, ...mockHistory];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'failed': return 'error';
      case 'processing': return 'warning';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <ImageIcon />;
      case 'failed': return <DeleteForever />;
      case 'processing': return <Refresh />;
      default: return <ImageIcon />;
    }
  };

  const getTypeColor = (type) => {
    return type === 'text-to-image' ? 'primary' : 'secondary';
  };

  const filteredHistory = allHistory
    .filter(item => 
      item.prompt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.style?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const handleDownload = (item) => {
    if (item.imageUrl && item.status === 'completed') {
      const a = document.createElement('a');
      a.href = item.imageUrl;
      a.download = `gibili-art-${item.id}.png`;
      a.click();
    }
  };

  const handleShare = (item) => {
    if (navigator.share) {
      navigator.share({
        title: 'Check out this GIBILI AI artwork!',
        text: item.prompt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleSelectItem = (itemId) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const handleDeleteSelected = () => {
    // In a real app, this would call an API to delete items
    console.log('Deleting items:', Array.from(selectedItems));
    setSelectedItems(new Set());
  };

  const handleRetry = (item) => {
    // In a real app, this would resubmit the generation request
    console.log('Retrying generation for:', item);
  };

  const formatDuration = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const renderTimelineView = () => (
    <Timeline position="alternate">
      {filteredHistory.map((item, index) => (
        <TimelineItem key={item.id}>
          <TimelineOppositeContent sx={{ m: 'auto 0' }} variant="body2" color="text.secondary">
            {formatDate(item.createdAt)}
          </TimelineOppositeContent>
          
          <TimelineSeparator>
            <TimelineDot
              color={getStatusColor(item.status)}
              variant={item.status === 'completed' ? 'filled' : 'outlined'}
            >
              {getStatusIcon(item.status)}
            </TimelineDot>
            {index < filteredHistory.length - 1 && <TimelineConnector />}
          </TimelineSeparator>
          
          <TimelineContent sx={{ py: '12px', px: 2 }}>
            <motion.div
              initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                sx={{
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': { boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)' },
                  opacity: selectedItems.has(item.id) ? 0.7 : 1,
                  border: selectedItems.has(item.id) ? '2px solid' : 'none',
                  borderColor: 'primary.main',
                }}
                onClick={() => handleSelectItem(item.id)}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Chip
                      label={item.type}
                      color={getTypeColor(item.type)}
                      size="small"
                    />
                    <Chip
                      label={item.style}
                      variant="outlined"
                      size="small"
                    />
                    <Chip
                      label={item.status}
                      color={getStatusColor(item.status)}
                      size="small"
                    />
                  </Box>

                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {item.prompt}
                  </Typography>

                  {item.status === 'completed' && (
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      {item.originalUrl && (
                        <Box>
                          <Typography variant="caption" color="text.secondary">Original</Typography>
                          <Box
                            component="img"
                            src={item.originalUrl}
                            alt="Original"
                            sx={{
                              width: 80,
                              height: 60,
                              objectFit: 'cover',
                              borderRadius: 1,
                              border: '1px solid',
                              borderColor: 'divider',
                            }}
                          />
                        </Box>
                      )}
                      <Box>
                        <Typography variant="caption" color="text.secondary">Generated</Typography>
                        <Box
                          component="img"
                          src={item.imageUrl}
                          alt="Generated"
                          sx={{
                            width: 120,
                            height: 80,
                            objectFit: 'cover',
                            borderRadius: 1,
                            border: '1px solid',
                            borderColor: 'divider',
                          }}
                        />
                      </Box>
                    </Box>
                  )}

                  {item.status === 'failed' && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {item.error || 'Generation failed'}
                    </Alert>
                  )}

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Box>
                      {item.processingTime && (
                        <Typography variant="caption" color="text.secondary">
                          Processing time: {formatDuration(item.processingTime)}
                        </Typography>
                      )}
                      {item.seed && (
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                          Seed: {item.seed}
                        </Typography>
                      )}
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {item.status === 'completed' && (
                        <>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(item);
                            }}
                          >
                            <Download />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShare(item);
                            }}
                          >
                            <Share />
                          </IconButton>
                        </>
                      )}
                      {item.status === 'failed' && (
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRetry(item);
                          }}
                        >
                          <Restore />
                        </IconButton>
                      )}
                      <IconButton
                        size="small"
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectItem(item.id);
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );

  const renderGridView = () => (
    <Grid container spacing={3}>
      {filteredHistory.map((item, index) => (
        <Grid item xs={12} sm={6} md={4} key={item.id}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card
              sx={{
                height: '100%',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': { boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)' },
                opacity: selectedItems.has(item.id) ? 0.7 : 1,
                border: selectedItems.has(item.id) ? '2px solid' : 'none',
                borderColor: 'primary.main',
              }}
              onClick={() => handleSelectItem(item.id)}
            >
              {item.status === 'completed' && item.imageUrl && (
                <CardMedia
                  component="img"
                  height="200"
                  image={item.imageUrl}
                  alt={item.prompt}
                  sx={{ objectFit: 'cover' }}
                />
              )}
              
              <CardContent>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Chip
                    label={item.type}
                    color={getTypeColor(item.type)}
                    size="small"
                  />
                  <Chip
                    label={item.status}
                    color={getStatusColor(item.status)}
                    size="small"
                  />
                </Box>

                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 500,
                    mb: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {item.prompt}
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  {formatDate(item.createdAt)}
                </Typography>

                {item.status === 'failed' && (
                  <Alert severity="error" sx={{ mt: 1, fontSize: '0.75rem' }}>
                    {item.error || 'Generation failed'}
                  </Alert>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
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
            Generation History
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Track your AI art generation journey and manage your creations
          </Typography>
        </Box>

        {/* Controls */}
        <Box sx={{ mb: 4 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
            <TextField
              fullWidth
              placeholder="Search your history..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{
                maxWidth: { md: 400 },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
            />

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant={viewMode === 'timeline' ? 'contained' : 'outlined'}
                startIcon={<FilterList />}
                onClick={() => setViewMode('timeline')}
              >
                Timeline
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'contained' : 'outlined'}
                startIcon={<PhotoLibrary />}
                onClick={() => setViewMode('grid')}
              >
                Grid
              </Button>
            </Box>

            {selectedItems.size > 0 && (
              <Button
                variant="contained"
                color="error"
                startIcon={<Delete />}
                onClick={handleDeleteSelected}
              >
                Delete ({selectedItems.size})
              </Button>
            )}
          </Stack>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* Content */}
        {filteredHistory.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                mx: 'auto',
                mb: 2,
                bgcolor: 'primary.main',
              }}
            >
              <ImageIcon sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              No generation history
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Start creating amazing AI art to build your history
            </Typography>
          </Box>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={viewMode}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {viewMode === 'timeline' ? renderTimelineView() : renderGridView()}
            </motion.div>
          </AnimatePresence>
        )}
      </motion.div>
    </Container>
  );
};

export default History;
