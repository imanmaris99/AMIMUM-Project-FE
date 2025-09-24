import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import WishlistButton from '@/components/common/WishlistButton';
import LoginRequiredModal from '@/components/common/LoginRequiredModal';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock SessionManager
jest.mock('@/lib/auth', () => ({
  SessionManager: {
    isAuthenticated: jest.fn(),
  },
}));

// Mock WishlistContext
jest.mock('@/contexts/WishlistContext', () => ({
  useWishlist: () => ({
    isInWishlist: jest.fn(() => false),
    toggleWishlist: jest.fn(),
  }),
}));

describe('WishlistButton Modal Routing Test', () => {
  const mockPush = jest.fn();
  const mockProduct = {
    id: 'test-product-1',
    name: 'Test Product',
    price: 100000,
    image: '/test-image.jpg',
    brand: 'Test Brand',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  test('should open login modal when user is not authenticated', () => {
    const { SessionManager } = require('@/lib/auth');
    SessionManager.isAuthenticated.mockReturnValue(false);

    render(<WishlistButton product={mockProduct} />);
    
    const wishlistButton = screen.getByRole('button', { name: /add to wishlist/i });
    fireEvent.click(wishlistButton);

    // Check if login modal is opened
    expect(screen.getByText('Login untuk Menyimpan ke Wishlist')).toBeInTheDocument();
    expect(screen.getByText('Masuk ke Akun')).toBeInTheDocument();
  });

  test('should navigate to login page when "Masuk ke Akun" button is clicked', () => {
    const { SessionManager } = require('@/lib/auth');
    SessionManager.isAuthenticated.mockReturnValue(false);

    render(<WishlistButton product={mockProduct} />);
    
    const wishlistButton = screen.getByRole('button', { name: /add to wishlist/i });
    fireEvent.click(wishlistButton);

    const loginButton = screen.getByText('Masuk ke Akun');
    fireEvent.click(loginButton);

    // Verify navigation to login page
    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  test('should navigate to register page when "Buat Akun Baru" button is clicked', () => {
    const { SessionManager } = require('@/lib/auth');
    SessionManager.isAuthenticated.mockReturnValue(false);

    render(<WishlistButton product={mockProduct} />);
    
    const wishlistButton = screen.getByRole('button', { name: /add to wishlist/i });
    fireEvent.click(wishlistButton);

    const registerButton = screen.getByText('Buat Akun Baru');
    fireEvent.click(registerButton);

    // Verify navigation to register page
    expect(mockPush).toHaveBeenCalledWith('/register');
  });

  test('should prevent event bubbling when clicking modal buttons', () => {
    const mockParentClick = jest.fn();
    
    render(
      <div onClick={mockParentClick}>
        <WishlistButton product={mockProduct} />
      </div>
    );
    
    const wishlistButton = screen.getByRole('button', { name: /add to wishlist/i });
    fireEvent.click(wishlistButton);

    const loginButton = screen.getByText('Masuk ke Akun');
    fireEvent.click(loginButton);

    // Verify parent click handler was not called
    expect(mockParentClick).not.toHaveBeenCalled();
  });
});

describe('LoginRequiredModal Event Handling Test', () => {
  const mockOnClose = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  test('should stop propagation when clicking modal buttons', () => {
    const mockParentClick = jest.fn();
    
    render(
      <div onClick={mockParentClick}>
        <LoginRequiredModal
          isOpen={true}
          onClose={mockOnClose}
          feature="wishlist"
        />
      </div>
    );

    const loginButton = screen.getByText('Masuk ke Akun');
    fireEvent.click(loginButton);

    // Verify parent click handler was not called
    expect(mockParentClick).not.toHaveBeenCalled();
    // Verify navigation still works
    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  test('should close modal when clicking outside', () => {
    render(
      <LoginRequiredModal
        isOpen={true}
        onClose={mockOnClose}
        feature="wishlist"
      />
    );

    const modalOverlay = screen.getByRole('generic').firstChild;
    fireEvent.click(modalOverlay!);

    expect(mockOnClose).toHaveBeenCalled();
  });

  test('should not close modal when clicking inside modal content', () => {
    render(
      <LoginRequiredModal
        isOpen={true}
        onClose={mockOnClose}
        feature="wishlist"
      />
    );

    const modalContent = screen.getByText('Login untuk Menyimpan ke Wishlist').closest('div');
    fireEvent.click(modalContent!);

    expect(mockOnClose).not.toHaveBeenCalled();
  });
});
