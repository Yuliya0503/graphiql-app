import React from 'react';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MainPage from './MainPage';
import { AuthProvider } from '../../utils/Auth/AuthContext';
import { vi } from 'vitest';

vi.mock('../../components/GraphqlEditor/Query', () => ({
  __esModule: true,
  default: () => <div>Mocked Query Component</div>,
}));

vi.mock('../../utils/localization/localizationContext', () => ({
  useLocalization: vi.fn(() => ({
    locale: 'en',
    messages: {
      en: {
        query_placeholder: 'Enter your GraphQL query here',
        settings_title: 'Settings',
        settings_submit: 'Submit',
        settings_cancel: 'Cancel',
        settings_current: 'Current GraphQL API',
        settings_choose: 'Choose a new GraphQL API',
        settings_yours: 'or input yours',
        settings_other: 'Other',
        enter_variables_placeholder: 'Enter variables here',
        enter_headers_placeholder: 'Enter headers here (one per line)',
        docs_title: 'Docs',
        variables: 'Variables',
        headers: 'Headers',
      },
    },
  })),
}));

vi.mock('../../components/Prettifying/Prettyfing', () => ({
  __esModule: true,
  default: (input: string) => `Prettified: ${input}`,
}));

describe('MainPage Component', () => {
  it('should render Docs and Settings icons', async () => {
    await act(async () => {
      render(
        <AuthProvider>
          <MemoryRouter>
            <MainPage />
          </MemoryRouter>
        </AuthProvider>
      );
    });

    const iconDocs = screen.getByAltText('Docs');
    const iconSettings = screen.getByAltText('Settings');

    expect(iconDocs).toBeInTheDocument();
    expect(iconSettings).toBeInTheDocument();
  });

  it('should toggle Docs Panel on button click', async () => {
    await act(async () => {
      render(
        <AuthProvider>
          <MemoryRouter>
            <MainPage />
          </MemoryRouter>
        </AuthProvider>
      );
    });

    const iconDocs = screen.getByAltText('Docs');
    fireEvent.click(iconDocs);

    await waitFor(() => {
      const docsPanel = screen.getByText(/Documentation\.\.\./i);
      expect(docsPanel).toBeInTheDocument();
    });
  });

  it('should update query input on user input', async () => {
    await act(async () => {
      render(
        <AuthProvider>
          <MemoryRouter>
            <MainPage />
          </MemoryRouter>
        </AuthProvider>
      );
    });

    const queryInput = screen.getByPlaceholderText(
      'Enter your GraphQL query here'
    );
    fireEvent.change(queryInput, { target: { value: 'Your GraphQL Query' } });

    expect(queryInput).toHaveValue('Your GraphQL Query');
  });

  it('should handle SettingsModal interaction', async () => {
    await act(async () => {
      render(
        <AuthProvider>
          <MemoryRouter>
            <MainPage />
          </MemoryRouter>
        </AuthProvider>
      );
    });

    const settingsButton = screen.getByAltText('Settings');
    fireEvent.click(settingsButton);

    await waitFor(() => {
      const modalTitle = screen.getByText('Settings');
      expect(modalTitle).toBeInTheDocument();
    });

    const selectApiDropdown = screen.getByLabelText(
      'Choose a new GraphQL API',
      { exact: false }
    );
    expect(selectApiDropdown).toBeInTheDocument();
    fireEvent.change(selectApiDropdown, { target: { value: 'other' } });

    await waitFor(() => {
      const customApiInput = screen.getByTestId('custom-api-input');
      expect(customApiInput).toBeInTheDocument();
      fireEvent.change(customApiInput, {
        target: { value: 'https://custom-api.example/graphql' },
      });
    });

    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);

    await waitFor(() => {
      const modal = screen.queryByText('Settings');
      expect(modal).not.toBeInTheDocument();
    });
  });
  it('should close SettingsModal on "Cancel" click', async () => {
    await act(async () => {
      render(
        <AuthProvider>
          <MemoryRouter>
            <MainPage />
          </MemoryRouter>
        </AuthProvider>
      );
    });

    const settingsButton = screen.getByAltText('Settings');
    fireEvent.click(settingsButton);

    await act(async () => {
      const modalTitle = screen.getByText('Settings');
      expect(modalTitle).toBeInTheDocument();

      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);
    });

    await waitFor(() => {
      const modal = screen.queryByText('Settings');
      expect(modal).not.toBeInTheDocument();
    });
  });
  it('should prettify the query on "Prettify" click', async () => {
    await act(async () => {
      render(
        <AuthProvider>
          <MemoryRouter>
            <MainPage />
          </MemoryRouter>
        </AuthProvider>
      );
    });
    const queryInput = screen.getByPlaceholderText(
      'Enter your GraphQL query here'
    );
    fireEvent.change(queryInput, { target: { value: 'Your GraphQL Query' } });

    const prettifyButton = screen.getByText('Prettify');
    fireEvent.click(prettifyButton);

    await waitFor(() => {
      expect(queryInput).toHaveValue('Prettified: Your GraphQL Query');
    });
  });
  it('should update variable input on user input', async () => {
    await act(async () => {
      render(
        <AuthProvider>
          <MemoryRouter>
            <MainPage />
          </MemoryRouter>
        </AuthProvider>
      );
    });

    fireEvent.click(screen.getByText('Variables'));

    const variablesInput = screen.getByTestId('textarea-test-id');
    fireEvent.change(variablesInput, { target: { value: 'Your Variables' } });

    expect(variablesInput).toHaveValue('Your Variables');
  });
  it('should update headers input on user input', async () => {
    await act(async () => {
      render(
        <AuthProvider>
          <MemoryRouter>
            <MainPage />
          </MemoryRouter>
        </AuthProvider>
      );
    });

    fireEvent.click(screen.getByText('Headers'));

    const variablesInput = screen.getByTestId('textarea-test-id');
    fireEvent.change(variablesInput, { target: { value: 'Your Headers' } });

    expect(variablesInput).toHaveValue('Your Headers');
  });
});
