import React, { useEffect } from 'react';

function loadIconFont(): void {
  require('../utils/iconFont');
}

const ClientInit: React.FC = () => {
  useEffect(() => {
    loadIconFont();
  }, []);

  return null;
};

export default ClientInit;
