export interface Santo {
  nome: string;
  historia: string;
  virtudes: string[];
  icone?: string;
}

export interface SantosData {
  [mesDia: string]: Santo;
}

const santos: SantosData = {
  "01-01": {
    nome: "Santa Maria, Mãe de Deus",
    historia:
      "Em 1 de janeiro celebramos a solenidade de Maria como Mãe de Deus. Maria, escolhida antes dos séculos para ser a Mãe do Filho de Deus, disse 'sim' ao plano divino com total entrega. Ela é a Theotokos (Mãe de Deus), honrada pela Igreja universal como a mais excelsa das criaturas.",
    virtudes: ["Humildade", "Fé", "Obediência", "Amor materno"],
  },
  "01-06": {
    nome: "Santos Reis Magos (Epifania)",
    historia:
      "Os Magos do Oriente, guiados por uma estrela, viajaram longas distâncias para adorar o recém-nascido Jesus em Belém. Apresentando ouro, incenso e mirra, foram os primeiros gentios a reconhecer Cristo como Rei, Deus e Homem destinado à paixão.",
    virtudes: ["Sabedoria", "Perseverança", "Adoração", "Generosidade"],
  },
  "01-13": {
    nome: "Santo Hilário de Poitiers",
    historia:
      "Bispo e Doutor da Igreja do século IV, Santo Hilário foi um dos grandes defensores da divindade de Cristo contra a heresia ariana. Exilado por causa de sua fé, usou o tempo para escrever obras teológicas brilhantes. É chamado de 'Atanásio do Ocidente'.",
    virtudes: ["Coragem", "Sabedoria", "Fidelidade à fé", "Perseverança"],
  },
  "01-17": {
    nome: "Santo Antônio do Deserto (Abade)",
    historia:
      "Nascido no Egito em 251 d.C., Santo Antônio abandonou sua fortuna para viver em solidão no deserto. Fundador do monasticismo cristão, passou décadas em oração intensa e combate espiritual. Sua vida foi narrada por Santo Atanásio e influenciou gerações de monges.",
    virtudes: ["Penitência", "Oração", "Humildade", "Fortaleza"],
  },
  "01-20": {
    nome: "São Sebastião",
    historia:
      "Oficial do exército romano no século III, Sebastião era cristão secreto que sustentava os companheiros na fé. Descoberto, foi condenado a ser flechado e deixado por morto, mas sobreviveu. Ao confrontar o imperador Diocleciano, foi executado com paus. É padroeiro dos soldados e atletas.",
    virtudes: ["Coragem", "Fidelidade", "Fortaleza", "Testemunho"],
  },
  "01-24": {
    nome: "São Francisco de Sales",
    historia:
      "Bispo de Genebra do século XVI/XVII, São Francisco de Sales é o padroeiro dos jornalistas e escritores católicos. Utilizou panfletos e escritos para reconverter calvinistas. Sua obra 'Introdução à Vida Devota' continua sendo um clássico espiritual para leigos.",
    virtudes: ["Mansidão", "Paciência", "Amabilidade", "Sabedoria"],
  },
  "01-28": {
    nome: "São Tomás de Aquino",
    historia:
      "Doutor da Igreja e maior teólogo da escolástica medieval, São Tomás de Aquino nasceu na Itália em 1225. Sua monumental 'Suma Teológica' sintetizou fé e razão de forma magistral. É padroeiro das universidades católicas e dos estudantes.",
    virtudes: ["Inteligência", "Humildade", "Contemplação", "Prudência"],
  },
  "02-02": {
    nome: "Apresentação do Senhor (Nossa Senhora das Candeias)",
    historia:
      "Quarenta dias após o Natal, Maria e José apresentaram Jesus no Templo de Jerusalém, cumprindo a Lei de Moisés. O ancião Simeão reconheceu o Messias e profetizou a espada que atravessaria a alma de Maria. É o dia em que se bênçoam as velas na Igreja.",
    virtudes: ["Obediência à Lei", "Fé", "Gratidão", "Reconhecimento"],
  },
  "02-03": {
    nome: "São Brás",
    historia:
      "Bispo de Sebaste na Armênia no século IV, São Brás é venerado como curador das doenças da garganta. Segundo a tradição, curou um menino que engoliu uma espinha de peixe. Mártir sob o imperador Licínio, é invocado com a bênção das gargantas em sua festa.",
    virtudes: ["Misericórdia", "Caridade", "Coragem", "Fé"],
  },
  "02-14": {
    nome: "São Valentim",
    historia:
      "Presbítero romano do século III, São Valentim foi martirizado por celebrar casamentos cristãos quando o imperador Cláudio II proibiu os matrimônios de soldados. Sua associação com o amor romântico cresceu na Idade Média, tornando-o símbolo do amor cristão e conjugal.",
    virtudes: ["Amor", "Coragem", "Fidelidade", "Compaixão"],
  },
  "02-22": {
    nome: "Cátedra de São Pedro",
    historia:
      "Esta solenidade celebra a autoridade conferida por Cristo a Pedro como fundamento da Igreja. 'Tu és Pedro e sobre esta pedra edificarei minha Igreja' (Mt 16,18). A cátedra episcopal de Roma representa a continuidade do magistério apostólico e a unidade da Igreja.",
    virtudes: ["Autoridade", "Humildade", "Fidelidade", "Serviço"],
  },
  "03-07": {
    nome: "Santas Perpétua e Felicidade",
    historia:
      "Mártires cartaginesas do século III, Perpétua era uma jovem nobre e Felicidade, sua escrava grávida. Ambas se recusaram a sacrificar aos deuses romanos e foram condenadas às feras. Os diários de Perpétua na prisão são um dos primeiros escritos cristãos de uma mulher.",
    virtudes: ["Coragem", "Fé inabalável", "Amor fraterno", "Perseverança"],
  },
  "03-17": {
    nome: "São Patrício",
    historia:
      "Padroeiro da Irlanda, São Patrício nasceu na Bretanha no século V. Capturado por piratas aos 16 anos e escravizado na Irlanda, viveu anos de oração intensa. Fugiu, foi ordenado bispo e voltou à Irlanda para evangelizá-la completamente, usando o trevo para explicar a Santíssima Trindade.",
    virtudes: ["Perseverança", "Coragem missionária", "Perdão", "Fé"],
  },
  "03-19": {
    nome: "São José",
    historia:
      "Esposo de Maria e pai adotivo de Jesus, São José foi escolhido por Deus para ser o guardião do Filho de Deus. Descendente da linhagem de Davi, era carpinteiro em Nazaré. Silencioso e fiel, protegeu a Sagrada Família na fuga ao Egito e criou Jesus com amor paterno. É padroeiro da Igreja universal, dos trabalhadores e da família.",
    virtudes: ["Humildade", "Obediência", "Fé", "Trabalho", "Prudência"],
  },
  "03-25": {
    nome: "Anunciação do Senhor",
    historia:
      "Neste dia celebramos o momento em que o Anjo Gabriel anunciou a Maria que ela seria a Mãe de Deus. Com seu 'Eis aqui a serva do Senhor', Maria aceitou o plano divino e o Verbo se encarnou em seu seio virginal. É o início da redenção da humanidade.",
    virtudes: ["Fé", "Obediência", "Humildade", "Entrega"],
  },
  "04-04": {
    nome: "São Isidoro de Sevilha",
    historia:
      "Arcebispo de Sevilha nos séculos VI-VII, São Isidoro foi um dos maiores intelectuais da Europa medieval. Suas 'Etimologias' foram a primeira enciclopédia do mundo ocidental. Reformou a Igreja na Espanha e é hoje padroeiro da internet e dos internautas.",
    virtudes: ["Sabedoria", "Humildade", "Diligência", "Universalidade"],
  },
  "04-07": {
    nome: "São João Batista de La Salle",
    historia:
      "Fundador dos Irmãos das Escolas Cristãs no século XVII, São João Batista de La Salle dedicou sua vida à educação dos pobres. Renunciou a seu cânon e fortuna para viver entre os professores. É padroeiro dos educadores e professores.",
    virtudes: ["Serviço", "Generosidade", "Dedicação", "Humildade"],
  },
  "04-23": {
    nome: "São Jorge",
    historia:
      "Mártir do século III e um dos santos mais venerados do Oriente e Ocidente, São Jorge era oficial romano cristão que recusou apostatar. A lenda do dragão simboliza a vitória do bem sobre o mal. Padroeiro da Inglaterra, Portugal, Brasil (estado de São Paulo) e de muitas nações.",
    virtudes: ["Coragem", "Fé", "Nobreza", "Proteção dos fracos"],
  },
  "04-25": {
    nome: "São Marcos Evangelista",
    historia:
      "Autor do segundo Evangelho, São Marcos foi discípulo de São Pedro e companheiro de São Paulo. Seu Evangelho, o mais curto dos quatro, destaca a humanidade e as obras de Jesus com linguagem viva e direta. Fundou a Igreja de Alexandria e foi mártir no Egito.",
    virtudes: ["Fidelidade", "Serviço apostólico", "Coragem", "Humildade"],
  },
  "05-01": {
    nome: "São José Operário",
    historia:
      "Em 1 de maio, dia do trabalho, a Igreja celebra São José Operário. João Paulo II estabeleceu esta festa em 1955 para consagrar o trabalho humano à proteção de José. O pai terreno de Jesus, artesão em Nazaré, santificou o trabalho manual pelo qual sustentou a Sagrada Família.",
    virtudes: ["Trabalho", "Dignidade humana", "Responsabilidade", "Fidelidade"],
  },
  "05-03": {
    nome: "Santos Filipe e Tiago Apóstolo",
    historia:
      "Filipe foi chamado diretamente por Jesus e trouxe Natanael (Bartolomeu) ao Senhor. Tiago, irmão do Senhor e primeiro bispo de Jerusalém, presidiu o Concílio de Jerusalém. Sua carta canônica insiste na fé viva pelas obras. Ambos deram a vida pelo Evangelho.",
    virtudes: ["Fé", "Obediência", "Missão", "Coragem"],
  },
  "05-13": {
    nome: "Nossa Senhora de Fátima",
    historia:
      "Em 13 de maio de 1917, a Virgem Maria apareceu a três pastorinhos — Lúcia, Francisco e Jacinta — em Fátima, Portugal. Ao longo de seis aparições, pediu oração, penitência e consagração ao Imaculado Coração de Maria. O milagre do sol em outubro de 1917 foi testemunhado por 70 mil pessoas.",
    virtudes: ["Oração", "Penitência", "Fidelidade", "Esperança"],
  },
  "05-15": {
    nome: "São Isidoro Lavrador",
    historia:
      "Camponês espanhol do século XII, São Isidoro viveu toda sua vida trabalhando nos campos de Madrid. Conhecido por sua piedade profunda e caridade extrema com os pobres, é venerado como padroeiro dos agricultores e das zonas rurais. Seu casamento com Santa Maria de la Cabeza é exemplo de santidade conjugal.",
    virtudes: ["Simplicidade", "Trabalho", "Caridade", "Oração"],
  },
  "05-26": {
    nome: "São Filipe Neri",
    historia:
      "Fundador da Congregação do Oratório no século XVI, São Filipe Neri era conhecido por sua alegria contagiante e humor. 'Santo alegre' de Roma, atraía multidões com seu jeito descontraído de falar de Deus. É padroeiro de Roma e da juventude.",
    virtudes: ["Alegria", "Humildade", "Apostolado", "Oração"],
  },
  "05-31": {
    nome: "Visitação de Nossa Senhora",
    historia:
      "Após a Anunciação, Maria foi visitar sua prima Isabel, que estava grávida de João Batista. Ao ouvir a saudação de Maria, João saltou de alegria no ventre de Isabel. É quando Maria proclama o Magnificat, o mais belo cântico de louvor das Escrituras.",
    virtudes: ["Caridade", "Serviço", "Humildade", "Alegria"],
  },
  "06-13": {
    nome: "Santo Antônio de Pádua",
    historia:
      "Nascido em Lisboa em 1195, Santo Antônio entrou para os Franciscanos após ver os mártires. Pregador extraordinário, doutor da Igreja e taumaturgo famoso, suas pregações convertiam multidões. Morreu aos 36 anos deixando um legado imenso. É o mais popular santo do Brasil, padroeiro dos pobres e dos objetos perdidos.",
    virtudes: ["Humildade", "Generosidade", "Sabedoria", "Amor aos pobres"],
  },
  "06-24": {
    nome: "Natividade de São João Batista",
    historia:
      "Único santo além de Maria e Jesus cujo nascimento é celebrado pela Igreja, João Batista foi enviado por Deus para preparar o caminho do Messias. 'Voz que clama no deserto', ele batizou Jesus no Jordão e morreu decapitado por denunciar o adultério do rei Herodes.",
    virtudes: ["Profetismo", "Coragem", "Austoridade", "Fidelidade"],
  },
  "06-29": {
    nome: "Santos Pedro e Paulo",
    historia:
      "A maior solenidade apostólica celebra os dois pilares da Igreja. Pedro, o pescador de Galileia, recebeu as chaves do Reino. Paulo, o fariseu perseguidor, tornou-se o maior missionário. Ambos morreram em Roma por ordem de Nero, fundando a tradição da Igreja de Roma.",
    virtudes: ["Fé", "Missão", "Coragem", "Liderança"],
  },
  "07-11": {
    nome: "São Bento (Padroeiro da Europa)",
    historia:
      "Fundador do monasticismo ocidental, São Bento nasceu em Núrsia em 480 d.C. Sua 'Regra de São Bento', resumida no binômio 'Ora et Labora' (Ora e Trabalha), moldou a cultura e a civilização da Europa medieval. É padroeiro da Europa e protetor contra o veneno e as feitiçarias.",
    virtudes: ["Oração", "Trabalho", "Obediência", "Equilíbrio"],
  },
  "07-22": {
    nome: "Santa Maria Madalena",
    historia:
      "Das sete demônios expulsos por Jesus, Maria Madalena tornou-se uma das discípulas mais fiéis. Esteve ao pé da Cruz e foi a primeira a ver Cristo ressuscitado — por isso é chamada 'Apóstola dos Apóstolos'. Representa o poder da misericórdia divina que transforma.",
    virtudes: ["Amor", "Fidelidade", "Arrependimento", "Coragem"],
  },
  "07-25": {
    nome: "São Tiago Apóstolo",
    historia:
      "Irmão de São João e filho de Zebedeu, São Tiago foi o primeiro apóstolo a sofrer o martírio, decapitado por Herodes Agripa. Seu túmulo em Santiago de Compostela (Espanha) é o terceiro maior destino de peregrinação cristã do mundo. Padroeiro da Espanha.",
    virtudes: ["Fé", "Coragem", "Missão", "Generosidade"],
  },
  "08-04": {
    nome: "São João Maria Vianney (Cura d'Ars)",
    historia:
      "Pároco da pequena aldeia de Ars na França do século XIX, São João Vianney atraía multidões de todo o país. Chegava a passar 16 horas por dia no confessionário. Dormia apenas algumas horas e vivia em extrema pobreza. É o padroeiro universal dos sacerdotes.",
    virtudes: ["Penitência", "Caridade", "Humildade", "Pastoral"],
  },
  "08-10": {
    nome: "São Lourenço",
    historia:
      "Diácono da Igreja de Roma no século III, São Lourenço foi martirizado no ano 258 d.C. Quando o prefeito romano exigiu os tesouros da Igreja, Lourenço apresentou os pobres dizendo: 'Estes são os tesouros da Igreja'. Foi queimado vivo numa grelha, tornando-se padroeiro dos cozinheiros e pobres.",
    virtudes: ["Caridade", "Coragem", "Alegria", "Pobreza evangélica"],
  },
  "08-15": {
    nome: "Assunção de Nossa Senhora",
    historia:
      "A maior solenidade mariana celebra a elevação de Maria — corpo e alma — ao Céu ao fim de sua vida terrena. Dogma definido por Pio XII em 1950, a Assunção é a antecipação em Maria do destino final de todo cristão: a ressurreição gloriosa.",
    virtudes: ["Fé", "Pureza", "Entrega total", "Esperança"],
  },
  "08-22": {
    nome: "Queenship of Mary (Nossa Senhora Rainha)",
    historia:
      "Oito dias após a Assunção, a Igreja celebra Maria como Rainha do Céu e da Terra. Seu reinado não é de poder, mas de serviço e maternidade. Como Mãe de Cristo Rei, ela intercede por todos os filhos de Deus. Esta festa foi estabelecida por Pio XII em 1954.",
    virtudes: ["Serviço", "Maternidade", "Intercessão", "Humildade"],
  },
  "08-28": {
    nome: "Santo Agostinho",
    historia:
      "Doutor da Igreja e um dos maiores pensadores da história, Santo Agostinho nasceu em 354 d.C. em Tagaste, África. Após uma juventude turbulenta, converteu-se pelo exemplo da mãe Santa Mônica e pelos sermões de Santo Ambrósio. Bispo de Hipona, escreveu 'Confissões' e 'A Cidade de Deus'.",
    virtudes: ["Inteligência", "Arrependimento", "Amor a Deus", "Sabedoria"],
  },
  "08-29": {
    nome: "Martírio de São João Batista",
    historia:
      "João Batista foi preso por Herodes Antipas por denunciar seu casamento adúltero com Herodíade. Por ocasião de um banquete, a filha de Herodíade dançou e pediu a cabeça de João. Herodes, constrangido perante os convidados, ordenou a decapitação do profeta.",
    virtudes: ["Profetismo", "Integridade", "Coragem", "Martírio"],
  },
  "09-08": {
    nome: "Natividade de Nossa Senhora",
    historia:
      "A Igreja celebra o nascimento de Maria como aurora da salvação. Filha de Joaquim e Ana, Maria nasceu imaculada pelo privilégio divino em preparação para ser Mãe de Deus. Seu nascimento encheu de alegria o mundo inteiro, pois dela nasceria o Sol da Justiça.",
    virtudes: ["Pureza", "Humildade", "Graça", "Fidelidade"],
  },
  "09-14": {
    nome: "Exaltação da Santa Cruz",
    historia:
      "Esta solenidade comemora a descoberta da verdadeira Cruz por Santa Helena, mãe do imperador Constantino, em 320 d.C. A Cruz, instrumento de morte, tornou-se símbolo de vitória e redenção. 'Nós adoramos Tua Cruz, Senhor, e louvamos Tua santa ressurreição.'",
    virtudes: ["Fé", "Adoração", "Gratidão", "Esperança"],
  },
  "09-15": {
    nome: "Nossa Senhora das Dores",
    historia:
      "No dia após a exaltação da Santa Cruz, a Igreja contempla os sete sofrimentos de Maria: a profecia de Simeão, a fuga ao Egito, o menino perdido no Templo, o caminho do Calvário, a Crucificação, a descida da Cruz e o sepultamento. Maria 'co-redentora' participa do sofrimento do Filho.",
    virtudes: ["Fortaleza", "Fidelidade", "Compaixão", "Esperança"],
  },
  "09-29": {
    nome: "Santos Arcanjos Miguel, Gabriel e Rafael",
    historia:
      "A Igreja celebra os três arcanjos nomeados nas Escrituras: Miguel (Quem como Deus), chefe dos exércitos celestiais; Gabriel (Força de Deus), mensageiro da Anunciação; Rafael (Medicina de Deus), guia de Tobias. São os grandes intercessores e protetores da humanidade.",
    virtudes: ["Fidelidade", "Serviço", "Proteção", "Mensageirismo"],
  },
  "10-01": {
    nome: "Santa Teresinha do Menino Jesus",
    historia:
      "Carmelita descalça francesa do século XIX, Santa Teresinha morreu de tuberculose aos 24 anos. Sua autobiografia 'História de uma Alma' revelou o 'Caminho Pequeno' — uma espiritualidade de infância espiritual e confiança total. É Doutora da Igreja e padroeira das missões.",
    virtudes: ["Humildade", "Confiança", "Pequenez", "Amor"],
  },
  "10-04": {
    nome: "São Francisco de Assis",
    historia:
      "Filho de um rico comerciante de Assis, Francisco renunciou a tudo em 1206 para seguir Cristo pobre. Fundou os Frades Menores, as Clarissas e a Ordem Terceira. Recebeu os estigmas em 1224 e compôs o belíssimo 'Cântico das Criaturas'. Padroeiro da Ecologia e dos animais.",
    virtudes: ["Pobreza", "Humildade", "Alegria", "Amor à criação"],
  },
  "10-07": {
    nome: "Nossa Senhora do Rosário",
    historia:
      "Esta festa celebra a devoção mariana mais difundida do mundo. A tradição atribui o Rosário a São Domingos e comemora a vitória de Lepanto em 1571, quando a frota cristã derrotou os turcos otomanos após intensas orações do Rosário. João Paulo II acrescentou os mistérios luminosos em 2002.",
    virtudes: ["Oração", "Meditação", "Fidelidade", "Confiança"],
  },
  "10-15": {
    nome: "Santa Teresa d'Ávila",
    historia:
      "Mística e reformadora carmelita do século XVI, Santa Teresa fundou 17 mosteiros reformados e escreveu obras místicas magistrais: 'Caminho de Perfeição', 'O Castelo Interior' e 'Livro da Vida'. Foi a primeira mulher declarada Doutora da Igreja por Paulo VI em 1970.",
    virtudes: ["Oração", "Determinação", "Amor a Deus", "Sabedoria"],
  },
  "10-18": {
    nome: "São Lucas Evangelista",
    historia:
      "Médico e discípulo de São Paulo, São Lucas escreveu o terceiro Evangelho e os Atos dos Apóstolos. Seu Evangelho destaca a misericórdia de Jesus, as mulheres, os pobres e a alegria. Padroeiro dos médicos, pintores e artistas. Teria pintado o primeiro retrato de Nossa Senhora.",
    virtudes: ["Atenção ao próximo", "Compaixão", "Arte", "Missão"],
  },
  "10-28": {
    nome: "Santos Simão e Judas Tadeu Apóstolos",
    historia:
      "Simão o Zelote e Judas Tadeu (não o Iscariotes) são celebrados juntos. Judas Tadeu escreveu uma das cartas canônicas do Novo Testamento e é invocado como padroeiro das causas impossíveis e desesperadas. Simão evangelizou a Pérsia e o Egito.",
    virtudes: ["Fidelidade", "Perseverança", "Missão", "Esperança"],
  },
  "11-01": {
    nome: "Todos os Santos",
    historia:
      "A solenidade de Todos os Santos celebra a comunhão com todos os que já alcançaram a glória eterna, conhecidos ou desconhecidos pela Igreja. A multidão inumerável de santos proclama que a santidade é possível para todos — cada cristão é chamado à santidade.",
    virtudes: ["Santidade", "Comunhão", "Esperança", "Fidelidade"],
  },
  "11-02": {
    nome: "Comemoração dos Fiéis Defuntos",
    historia:
      "O Dia de Finados é um dia de oração e sufrágio pelos fiéis que morreram e podem ainda estar em purificação no Purgatório. A doutrina católica do Purgatório afirma que a oração dos vivos pode ajudar os mortos na preparação definitiva para o encontro com Deus.",
    virtudes: ["Caridade", "Esperança", "Compaixão", "Fidelidade"],
  },
  "11-09": {
    nome: "Dedicação da Basílica de Latrão",
    historia:
      "A Basílica de São João de Latrão em Roma é a catedral do Papa — 'Mater et Caput' (Mãe e Cabeça) de todas as igrejas do mundo. Sua dedicação celebra a unidade de toda a Igreja em torno do Bispo de Roma. Construída por Constantino no século IV, é a mais antiga basílica papal.",
    virtudes: ["Unidade", "Fidelidade", "Comunhão", "Catolicidade"],
  },
  "11-11": {
    nome: "São Martinho de Tours",
    historia:
      "Soldado romano convertido ao Cristianismo, São Martinho é famoso por ter partido sua capa com um mendigo. Tornou-se monge e depois bispo de Tours. É um dos patronos da França e de Portugal. Sua festa (dia de São Martinho) está ligada às festas da castanha e do vinho novo.",
    virtudes: ["Caridade", "Generosidade", "Misericórdia", "Simplicidade"],
  },
  "11-22": {
    nome: "Santa Cecília",
    historia:
      "Mártir romana dos séculos II-III, Santa Cecília é venerada como padroeira da música e dos músicos. A tradição diz que, em seu casamento, enquanto o órgão tocava, ela cantava em seu coração a Deus. Ao ser martirizada, sobreviveu por três dias cantando louvores.",
    virtudes: ["Fé", "Pureza", "Arte", "Martírio"],
  },
  "11-24": {
    nome: "São André Dũng-Lạc e companheiros",
    historia:
      "São André Dũng-Lạc e seus 116 companheiros são os mártires do Vietnã, canonizados por João Paulo II em 1988. Sacerdotes, religiosos e leigos vietnamitas, foram executados entre 1745 e 1862 por recusar-se a apostatar da fé católica durante as perseguições imperiais.",
    virtudes: ["Martírio", "Fidelidade", "Coragem", "Solidariedade"],
  },
  "11-30": {
    nome: "São André Apóstolo",
    historia:
      "Primeiro discípulo chamado por Jesus (por isso chamado 'Protocleto'), São André era irmão de Simão Pedro e pescador na Galileia. Evangelizou a Grécia, Ásia Menor e Escícia. Morreu crucificado em uma cruz em X (Cruz de Santo André) em Patras, na Grécia. Padroeiro da Escócia e da Rússia.",
    virtudes: ["Prontidão", "Missão", "Fraternidade", "Martírio"],
  },
  "12-03": {
    nome: "São Francisco Xavier",
    historia:
      "Co-fundador da Companhia de Jesus com Santo Inácio, Francisco Xavier foi o maior missionário da era moderna. Em dez anos evangelizou a Índia, o Ceilão, o Japão e outras nações da Ásia, batizando dezenas de milhares de pessoas. Morreu em 1552 tentando entrar na China. Padroeiro das missões.",
    virtudes: ["Ardor missionário", "Coragem", "Abnegação", "Oração"],
  },
  "12-06": {
    nome: "São Nicolau",
    historia:
      "Bispo de Mira (atual Turquia) no século IV, São Nicolau é famoso por sua generosidade extrema, especialmente para com as crianças e os pobres. Sua tradição de presentes secretos noturnos tornou-se o fundamento do Papai Noel. É padroeiro das crianças, marinheiros e dos estudiantes.",
    virtudes: ["Generosidade", "Caridade", "Humildade", "Proteção"],
  },
  "12-08": {
    nome: "Imaculada Conceição de Maria",
    historia:
      "Dogma definido pelo Papa Pio IX em 1854, a Imaculada Conceição proclama que Maria foi preservada do pecado original desde o primeiro instante de sua concepção. 'Sou a Imaculada Conceição', disse Nossa Senhora em Lourdes em 1858. É a padroeira dos Estados Unidos e do Brasil.",
    virtudes: ["Pureza", "Graça", "Santidade", "Eleição divina"],
  },
  "12-12": {
    nome: "Nossa Senhora de Guadalupe",
    historia:
      "Em 1531, a Virgem Maria apareceu ao índio Juan Diego em Tepeyac, México. Pediu a construção de um santuário e deixou sua imagem milagrosa impressa no manto de Juan Diego. A devoção a Guadalupe converteu milhões de índios e é o maior fenômeno de evangelização das Américas. Padroeira da América Latina.",
    virtudes: ["Misericórdia", "Maternidade", "Missão", "Esperança"],
  },
  "12-13": {
    nome: "Santa Luzia",
    historia:
      "Virgem e mártir siciliana do século IV, Santa Luzia recusou um casamento nobre para consagrar-se a Deus. Denunciada ao governador romano, foi condenada. Seu nome significa 'luz' e é invocada para doenças dos olhos. Padroeira dos cegos e dos oftalmologistas.",
    virtudes: ["Pureza", "Consagração", "Coragem", "Fé"],
  },
  "12-26": {
    nome: "São Estêvão Proto-Mártir",
    historia:
      "Primeiro mártir cristão da história, São Estêvão era diácono de extraordinária fé e sabedoria. Acusado de blasfêmia, pronunciou um longo discurso aos sacerdotes e foi apedrejado, perdoando seus algozes. Entre os que consentiam em sua morte estava Saulo de Tarso, futuro São Paulo.",
    virtudes: ["Fidelidade", "Perdão", "Coragem", "Caridade"],
  },
  "12-27": {
    nome: "São João Apóstolo e Evangelista",
    historia:
      "O 'discípulo amado' que repousou na última ceia no peito do Senhor, São João foi o único apóstolo presente na Crucificação. Escreveu o quarto Evangelho, três cartas e o Apocalipse. Acolheu Maria por mandato de Jesus. Morreu em Éfeso em idade avançada — o único apóstolo a não morrer mártir.",
    virtudes: ["Amor", "Contemplação", "Fidelidade", "Sabedoria"],
  },
  "12-28": {
    nome: "Santos Inocentes",
    historia:
      "Os Santos Inocentes são os meninos de Belém e arredores, com até dois anos, mandados matar por Herodes para eliminar o recém-nascido Jesus. São as primeiras vítimas inocentes por causa de Cristo — mártires sem o terem querido. A Igreja os venera como flores que o inverno colheu antes de florescer.",
    virtudes: ["Inocência", "Martírio", "Pureza", "Vítima expiatória"],
  },
};

export default santos;
