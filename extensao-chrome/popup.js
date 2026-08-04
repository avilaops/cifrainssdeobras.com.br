document.addEventListener('DOMContentLoaded', () => {
  const syncBtn = document.getElementById('sync-btn');
  const statusBox = document.getElementById('status-box');
  const statusText = document.getElementById('status-text');

  // URL da API em produção (substitua localmente para testes se necessário)
  const API_URL = 'https://app.cifrainssdeobras.com.br/api/ecac/sync';
  
  // Uma chave simples para o MVP. Em produção, você poderia gerar um token único por cliente.
  const API_KEY = 'avila-ops-ext-token-123';

  function showStatus(message, type) {
    statusBox.className = `status-box ${type}`;
    statusText.textContent = message;
  }

  syncBtn.addEventListener('click', async () => {
    syncBtn.disabled = true;
    showStatus('Capturando sessão...', 'loading');

    try {
      // Pega todos os cookies relacionados à receita
      const cookies = await chrome.cookies.getAll({ domain: "receita.fazenda.gov.br" });
      
      if (!cookies || cookies.length === 0) {
        showStatus('Nenhum cookie encontrado. Você fez login no e-CAC?', 'error');
        syncBtn.disabled = false;
        return;
      }

      // Procura pelo cookie de autenticação principal (JSESSIONID, eCAC, etc)
      // O e-CAC usa vários cookies, vamos enviar todos relevantes para garantir a sessão.
      const payload = {
        cookies: cookies.map(c => ({
          name: c.name,
          value: c.value,
          domain: c.domain,
          path: c.path,
          secure: c.secure,
          httpOnly: c.httpOnly
        }))
      };

      showStatus('Sincronizando com a Ávila Ops...', 'loading');

      // Envia para a API da Calculadora
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        showStatus('Sessão sincronizada com sucesso! O robô já tem acesso.', 'success');
      } else {
        throw new Error(result.error || 'Erro na resposta do servidor.');
      }
      
    } catch (error) {
      console.error('Erro de Sincronização:', error);
      showStatus(`Falha: ${error.message}`, 'error');
    } finally {
      syncBtn.disabled = false;
    }
  });
});
