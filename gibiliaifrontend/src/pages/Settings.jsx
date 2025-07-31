import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Switch,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  TextField,
  Button,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
} from '@mui/material';
import {
  Palette,
  Notifications,
  Security,
  Storage,
  Download,
  Settings as SettingsIcon,
  ExpandMore,
  CloudDownload,
  Brightness4,
  SaveAlt,
  RestartAlt,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const Settings = () => {
  const [settings, setSettings] = useState({
    // Generation Settings
    defaultStyle: 'Studio Ghibli',
    defaultDimensions: '1024x1024',
    autoSave: true,
    processingQuality: 'high',
    seedConsistency: false,
    
    // UI/UX Settings
    darkMode: false,
    animations: true,
    soundEffects: true,
    compactView: false,
    autoPreview: true,
    
    // Notification Settings
    generationComplete: true,
    generationFailed: true,
    weeklyDigest: true,
    promotionalEmails: false,
    browserNotifications: true,
    
    // Privacy Settings
    publicProfile: true,
    showStats: true,
    allowDataCollection: false,
    shareUsageData: false,
    
    // Storage Settings
    autoDeleteOldImages: false,
    maxStorageSize: 500, // MB
    backupFrequency: 'weekly',
    cloudSync: false,
    
    // Advanced Settings
    apiTimeout: 60, // seconds
    retryAttempts: 3,
    debugMode: false,
    betaFeatures: false,
  });

  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);

  const styleOptions = [
    'Studio Ghibli',
    'Anime',
    'Watercolor',
    'Oil Painting',
    'Digital Art',
    'Fantasy',
    'Realistic',
    'Abstract',
  ];

  const dimensionOptions = [
    '512x512',
    '768x768',
    '1024x1024',
    '1152x896',
    '896x1152',
    '1216x832',
    '832x1216',
  ];

  const qualityOptions = [
    { value: 'draft', label: 'Draft (Fast)' },
    { value: 'standard', label: 'Standard' },
    { value: 'high', label: 'High Quality' },
    { value: 'ultra', label: 'Ultra (Slow)' },
  ];

  const backupOptions = [
    { value: 'never', label: 'Never' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
  ];

  const handleSettingChange = (category, setting) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setSettings(prev => ({
      ...prev,
      [setting]: value,
    }));
  };

  const handleSliderChange = (setting) => (event, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value,
    }));
  };

  const handleReset = () => {
    setSettings({
      defaultStyle: 'Studio Ghibli',
      defaultDimensions: '1024x1024',
      autoSave: true,
      processingQuality: 'high',
      seedConsistency: false,
      darkMode: false,
      animations: true,
      soundEffects: true,
      compactView: false,
      autoPreview: true,
      generationComplete: true,
      generationFailed: true,
      weeklyDigest: true,
      promotionalEmails: false,
      browserNotifications: true,
      publicProfile: true,
      showStats: true,
      allowDataCollection: false,
      shareUsageData: false,
      autoDeleteOldImages: false,
      maxStorageSize: 500,
      backupFrequency: 'weekly',
      cloudSync: false,
      apiTimeout: 60,
      retryAttempts: 3,
      debugMode: false,
      betaFeatures: false,
    });
    setShowResetDialog(false);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `gibili-settings-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    setShowExportDialog(false);
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target.result);
          setSettings(prev => ({ ...prev, ...importedSettings }));
        } catch (error) {
          console.error('Invalid settings file');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
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
              background: 'linear-gradient(45deg, #673AB7, #9C27B0)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Settings
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Customize your GIBILI AI experience to match your preferences
          </Typography>
        </Box>

        {/* Settings Sections */}
        <Grid container spacing={3}>
          {/* Generation Settings */}
          <Grid item xs={12} md={6}>
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Palette color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Generation Settings
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={3}>
                  <FormControl fullWidth>
                    <InputLabel>Default Style</InputLabel>
                    <Select
                      value={settings.defaultStyle}
                      onChange={handleSettingChange('generation', 'defaultStyle')}
                      label="Default Style"
                    >
                      {styleOptions.map((style) => (
                        <MenuItem key={style} value={style}>
                          {style}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel>Default Dimensions</InputLabel>
                    <Select
                      value={settings.defaultDimensions}
                      onChange={handleSettingChange('generation', 'defaultDimensions')}
                      label="Default Dimensions"
                    >
                      {dimensionOptions.map((dimension) => (
                        <MenuItem key={dimension} value={dimension}>
                          {dimension}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel>Processing Quality</InputLabel>
                    <Select
                      value={settings.processingQuality}
                      onChange={handleSettingChange('generation', 'processingQuality')}
                      label="Processing Quality"
                    >
                      {qualityOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.autoSave}
                        onChange={handleSettingChange('generation', 'autoSave')}
                      />
                    }
                    label="Auto-save generated images"
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.seedConsistency}
                        onChange={handleSettingChange('generation', 'seedConsistency')}
                      />
                    }
                    label="Use consistent seeds for similar results"
                  />
                </Stack>
              </AccordionDetails>
            </Accordion>
          </Grid>

          {/* UI/UX Settings */}
          <Grid item xs={12} md={6}>
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Brightness4 color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Interface
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={3}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.darkMode}
                        onChange={handleSettingChange('ui', 'darkMode')}
                      />
                    }
                    label="Dark mode"
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.animations}
                        onChange={handleSettingChange('ui', 'animations')}
                      />
                    }
                    label="Enable animations"
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.soundEffects}
                        onChange={handleSettingChange('ui', 'soundEffects')}
                      />
                    }
                    label="Sound effects"
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.compactView}
                        onChange={handleSettingChange('ui', 'compactView')}
                      />
                    }
                    label="Compact view"
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.autoPreview}
                        onChange={handleSettingChange('ui', 'autoPreview')}
                      />
                    }
                    label="Auto-preview images"
                  />
                </Stack>
              </AccordionDetails>
            </Accordion>
          </Grid>

          {/* Notification Settings */}
          <Grid item xs={12} md={6}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Notifications color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Notifications
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={3}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.generationComplete}
                        onChange={handleSettingChange('notifications', 'generationComplete')}
                      />
                    }
                    label="Generation complete"
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.generationFailed}
                        onChange={handleSettingChange('notifications', 'generationFailed')}
                      />
                    }
                    label="Generation failed"
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.weeklyDigest}
                        onChange={handleSettingChange('notifications', 'weeklyDigest')}
                      />
                    }
                    label="Weekly digest"
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.promotionalEmails}
                        onChange={handleSettingChange('notifications', 'promotionalEmails')}
                      />
                    }
                    label="Promotional emails"
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.browserNotifications}
                        onChange={handleSettingChange('notifications', 'browserNotifications')}
                      />
                    }
                    label="Browser notifications"
                  />
                </Stack>
              </AccordionDetails>
            </Accordion>
          </Grid>

          {/* Privacy Settings */}
          <Grid item xs={12} md={6}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Security color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Privacy & Security
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={3}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.publicProfile}
                        onChange={handleSettingChange('privacy', 'publicProfile')}
                      />
                    }
                    label="Public profile"
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.showStats}
                        onChange={handleSettingChange('privacy', 'showStats')}
                      />
                    }
                    label="Show statistics"
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.allowDataCollection}
                        onChange={handleSettingChange('privacy', 'allowDataCollection')}
                      />
                    }
                    label="Allow data collection"
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.shareUsageData}
                        onChange={handleSettingChange('privacy', 'shareUsageData')}
                      />
                    }
                    label="Share usage analytics"
                  />

                  <Alert severity="info" sx={{ mt: 2 }}>
                    We respect your privacy. Data collection helps us improve the service.
                  </Alert>
                </Stack>
              </AccordionDetails>
            </Accordion>
          </Grid>

          {/* Storage Settings */}
          <Grid item xs={12} md={6}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Storage color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Storage
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Maximum storage size: {settings.maxStorageSize} MB
                    </Typography>
                    <Slider
                      value={settings.maxStorageSize}
                      onChange={handleSliderChange('maxStorageSize')}
                      min={100}
                      max={2000}
                      step={50}
                      marks={[
                        { value: 100, label: '100MB' },
                        { value: 500, label: '500MB' },
                        { value: 1000, label: '1GB' },
                        { value: 2000, label: '2GB' },
                      ]}
                      valueLabelDisplay="auto"
                    />
                  </Box>

                  <FormControl fullWidth>
                    <InputLabel>Backup Frequency</InputLabel>
                    <Select
                      value={settings.backupFrequency}
                      onChange={handleSettingChange('storage', 'backupFrequency')}
                      label="Backup Frequency"
                    >
                      {backupOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.autoDeleteOldImages}
                        onChange={handleSettingChange('storage', 'autoDeleteOldImages')}
                      />
                    }
                    label="Auto-delete old images"
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.cloudSync}
                        onChange={handleSettingChange('storage', 'cloudSync')}
                      />
                    }
                    label="Cloud synchronization"
                  />
                </Stack>
              </AccordionDetails>
            </Accordion>
          </Grid>

          {/* Advanced Settings */}
          <Grid item xs={12} md={6}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <SettingsIcon color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Advanced
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    type="number"
                    label="API Timeout (seconds)"
                    value={settings.apiTimeout}
                    onChange={handleSettingChange('advanced', 'apiTimeout')}
                    inputProps={{ min: 10, max: 300 }}
                  />

                  <TextField
                    fullWidth
                    type="number"
                    label="Retry Attempts"
                    value={settings.retryAttempts}
                    onChange={handleSettingChange('advanced', 'retryAttempts')}
                    inputProps={{ min: 1, max: 10 }}
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.debugMode}
                        onChange={handleSettingChange('advanced', 'debugMode')}
                      />
                    }
                    label="Debug mode"
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.betaFeatures}
                        onChange={handleSettingChange('advanced', 'betaFeatures')}
                      />
                    }
                    label="Enable beta features"
                  />

                  <Alert severity="warning">
                    Advanced settings may affect app performance. Change with caution.
                  </Alert>
                </Stack>
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>

        {/* Action Buttons */}
        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button
              variant="contained"
              startIcon={<SaveAlt />}
              size="large"
            >
              Save Settings
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<CloudDownload />}
              onClick={() => setShowExportDialog(true)}
              size="large"
            >
              Export Settings
            </Button>
            
            <Button
              component="label"
              variant="outlined"
              startIcon={<Download />}
              size="large"
            >
              Import Settings
              <input
                type="file"
                hidden
                accept=".json"
                onChange={handleImport}
              />
            </Button>
            
            <Button
              variant="outlined"
              color="error"
              startIcon={<RestartAlt />}
              onClick={() => setShowResetDialog(true)}
              size="large"
            >
              Reset to Default
            </Button>
          </Stack>
        </Box>
      </motion.div>

      {/* Reset Confirmation Dialog */}
      <Dialog
        open={showResetDialog}
        onClose={() => setShowResetDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Reset Settings</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to reset all settings to their default values? 
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowResetDialog(false)}>Cancel</Button>
          <Button onClick={handleReset} color="error" variant="contained">
            Reset
          </Button>
        </DialogActions>
      </Dialog>

      {/* Export Confirmation Dialog */}
      <Dialog
        open={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Export Settings</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            This will download your current settings as a JSON file that you can 
            import later or share with others.
          </Typography>
          <Alert severity="info">
            Your exported settings file will not contain any personal data or images.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowExportDialog(false)}>Cancel</Button>
          <Button onClick={handleExport} variant="contained">
            Export
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Settings;
