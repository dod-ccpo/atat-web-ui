/** 
 * globally imports library to prevent
 * collision with cypress assert functions 
 */
import '@testing-library/jest-dom/extend-expect'

/**
 * Mocked functions prevent overwhelming text
 * that is displayed
 * vue-test-utils/jest console
 */

global.console = {
  ...console,
  //log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};