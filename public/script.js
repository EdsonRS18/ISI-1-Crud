const form = document.getElementById('formulario');
const tabela = document.getElementById('tabela');

form.addEventListener('submit', function(event) {
  event.preventDefault();

  const aluno = {
    id: this.elements.alunoId.value,
    nome: this.elements.nome.value,
    cpf: this.elements.cpf.value,
    plano: this.elements.plano.value,
    
  };
  
  const method = aluno.id ? 'PUT' : 'POST';
  const url = aluno.id ? `/alunos/${aluno.id}` : '/alunos';

  fetch(url, {
    method: method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(aluno)
  })
  .then(response => response.json())
  .then(data => {
    // Atualiza a lista de produtos com resposta do servidor
    localStorage.setItem('alunos', JSON.stringify(data));
    exibirAlunos();
  });

  // Resetar o form
  form.reset();
  form.elements.alunoId.value = '';

});

function exibirAlunos() {
  tabela.innerHTML = '';
  const submitButton = form.querySelector('button[type="submit"]');
  submitButton.textContent = 'Adicionar';
  fetch('/alunos')
    .then(response => response.json())
    .then(data => {
      let alunos = data || [];
      for (let i = 0; i < alunos.length; i++) {
        const aluno = alunos[i];
        const tr = document.createElement('tr');
        tr.classList.add("aluno");
        tr.dataset.index = aluno.id;
        tr.innerHTML = `
          <td>${aluno.nome}</td>
          <td>${aluno.cpf}</td>
          <td>${aluno.plano}</td>
          <td class="acao"><button id="editar">Editar</button>
                          <button id="deletar">Deletar</button></td>`;
        tabela.appendChild(tr);

      }
    });
}

function deletarAluno(index) {
  // Manda uma request de DELETE pro servidor
  fetch(`/alunos/${index}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => {
    // Atualiza a lista de produtos com resposta do servidor
    exibirAlunos();
  });
}


function editarAluno(index) {
  fetch(`/alunos/${index}`)
    .then(response => response.json())
    .then(aluno => {
      form.elements.alunoId.value = aluno.id;
      // define o id do produto no campo hidden do formulário
      form.elements.nome.value = aluno.nome;
      form.elements.cpf.value = aluno.cpf;
      form.elements.plano.value = aluno.plano;
      

      // Muda o metodo pra put e atualiza o form action URl
      form.method = 'PUT';
      form.action = `/alunos/${aluno.id}`; // atualiza o URL do formulário para incluir o id do produto

      // Muda o nome do botão de submit
      const submitButton = form.querySelector('button[type="submit"]');
      submitButton.textContent = 'Salvar';

      // Adiciona um event listener pra o form submission pra editar o produto
      form.removeEventListener('submit', adicionarAluno);
      form.addEventListener('submit', function(event) {
        event.preventDefault();
        const alunoAtualizado = {
          nome: this.elements.nome.value,
          cpf: this.elements.cpf.value,
          plano: this.elements.plano.value,
        };

        // Manda um request de put pro servidor
        fetch(`/alunos/${aluno.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(alunoAtualizado)
        })
        .then(response => response.json())
        .then(data => {

          exibirAlunos();
        });
      });
    });
}


tabela.addEventListener('click', function(event) {
  if (event.target.id === 'deletar') {
    const index = event.target.closest('.aluno').dataset.index;
    deletarAluno(index);

  } else if (event.target.id ==='editar') {
    const index = event.target.closest('.aluno').dataset.index;
    editarAluno(index);}

  });
  
exibirAlunos();


