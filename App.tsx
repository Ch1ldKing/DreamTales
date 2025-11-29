import React from 'react';
import WinterStage from './components/WinterStage';

const App: React.FC = () => {
  return (
    <div className="h-screen w-screen relative overflow-hidden bg-slate-950">
      <WinterStage />
    </div>
  );
};

export default App;