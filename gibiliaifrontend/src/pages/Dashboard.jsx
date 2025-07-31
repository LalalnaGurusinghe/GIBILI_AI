import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Paper,
  Avatar,
  IconButton,
} from '@mui/material';
import {
  Palette,
  PhotoCamera,
  TrendingUp,
  Star,
  Download,
  Share,
  Favorite,
  PlayArrow,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';

const Dashboard = () => {
  const navigate = useNavigate();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const stats = [
    { title: 'Images Generated', value: '127', icon: <PhotoCamera />, color: '#4CAF50' },
    { title: 'Total Downloads', value: '89', icon: <Download />, color: '#2196F3' },
    { title: 'Likes Received', value: '342', icon: <Favorite />, color: '#E91E63' },
    { title: 'Trending Score', value: '94%', icon: <TrendingUp />, color: '#FF9800' },
  ];

  const recentGenerations = [
    {
      id: 1,
      title: 'Magical Forest Scene',
      prompt: 'Enchanted forest with floating spirits',
      style: 'Studio Ghibli',
      image: '/api/placeholder/300/200',
      likes: 23,
      downloads: 12,
      createdAt: '2 hours ago',
    },
    {
      id: 2,
      title: 'Dragon in Clouds',
      prompt: 'Majestic dragon soaring through clouds',
      style: 'Anime',
      image: '/api/placeholder/300/200',
      likes: 45,
      downloads: 28,
      createdAt: '5 hours ago',
    },
    {
      id: 3,
      title: 'Castle in the Sky',
      prompt: 'Floating castle surrounded by clouds',
      style: 'Studio Ghibli',
      image: '/api/placeholder/300/200',
      likes: 67,
      downloads: 34,
      createdAt: '1 day ago',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <Box sx={{ minHeight: '100vh', pb: 4 }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(139, 195, 74, 0.1) 100%)',
          py: 8,
          mb: 4,
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                mb: 2,
                background: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textAlign: 'center',
              }}
            >
              Welcome to GIBILI AI
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: 'text.secondary',
                mb: 4,
                textAlign: 'center',
                maxWidth: '600px',
                mx: 'auto',
              }}
            >
              Transform your imagination into stunning Studio Ghibli-style artwork with the power of AI
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<Palette />}
                  onClick={() => navigate('/generate')}
                  sx={{
                    py: 1.5,
                    px: 4,
                    fontSize: '1.1rem',
                    borderRadius: 3,
                  }}
                >
                  Start Creating
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<PlayArrow />}
                  onClick={() => navigate('/tutorial')}
                  sx={{
                    py: 1.5,
                    px: 4,
                    fontSize: '1.1rem',
                    borderRadius: 3,
                  }}
                >
                  Watch Tutorial
                </Button>
              </motion.div>
            </Box>
          </motion.div>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {/* Stats Section */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
            Your Statistics
          </Typography>
          
          <Grid container spacing={3} sx={{ mb: 6 }}>
            {stats.map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div variants={itemVariants}>
                  <Card
                    sx={{
                      height: '100%',
                      background: `linear-gradient(135deg, ${stat.color}15, ${stat.color}05)`,
                      border: `1px solid ${stat.color}30`,
                    }}
                  >
                    <CardContent sx={{ textAlign: 'center', py: 3 }}>
                      <Avatar
                        sx={{
                          bgcolor: stat.color,
                          mx: 'auto',
                          mb: 2,
                          width: 56,
                          height: 56,
                        }}
                      >
                        {stat.icon}
                      </Avatar>
                      <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, color: stat.color }}>
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {stat.title}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          {/* Recent Generations */}
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
            Recent Creations
          </Typography>
          
          <Grid container spacing={3}>
            {recentGenerations.map((item, index) => (
              <Grid item xs={12} md={4} key={item.id}>
                <motion.div
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card sx={{ height: '100%' }}>
                    <CardMedia
                      component="div"
                      sx={{
                        height: 200,
                        background: `linear-gradient(45deg, #4CAF50${Math.floor(Math.random() * 9)}0, #8BC34A${Math.floor(Math.random() * 9)}0)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                      }}
                    >
                      <PhotoCamera sx={{ fontSize: 60, color: 'white', opacity: 0.7 }} />
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                        }}
                      >
                        <Chip
                          label={item.style}
                          size="small"
                          sx={{
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            color: 'text.primary',
                          }}
                        />
                      </Box>
                    </CardMedia>
                    
                    <CardContent>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        {item.title}
                      </Typography>
                      
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2, minHeight: 40 }}
                      >
                        {item.prompt}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Favorite sx={{ fontSize: 16, color: 'error.main' }} />
                            <Typography variant="caption">{item.likes}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Download sx={{ fontSize: 16, color: 'primary.main' }} />
                            <Typography variant="caption">{item.downloads}</Typography>
                          </Box>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {item.createdAt}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton size="small" color="primary">
                          <Download />
                        </IconButton>
                        <IconButton size="small" color="primary">
                          <Share />
                        </IconButton>
                        <IconButton size="small" color="error">
                          <Favorite />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          {/* Quick Actions */}
          <Paper
            sx={{
              mt: 6,
              p: 4,
              background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(139, 195, 74, 0.05) 100%)',
              border: '1px solid rgba(76, 175, 80, 0.2)',
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}>
              Ready to create something amazing?
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="contained"
                  startIcon={<Palette />}
                  onClick={() => navigate('/generate')}
                  sx={{ borderRadius: 3 }}
                >
                  Text to Image
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outlined"
                  startIcon={<PhotoCamera />}
                  onClick={() => navigate('/upload')}
                  sx={{ borderRadius: 3 }}
                >
                  Image to Image
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="text"
                  startIcon={<Star />}
                  onClick={() => navigate('/gallery')}
                  sx={{ borderRadius: 3 }}
                >
                  Explore Gallery
                </Button>
              </motion.div>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Dashboard;
