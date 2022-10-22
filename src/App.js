import React from 'react';
import './App.css';
import Menu from './components/Menu';
import DialogCanvas from './features/dialogCanvas/DialogCanvas';

function App() {
  return (
    <div className="App">
      <DialogCanvas menu={<Menu />} />
    </div>
  );
}

export default App;
