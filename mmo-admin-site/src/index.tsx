import React, { Suspense } from 'react';
import { Provider } from 'react-redux';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import { store } from './store/Store';
import Spinner from './views/spinner/Spinner';
import './utils/i18n';
import MessageContainer from './components/alert/Message';

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <Provider store={store}>
      <Suspense fallback={<Spinner />}>
        <BrowserRouter>
          <App />
          <MessageContainer />
        </BrowserRouter>
      </Suspense>
    </Provider>,
  );
} else {
  console.error('Root element not found');
}
