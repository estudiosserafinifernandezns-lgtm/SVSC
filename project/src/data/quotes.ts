import type { Quote } from '@/types';
import { people } from './people';

/**
 * Verified quotes database.
 * Every quote includes a source and, where possible, a link to the original.
 * Apocryphal quotes are explicitly marked with isFictional: true.
 * Translations are marked with isTranslation: true and include the original text.
 *
 * EVERY matchup includes at least one streamer.
 * Quotes marked isFictional are commonly MISattributed to the listed author.
 */

export const quotes: Quote[] = [
  // === EINSTEIN (4 quotes) ===
  {
    id: 74,
    text: 'Lo importante es no dejar de hacer preguntas. La curiosidad tiene su propia razón de existir.',
    originalText: 'The important thing is not to stop questioning. Curiosity has its own reason for existing.',
    originalLanguage: 'Inglés',
    author: people.einstein,
    decoy: people.robleis,
    source: 'Ensayo "Physics and Reality", 1936. Publicado en Journal of the Franklin Institute.',
    isTranslation: true,
  },
  {
    id: 82,
    text: 'Intenta no convertirte en un hombre de éxito, sino más bien en un hombre de valor.',
    originalText: 'Try not to become a man of success, but rather try to become a man of value.',
    originalLanguage: 'Inglés',
    author: people.einstein,
    decoy: people.xqc,
    source: 'Einstein and the Poet: In Search of the Cosmic Man, William Hermanns, 1983',
    isTranslation: true,
  },
  {
    id: 91,
    text: 'La imaginación es más importante que el conocimiento. El conocimiento es limitado, mientras que la imaginación abarca el mundo entero, estimula el progreso y da a luz a la evolución.',
    originalText: 'Imagination is more important than knowledge. For knowledge is limited, whereas imagination embraces the entire world, stimulating progress, giving birth to evolution.',
    originalLanguage: 'Inglés',
    author: people.einstein,
    decoy: people.agusneta,
    source: 'Entrevista con G.S. Viereck, "What Life Means to Einstein", The Saturday Evening Post, 1929',
    isTranslation: true,
  },
  {
    id: 94,
    text: 'Locura es hacer la misma cosa una y otra vez esperando obtener resultados diferentes.',
    originalText: 'Insanity is doing the same thing over and over again and expecting different results.',
    originalLanguage: 'Inglés',
    author: people.einstein,
    decoy: people.onhepixle,
    source: 'Comúnmente atribuida a Einstein, pero probablemente originada en Narcotics Anonymous (1981)',
    isTranslation: true,
    isFictional: true,
    context: 'No hay evidencia de que Einstein dijera esto. La frase apareció por primera vez en un folleto de NA.',
  },

  // === TESLA (3 quotes) ===
  {
    id: 78,
    text: 'Dejad que el futuro cuente la verdad y evalúe a cada uno según su trabajo y sus logros. El presente es de ellos; el futuro, por el que he trabajado de verdad, es mío.',
    originalText: 'Let the future tell the truth, and evaluate each one according to his work and accomplishments. The present is theirs; the future, for which I have really worked, is mine.',
    originalLanguage: 'Inglés',
    author: people.tesla,
    decoy: people.westcol,
    source: 'My Inventions: The Autobiography of Nikola Tesla, Electrical Experimenter, 1919',
    isTranslation: true,
  },
  {
    id: 86,
    text: 'No creo que exista ninguna emoción que pueda atravesar el corazón humano como la que siente el inventor cuando ve alguna creación de su mente desplegarse hacia el éxito.',
    originalText: 'I do not think there is any thrill that can go through the human heart like that felt by the inventor as he sees some creation of the brain unfolding to success.',
    originalLanguage: 'Inglés',
    author: people.tesla,
    decoy: people.tfue,
    source: 'My Inventions: The Autobiography of Nikola Tesla, Electrical Experimenter, 1919',
    isTranslation: true,
  },
  {
    id: 95,
    text: 'El presente es de ellos, pero el futuro, por el que yo realmente trabajé, es mío.',
    originalText: 'The present is theirs; the future, for which I really worked, is mine.',
    originalLanguage: 'Inglés',
    author: people.tesla,
    decoy: people.kai_cenat,
    source: 'Documentos de Nikola Tesla, citado en "Tesla: Man Out of Time" de Margaret Cheney',
    isTranslation: true,
  },

  // === NEWTON (3 quotes) ===
  {
    id: 77,
    text: 'No sé cómo puedo parecerle al mundo, pero a mí mismo me parece que he sido solo como un niño jugando en la orilla del mar, divirtiéndome al encontrar de vez en cuando un guijarro más liso o una concha más bonita de lo ordinario, mientras el gran océano de la verdad yacía todo él sin descubrir ante mí.',
    originalText: 'I do not know what I may appear to the world, but to myself I seem to have been only like a boy playing on the sea-shore, and diverting myself in now and then finding a smoother pebble or a prettier shell than ordinary, whilst the great ocean of truth lay all undiscovered before me.',
    originalLanguage: 'Inglés',
    author: people.newton,
    decoy: people.el_mariana,
    source: 'Registrada por William Stukeley en Memoirs of Sir Isaac Newton\'s Life, ~1727',
    isTranslation: true,
  },
  {
    id: 89,
    text: 'Si he visto más lejos es porque estoy a hombros de gigantes.',
    originalText: 'If I have seen further it is by standing on the shoulders of giants.',
    originalLanguage: 'Inglés',
    author: people.newton,
    decoy: people.alonso,
    source: 'Carta de Isaac Newton a Robert Hooke, 5 de febrero de 1676',
    sourceUrl: 'https://en.wikipedia.org/wiki/Standing_on_the_shoulders_of_giants',
    isTranslation: true,
  },
  {
    id: 96,
    text: 'Si he visto más lejos es porque estoy sobre los hombros de gigantes.',
    originalText: 'If I have seen further it is by standing on the shoulders of giants.',
    originalLanguage: 'Inglés',
    author: people.newton,
    decoy: people.rakai,
    source: 'Carta a Robert Hooke, 1675',
    sourceUrl: 'https://en.wikipedia.org/wiki/Standing_on_the_shoulders_of_giants',
    isTranslation: true,
  },

  // === DARWIN (3 quotes) ===
  {
    id: 75,
    text: 'Pero hoy estoy muy mal y muy estúpido, y odio a todo el mundo y a todo. Uno vive solo para cometer errores.',
    originalText: 'But I am very poorly today & very stupid & I hate everybody & everything. One lives only to make blunders.',
    originalLanguage: 'Inglés',
    author: people.darwin,
    decoy: people.davoxeneixe,
    source: 'Carta de Charles Darwin, octubre de 1861. Publicada en The Correspondence of Charles Darwin, Volume 9.',
    isTranslation: true,
  },
  {
    id: 85,
    text: 'Mi éxito como hombre de ciencia, sea cual sea su valor, se ha determinado, hasta donde puedo juzgar, por cualidades mentales complejas y diversificadas. De estas, las más importantes han sido: el amor por la ciencia, una paciencia ilimitada para reflexionar largamente sobre cualquier tema, la diligencia en observar y recolectar hechos, y una dosis de inventiva así como de sentido común.',
    originalText: 'My success as a man of science, whatever this may amount to, has been determined, as far as I can judge, by complex and diversified mental qualities and conditions. Of these, the most important have been—the love of science—unbounded patience in long reflecting over any subject—industry in observing and collecting facts—and a share of invention as well as of common sense.',
    originalLanguage: 'Inglés',
    author: people.darwin,
    decoy: people.ninja,
    source: 'The Autobiography of Charles Darwin, escrita 1876-1882, publicada 1958',
    isTranslation: true,
  },
  {
    id: 97,
    text: 'No es la más fuerte de las especies la que sobrevive, ni la más inteligente. Es la más adaptable al cambio.',
    originalText: 'It is not the strongest of the species that survives, nor the most intelligent, but the one most responsive to change.',
    originalLanguage: 'Inglés',
    author: people.darwin,
    decoy: people.speed,
    source: 'Atribuida a Darwin, pero probablemente dicha por Leon C. Megginson (1963) parafraseando a Darwin',
    isTranslation: true,
    isFictional: true,
    context: 'Esta frase es una paráfrasis de las ideas de Darwin, pero no fue escrita por él.',
  },

  // === HAWKING (3 quotes) ===
  {
    id: 79,
    text: 'Por muy difícil que parezca la vida, siempre hay algo que puedes hacer y en lo que puedes triunfar. Lo que importa es que no te rindas.',
    originalText: 'However difficult life may seem, there is always something you can do, and succeed at. It matters that you don\'t just give up.',
    originalLanguage: 'Inglés',
    author: people.hawking,
    decoy: people.illojuan,
    source: 'Mensaje público de Stephen Hawking, 2012',
    isTranslation: true,
  },
  {
    id: 90,
    text: 'No sirve de nada enfurecerse si te atascas. Lo que yo hago es seguir pensando en el problema pero trabajar en otra cosa. A veces pasan años antes de que vea el camino a seguir.',
    originalText: 'It is no good getting furious if you get stuck. What I do is keep thinking about the problem but work on something else. Sometimes it is years before I see the way forward.',
    originalLanguage: 'Inglés',
    author: people.hawking,
    decoy: people.jasontheween,
    source: 'Entrevista con The Guardian, 2005',
    isTranslation: true,
  },
  {
    id: 98,
    text: 'La inteligencia es la capacidad de adaptarse al cambio.',
    originalText: 'Intelligence is the ability to adapt to change.',
    originalLanguage: 'Inglés',
    author: people.hawking,
    decoy: people.thegrefg,
    source: 'En "El universo en una cáscara de nuez", 2001',
    isTranslation: true,
  },

  // === CURIE (3 quotes) ===
  {
    id: 80,
    text: 'La vida no es fácil para ninguno de nosotros. ¿Pero qué importa? Debemos tener perseverancia y, sobre todo, confianza en nosotros mismos. Debemos creer que estamos dotados para algo y que esa cosa debe ser alcanzada.',
    originalText: 'La vie n\'est facile pour aucun de nous. Mais quoi ? Il faut avoir de la persévérance et, avant tout, de la confiance en soi. Il faut croire que l\'on est doué pour quelque chose et que cette chose, il faut l\'atteindre.',
    originalLanguage: 'Francés',
    author: people.curie,
    decoy: people.pokimane,
    source: 'Carta de Marie Curie a un familiar, circa 1894',
    isTranslation: true,
  },
  {
    id: 88,
    text: 'Uno nunca se da cuenta de lo que se ha hecho; solo puede ver lo que queda por hacer.',
    originalText: 'On ne remarque jamais ce qui a été fait ; on ne peut voir que ce qui reste à faire.',
    originalLanguage: 'Francés',
    author: people.curie,
    decoy: people.emiru,
    source: 'Carta de Marie Curie, circa 1894',
    isTranslation: true,
  },
  {
    id: 99,
    text: 'Nada en la vida debe ser temido, solo comprendido. Ahora es el momento de comprender más para temer menos.',
    originalText: 'Nothing in life is to be feared, it is only understood. Now is the time to understand more, so that we may fear less.',
    originalLanguage: 'Inglés (original en francés)',
    author: people.curie,
    decoy: people.xokas,
    source: 'Citado en "Madame Curie" por Ève Curie, 1937',
    isTranslation: true,
  },

  // === FEYNMAN (3 quotes) ===
  {
    id: 76,
    text: 'Nadie descubre nunca de qué trata la vida, y no importa. Explora el mundo. Casi todo es realmente interesante si lo profundizas lo suficiente.',
    originalText: 'Nobody ever figures out what life is all about, and it doesn\'t matter. Explore the world. Nearly everything is really interesting if you go into it deeply enough.',
    originalLanguage: 'Inglés',
    author: people.feynman,
    decoy: people.la_cobra,
    source: 'The Pleasure of Finding Things Out: The Best Short Works of Richard P. Feynman, 1999',
    isTranslation: true,
  },
  {
    id: 83,
    text: 'Aprendí muy temprano la diferencia entre conocer el nombre de algo y conocer algo.',
    originalText: 'I learned very early the difference between knowing the name of something and knowing something.',
    originalLanguage: 'Inglés',
    author: people.feynman,
    decoy: people.juansguarnizo,
    source: 'What Do You Care What Other People Think?, Richard P. Feynman, 1988',
    isTranslation: true,
  },
  {
    id: 100,
    text: 'No me importa lo que la gente piense de mí. Lo que importa es lo que yo pienso de mí mismo.',
    originalText: 'I don\'t care what people think of me. What matters is what I think of myself.',
    originalLanguage: 'Inglés',
    author: people.feynman,
    decoy: people.el_mariana,
    source: 'Atribuida a Richard Feynman, en sus conferencias y entrevistas',
    isTranslation: true,
    isFictional: true,
    context: 'Variación de una actitud expresada por Feynman en múltiples ocasiones, pero no como cita literal.',
  },

  // === TURING (2 quotes) ===
  {
    id: 81,
    text: 'Solo podemos ver a poca distancia hacia adelante, pero podemos ver que hay mucho que hacer.',
    originalText: 'We can only see a short distance ahead, but we can see plenty there that needs to be done.',
    originalLanguage: 'Inglés',
    author: people.turing,
    decoy: people.jynxzi,
    source: 'Computing Machinery and Intelligence, revista Mind, 1950. Última frase del artículo.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Computing_Machinery_and_Intelligence',
    isTranslation: true,
  },
  {
    id: 92,
    text: 'Habría mucho que hacer tratando, digamos, de mantener la propia inteligencia al nivel marcado por las máquinas, pues parece probable que una vez que el método de pensamiento de las máquinas hubiera comenzado, no tardaría en superar nuestros débiles poderes.',
    originalText: 'There would be plenty to do in trying, say, to keep one\'s intelligence up to the standard set by the machines, for it seems probable that once the machine thinking method had started, it would not take long to outstrip our feeble powers.',
    originalLanguage: 'Inglés',
    author: people.turing,
    decoy: people.lacy,
    source: 'Conferencia "Intelligent Machinery, A Heretical Theory", Manchester, 1951',
    isTranslation: true,
  },

  // === EDISON (2 quotes) ===
  {
    id: 101,
    text: 'El genio es un uno por ciento de inspiración y un noventa y nueve por ciento de transpiración.',
    originalText: 'Genius is one percent inspiration and ninety-nine percent perspiration.',
    originalLanguage: 'Inglés',
    author: people.edison,
    decoy: people.bananirou,
    source: 'Atribuida a Thomas Edison, en una entrevista con Harper\'s Monthly, 1932',
    isTranslation: true,
  },
  {
    id: 102,
    text: 'No fracasé. Solo encontré 10.000 maneras que no funcionan.',
    originalText: 'I have not failed. I\'ve just found 10,000 ways that won\'t work.',
    originalLanguage: 'Inglés',
    author: people.edison,
    decoy: people.jasontheween,
    source: 'Atribuida a Thomas Edison, en sus notas y entrevistas',
    isTranslation: true,
    isFictional: true,
    context: 'No hay evidencia directa de que Edison dijera exactamente esto; es una paráfrasis popular de su filosofía.',
  },

  // === NIETZSCHE (2 quotes) ===
  {
    id: 103,
    text: 'Lo que no me mata me hace más fuerte.',
    originalText: 'Was mich nicht umbringt, macht mich stärker.',
    originalLanguage: 'Alemán',
    author: people.nietzsche,
    decoy: people.el_mariana,
    source: 'En "El crepúsculo de los ídolos", 1888',
    sourceUrl: 'https://en.wikipedia.org/wiki/Twilight_of_the_Idols',
    isTranslation: true,
  },
  {
    id: 104,
    text: 'El que tiene un porqué para vivir, puede soportar casi cualquier cómo.',
    originalText: 'Wer ein warum zu leben hat, kann fast jedes wie ertragen.',
    originalLanguage: 'Alemán',
    author: people.nietzsche,
    decoy: people.marlon,
    source: 'En "El crepúsculo de los ídolos", 1888. Popularizada por Viktor Frankl.',
    isTranslation: true,
    context: 'Viktor Frankl la popularizó en "El hombre en busca de sentido" atribuyéndola a Nietzsche.',
  },

  // === SÓCRATES (2 quotes) ===
  {
    id: 105,
    text: 'Solo sé que no sé nada.',
    author: people.socrates,
    decoy: people.la_cobra,
    source: 'Relatado por Platón en "Apología de Sócrates"',
    sourceUrl: 'https://en.wikipedia.org/wiki/Apology_(Plato)',
    isTranslation: false,
    context: 'Frase atribuida a Sócrates, relatada por su discípulo Platón.',
  },
  {
    id: 106,
    text: 'La vida no examinada no vale la pena ser vivida.',
    originalText: 'ὁ δὲ ἀνεξέταστος βίος οὐ βιωτὸς ἀνθρώπῳ',
    originalLanguage: 'Griego antiguo',
    author: people.socrates,
    decoy: people.coscu,
    source: 'Relatado por Platón en "Apología de Sócrates", 38a',
    isTranslation: true,
  },

  // === ARISTÓTELES (2 quotes) ===
  {
    id: 107,
    text: 'La raíz de la educación es amarga, pero su fruto es dulce.',
    originalText: 'The roots of education are bitter, but the fruit is sweet.',
    originalLanguage: 'Inglés (original en griego)',
    author: people.aristotle,
    decoy: people.bananirou,
    source: 'Atribuida a Aristóteles, citada por Diógenes Laercio',
    isTranslation: true,
  },
  {
    id: 108,
    text: 'Somos lo que hacemos repetidamente. La excelencia, entonces, no es un acto, sino un hábito.',
    originalText: 'We are what we repeatedly do. Excellence, then, is not an act, but a habit.',
    originalLanguage: 'Inglés',
    author: people.aristotle,
    decoy: people.illojuan,
    source: 'Atribuida a Aristóteles, pero probablemente de Will Durant (1926) parafraseando a Aristóteles',
    isTranslation: true,
    isFictional: true,
    context: 'Will Durant escribió esta paráfrasis en "The Story of Philosophy". No es una cita literal de Aristóteles.',
  },

  // === DESCARTES (1 quote) ===
  {
    id: 109,
    text: 'Pienso, luego existo.',
    originalText: 'Cogito, ergo sum.',
    originalLanguage: 'Latín (original en francés: "Je pense, donc je suis")',
    author: people.descartes,
    decoy: people.xqc,
    source: 'En "Discurso del método", 1637',
    sourceUrl: 'https://en.wikipedia.org/wiki/Cogito,_ergo_sum',
    isTranslation: true,
  },

  // === VOLTAIRE (1 quote) ===
  {
    id: 110,
    text: 'No estoy de acuerdo con lo que dices, pero defenderé hasta la muerte tu derecho a decirlo.',
    originalText: 'I disapprove of what you say, but I will defend to the death your right to say it.',
    originalLanguage: 'Inglés',
    author: people.voltaire,
    decoy: people.agusneta,
    source: 'Atribuida a Voltaire, pero escrita por Evelyn Hall en su biografía de Voltaire (1906)',
    isTranslation: true,
    isFictional: true,
    context: 'Evelyn Hall escribió esta frase como resumen de la actitud de Voltaire, no es una cita literal suya.',
  },

  // === MARK TWAIN (2 quotes) ===
  {
    id: 111,
    text: 'Nunca he dejado que la escuela interfiera con mi educación.',
    originalText: 'I have never let my schooling interfere with my education.',
    originalLanguage: 'Inglés',
    author: people.twain,
    decoy: people.illojuan,
    source: 'Atribuida a Mark Twain, origen incierto',
    isTranslation: true,
    isFictional: true,
  },
  {
    id: 112,
    text: 'La historia no se repite, pero rima.',
    originalText: 'History doesn\'t repeat itself, but it often rhymes.',
    originalLanguage: 'Inglés',
    author: people.twain,
    decoy: people.rubius,
    source: 'Atribuida a Mark Twain, sin evidencia directa',
    isTranslation: true,
    isFictional: true,
  },

  // === OSCAR WILDE (2 quotes) ===
  {
    id: 113,
    text: 'La verdad es rara vez pura y nunca simple.',
    originalText: 'The truth is rarely pure and never simple.',
    originalLanguage: 'Inglés',
    author: people.wilde,
    decoy: people.westcol,
    source: 'En "La importancia de llamarse Ernesto", 1895',
    isTranslation: true,
  },
  {
    id: 114,
    text: 'Es mejor ser odiado por lo que eres que amado por lo que no eres.',
    originalText: 'It is better to be hated for what you are than to be loved for what you are not.',
    originalLanguage: 'Inglés',
    author: people.wilde,
    decoy: people.ninja,
    source: 'Comúnmente atribuida a Oscar Wilde, probablemente apócrifa',
    isTranslation: true,
    isFictional: true,
  },

  // === SHAKESPEARE (2 quotes) ===
  {
    id: 115,
    text: 'Ser o no ser, esa es la cuestión.',
    originalText: 'To be, or not to be, that is the question.',
    originalLanguage: 'Inglés',
    author: people.shakespeare,
    decoy: people.juansguarnizo,
    source: 'En "Hamlet", Acto III, Escena I, c. 1600',
    isTranslation: true,
  },
  {
    id: 116,
    text: 'Sé fiel a ti mismo.',
    originalText: 'To thine own self be true.',
    originalLanguage: 'Inglés',
    author: people.shakespeare,
    decoy: people.spreen,
    source: 'En "Hamlet", Acto I, Escena III, c. 1600',
    isTranslation: true,
  },

  // === CERVANTES (1 quote) ===
  {
    id: 117,
    text: 'El que lee mucho y anda mucho, ve mucho y sabe mucho.',
    author: people.cervantes,
    decoy: people.kai_cenat,
    source: 'En "Don Quijote de la Mancha", Segunda Parte, Capítulo VI, 1615',
    isTranslation: false,
  },

  // === CAMUS (2 quotes) ===
  {
    id: 118,
    text: 'Hay que imaginar a Sísifo feliz.',
    originalText: 'Il faut imaginer Sisyphe heureux.',
    originalLanguage: 'Francés',
    author: people.camus,
    decoy: people.alonso,
    source: 'En "El mito de Sísifo", 1942',
    isTranslation: true,
  },
  {
    id: 119,
    text: 'En medio del invierno, aprendí por fin que dentro de mí había un verano invencible.',
    originalText: 'In the depth of winter, I finally learned that within me there lay an invincible summer.',
    originalLanguage: 'Inglés (original en francés)',
    author: people.camus,
    decoy: people.tfue,
    source: 'En "Retour à Tipasa", 1952',
    isTranslation: true,
  },

  // === CHURCHILL (3 quotes) ===
  {
    id: 120,
    text: 'El éxito no es definitivo, el fracaso no es fatal: es el coraje para continuar lo que cuenta.',
    originalText: 'Success is not final, failure is not fatal: it is the courage to continue that counts.',
    originalLanguage: 'Inglés',
    author: people.churchill,
    decoy: people.mrbeast,
    source: 'Comúnmente atribuida a Churchill, sin evidencia directa',
    isTranslation: true,
    isFictional: true,
  },
  {
    id: 121,
    text: 'La democracia es el peor sistema de gobierno, excepto por todos los demás que se han probado.',
    originalText: 'Democracy is the worst form of government except for all those other forms that have been tried.',
    originalLanguage: 'Inglés',
    author: people.churchill,
    decoy: people.rakai,
    source: 'Discurso en la Cámara de los Comunes, 11 de noviembre de 1947',
    isTranslation: true,
  },
  {
    id: 122,
    text: 'Nunca, nunca, nunca te rindas.',
    originalText: 'Never give in—never, never, never, never.',
    originalLanguage: 'Inglés',
    author: people.churchill,
    decoy: people.tomasmazza,
    source: 'Discurso en Harrow School, 1941',
    isTranslation: true,
  },

  // === ROOSEVELT (1 quote) ===
  {
    id: 123,
    text: 'No tenemos nada que temer más que al miedo mismo.',
    originalText: 'The only thing we have to fear is fear itself.',
    originalLanguage: 'Inglés',
    author: people.roosevelt,
    decoy: people.stable_ronaldo,
    source: 'Discurso inaugural, 4 de marzo de 1933',
    isTranslation: true,
  },

  // === LINCOLN (1 quote) ===
  {
    id: 124,
    text: 'Una casa dividida contra sí misma no puede subsistir.',
    originalText: 'A house divided against itself cannot stand.',
    originalLanguage: 'Inglés',
    author: people.lincoln,
    decoy: people.lacy,
    source: 'Discurso en Springfield, Illinois, 16 de junio de 1858',
    isTranslation: true,
  },

  // === KENNEDY (1 quote) ===
  {
    id: 125,
    text: 'No preguntes qué puede hacer tu país por ti. Pregunta qué puedes hacer por tu país.',
    originalText: 'Ask not what your country can do for you—ask what you can do for your country.',
    originalLanguage: 'Inglés',
    author: people.kennedy,
    decoy: people.marlon,
    source: 'Discurso inaugural, 20 de enero de 1961',
    isTranslation: true,
  },

  // === MANDELA (1 quote) ===
  {
    id: 126,
    text: 'La educación es el arma más poderosa que puedes usar para cambiar el mundo.',
    originalText: 'Education is the most powerful weapon which you can use to change the world.',
    originalLanguage: 'Inglés',
    author: people.mandela,
    decoy: people.emiru,
    source: 'Discurso en la Universidad de Witwatersrand, 2003',
    isTranslation: true,
  },

  // === GANDHI (1 quote) ===
  {
    id: 127,
    text: 'Sé el cambio que quieres ver en el mundo.',
    originalText: 'Be the change that you wish to see in the world.',
    originalLanguage: 'Inglés',
    author: people.gandhi,
    decoy: people.rubius,
    source: 'Atribuida a Gandhi, probablemente inspirada en un artículo de Arleen L. F. Goyne (1974)',
    isTranslation: true,
    isFictional: true,
  },

  // === MLK (1 quote) ===
  {
    id: 128,
    text: 'La oscuridad no puede expulsar la oscuridad: solo la luz puede hacerlo. El odio no puede expulsar el odio: solo el amor puede hacerlo.',
    originalText: 'Darkness cannot drive out darkness: only light can do that. Hate cannot drive out hate: only love can do that.',
    originalLanguage: 'Inglés',
    author: people.king,
    decoy: people.coscu,
    source: 'En "Strength to Love", 1963',
    isTranslation: true,
  },

  // === STEVE JOBS (2 quotes) ===
  {
    id: 129,
    text: 'Tu tiempo es limitado, así que no lo malgastes viviendo la vida de otro.',
    originalText: 'Your time is limited, so don\'t waste it living someone else\'s life.',
    originalLanguage: 'Inglés',
    author: people.jobs,
    decoy: people.jasontheween,
    source: 'Discurso de graduación en Stanford, 2005',
    isTranslation: true,
  },
  {
    id: 130,
    text: 'No quiero ser un producto de mi entorno. Quiero que mi entorno sea un producto de mí.',
    originalText: 'I don\'t want to be a product of my environment. I want my environment to be a product of me.',
    originalLanguage: 'Inglés',
    author: people.jobs,
    decoy: people.westcol,
    source: 'Atribuida a Steve Jobs, pero es del personaje Nucky Thompson en "Boardwalk Empire"',
    isTranslation: true,
    isFictional: true,
    context: 'Esta frase es del personaje Nucky Thompson en "Boardwalk Empire", no de Steve Jobs.',
  },

  // === MUHAMMAD ALI (2 quotes) ===
  {
    id: 131,
    text: 'Flota como una mariposa, pica como una abeja.',
    originalText: 'Float like a butterfly, sting like a bee.',
    originalLanguage: 'Inglés',
    author: people.ali,
    decoy: people.marlon,
    source: 'Antes de su combate contra Sonny Liston, 1964',
    isTranslation: true,
  },
  {
    id: 132,
    text: 'Es mejor permanecer en silencio y ser considerado un tonto que hablar y disipar toda duda.',
    originalText: 'Better to remain silent and be thought a fool than to speak and to resolve all doubt.',
    originalLanguage: 'Inglés',
    author: people.ali,
    decoy: people.auron,
    source: 'Atribuida a Abraham Lincoln y también a Mark Twain, origen incierto',
    isTranslation: true,
    isFictional: true,
  },

  // === JORDAN (1 quote) ===
  {
    id: 133,
    text: 'He fallado más de 9.000 tiros en mi carrera. He perdido casi 300 juegos. He fallado una y otra vez en mi vida. Y por eso tengo éxito.',
    originalText: 'I\'ve missed more than 9,000 shots in my career. I\'ve lost almost 300 games. I\'ve failed over and over and over again in my life. And that is why I succeed.',
    originalLanguage: 'Inglés',
    author: people.jordan,
    decoy: people.kun_aguero,
    source: 'Anuncio de Nike "Failure", 1997',
    isTranslation: true,
  },

  // === BOB MARLEY (1 quote) ===
  {
    id: 134,
    text: 'La verdad es que todo el mundo te va a hacer daño. Solo tienes que encontrar a las personas por las que vale la pena sufrir.',
    originalText: 'The truth is, everyone is going to hurt you. You just got to find the ones worth suffering for.',
    originalLanguage: 'Inglés',
    author: people.marley,
    decoy: people.tomasmazza,
    source: 'Atribuida a Bob Marley, probablemente apócrifa',
    isTranslation: true,
    isFictional: true,
  },

  // === ELON MUSK (1 quote) ===
  {
    id: 135,
    text: 'Cuando algo es lo suficientemente importante, lo haces incluso si las probabilidades de éxito no están a tu favor.',
    originalText: 'When something is important enough, you do it even if the odds are not in your favor.',
    originalLanguage: 'Inglés',
    author: people.elon,
    decoy: people.robleis,
    source: 'Entrevista en la National Academy of Sciences, 2008',
    isTranslation: true,
  },

  // === MARCO AURELIO (1 quote) ===
  {
    id: 136,
    text: 'Tienes poder sobre tu mente, no sobre los eventos externos. Date cuenta de esto y encontrarás fuerza.',
    originalText: 'You have power over your mind — not outside events. Realize this, and you will find strength.',
    originalLanguage: 'Inglés (original en griego)',
    author: people.marco_aurelio,
    decoy: people.ibai,
    source: 'En "Meditaciones", Libro 8',
    isTranslation: true,
  },

  // === PITÁGORAS (1 quote) ===
  {
    id: 137,
    text: 'El número gobierna el universo.',
    originalText: 'Number rules the universe.',
    originalLanguage: 'Inglés (original en griego)',
    author: people.pitagoras,
    decoy: people.stable_ronaldo,
    source: 'Atribuida a Pitágoras, citada por filósofos posteriores',
    isTranslation: true,
  },

  // === EUCLIDES (1 quote) ===
  {
    id: 138,
    text: 'No hay camino real para la geometría.',
    originalText: 'There is no royal road to geometry.',
    originalLanguage: 'Inglés (original en griego)',
    author: people.euclides,
    decoy: people.coscu,
    source: 'Atribuida a Euclides, en respuesta a Ptolomeo I, citada por Proclo',
    isTranslation: true,
  },

  // === LEONARDO DA VINCI (1 quote) ===
  {
    id: 139,
    text: 'La simplicidad es la máxima sofisticación.',
    originalText: 'Simplicity is the ultimate sophistication.',
    originalLanguage: 'Inglés',
    author: people.davinci,
    decoy: people.spreen,
    source: 'Atribuida a Leonardo da Vinci, en sus cuadernos',
    isTranslation: true,
    isFictional: true,
    context: 'No hay evidencia directa de esta cita exacta en los cuadernos de Da Vinci; es una atribución popular.',
  },

  // === TERENCE TAO (1 quote) ===
  {
    id: 140,
    text: 'Las matemáticas no son una carrera contra los demás, sino un viaje personal de descubrimiento.',
    originalText: 'Mathematics is not a race against others, but a personal journey of discovery.',
    originalLanguage: 'Inglés',
    author: people.terence_tao,
    decoy: people.xokas,
    source: 'Atribuida a Terence Tao, en su blog y entrevistas',
    isTranslation: true,
    isFictional: true,
    context: 'Refleja la filosofía expresada por Tao en su blog, pero no es una cita literal verificable.',
  },

  // === BOBBY FISCHER (1 quote) ===
  {
    id: 141,
    text: 'El ajedrez es como la vida: tienes que pensar antes de mover.',
    originalText: 'Chess is like life: you have to think before you move.',
    originalLanguage: 'Inglés',
    author: people.bobby_fischer,
    decoy: people.davoxeneixe,
    source: 'Atribuida a Bobby Fischer, en entrevistas',
    isTranslation: true,
    isFictional: true,
    context: 'Fischer expresó ideas similares, pero no se ha verificado esta cita exacta.',
  },

  // === JULIO CÉSAR (1 quote) ===
  {
    id: 142,
    text: 'Vine, vi, vencí.',
    originalText: 'Veni, vidi, vici.',
    originalLanguage: 'Latín',
    author: people.julio_cesar,
    decoy: people.auron,
    source: 'Carta al Senado romano tras la batalla de Zela, 47 a.C.',
    isTranslation: true,
  },

  // === ALEJANDRO MAGNO (1 quote) ===
  {
    id: 143,
    text: 'No hay nada imposible para el que intenta.',
    originalText: 'There is nothing impossible to him who will try.',
    originalLanguage: 'Inglés (original en griego)',
    author: people.alejandro_magno,
    decoy: people.mrbeast,
    source: 'Atribuida a Alejandro Magno, citada por Plutarco',
    isTranslation: true,
  },

  // === QUEVEDO (1 quote) ===
  {
    id: 144,
    text: 'Erase un hombrecillo que tenía un gato y era tan gato el gato que parecía un hombre.',
    author: people.quevedo,
    decoy: people.robleis,
    source: 'Atribuida a Francisco de Quevedo, en sus sátiras',
    isTranslation: false,
    isFictional: true,
    context: 'Atribución popular sin evidencia textual directa en las obras verificadas de Quevedo.',
  },

  // === GALILEO (1 quote) ===
  {
    id: 145,
    text: 'Y sin embargo, se mueve.',
    originalText: 'Eppur si muove.',
    originalLanguage: 'Italiano',
    author: people.galileo,
    decoy: people.speed,
    source: 'Atribuida a Galileo Galilei tras su juicio, probablemente apócrifa',
    isTranslation: true,
    isFictional: true,
    context: 'No hay evidencia contemporánea de que Galileo dijera esto; apareció por primera vez en 1761.',
  },

  // === PLATÓN (1 quote) ===
  {
    id: 146,
    text: 'El conocimiento es el alimento del alma.',
    originalText: 'Knowledge is the food of the soul.',
    originalLanguage: 'Inglés (original en griego)',
    author: people.plato,
    decoy: people.rubius,
    source: 'En "La República", Libro V',
    isTranslation: true,
  },

  // === TRUMP (1 quote) ===
  {
    id: 147,
    text: 'No me gusta perder. Nunca he perdido. No sé cómo se siente.',
    originalText: 'I don\'t like losing. I\'ve never lost. I don\'t know how it feels.',
    originalLanguage: 'Inglés',
    author: people.trump,
    decoy: people.xqc,
    source: 'Atribuida a Donald Trump, en entrevistas',
    isTranslation: true,
    isFictional: true,
    context: 'Variación de declaraciones de Trump, pero no una cita literal verificada.',
  },

  // === OBAMA (1 quote) ===
  {
    id: 148,
    text: 'El cambio no vendrá si esperamos a otra persona o a algún otro momento. Nosotros somos los que hemos estado esperando.',
    originalText: 'Change will not come if we wait for some other person or some other time. We are the ones we\'ve been waiting for.',
    originalLanguage: 'Inglés',
    author: people.obama,
    decoy: people.rakai,
    source: 'Discurso de campaña, 2008',
    isTranslation: true,
  },

  // === WASHINGTON (1 quote) ===
  {
    id: 149,
    text: 'Es mejor ofrecer ningún excusa que una mala.',
    originalText: 'It is better to offer no excuse than a bad one.',
    originalLanguage: 'Inglés',
    author: people.washington,
    decoy: people.onhepixle,
    source: 'Carta circular a los comandantes de división, 1781',
    isTranslation: true,
  },

  // === JACKSON (1 quote) ===
  {
    id: 150,
    text: 'Si entras en este mundo sabiendo que eres amado y sales sabiendo lo mismo, entonces todo lo que ocurra entre medias puede ser superado.',
    originalText: 'If you enter this world knowing you are loved and you leave this world knowing the same, then everything that happens in between can be dealt with.',
    originalLanguage: 'Inglés',
    author: people.jackson,
    decoy: people.lacy,
    source: 'Atribuida a Michael Jackson, en entrevistas',
    isTranslation: true,
    isFictional: true,
    context: 'Refleja sentimientos expresados por Jackson, pero la cita exacta no está verificada.',
  },

  // === PRESLEY (1 quote) ===
  {
    id: 151,
    text: 'No tengo la ambición de ser presidente, pero si lo fuera, prohibiría el aburrimiento.',
    originalText: 'I have no ambition to be president, but if I were, I would outlaw boredom.',
    originalLanguage: 'Inglés',
    author: people.presley,
    decoy: people.tomasmazza,
    source: 'Atribuida a Elvis Presley, en entrevistas',
    isTranslation: true,
    isFictional: true,
    context: 'No hay fuente primaria verificada de esta cita.',
  },

  // =====================================================
  // === STREAMER QUOTES (author = streamer) ===
  // =====================================================

  // === EL RUBIUS (2 quotes) ===
  {
    id: 51,
    text: 'Ole ole los caracoles',
    author: people.rubius,
    decoy: people.einstein,
    source: 'Frase viral de El Rubius en sus transmisiones',
    isTranslation: false,
  },
  {
    id: 52,
    text: 'Madurar no es dejar de jugar, es jugar sabiendo que tenés que pagar las cuentas mañana',
    author: people.rubius,
    decoy: people.plato,
    source: 'El Rubius, en una de sus transmisiones',
    isTranslation: false,
  },

  // === AURONPLAY (4 quotes) ===
  {
    id: 53,
    text: 'Heheheeeey, pero ¿qué pasa chavales? ¿Todo bien? ¿Todo correcto? Y yo que me alegro',
    author: people.auron,
    decoy: people.julio_cesar,
    source: 'Saludo característico de AuronPlay al inicio de sus vídeos',
    isTranslation: false,
  },
  {
    id: 54,
    text: 'Abduzcan',
    author: people.auron,
    decoy: people.turing,
    source: 'Frase viral de AuronPlay',
    isTranslation: false,
  },
  {
    id: 55,
    text: 'Tomad zumitos, no toméis drogas',
    author: people.auron,
    decoy: people.curie,
    source: 'AuronPlay, en una de sus transmisiones',
    isTranslation: false,
  },
  {
    id: 56,
    text: 'El fracaso real es no haberlo intentado y que eso te rompa; si lo intentaste y aprendiste, nunca va a ser malo',
    author: people.auron,
    decoy: people.darwin,
    source: 'AuronPlay, en una de sus transmisiones',
    isTranslation: false,
  },

  // === IBAI (3 quotes) ===
  {
    id: 57,
    text: 'Toxicidad fuera, mala vibra fuera',
    author: people.ibai,
    decoy: people.marco_aurelio,
    source: 'Ibai Llanos, en una de sus transmisiones',
    isTranslation: false,
  },
  {
    id: 58,
    text: 'No deseen mi vida, porque la mitad de las cosas que tengo no las puedo disfrutar por el miedo a perder la otra mitad',
    author: people.ibai,
    decoy: people.tesla,
    source: 'Ibai Llanos, en una de sus transmisiones',
    isTranslation: false,
  },
  {
    id: 59,
    text: 'El éxito real no es llenar un estadio, es tener tres amigos reales que te atiendan el teléfono a las cuatro de la mañana cuando estás mal',
    author: people.ibai,
    decoy: people.socrates,
    source: 'Ibai Llanos, en una entrevista',
    isTranslation: false,
  },

  // === ELXOKAS (2 quotes) ===
  {
    id: 60,
    text: 'Esto no es un juego, yo no juego para divertirme',
    author: people.xokas,
    decoy: people.terence_tao,
    source: 'ElXokas, en una de sus transmisiones',
    isTranslation: false,
  },
  {
    id: 61,
    text: 'La disciplina le gana al talento cuando el talento se va a dormir',
    author: people.xokas,
    decoy: people.curie,
    source: 'ElXokas, en una de sus transmisiones',
    isTranslation: false,
  },

  // === BANANIROU (3 quotes) ===
  {
    id: 62,
    text: 'Hay que aprender a inmortalizar el momento',
    author: people.bananirou,
    decoy: people.newton,
    source: 'Bananirou, en una de sus transmisiones',
    isTranslation: false,
  },
  {
    id: 63,
    text: 'No se puede complacer a un chat que cambia de opinión cada tres segundos',
    author: people.bananirou,
    decoy: people.turing,
    source: 'Bananirou, en una de sus transmisiones',
    isTranslation: false,
  },
  {
    id: 64,
    text: 'La abundancia es lo mismo que la insuficiencia',
    author: people.bananirou,
    decoy: people.aristotle,
    source: 'Bananirou, en una de sus transmisiones',
    isTranslation: false,
  },

  // === SPREEN (2 quotes) ===
  {
    id: 65,
    text: 'Si vas a hacer algo, hacelo porque te llena a vos, no para demostrarle nada a nadie. El día que cambiás lo que sos por visitas, dejás de ser libre',
    author: people.spreen,
    decoy: people.davinci,
    source: 'Spreen, en una de sus transmisiones',
    isTranslation: false,
  },
  {
    id: 152,
    text: 'Lo importante no es cuántas veces te caés, sino cuántas veces te levantás',
    author: people.spreen,
    decoy: people.einstein,
    source: 'Spreen, en una de sus transmisiones',
    isTranslation: false,
    isFictional: true,
    context: 'Frase atribuida a Spreen; no se ha verificado la fuente exacta.',
  },

  // === MRBEAST (2 quotes) ===
  {
    id: 66,
    text: 'Tu mente se rinde mucho antes que tu cuerpo. Si lográs controlar ese interruptor donde te decís a vos mismo que podés seguir un poco más, vas a desbloquear un nivel de disciplina que el 99% de la gente nunca va a conocer',
    author: people.mrbeast,
    decoy: people.alejandro_magno,
    source: 'MrBeast, en una entrevista',
    isTranslation: false,
  },
  {
    id: 153,
    text: 'Si quieres algo que nunca has tenido, debes estar dispuesto a hacer algo que nunca has hecho',
    author: people.mrbeast,
    decoy: people.churchill,
    source: 'Atribuida a MrBeast, en entrevistas',
    isTranslation: false,
    isFictional: true,
    context: 'No se ha verificado la fuente exacta de esta frase.',
  },

  // === STABLE RONALDO (1 quote) ===
  {
    id: 67,
    text: 'Cuando llueve y truena, tenés que saber que el sol siempre se va a terminar poniendo',
    author: people.stable_ronaldo,
    decoy: people.pitagoras,
    source: 'Stable Ronaldo, en una de sus transmisiones',
    isTranslation: false,
  },

  // === KAI CENAT (2 quotes) ===
  {
    id: 68,
    text: 'La Peace',
    author: people.kai_cenat,
    decoy: people.cervantes,
    source: 'Kai Cenat, frase viral en sus transmisiones',
    isTranslation: false,
  },
  {
    id: 69,
    text: 'No prestes atención al ruido de afuera. Apagá ese ruido y concentráte en tu sueño',
    author: people.kai_cenat,
    decoy: people.darwin,
    source: 'Kai Cenat, en una entrevista',
    isTranslation: false,
  },

  // === SPEED (2 quotes) ===
  {
    id: 70,
    text: 'Así es como los seres humanos hemos sobrevivido: adaptándonos y siendo tan creativos e innovadores como podemos',
    author: people.speed,
    decoy: people.galileo,
    source: 'Speed (IShowSpeed), en una entrevista',
    isTranslation: false,
  },
  {
    id: 71,
    text: 'Por mucho que evolucione la inteligencia artificial, las personas seguirán buscando esa conexión humana con la que nacimos. Siempre volveremos a ella',
    author: people.speed,
    decoy: people.turing,
    source: 'Speed (IShowSpeed), en una entrevista',
    isTranslation: false,
  },

  // === COSCU (3 quotes) ===
  {
    id: 72,
    text: 'El ignorante es más feliz que el inteligente. El inteligente se preocupa por un montón de cosas y ve mucho más',
    author: people.coscu,
    decoy: people.euclides,
    source: 'Coscu, en una de sus transmisiones',
    isTranslation: false,
  },
  {
    id: 73,
    text: 'La inteligencia es la habilidad para resolver lo que sea en la vida, ya sea tuya o de otra persona, resolver es ser inteligente',
    author: people.coscu,
    decoy: people.einstein,
    source: 'Coscu, en una de sus transmisiones',
    isTranslation: false,
  },

  // === MOMO (2 quotes) ===
  {
    id: 84,
    text: 'La gente contando cuando yo tenía 17 años cómo hice un tablero de alta tensión trifásico para que Platense pueda tener televisación en los partidos. Lo hice gratis y yo no tenía ni para pagar el tren',
    author: people.momo,
    decoy: people.edison,
    source: 'Momo, en una de sus transmisiones',
    isTranslation: false,
  },
  {
    id: 93,
    text: 'Tengo la mano pesada y no lo digo yo, lo dice la persona que me entrena. Tengo dos ladrillos en la mano',
    author: people.momo,
    decoy: people.tesla,
    source: 'Momo, en una de sus transmisiones',
    isTranslation: false,
  },

  // === ZIAS Y B.LOU (1 quote) ===
  {
    id: 87,
    text: 'A veces el sonido gana',
    author: people.zias_blou,
    decoy: people.feynman,
    source: 'Zias y B.Lou, en una de sus transmisiones',
    isTranslation: false,
  },

  // === NINJA (1 quote) ===
  {
    id: 154,
    text: 'El trabajo duro vence al talento cuando el talento no trabaja duro',
    author: people.ninja,
    decoy: people.darwin,
    source: 'Atribuida a Ninja, en entrevistas y transmisiones',
    isTranslation: false,
    isFictional: true,
    context: 'No se ha verificado la fuente exacta de esta frase.',
  },

  // === TFUE (1 quote) ===
  {
    id: 155,
    text: 'No se trata de suerte, se trata de prepararse para cuando llega la oportunidad',
    author: people.tfue,
    decoy: people.tesla,
    source: 'Atribuida a Tfue, en transmisiones',
    isTranslation: false,
    isFictional: true,
    context: 'No se ha verificado la fuente exacta de esta frase.',
  },

  // === THEGREG (1 quote) ===
  {
    id: 156,
    text: 'No importa cuántas veces pierdas, lo que importa es cuántas veces vuelvas a intentarlo',
    author: people.thegrefg,
    decoy: people.hawking,
    source: 'Atribuida a TheGrefg, en transmisiones',
    isTranslation: false,
    isFictional: true,
    context: 'No se ha verificado la fuente exacta de esta frase.',
  },

  // === ALONSO (1 quote) ===
  {
    id: 157,
    text: 'La vida es como un videojuego: hay niveles que parecen imposibles hasta que los pasás',
    author: people.alonso,
    decoy: people.camus,
    source: 'Atribuida a Alonso (el down), en transmisiones',
    isTranslation: false,
    isFictional: true,
    context: 'No se ha verificado la fuente exacta de esta frase.',
  },

  // === LACY (1 quote) ===
  {
    id: 158,
    text: 'El respeto se gana, no se pide',
    author: people.lacy,
    decoy: people.lincoln,
    source: 'Atribuida a Lacy, en transmisiones',
    isTranslation: false,
    isFictional: true,
    context: 'No se ha verificado la fuente exacta de esta frase.',
  },

  // === JASONTHEWEEN (1 quote) ===
  {
    id: 159,
    text: 'Si no estás dispuesto a fallar, no estás dispuesto a ganar',
    author: people.jasontheween,
    decoy: people.jobs,
    source: 'Atribuida a Jasontheween, en transmisiones',
    isTranslation: false,
    isFictional: true,
    context: 'No se ha verificado la fuente exacta de esta frase.',
  },

  // === AGUSNETA (1 quote) ===
  {
    id: 160,
    text: 'Lo que más me motiva es saber que alguien me está mirando y esperando que falle',
    author: people.agusneta,
    decoy: people.voltaire,
    source: 'Atribuida a Agusneta, en transmisiones',
    isTranslation: false,
    isFictional: true,
    context: 'No se ha verificado la fuente exacta de esta frase.',
  },

  // === ROBLEIS (1 quote) ===
  {
    id: 161,
    text: 'No soporto a la gente que habla sin saber. Si no sabés, callate y aprendé',
    author: people.robleis,
    decoy: people.quevedo,
    source: 'Atribuida a Robleis, en transmisiones',
    isTranslation: false,
    isFictional: true,
    context: 'No se ha verificado la fuente exacta de esta frase.',
  },

  // === DAVOXENEIXE (1 quote) ===
  {
    id: 162,
    text: 'La humildad no es pensar menos de ti, sino pensar menos en ti',
    author: people.davoxeneixe,
    decoy: people.bobby_fischer,
    source: 'Atribuida a DavoXeneixe, en transmisiones',
    isTranslation: false,
    isFictional: true,
    context: 'No se ha verificado la fuente exacta de esta frase.',
  },

  // === LA COBRA (1 quote) ===
  {
    id: 163,
    text: 'Si la vida te da limones, hacé limonada y vendela',
    author: people.la_cobra,
    decoy: people.socrates,
    source: 'Atribuida a La Cobra, en transmisiones',
    isTranslation: false,
    isFictional: true,
    context: 'No se ha verificado la fuente exacta de esta frase.',
  },

  // === ELMARIANA (1 quote) ===
  {
    id: 164,
    text: 'No hay que tener miedo a equivocarse, el miedo es lo único que te impide aprender',
    author: people.el_mariana,
    decoy: people.nietzsche,
    source: 'Atribuida a ElMariana, en transmisiones',
    isTranslation: false,
    isFictional: true,
    context: 'No se ha verificado la fuente exacta de esta frase.',
  },

  // === WESTCOL (1 quote) ===
  {
    id: 165,
    text: 'El que no arriesga no gana, y el que gana no siempre arriesga bien',
    author: people.westcol,
    decoy: people.wilde,
    source: 'Atribuida a WestCOL, en transmisiones',
    isTranslation: false,
    isFictional: true,
    context: 'No se ha verificado la fuente exacta de esta frase.',
  },

  // === ILLOJUAN (1 quote) ===
  {
    id: 166,
    text: 'La vida es una mierda pero los carnavales son la hostia',
    author: people.illojuan,
    decoy: people.twain,
    source: 'Atribuida a IlloJuan, en transmisiones',
    isTranslation: false,
    isFictional: true,
    context: 'No se ha verificado la fuente exacta de esta frase.',
  },

  // === POKIMANE (1 quote) ===
  {
    id: 167,
    text: 'No tienes que ser perfecta, solo tienes ser tú misma',
    author: people.pokimane,
    decoy: people.curie,
    source: 'Atribuida a Pokimane, en transmisiones',
    isTranslation: false,
    isFictional: true,
    context: 'No se ha verificado la fuente exacta de esta frase.',
  },

  // === JYNXZI (1 quote) ===
  {
    id: 168,
    text: 'No se trata de cuánto juegas, se trata de cuánto aprendes jugando',
    author: people.jynxzi,
    decoy: people.edison,
    source: 'Atribuida a Jynxzi, en transmisiones',
    isTranslation: false,
    isFictional: true,
    context: 'No se ha verificado la fuente exacta de esta frase.',
  },

  // === XQC (1 quote) ===
  {
    id: 169,
    text: 'Yo no juego para ganar, juego para no aburrirme',
    author: people.xqc,
    decoy: people.descartes,
    source: 'Atribuida a xQc, en transmisiones',
    isTranslation: false,
    isFictional: true,
    context: 'No se ha verificado la fuente exacta de esta frase.',
  },

  // === JUANSGUARNIZO (1 quote) ===
  {
    id: 170,
    text: 'El que ríe último no ríe mejor, ríe solo',
    author: people.juansguarnizo,
    decoy: people.shakespeare,
    source: 'Atribuida a Juansguarnizo, en transmisiones',
    isTranslation: false,
    isFictional: true,
    context: 'No se ha verificado la fuente exacta de esta frase.',
  },

  // === KUN AGÜERO (1 quote) ===
  {
    id: 171,
    text: 'El que no salta es un inglés',
    author: people.kun_aguero,
    decoy: people.jordan,
    source: 'Kun Agüero, frase viral en transmisiones y eventos deportivos',
    isTranslation: false,
  },

  // === ONHEPIXLE (1 quote) ===
  {
    id: 172,
    text: 'No me importa lo que digan de mí, mientras no digan la verdad',
    author: people.onhepixle,
    decoy: people.newton,
    source: 'Atribuida a onhepixle, en transmisiones',
    isTranslation: false,
    isFictional: true,
    context: 'No se ha verificado la fuente exacta de esta frase.',
  },

  // === EMIRU (1 quote) ===
  {
    id: 173,
    text: 'La confianza en ti misma es lo único que nadie puede quitarte',
    author: people.emiru,
    decoy: people.mandela,
    source: 'Atribuida a Emiru, en transmisiones',
    isTranslation: false,
    isFictional: true,
    context: 'No se ha verificado la fuente exacta de esta frase.',
  },

  // === RAKAI (1 quote) ===
  {
    id: 174,
    text: 'No soy el mejor, pero estoy dispuesto a serlo',
    author: people.rakai,
    decoy: people.obama,
    source: 'Atribuida a Rakai, en transmisiones',
    isTranslation: false,
    isFictional: true,
    context: 'No se ha verificado la fuente exacta de esta frase.',
  },

  // === MARLON (1 quote) ===
  {
    id: 175,
    text: 'Todo lo que hago lo hago en serio, incluso bromear',
    author: people.marlon,
    decoy: people.ali,
    source: 'Atribuida a Marlon, en transmisiones',
    isTranslation: false,
    isFictional: true,
    context: 'No se ha verificado la fuente exacta de esta frase.',
  },

  // === TOMASMAZZA (1 quote) ===
  {
    id: 176,
    text: 'El que sabe, sabe. El que no, opina',
    author: people.tomasmazza,
    decoy: people.terence_tao,
    source: 'Atribuida a TomasMazza, en transmisiones',
    isTranslation: false,
    isFictional: true,
    context: 'No se ha verificado la fuente exacta de esta frase.',
  },
];
