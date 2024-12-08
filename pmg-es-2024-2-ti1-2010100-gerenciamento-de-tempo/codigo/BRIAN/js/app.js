//variaveis
const nome = document.querySelector("#nome");
const materia = document.querySelector("#materia");
const descrição = document.querySelector("#descrição");
const prioridade = document.querySelector("prioridade");
const mostrarNotas = document.querySelector("#mostrarnotas");
const btnsalvar= document.querySelector("#btnsalvar");
const total = document.querySelector(contador);
let contador = 0;
let cadastroNotas = [];

//functions

//cadastro de novas notas

function cadastrar(dados){
  contador++;
  let strnotas = localStorage.getItem('db');
  let objnotas = {};
  if(strnotas){
    objnotas = JSON.parse(strnotas);
  } else {
      objnotas = { nota: [
      {id: contador,
     nome:"Brian B",
      materia: "Diw",
      descrição:"muito complexo",
      prioridade:"Alta"},
      {id: contador,
      nome:"Geovana B",
      materia: "TIAW",
      descrição:"muito estranho",
      prioridade:"Média"},
      {id: contador,
      nome:"Ronald T",
      materia: "Cálculo",
      descrição:"muito complexo",
      prioridade:"Alta"}
      ] };
    }
      return objnotas;
}
function salvardados(dados){
  localStorage.setItem('db', JSON.stringify (dados));
}

//Exibir notas cadastradas
function exibirNotas(){
  let notas =document.getElementById('notas');
  let strHTML = '';
  let objnotas = cadastrar();
  for(let i=0; i<objnotas.nota.length; i++){
    strHTML += `<li>${objnotas.nota[i].nome} - ${objnotas.nota[i].id} - ${objnotas.nota[i].prioridade} </li>`;
  }
  notas.innerHTML = strHTML;
}

// incluir notas
function incluirNotas(){
//ler dados do localStorage
let objnotas = cadastrar();
//incluir um novo contato
nome = document.getElementById('nome').value;
materia = document.getElementById('materia').value;
descrição = document.getElementById('descrição').value;
prioridade = document.getElementById('prioridade').value;
let novaNota = {
    nome: nome,
    materia: materia,
    descrição: descrição,
    prioridade: prioridade
  };
  objnotas.nota.push (novaNota);
  //salvar os dados no localStorage
  salvardados(objnotas);
}

//botão salvar
document.getElementById('btnsalvar').addEventListener('click', cadastrar);
salvarDados(objnotas); 
//botão carregar dados
document.getElementById('btncarregardados').addEventListener('click', exibirNotas);
salvarDados(objnotas); 











  //salvar dados




  
  cadastroNotas.push(nota);
  localStorage.setItem("mostrarNotas", JSON.stringify(cadastroNotas));
  localStorage.setItem("contador", contador);
  atualizarcadastroNotas(nota)



















































function  atualizarcadastroNotas(nota){
  let li = document.createElement("li");
  li.id = `item-${nota.id}`;
  li.textContent = nota.nome;
  li.addEventListener("click", (event) => {
    if(event.ctrlKey){
      excluir(event);
    } else {
      exibirDetalhes(event);
    }
  });
  mostrarNotas.appendChild(li);
}

//Carregar notas cadastradas
function caregarNotas (){
  contador = Number(localStorage.getItem("contador")); //recupera o contador
  cadastroNotas = JSON.parse(localStorage.getItem("mostrarNotas")) || []; //recupra a lista salva
}









/* 
var Cadastro= [
    { nome: "Brian Breder",
      idade: 20,
      cidade: "Belo Horizonte",
    },
    {
      nome: "Geovana Breder",
      idade: 52,
      cidade: "Contagem",
    },
    {
      nome: "Junin do creu",
      idade: 25,
      cidade: "Sabara",
    },
  ];
  
  function ExibirCadastro() {
      var textoHTML = '';
      for (let x = 0; x < Cadastro.length; x++) {
          textoHTML += `pessoa: ${Cadastro[x].nome} <br>`;
          
          if(Cadastro[x].veiculo.length > 0){
              textoHTML += '<ul>';
          }
          for(let y=0; y<Cadastro[x].veiculo.length; y++){
              let marca = Cadastro[x].veiculo[y].marca;
              let modelo = Cadastro[x].veiculo[y].modelo;
              let ano = Cadastro[x].veiculo[y].ano;
              textoHTML += `<li>${marca} - ${modelo} - ${ano} </li>`
          }
          if(Cadastro[x].veiculo.length > 0){
             textoHTML += '</ul>';
          }
      }
      var tela = document.getElementById('tela');
      tela.innerHTML = textoHTML; 
  
  }
  */