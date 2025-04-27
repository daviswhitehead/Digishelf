import React from 'react';
import type { NextPage } from 'next';

const LoginPage: NextPage = () => {
  const [LoginComponent, setLoginComponent] = React.useState<React.ComponentType | null>(null);

  React.useEffect(() => {
    import('../components/Login').then(mod => {
      setLoginComponent(() => mod.default);
    });
  }, []);

  return (
    <div
      style={{
        backgroundColor: '#000',
        color: '#fff',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {LoginComponent && <LoginComponent />}
    </div>
  );
};

export default LoginPage;
