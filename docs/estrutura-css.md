### Estrutura de Arquivos CSS

Aqui está a estrutura detalhada dos arquivos CSS organizados em pastas para facilitar a manutenção e escalabilidade do projeto. Cada pasta tem uma função específica, seguindo uma hierarquia lógica:

assets/
  css/
    00-settings/
      tokens.css        # cores, fontes, espaçamentos, z-index
      breakpoints.css
    01-base/
      reset.css
      base.css          # body, links, headings
      typography.css
    02-layout/
      container.css
      grid.css
      header.css
      footer.css
    03-components/
      button.css
      card.css
      form.css
      modal.css
    04-pages/
      home.css
      sobre.css
      contato.css
    05-utilities/
      spacing.css       # .u-mt-16, .u-px-24...
      display.css       # .u-flex, .u-hidden...
      text.css          # .u-text-center...
    main.css
