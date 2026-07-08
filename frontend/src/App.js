import { useState } from 'react';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';
import { Sidebar } from './sidebar';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen w-screen bg-zinc-950 overflow-hidden relative">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex-1 flex flex-col relative h-full overflow-hidden">
        <PipelineUI />
        <SubmitButton />
      </div>
    </div>
  );
}

export default App;
