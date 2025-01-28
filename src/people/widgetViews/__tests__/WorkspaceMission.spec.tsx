import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import WorkspaceMission from '../WorkspaceMission';
import { useFeatureFlag } from '../../../hooks/useFeatureFlag';
import { withProviders } from '../../../providers';

global.IntersectionObserver = class IntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string = '0px';
  readonly thresholds: ReadonlyArray<number> = [0];
  private callback: IntersectionObserverCallback;
  private options?: IntersectionObserverInit;

  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    this.callback = callback;
    this.options = options;
  }

  observe(target: Element) {
    const entry: IntersectionObserverEntry = {
      isIntersecting: true,
      target: target,
      boundingClientRect: target.getBoundingClientRect(),
      intersectionRatio: 1,
      intersectionRect: target.getBoundingClientRect(),
      rootBounds: null,
      time: Date.now()
    };
    this.callback([entry], this);
  }

  unobserve() {
    // No-op
  }

  disconnect() {
    // No-op
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
};

jest.mock('../../../hooks/useFeatureFlag');

const mockCrypto = {
  getRandomValues: function (buffer: Uint8Array): Uint8Array {
    for (let i = 0; i < buffer.length; i++) {
      buffer[i] = Math.floor(Math.random() * 256);
    }
    return buffer;
  }
};
global.crypto = mockCrypto as Crypto;

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const WrappedComponent = withProviders(() => (
    <MemoryRouter initialEntries={['/workspace/test-uuid']}>
      <Route path="/workspace/:uuid">{children}</Route>
    </MemoryRouter>
  ));

  return <WrappedComponent />;
};

describe('WorkspaceMission', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show planner button when feature flag is enabled', async () => {
    (useFeatureFlag as jest.Mock).mockReturnValue({
      isEnabled: true,
      loading: false
    });

    render(
      <TestWrapper>
        <WorkspaceMission />
      </TestWrapper>
    );
    waitFor(() => {
      expect(screen.getByTestId('workspace-planner-btn')).toBeInTheDocument();
    });
  });

  it('should hide planner button when feature flag is disabled', async () => {
    (useFeatureFlag as jest.Mock).mockReturnValue({
      isEnabled: false,
      loading: false
    });

    render(
      <TestWrapper>
        <WorkspaceMission />
      </TestWrapper>
    );
    waitFor(() => {
      expect(screen.queryByTestId('workspace-planner-btn')).not.toBeInTheDocument();
    });
  });

  it('should hide planner button while loading', async () => {
    (useFeatureFlag as jest.Mock).mockReturnValue({
      isEnabled: true,
      loading: true
    });

    render(
      <TestWrapper>
        <WorkspaceMission />
      </TestWrapper>
    );
    waitFor(() => {
      expect(screen.queryByTestId('workspace-planner-btn')).not.toBeInTheDocument();
    });
  });
});
