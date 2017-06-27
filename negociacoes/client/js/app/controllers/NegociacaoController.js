class NegociacaoController {

    constructor() {

        let $ = document.querySelector.bind(document);
        this._inputData = $('#data');
        this._inputQuantidade = $('#quantidade');
        this._inputValor = $('#valor');

        this._listaNegociacoes = new Bind(
            new ListaNegociacoes(),
            new NegociacoesView($('#negociacoesView')),
            'adiciona', 'esvazia'
        );

        this._mensagem = new Bind(
            new Mensagem(),
            new MensagemView($('#mensagemView')),
            'texto'
        );
    }

    adiciona(event) {

        event.preventDefault();
        this._listaNegociacoes.adiciona(this._criaNegociacao());
        this._mensagem.texto = 'Negociação adicionada com sucesso!';
        this._limpaFormulario();
    }

    importaNegociacoes() {

        let service = new NegociacaoService();

        Promise.all([
                service.obterNegociacoesSemana(),
                service.obterNegociacoesSemanaAnterior(),
                service.obterNegociacoesSemanaRetrasada()
            ]).then(negociacoes => {
                negociacoes
                    .reduce((arrayAchatado, array) => arrayAchatado.concat(array), [])
                    .forEach(negociacao => this._listaNegociacoes.adiciona(negociacao));
                this._mensagem.texto = 'Negociações importadas com sucesso';
            })
            .catch(error => this._mensagem.texto = error);


        /* da problema no assincrono
        service.obterNegociacoesSemana()
            .then(negociacoes => {
                negociacoes.forEach(negociacao => this._listaNegociacoes.adiciona(negociacao))
                this._mensagem.texto = 'Negociações da semana obtida com sucesso';
            })
            .catch(erro => this._mensagem.texto = erro);
        */
        /* da problema no assincrono
        service.obterNegociacoesSemana((erro, negociacoes) => {

            if (erro) {
                this._mensagem.texto = erro;
                return;
            }

            negociacoes.forEach(negociacao => this._listaNegociacoes.adiciona(negociacao));
            service.obterNegociacoesSemanaRetrasada((erro, negociacoes) => {

                if (erro) {
                    this._mensagem.texto = erro;
                    return;
                }

                negociacoes.forEach(negociacao => this._listaNegociacoes.adiciona(negociacao));
                service.obterNegociacoesSemanaAnterior((erro, negociacoes) => {

                    if (erro) {
                        this._mensagem.texto = erro;
                        return;
                    }

                    negociacoes.forEach(negociacao => this._listaNegociacoes.adiciona(negociacao));
                    this._mensagem.texto = 'Negociações importadas com sucesso.';

                });
            });
        });
        */

    }

    apaga() {

        this._listaNegociacoes.esvazia();
        this._mensagem.texto = 'Negociações apagadas com sucesso';
    }

    _criaNegociacao() {

        return new Negociacao(
            DateHelper.textoParaData(this._inputData.value),
            this._inputQuantidade.value,
            this._inputValor.value
        );
    }

    _limpaFormulario() {

        this._inputData.value = ''
        this._inputQuantidade.value = 1;
        this._inputValor.value = 0.0;
        this._inputData.focus();
    }

}