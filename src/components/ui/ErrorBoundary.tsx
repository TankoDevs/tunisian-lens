import { Component, type ReactNode } from 'react';

interface Props { children: ReactNode }
interface State { hasError: boolean; message: string }

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, message: '' };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, message: error.message };
    }

    componentDidCatch(error: Error, info: { componentStack: string }) {
        console.error('App crashed:', error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#0a0a0a',
                    color: '#fff',
                    fontFamily: 'Inter, sans-serif',
                    gap: '12px',
                    padding: '24px',
                    textAlign: 'center',
                }}>
                    <h1 style={{ fontSize: 24, margin: 0 }}>Something went wrong</h1>
                    <p style={{ color: '#888', maxWidth: 400, margin: 0 }}>{this.state.message}</p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            marginTop: 16,
                            padding: '10px 24px',
                            background: '#fff',
                            color: '#000',
                            border: 'none',
                            cursor: 'pointer',
                            borderRadius: 4,
                            fontWeight: 600
                        }}
                    >
                        Reload Page
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}
