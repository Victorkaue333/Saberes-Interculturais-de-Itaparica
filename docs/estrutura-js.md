### Estrutura de Arquivos JS

Aqui está a estrutura detalhada dos arquivos JavaScript organizados em pastas para facilitar a manutenção e escalabilidade do projeto. Cada pasta tem uma função específica, seguindo uma hierarquia lógica:

js/
  core/
    dom.js            # seletores/helpers de DOM
    events.js         # eventos globais
  components/
    menu.js
    modal.js
    accordion.js
  pages/
    home.js
    contato.js
  services/
    api.js            # fetch/chamadas externas
    storage.js        # localStorage/sessionStorage
  utils/
    debounce.js
    format.js
    validators.js
  main.js
