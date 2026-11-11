
let estadoPokedex = {
    digitando: false,
}

let numPokemon = '';

const key1 = document.querySelector('#key-1');
const key2 = document.querySelector('#key-2');
const key3 = document.querySelector('#key-3');
const key4 = document.querySelector('#key-4');
const key5 = document.querySelector('#key-5');
const key6 = document.querySelector('#key-6');
const key7 = document.querySelector('#key-7');
const key8 = document.querySelector('#key-8');
const key9 = document.querySelector('#key-9');
const key10 = document.querySelector('#key-10');
const btnWhiteLeft = document.querySelector('#btn-white-left');
const btnWhiteRight = document.querySelector('#btn-white-right');
const btnUp = document.querySelector('#btn-up');
const btnDown = document.querySelector('#btn-down');
const btnLeft = document.querySelector('#btn-left');
const btnRight = document.querySelector('#btn-right');
const infoScreen = document.querySelector('#info-screen');
const mainScreen = document.querySelector('#main-screen');
const numberDisplay = document.querySelector('#number-display');

key1.addEventListener('click', () => leituraTeclado('1'));
key2.addEventListener('click', () => leituraTeclado('2'));
key3.addEventListener('click', () => leituraTeclado('3'));
key4.addEventListener('click', () => leituraTeclado('4'));
key5.addEventListener('click', () => leituraTeclado('5'));
key6.addEventListener('click', () => leituraTeclado('6'));
key7.addEventListener('click', () => leituraTeclado('7'));
key8.addEventListener('click', () => leituraTeclado('8'));
key9.addEventListener('click', () => leituraTeclado('9'));
key10.addEventListener('click', () => leituraTeclado('0'));
btnWhiteLeft.addEventListener('click', buscarPokemon);
btnWhiteRight.addEventListener('click', apagar);
btnUp.addEventListener('click', () => {
    pokeId = Number(numberDisplay.textContent.replaceAll('#', ''))
    pokeId += 10 
    console.log(pokeId)
    consultarApi(pokeId)
})
btnDown.addEventListener('click', () => {
    pokeId = Number(numberDisplay.textContent.replaceAll('#', ''))
    pokeId -= 10 
    console.log(pokeId)
    consultarApi(pokeId)
})
btnLeft.addEventListener('click', () => {
    pokeId = Number(numberDisplay.textContent.replaceAll('#', ''))
    pokeId -- 
    console.log(pokeId)
    consultarApi(pokeId)
})
btnRight.addEventListener('click', () => {
    pokeId = Number(numberDisplay.textContent.replaceAll('#', ''))
    pokeId ++ 
    console.log(pokeId)
    consultarApi(pokeId)
})

const sensibilidadeScroll = 0.4; 

infoScreen.addEventListener('wheel', function(event) {
    const precisaDeScroll = infoScreen.scrollHeight > infoScreen.clientHeight;
    
    if (precisaDeScroll) {
        event.stopPropagation();
        event.preventDefault();

        // Rola uma fração menor do deltaY nativo de forma linear
        infoScreen.scrollBy({
            top: event.deltaY * sensibilidadeScroll
        });
    }
}, { passive: false });

if(innerWidth <= 600){
    btnWhiteLeft.style.fontSize = '0.35rem'
    btnWhiteRight.style.fontSize = '0.35rem'
}

function leituraTeclado(tecla)
{
    if(!estadoPokedex.digitando)
    {
        infoScreen.textContent = '';
        estadoPokedex.digitando = true;
    }
    numPokemon += tecla;
    infoScreen.textContent = numPokemon;
}

function apagar()
{
    if(estadoPokedex.digitando)
    {
        numPokemon = numPokemon.slice(0, -1);
        if(numPokemon.length < 1)
        {
            estadoPokedex.digitando = false;
            infoScreen.textContent = 'Aguardando dados…';
            mainScreen.textContent = 'Nenhum Pokémon carregado'
            numberDisplay.textContent = '#000'
        }
        else
        {
            infoScreen.textContent = numPokemon;
        }
    }
}

async function consultarApi(msg)
{
    try
    {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${msg}`);
        const data = await response.json();
        console.log(data)
        atualizarNumero(data.id);
        const urlImage = data.sprites.front_default;
        exibirSprite(urlImage);
        exibirDados(data);
        
    }
    catch(erro)
    {
        alert('Pokémon não encontrado');
        numPokemon = ''
        apagar()  
    }
}

function buscarPokemon()
{
    if(estadoPokedex.digitando) consultarApi(numPokemon);
}

function exibirSprite(urlImage)
{
    mainScreen.textContent = '';
    const img = document.createElement('img');
    img.src = urlImage;
    //img.style.width = '150px';
    const larguraTela = window.innerWidth
    if(larguraTela > 600){
        img.style.width = '7.5rem';
    }else{
        img.style.width = '4.7rem';
    }

    img.style.transform = 'translate(0, -12px)';
    mainScreen.appendChild(img);
}

function atualizarNumero(id)
{

    let idString = id.toString();
    while(idString.length < 4) idString = '0' + idString;
    idString = '#' + idString;
    numberDisplay.textContent = idString;
}

let regiaoFinal = ''

async function geracaoRegiao(){
   try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon-species/' + numPokemon + '/')
        const data = await response.json()
        const regioes = {
            'generation-i': 'Kanto',
            'generation-ii': 'Johto',
            'generation-iii': 'Hoenn',
            'generation-iv': 'Sinnoh',
            'generation-v': 'Unova',
            'generation-vi': 'Kalos',
            'generation-vii': 'Alola',
            'generation-viii': 'Galar',
            'generation-ix': 'Paldea'
        }
        regiaoFinal = regioes[data.generation.name]
        return regiaoFinal  
    }
    catch(erro){
        regiaoFinal = 'Not Found'
        return regiaoFinal  
    }
}

let description = ''
async function descricao(){
    try {const response = await fetch('https://pokeapi.co/api/v2/pokemon-species/' + numPokemon + '/')
    const data = await response.json()
    description = data.flavor_text_entries[0].flavor_text.replaceAll('\f', ' ').replaceAll('\n', ' ')
    return description}
    catch(erro){
        description = 'Not Found'
        return description
    }
}

async function exibirDados(info){
    infoScreen.textContent = ''
    let tipos = info.types.map(type => type.type.name).join(', ')
    const nomeTipo = document.createElement('p')
    nomeTipo.textContent = (capitalizar(info.name) + ': ' + capitalizar(tipos))
    nomeTipo.style.fontWeight = 'bold'
    nomeTipo.style.fontSize = '1.2rem'
    const pesoAltura = document.createElement('p')
    pesoAltura.textContent = 'Weight: ' + info.weight/10 + 'kg' + ' | ' + 'Height: ' + info.height/10 + 'm'
    const regiao = document.createElement('p')
    regiao.textContent = 'Region: ' + await geracaoRegiao()
    const descricaoTexto = document.createElement('p')
    descricaoTexto.textContent = 'Description: ' + await descricao()
    infoScreen.append(nomeTipo, pesoAltura, regiao, descricaoTexto)
    numPokemon = ''
}

function capitalizar(str){
    const strCapitalizada = str.charAt(0).toUpperCase() + str.slice(1)
    return strCapitalizada
}