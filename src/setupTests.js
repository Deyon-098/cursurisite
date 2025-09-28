// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock window.scrollTo
Object.defineProperty(window, 'scrollTo', {
  value: jest.fn(),
  writable: true
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock castable-video
jest.mock('castable-video', () => ({}));

// Mock GSAP
global.gsap = {
  fromTo: jest.fn(),
  to: jest.fn(),
  from: jest.fn(),
  set: jest.fn(),
  timeline: jest.fn(() => ({
    to: jest.fn(),
    from: jest.fn(),
    fromTo: jest.fn(),
    set: jest.fn(),
    play: jest.fn(),
    pause: jest.fn(),
    reverse: jest.fn(),
  })),
};

global.window.gsap = global.gsap;