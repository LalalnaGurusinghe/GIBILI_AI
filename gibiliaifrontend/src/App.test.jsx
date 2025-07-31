import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders GIBILI AI Art Generator', () => {
  render(<App />);
  const linkElement = screen.getByText(/GIBILI AI Art Generator/i);
  expect(linkElement).toBeTruthy();
});
