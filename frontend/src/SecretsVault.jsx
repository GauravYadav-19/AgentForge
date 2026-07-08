import React, { useState } from 'react';
import { Key, X, Eye, EyeOff, Plus } from 'lucide-react';

export const SecretsVault = ({ isOpen, onClose }) => {
  const [secrets, setSecrets] = useState([]);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [visibleSecrets, setVisibleSecrets] = useState({});

  if (!isOpen) return null;

  const handleAddSecret = (e) => {
    e.preventDefault();
    if (!newKey.trim() || !newValue.trim()) return;
    
    setSecrets([...secrets, { id: Date.now(), key: newKey.trim(), value: newValue.trim() }]);
    setNewKey('');
    setNewValue('');
  };

  const toggleVisibility = (id) => {
    setVisibleSecrets(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const removeSecret = (id) => {
    setSecrets(secrets.filter(s => s.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-[500px] rounded-xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl relative flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-zinc-800/50 pb-4">
          <div>
            <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
              <Key className="w-5 h-5 text-emerald-500" />
              Secure Secrets Vault
            </h2>
            <p className="text-xs text-zinc-400 mt-1">Manage environment variables and API keys.</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-zinc-500 hover:text-zinc-300 transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Add Secret Form */}
        <form onSubmit={handleAddSecret} className="flex gap-2">
          <input 
            type="text" 
            placeholder="Key (e.g., OPENAI_API_KEY)" 
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            className="flex-1 rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <input 
            type="password" 
            placeholder="Value" 
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            className="flex-1 rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <button 
            type="submit" 
            className="flex items-center justify-center rounded-md bg-emerald-600 px-3 py-2 text-white hover:bg-emerald-500 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </form>

        {/* Secrets List */}
        <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-2">
          {secrets.length === 0 ? (
            <div className="text-center text-sm text-zinc-600 py-4 font-mono">
              No secrets stored in vault.
            </div>
          ) : (
            secrets.map((secret) => (
              <div key={secret.id} className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
                <div className="flex flex-col gap-1 overflow-hidden">
                  <span className="text-xs font-bold text-emerald-400 font-mono tracking-wider">{secret.key}</span>
                  <span className="text-sm text-zinc-300 font-mono truncate max-w-[320px]">
                    {visibleSecrets[secret.id] ? secret.value : '••••••••••••••••'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => toggleVisibility(secret.id)} 
                    className="text-zinc-500 hover:text-zinc-300 transition-colors p-1"
                  >
                    {visibleSecrets[secret.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button 
                    onClick={() => removeSecret(secret.id)} 
                    className="text-zinc-600 hover:text-red-400 transition-colors p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
