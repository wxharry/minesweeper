import React from 'react';
import { render, screen } from '@testing-library/react';
import Minesweeper from './Minesweeper';

test('renders learn react link', () => {
  render(<Minesweeper />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
