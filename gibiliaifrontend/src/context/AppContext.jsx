import React, { createContext, useContext, useReducer } from 'react';

const AppContext = createContext();

const initialState = {
  user: null,
  generatedImages: [],
  generationHistory: [],
  isLoading: false,
  error: null,
  settings: {
    notifications: true,
    darkMode: true,
    autoSave: true,
  },
};

const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'ADD_GENERATED_IMAGE':
      return {
        ...state,
        generatedImages: [action.payload, ...state.generatedImages],
      };
    
    case 'REMOVE_GENERATED_IMAGE':
      return {
        ...state,
        generatedImages: state.generatedImages.filter(img => img.id !== action.payload),
      };
    
    case 'ADD_TO_HISTORY':
      return {
        ...state,
        generationHistory: [action.payload, ...state.generationHistory],
      };
    
    case 'CLEAR_HISTORY':
      return {
        ...state,
        generationHistory: [],
      };
    
    case 'SET_USER':
      return { ...state, user: action.payload };
    
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };
    
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const value = {
    ...state,
    dispatch,
    // Action creators
    setLoading: (loading) => dispatch({ type: 'SET_LOADING', payload: loading }),
    setError: (error) => dispatch({ type: 'SET_ERROR', payload: error }),
    clearError: () => dispatch({ type: 'CLEAR_ERROR' }),
    addGeneratedImage: (image) => dispatch({ type: 'ADD_GENERATED_IMAGE', payload: image }),
    removeGeneratedImage: (id) => dispatch({ type: 'REMOVE_GENERATED_IMAGE', payload: id }),
    addToHistory: (item) => dispatch({ type: 'ADD_TO_HISTORY', payload: item }),
    clearHistory: () => dispatch({ type: 'CLEAR_HISTORY' }),
    setUser: (user) => dispatch({ type: 'SET_USER', payload: user }),
    updateSettings: (settings) => dispatch({ type: 'UPDATE_SETTINGS', payload: settings }),
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
