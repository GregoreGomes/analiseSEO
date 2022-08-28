var ponto = 0;
var urls = '';
var palavraChave = '';
var arrayPalavraChave = '';


const lastStepContainer = document.querySelector('#last-step');
const loaderStep = document.querySelector('#loader');

const VALIDACAO_URL =
'http://localhost:3000/validacao';

// valida titulo, mat tag description, h1 e h2

const address = () =>
    fetch(VALIDACAO_URL)
    .then(response => response.json())
    .then(user => user)
    .catch(error => alert('Erro na rota validacao', error));

const printAddress = async() => {
    var array = await address();
    urls = array.url;
    palavraChave = array.palavraChave.toUpperCase().replace(/,/g, '').split(' ');
    arrayPalavraChave = palavraChave.filter(function(i) {
        return i;
    });
    contCharacter(array);
    hasHeadingTags(array);
    hasImplementation();

    printAddressValidator();
};

// valida se ha erros no html

const VERIFY_IF_IS_A_VALID_URL =
'http://localhost:3000/respostaW3';

const addressValidator = () =>
    fetch(VERIFY_IF_IS_A_VALID_URL)
    .then(response => response.json())
    .then(user => {
        return user;
    })
    .catch(error => alert('Erro na rota respostaW3', error));

const printAddressValidator = async() => {
    var arrayValidator = await addressValidator();

    lastStepContainer.style.display = 'block';
    loaderStep.style.display = 'none';

    setTimeout(() => {
        init();
        confereErroHtml(arrayValidator);
    }, 1000);
};

//

function templateText(divName, divText) {
    var divNova = document.createElement('div');
    var conteudoNovo = document.createTextNode(divText);
    divNova.classList.add(divName);
    divNova.appendChild(conteudoNovo);

    var divAtual = document.querySelector(`.${divName}`);
    document.body.insertBefore(divNova, divAtual);
}

function confereErroHtml(array) {
    if (array.hasError != '') {
        templateText('align-text', 'Contém erros no html');
    } else {
        ponto++;
    }
}

function hasImplementation() {
    if (urls.includes('https:/') || urls.includes('http:/')) {
        ImplementationValidate(urls);
    } else {
        alert('Insira a url completa');
    }
}

function hasHeadingTags(array) {
    if (array.h1Tag != '' && array.h2Tag != '') {
        ponto++;
    } else if (array.h1Tag == '') {
        templateText('align-text', 'Não há tag h1');
    } else if (array.h2Tag == '') {
        templateText('align-text', 'Não há tag h2');
    } else {
        templateText('align-text', 'Não há tag h1 e h2');
    }

    arrayPalavraChave.forEach(e => {
        if (array.h2Tag.includes(e)) {
            ponto++;
            array.h1Tag = '';
            array.h2Tag = '';
        }
    });

    if (array.h2Tag != '') {
        templateText('align-text', `Não contém as palavras chaves no h2.`);
    }

    arrayPalavraChave.forEach(e => {
        if (array.h1Tag.includes(e)) {
            ponto++;
            array.h1Tag = '';
            array.h2Tag = '';
        }
    });

    if (array.h1Tag != '') {
        templateText('align-text', `Não contém as palavras chaves no h1.`);
    }
}

function ImplementationValidate(valueUrl) {
    if (valueUrl.includes('https:/')) {
        ponto++;
    } else {
        templateText('align-text', 'Sem HTTPS');
    }
}

function contCharacter(array) {
    const charactersTitle = array.title.length;
    const charactersMetaTagDescription = array.metaTagDescription.length;

    if (charactersTitle >= 55 && charactersTitle <= 65) {
        ponto++;
    } else {
        templateText('align-text', 'Título com menos de 55 caracteres ou mais de 65');
    }

    if (array.title.includes(array.palavraChave)) {
        templateText('align-text', `Não contém palavras chave no título.`);
    }

    if (charactersTitle) {
        arrayPalavraChave.forEach(e => {
            if (array.title.includes(e)) {
                ponto++;
                array.title = '';
            }
        });
    }

    if (charactersMetaTagDescription) {
        arrayPalavraChave.forEach(e => {
            if (array.metaTagDescription.includes(e)) {
                ponto++;
                array.metaTagDescription = '';
            }
        });
        if (charactersMetaTagDescription >= 145 && charactersMetaTagDescription <= 165) {
            ponto++;
        } else {
            templateText('align-text', 'Meta tag description com menos de 145 caracteres ou mais de 165');
        }

        if (array.metaTagDescription != '') {
            templateText('align-text', `Não contém as palavras chave pesquisadas`);
        }
    }
}

// parte visual da pontuaçao

function calcPontos() {
    var pontuacao = ponto * 12.5;
    return pontuacao;
}

function init() {
    $(document).ready(function() {
        $('.my-progress-bar')
            .circularProgress({
                line_width: 20,
                color: '#F9EC31',
                starting_position: 25,
                percent: calcPontos()
            })
            .circularProgress('animate', calcPontos(), 1000);
    });
}