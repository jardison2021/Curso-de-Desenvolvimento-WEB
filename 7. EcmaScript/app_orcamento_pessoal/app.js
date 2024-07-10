class Despesa{
	constructor(ano, mes, dia, tipo, descricao, valor){
		this.ano = ano
		this.mes = tipo
		this.dia = dia
		this.tipo = tipo
		this.descricao = descricao
		this.valor = valor
	}
	//Método para validação dos dados
	validarDados(){
		for(let i in this){
			if(this[i] == undefined || this[i] == '' || this[i] == null){
				return false
			}
		}
		return true
	}
}
//Classe do objeto BD
class Bd{
	constructor(){
		let id = localStorage.getItem('id')
		if(id === null){
			localStorage.setItem('id', 0)
		}
	}
	getProximoId(){
		let proximoId = localStorage.getItem('id')
		return parseInt(proximoId) + 1
	}
	//Função para utilizar o local storage
	//Esta função permite que toda vez que algum dado seja adiciondo, ela seja setada na notação JSON, artavés do camando JSON.stringify(d), sendo "d" o parâmetro utilizado para guardar as informações.
	//A função setItem contém um protocolo que abre comunicação com o local storage para o encaminhar o JSON.
	gravar(d){
		let id = this.getProximoId()
		localStorage.setItem(id, JSON.stringify(d))
		localStorage.setItem('id', id)
	}
	recuperarTodosRegistros(){
		//array de despesas
		let despesas = Array()
		let id = localStorage.getItem('id')
		//Aqui é recuperado todas as despesas cadastradas em localStorage
		for(let i = 1; i <= id; i++){
			//Recuperar despesas
			let despesa = JSON.parse(localStorage.getItem(i))
			//Condição que verifica que o item existe (está cadastrado) dentro do array, se esta condição for verdadeira o item será salteado, através da instrução 'continue' que verifica se um item existe dentro do array, e caso não exista, pula para a próxima interação do laço.
			if(despesa === null){
				continue
			}
			despesa.id = i
			despesas.push(despesa)
		}
		return despesa
	}
	pesquisar(despesa){
		let despesasFiltradas = Array()
		despesasFiltradas = this.recuperarTodosRegistros()
		//ano
		if(despesa.ano != ''){
			despesasFiltradas.filter(d => d.ano == despesa.ano)
		}
		//mes
		if(despesa.mes != ''){
			despesasFiltradas.filter(d => d.mes == despesa.mes)
		}
		//dia
		if(despesa.dia != ''){
			despesasFiltradas.filter(d => d.dia == despesa.dia)
		}
		//tipo
		if(despesa.tipo != ''){
			despesasFiltradas.filter(d => d.tipo == despesa.tipo)
		}
		//descricao
		if(despesa.descricao != ''){
			despesasFiltradas.filter(d => d.descricao == despesa.descricao)
		}
		//valor
		if(despesa.valor != ''){
			despesasFiltradas.filter(d => d.valor == despesa.valor)
		}
		return despesasFiltradas
	}
	remover(id){
		localStorage.removeItem(id)
	}
}
let bd = new Bd()
function cadastrarDespesa(){
	let ano = document.getElementById('ano')
	let mes = document.getElementById('mes')
	let dia = document.getElementById('dia')
	let descricao = document.getElementById('descricao')
	let valor = document.getElementById('valor')
	let despesa = new Despesa(ano.value, mes.value, dia.value, descricao.value, valor.value)
	//Condição e chamada da validação dos dados
	if(despesa.validarDados()){
		bd.gravar(despesa)
		document.getElementById('modal_titulo').innerHTML = 'Registro realizado com sucesso'
		document.getElementById('modal_titulo_div').className = 'modal-header text-success'
		document.getElementById('modal_conteudo').innerHTML = 'Despesa foi catastrada com sucesso!'
		document.getElementById('modal_btn').innerHTML = 'Voltar'
		document.getElementById('modal_btn').className = 'btn btn-success'
		//O $ é o seletor de elementos do Jquery
		$('#modalRegistraDespesa').modal('show')
		ano.value = ''
		mes.value = ''
		dia.value = ''
		tipo.value = ''
		descricao.value = ''
		valor.value = ''
	}else{
		document.getElementById('modal_titulo').innerHTML = 'Erro na inclusão do registro'
		document.getElementById('modal_titulo_div').className = 'modal-header text-danger'
		document.getElementById('modal_conteudo').innerHTML = 'Erro na gravação, verifique se todos os campos foram preenchidos corretamente!'
		document.getElementById('modal_btn').innerHTML = 'Voltar e corrigir!'
		document.getElementById('modal_btn').className = 'btn btn-danger'
		$('#modalRegistraDespesa').modal('show')
	}
}
//Listando despesas
function carregaListaDespesas(despesas = Array(), filtro = false){
	if(despesas.length == 0 && filtro == false){
		despesas = bd.recuperarTodosRegistros()
	}
	//Selecionando os elementos tbody da tabela
	let listaDespesas = document.getElementById('listaDespesas')
	listaDespesas.innerHTML = ''
	//Percorrer o array desepas, listando cada despesa de forma dinâmica
	despesas.forEach(function(d){
		//Criando a linha (tr)
		let linha = listaDespesas.insertRow()
		//Criar colunas (td)
		linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`
		//Ajustar o tipo
		switch(d.tipo){
		case '1': d.tipo = 'Alimentação'
			break
		case '2': d.tipo = 'Educação'
			break
		case '3': d.tipo = 'Lazer'
			break
		case '4': d.tipo = 'Saúde'
			break
		case '5': d.tipo = 'Transporte'
			break
		}
		linha.insertCell(1).innerHTML = d.tipo
		linha.insertCell(2).innerHTML = d.descricao
		linha.insertCell(3).innerHTML = d.valor
		//Criar o botão de exclusão
		let btn = document.createElement("button")
		btn.className = 'btn btn-danger'
		btn.innerHTML = '<i class="fas fa-times"></i>'
		btn.id = `id_despesa_${d.id}`
		btn.onclick = function(){
			//alert(this.id)
			let id = this.id.replace('id_despesa_', '')
			bd.remove(id)
			window.location.reload()
		}
		linha.insertCell(4).append(btn)
	})
}
//Filtrando despesas
function pesquisarDespesa(){
	let ano = document.getElementById('ano').value
	let mes = document.getElementById('mes').value
	let dia = document.getElementById('dia').value
	let tipo = document.getElementById('tipo').value
	let descricao = document.getElementById('descricao').value
	let valor = document.getElementById('valor').value
	let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)
	let despesas = bd.pesquisar(despesa)
	this.carregaListaDespesas(despesas, true)
}