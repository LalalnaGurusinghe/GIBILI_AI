import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Menu,
  MenuItem,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import {
  Search,
  FilterList,
  Download,
  Share,
  Favorite,
  FavoriteBorder,
  PhotoCamera,
  Close,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';

const Gallery = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [filterAnchor, setFilterAnchor] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [favorites, setFavorites] = useState(new Set());

  const { generatedImages } = useApp();

  // Mock data for demonstration since generatedImages might be empty
  const mockImages = [
    {
      id: 1,
      url: '/api/placeholder/400/300',
      prompt: 'Magical forest with glowing spirits',
      style: 'Studio Ghibli',
      type: 'text-to-image',
      createdAt: '2024-01-20T10:30:00Z',
      likes: 23,
      downloads: 12,
    },
    {
      id: 2,
      url: '/api/placeholder/400/300',
      prompt: 'Dragon soaring through clouds',
      style: 'Anime',
      type: 'text-to-image',
      createdAt: '2024-01-19T15:45:00Z',
      likes: 45,
      downloads: 28,
    },
    {
      id: 3,
      url: '/api/placeholder/400/300',
      prompt: 'Castle in the sky transformation',
      style: 'Fantasy',
      type: 'image-to-image',
      createdAt: '2024-01-18T08:20:00Z',
      likes: 67,
      downloads: 34,
    },
    {
      id: 4,
      url: '/api/placeholder/400/300',
      prompt: 'Peaceful village by the sea',
      style: 'Watercolor',
      type: 'text-to-image',
      createdAt: '2024-01-17T14:15:00Z',
      likes: 12,
      downloads: 8,
    },
    {
      id: 5,
      url: '/api/placeholder/400/300',
      prompt: 'Enchanted garden with butterflies',
      style: 'Studio Ghibli',
      type: 'text-to-image',
      createdAt: '2024-01-16T11:00:00Z',
      likes: 89,
      downloads: 45,
    },
    {
      id: 6,
      url: '/api/placeholder/400/300',
      prompt: 'Mystical creature in moonlight',
      style: 'Digital Art',
      type: 'image-to-image',
      createdAt: '2024-01-15T16:30:00Z',
      likes: 34,
      downloads: 19,
    },
  ];

  const allImages = [...generatedImages, ...mockImages];

  const filterOptions = [
    { value: 'all', label: 'All Images' },
    { value: 'text-to-image', label: 'Text to Image' },
    { value: 'image-to-image', label: 'Image to Image' },
    { value: 'favorites', label: 'Favorites' },
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'most-liked', label: 'Most Liked' },
    { value: 'most-downloaded', label: 'Most Downloaded' },
  ];

  const getStyleColor = (style) => {
    const colors = {
      'Studio Ghibli': '#4CAF50',
      'Anime': '#2196F3',
      'Watercolor': '#9C27B0',
      'Fantasy': '#673AB7',
      'Digital Art': '#E91E63',
      'Oil Painting': '#FF9800',
    };
    return colors[style] || '#757575';
  };

  const filteredImages = allImages
    .filter(image => {
      if (filter === 'favorites') return favorites.has(image.id);
      if (filter === 'all') return true;
      return image.type === filter;
    })
    .filter(image => 
      image.prompt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.style?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'most-liked':
          return (b.likes || 0) - (a.likes || 0);
        case 'most-downloaded':
          return (b.downloads || 0) - (a.downloads || 0);
        default:
          return 0;
      }
    });

  const handleFilterClick = (event) => {
    setFilterAnchor(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchor(null);
  };

  const handleFavorite = (imageId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(imageId)) {
      newFavorites.delete(imageId);
    } else {
      newFavorites.add(imageId);
    }
    setFavorites(newFavorites);
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleDownload = (image) => {
    // In a real app, this would download the actual image
    const a = document.createElement('a');
    a.href = image.url;
    a.download = `gibili-art-${image.id}.png`;
    a.click();
  };

  const handleShare = (image) => {
    if (navigator.share) {
      navigator.share({
        title: 'Check out this GIBILI AI artwork!',
        text: image.prompt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

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
              background: 'linear-gradient(45deg, #9C27B0, #E91E63)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Art Gallery
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Explore the beautiful world of AI-generated Studio Ghibli-style artwork
          </Typography>
        </Box>

        {/* Search and Filters */}
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search by prompt or style..."
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
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                  },
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'center', md: 'flex-end' } }}>
                <Tabs
                  value={filter}
                  onChange={(_, value) => setFilter(value)}
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  {filterOptions.map((option) => (
                    <Tab
                      key={option.value}
                      value={option.value}
                      label={option.label}
                      sx={{ minWidth: 'auto', px: 2 }}
                    />
                  ))}
                </Tabs>

                <IconButton onClick={handleFilterClick} color="primary">
                  <FilterList />
                </IconButton>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Image Grid */}
        <Grid container spacing={3}>
          <AnimatePresence>
            {filteredImages.map((image, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={image.id}>
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ y: -8 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
                      },
                    }}
                    onClick={() => handleImageClick(image)}
                  >
                    <CardMedia
                      component="div"
                      sx={{
                        height: 250,
                        background: `linear-gradient(45deg, ${getStyleColor(image.style)}30, ${getStyleColor(image.style)}10)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      {image.url.includes('placeholder') ? (
                        <PhotoCamera sx={{ fontSize: 60, color: 'white', opacity: 0.7 }} />
                      ) : (
                        <Box
                          component="img"
                          src={image.url}
                          alt={image.prompt}
                          sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      )}
                      
                      {/* Overlay Actions */}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'rgba(0, 0, 0, 0.5)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          opacity: 0,
                          transition: 'opacity 0.3s ease',
                          '&:hover': { opacity: 1 },
                        }}
                      >
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton
                            size="small"
                            sx={{ color: 'white', backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(image);
                            }}
                          >
                            <Download />
                          </IconButton>
                          <IconButton
                            size="small"
                            sx={{ color: 'white', backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShare(image);
                            }}
                          >
                            <Share />
                          </IconButton>
                          <IconButton
                            size="small"
                            sx={{ color: 'white', backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFavorite(image.id);
                            }}
                          >
                            {favorites.has(image.id) ? <Favorite /> : <FavoriteBorder />}
                          </IconButton>
                        </Box>
                      </Box>

                      {/* Style Chip */}
                      <Chip
                        label={image.style}
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 12,
                          left: 12,
                          backgroundColor: getStyleColor(image.style),
                          color: 'white',
                          fontWeight: 600,
                        }}
                      />
                    </CardMedia>

                    <CardContent sx={{ p: 2 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          mb: 1,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          minHeight: 40,
                        }}
                      >
                        {image.prompt}
                      </Typography>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Favorite sx={{ fontSize: 14, color: 'error.main' }} />
                            <Typography variant="caption">{image.likes || 0}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Download sx={{ fontSize: 14, color: 'primary.main' }} />
                            <Typography variant="caption">{image.downloads || 0}</Typography>
                          </Box>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(image.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </AnimatePresence>
        </Grid>

        {filteredImages.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <PhotoCamera sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              No images found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your search or filters
            </Typography>
          </Box>
        )}
      </motion.div>

      {/* Filter Menu */}
      <Menu
        anchorEl={filterAnchor}
        open={Boolean(filterAnchor)}
        onClose={handleFilterClose}
        PaperProps={{
          sx: { borderRadius: 2, border: '1px solid', borderColor: 'divider' },
        }}
      >
        <Typography variant="subtitle2" sx={{ px: 2, py: 1, fontWeight: 600 }}>
          Sort by
        </Typography>
        {sortOptions.map((option) => (
          <MenuItem
            key={option.value}
            selected={sortBy === option.value}
            onClick={() => {
              setSortBy(option.value);
              handleFilterClose();
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>

      {/* Image Dialog */}
      <Dialog
        open={Boolean(selectedImage)}
        onClose={() => setSelectedImage(null)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: 'background.paper',
            borderRadius: 3,
          },
        }}
      >
        {selectedImage && (
          <>
            <DialogContent sx={{ p: 0, position: 'relative' }}>
              <IconButton
                onClick={() => setSelectedImage(null)}
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  zIndex: 1,
                  '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.7)' },
                }}
              >
                <Close />
              </IconButton>
              
              <Box
                component="img"
                src={selectedImage.url}
                alt={selectedImage.prompt}
                sx={{
                  width: '100%',
                  maxHeight: '70vh',
                  objectFit: 'contain',
                  backgroundColor: 'black',
                }}
              />
            </DialogContent>
            
            <DialogActions sx={{ p: 3, flexDirection: 'column', alignItems: 'stretch' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                {selectedImage.prompt}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Chip
                  label={selectedImage.style}
                  sx={{
                    backgroundColor: getStyleColor(selectedImage.style),
                    color: 'white',
                  }}
                />
                <Chip label={selectedImage.type} variant="outlined" />
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  startIcon={<Download />}
                  onClick={() => handleDownload(selectedImage)}
                >
                  Download
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Share />}
                  onClick={() => handleShare(selectedImage)}
                >
                  Share
                </Button>
                <Button
                  variant="outlined"
                  startIcon={favorites.has(selectedImage.id) ? <Favorite /> : <FavoriteBorder />}
                  onClick={() => handleFavorite(selectedImage.id)}
                  color={favorites.has(selectedImage.id) ? 'error' : 'primary'}
                >
                  {favorites.has(selectedImage.id) ? 'Favorited' : 'Add to Favorites'}
                </Button>
              </Box>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default Gallery;
