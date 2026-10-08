import { inject } from '@vercel/analytics';
import { render } from 'preact';
import { loadTheme } from './state';
import { App } from './ui/app';
import './styles.css';

inject();

document.documentElement.dataset.theme = loadTheme();

const root = document.getElementById('app');
if (root) render(<App />, root);
