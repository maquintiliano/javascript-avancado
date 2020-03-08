class NegociacaoController{

    constructor(){

        //manipulando o dom -> criar um microframework
        //.bind mantém o "valor" da função original
        let $ =  document.querySelector.bind(document);

        this._inputData  = $('#data');
        this._inputQuantidade  = $('#quantidade');
        this._inputValor  = $('#valor');

        //mantem a ordem normal da lista
        this._ordemAtual = '';
      

        //armadilhas com proxy

        this._listaNegociacoes = new Bind(
                new ListaNegociacoes(),
                new NegociacaoView($('#negociacoesView')),
                'adiciona','esvazia','ordena','inverteOrdem'
        );

        this._mensagem = new Bind(
            new Mensagem(),
            new MensagemView($('#mensagemView')),
            'texto'
        );

        ConnectionFactory
        .getConnection()
        .then(connection => new NegociacaoDao(connection))
        .then(dao => dao.listaTodos())
        .then(negociacoes =>
            negociacoes.forEach(negociacao =>
                this._listaNegociacoes.adiciona(negociacao)))
    
    
    }

   
    adiciona(event){
        
        ConnectionFactory
            .getConnection()
            .then(connection => {
                
                let negociacao = this._criaNegociacao();

                new NegociacaoDAO(connection)
                    .adiciona(negociacao)
                    .then(() => {
                        this._listaNegociacoes.adiciona(negociacao);
                        this._mensagem.texto = 'Negociação adicionada com sucesso';
                        this._limpaFormulario();

                    });

            })
            .catch(erro => this._mensagem.texto = erro);

    }

    importaNegociacoes() {

        let service = new NegociacaoService();

        Promise.all([service.obterNegociacoesDaSemana(),
                    service.obterNegociacoesDaSemanaAnterior(),
                    service.obterNegociacoesDaSemanaRetrasada()]
        ).then(negociacoes => {
            negociacoes
            .reduce((arrayAchatado, array) => arrayAchatado.concat(array), [])
            .forEach(negociacao => this._listaNegociacoes.adiciona(negociacao));
            this._mensagem.texto = 'Negociações importadas com sucesso';
        })
        .catch(erro => this._mensagem.texto = erro);
    
    }

    apaga(){
        ConnectionFactory
            .getConnection()
            .then(connection => new NegociacaoDao(connection))
            .then(dao => dao.apagaTodos())
            .then(mensagem => {
                this._mensagem.texto = mensagem;
                this._listaNegociacoes.esvazia();
            });
    }

    ordena(coluna) {
        if(this._ordemAtual == coluna) {
            this._listaNegociacoes.inverteOrdem();
        } else {
            this._listaNegociacoes.ordena((a, b) => a[coluna] - b[coluna]);    
        }
        this._ordemAtual = coluna;
    }


    //metodos auxiliares (apenas a classe pode chamar metodos com _)

    _criaNegociacao(){

        return new Negociacao (
            DateHelper.textoParaData(this._inputData.value),
            this._inputQuantidade.value,
            this._inputValor.value
        );
    }


    _limpaFormulario(){
        this._inputData.value  = '';
        this._inputQuantidade.value  = 1;
        this._inputValor.value  = 0.0;

        this._inputData.focus();
    }
}    