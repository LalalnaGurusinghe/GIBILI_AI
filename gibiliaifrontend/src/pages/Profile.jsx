import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Button,
  TextField,
  Switch,
  Divider,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Badge,
} from '@mui/material';
import {
  Edit,
  Save,
  Cancel,
  PhotoCamera,
  Palette,
  Timer,
  TrendingUp,
  Notifications,
  Security,
  Help,
  Logout,
  EmojiEvents,
  Share,
  Delete,
  Favorite,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Art Enthusiast',
    email: 'artist@gibili.ai',
    bio: 'Passionate about creating beautiful AI-generated art in the style of Studio Ghibli.',
    location: 'Tokyo, Japan',
    website: 'https://myartportfolio.com',
    joinDate: '2024-01-01',
  });
  const [settings, setSettings] = useState({
    notifications: true,
    publicProfile: true,
    showStats: true,
    autoSave: true,
    darkMode: false,
  });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const stats = {
    totalGenerations: 127,
    successfulGenerations: 119,
    favoriteImages: 45,
    downloadsReceived: 234,
    sharesReceived: 89,
    totalProcessingTime: '4h 32m',
    averageProcessingTime: '18s',
    mostUsedStyle: 'Studio Ghibli',
    streak: 12,
  };

  const achievements = [
    { id: 1, name: 'First Creation', description: 'Generated your first image', icon: '🎨', earned: true },
    { id: 2, name: 'Speed Demon', description: 'Generated 10 images in one day', icon: '⚡', earned: true },
    { id: 3, name: 'Art Collector', description: 'Favorited 50 images', icon: '❤️', earned: false },
    { id: 4, name: 'Sharing is Caring', description: 'Shared 25 images', icon: '🤝', earned: true },
    { id: 5, name: 'Master Artist', description: 'Generated 100 images', icon: '👨‍🎨', earned: true },
    { id: 6, name: 'Trendsetter', description: 'One of your images got 100+ downloads', icon: '🔥', earned: false },
  ];

  const recentActivity = [
    { type: 'generation', title: 'Created "Magical Forest"', time: '2 hours ago', icon: <Palette /> },
    { type: 'favorite', title: 'Favorited "Dragon Castle"', time: '5 hours ago', icon: <Favorite /> },
    { type: 'share', title: 'Shared "Peaceful Village"', time: '1 day ago', icon: <Share /> },
    { type: 'achievement', title: 'Earned "Master Artist" badge', time: '2 days ago', icon: <EmojiEvents /> },
  ];

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    // In a real app, this would save to backend
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset changes
    setIsEditing(false);
  };

  const handleSettingChange = (setting) => (event) => {
    setSettings(prev => ({
      ...prev,
      [setting]: event.target.checked,
    }));
  };

  const handleDeleteAccount = () => {
    setShowDeleteDialog(true);
  };

  const confirmDeleteAccount = () => {
    // In a real app, this would delete the account
    console.log('Account deletion confirmed');
    setShowDeleteDialog(false);
  };

  const handleProfileImageUpload = () => {
    // In a real app, this would handle image upload
    console.log('Profile image upload');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Grid container spacing={4}>
          {/* Profile Section */}
          <Grid item xs={12} md={4}>
            <Card sx={{ textAlign: 'center', position: 'relative' }}>
              <CardContent sx={{ pt: 4 }}>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    <IconButton
                      size="small"
                      sx={{
                        backgroundColor: 'primary.main',
                        color: 'white',
                        '&:hover': { backgroundColor: 'primary.dark' },
                      }}
                      onClick={handleProfileImageUpload}
                    >
                      <PhotoCamera sx={{ fontSize: 16 }} />
                    </IconButton>
                  }
                >
                  <Avatar
                    sx={{
                      width: 120,
                      height: 120,
                      mx: 'auto',
                      mb: 2,
                      fontSize: '3rem',
                      background: 'linear-gradient(45deg, #9C27B0, #E91E63)',
                    }}
                  >
                    🎨
                  </Avatar>
                </Badge>

                {isEditing ? (
                  <Stack spacing={2} sx={{ mt: 2 }}>
                    <TextField
                      fullWidth
                      label="Name"
                      value={profileData.name}
                      onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                    />
                    <TextField
                      fullWidth
                      label="Email"
                      value={profileData.email}
                      onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    />
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Bio"
                      value={profileData.bio}
                      onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                    />
                    <TextField
                      fullWidth
                      label="Location"
                      value={profileData.location}
                      onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                    />
                    <TextField
                      fullWidth
                      label="Website"
                      value={profileData.website}
                      onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
                    />
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="contained"
                        startIcon={<Save />}
                        onClick={handleSave}
                        fullWidth
                      >
                        Save
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<Cancel />}
                        onClick={handleCancel}
                        fullWidth
                      >
                        Cancel
                      </Button>
                    </Box>
                  </Stack>
                ) : (
                  <>
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                      {profileData.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {profileData.email}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {profileData.bio}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                      📍 {profileData.location}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                      🌐 {profileData.website}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 3, display: 'block' }}>
                      Member since {new Date(profileData.joinDate).toLocaleDateString()}
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<Edit />}
                      onClick={handleEditToggle}
                      fullWidth
                    >
                      Edit Profile
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  🏆 Achievements
                </Typography>
                <Grid container spacing={1}>
                  {achievements.map((achievement) => (
                    <Grid item xs={4} key={achievement.id}>
                      <Box
                        sx={{
                          textAlign: 'center',
                          p: 1,
                          borderRadius: 2,
                          backgroundColor: achievement.earned ? 'primary.main' : 'grey.200',
                          color: achievement.earned ? 'white' : 'text.disabled',
                          opacity: achievement.earned ? 1 : 0.5,
                          transition: 'all 0.3s ease',
                        }}
                      >
                        <Typography variant="h6">{achievement.icon}</Typography>
                        <Typography variant="caption" sx={{ fontSize: '0.6rem' }}>
                          {achievement.name}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Main Content */}
          <Grid item xs={12} md={8}>
            {/* Stats */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  📊 Your Statistics
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
                        {stats.totalGenerations}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Total Generations
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="success.main" sx={{ fontWeight: 700 }}>
                        {Math.round((stats.successfulGenerations / stats.totalGenerations) * 100)}%
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Success Rate
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="error.main" sx={{ fontWeight: 700 }}>
                        {stats.favoriteImages}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Favorites
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="warning.main" sx={{ fontWeight: 700 }}>
                        {stats.streak}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Day Streak
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Most Used Style
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip label={stats.mostUsedStyle} color="primary" />
                      <LinearProgress
                        variant="determinate"
                        value={75}
                        sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Processing Efficiency
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Timer color="action" />
                      <Typography variant="body2">
                        Avg: {stats.averageProcessingTime} | Total: {stats.totalProcessingTime}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  📈 Recent Activity
                </Typography>
                <List>
                  {recentActivity.map((activity, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon>{activity.icon}</ListItemIcon>
                      <ListItemText
                        primary={activity.title}
                        secondary={activity.time}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>

            {/* Settings */}
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  ⚙️ Settings
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Notifications />
                    </ListItemIcon>
                    <ListItemText
                      primary="Notifications"
                      secondary="Receive updates about your generations"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.notifications}
                        onChange={handleSettingChange('notifications')}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>

                  <ListItem>
                    <ListItemIcon>
                      <Security />
                    </ListItemIcon>
                    <ListItemText
                      primary="Public Profile"
                      secondary="Allow others to see your profile"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.publicProfile}
                        onChange={handleSettingChange('publicProfile')}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>

                  <ListItem>
                    <ListItemIcon>
                      <TrendingUp />
                    </ListItemIcon>
                    <ListItemText
                      primary="Show Statistics"
                      secondary="Display your stats on profile"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.showStats}
                        onChange={handleSettingChange('showStats')}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>

                  <ListItem>
                    <ListItemIcon>
                      <Save />
                    </ListItemIcon>
                    <ListItemText
                      primary="Auto-save"
                      secondary="Automatically save your work"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={settings.autoSave}
                        onChange={handleSettingChange('autoSave')}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>

                  <Divider sx={{ my: 2 }} />

                  <ListItem button>
                    <ListItemIcon>
                      <Help />
                    </ListItemIcon>
                    <ListItemText primary="Help & Support" />
                  </ListItem>

                  <ListItem button onClick={handleDeleteAccount}>
                    <ListItemIcon>
                      <Delete />
                    </ListItemIcon>
                    <ListItemText
                      primary="Delete Account"
                      secondary="Permanently delete your account and data"
                    />
                  </ListItem>

                  <ListItem button>
                    <ListItemIcon>
                      <Logout />
                    </ListItemIcon>
                    <ListItemText primary="Sign Out" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </motion.div>

      {/* Delete Account Dialog */}
      <Dialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete your account? This action cannot be undone and will
            permanently remove all your data, including generated images and settings.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
          <Button onClick={confirmDeleteAccount} color="error" variant="contained">
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile;
