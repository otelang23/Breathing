import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StatCard } from '../StatCard';

describe('StatCard', () => {
    it('renders label and value correctly', () => {
        render(<StatCard label="Total Time" value="10:00" />);
        expect(screen.getByText('Total Time')).toBeInTheDocument();
        expect(screen.getByText('10:00')).toBeInTheDocument();
    });

    it('renders sub-label when provided', () => {
        render(<StatCard label="Cycles" value="5" sub="PAS 9.8" />);
        expect(screen.getByText('PAS 9.8')).toBeInTheDocument();
    });
});
