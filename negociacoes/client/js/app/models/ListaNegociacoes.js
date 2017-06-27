class ListaNegociacoes{
    
    constructor(){

        this._negociacoes = [];
    }

    adiciona(negociacao){

        this._negociacoes.push(negociacao);
        }

    get negociacoes(){
        
        return [].concat(this._negociacoes); //cria uma copia da lista de negociações
    }

    esvazia(){

        this._negociacoes = [];
    }

}