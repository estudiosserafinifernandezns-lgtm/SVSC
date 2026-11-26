import type { Person, Category } from '@/types';

/**
 * People catalog. Each person has a name, category, profession, and image URL.
 * Images use Wikipedia/Wikimedia Commons URLs where possible for licensing clarity.
 * Profession is a single primary occupation — no compound labels.
 */

const people: Record<string, Person> = {
  // === POLÍTICOS ===
  trump: { name: 'Donald Trump', category: 'politicos', profession: 'Político', imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/16/Official_Presidential_Portrait_of_President_Donald_J._Trump_%282025%29.jpg/960px-Official_Presidential_Portrait_of_President_Donald_J._Trump_%282025%29.jpg?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=thumbnail' },
  obama: { name: 'Barack Obama', category: 'politicos', profession: 'Político', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/President_Barack_Obama.jpg?utm_source=es.wikipedia.org&utm_campaign=index&utm_content=original' },
  kennedy: { name: 'John F. Kennedy', category: 'politicos', profession: 'Político', imageUrl: 'https://cdn.britannica.com/34/94934-050-BBF93D08/John-F-Kennedy.jpg' },
  roosevelt: { name: 'Franklin D. Roosevelt', category: 'politicos', profession: 'Político', imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/67/FDR_1944_Color_Portrait_%28cropped%29%28b%29.jpg/250px-FDR_1944_Color_Portrait_%28cropped%29%28b%29.jpg?utm_source=es.wikipedia.org&utm_campaign=parser&utm_content=thumbnail' },
  lincoln: { name: 'Abraham Lincoln', category: 'politicos', profession: 'Político', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/ab/Abraham_Lincoln_O-77_matte_collodion_print.jpg?utm_source=es.wikipedia.org&utm_campaign=index&utm_content=original' },
  washington: { name: 'George Washington', category: 'politicos', profession: 'Político', imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b6/Gilbert_Stuart_Williamstown_Portrait_of_George_Washington.jpg/250px-Gilbert_Stuart_Williamstown_Portrait_of_George_Washington.jpg?utm_source=es.wikipedia.org&utm_campaign=parser&utm_content=thumbnail' },
  churchill: { name: 'Winston Churchill', category: 'politicos', profession: 'Político', imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cd/Churchill_V_sign_HU_55521.jpg/250px-Churchill_V_sign_HU_55521.jpg?utm_source=es.wikipedia.org&utm_campaign=parser&utm_content=thumbnail' },
  mandela: { name: 'Nelson Mandela', category: 'politicos', profession: 'Político', imageUrl: 'https://static.nationalgeographicla.com/files/styles/image_3200/public/nationalgeographic_683924_bx.webp?w=1600&h=2395&p=top' },
  gandhi: { name: 'Mahatma Gandhi', category: 'politicos', profession: 'Activista', imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/07/Mahatma-Gandhi_Suedafrika-1906.jpg/250px-Mahatma-Gandhi_Suedafrika-1906.jpg?utm_source=en.wikipedia.org&utm_campaign=parser&utm_content=thumbnail' },
  king: { name: 'Martin Luther King Jr.', category: 'politicos', profession: 'Activista', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/84/Martin_Luther_King_Jr_NYWTS.jpg?utm_source=es.wikipedia.org&utm_campaign=index&utm_content=original' },

  // === CIENTÍFICOS ===
  einstein: { name: 'Albert Einstein', category: 'cientificos', profession: 'Físico', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Albert_Einstein_Head.jpg' },
  tesla: { name: 'Nikola Tesla', category: 'cientificos', profession: 'Inventor', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/79/Tesla_circa_1890.jpeg?utm_source=es.wikipedia.org&utm_campaign=index&utm_content=original' },
  newton: { name: 'Isaac Newton', category: 'cientificos', profession: 'Físico', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkbNJEC8T30LEQf8x773aBV0EjMBIFsvCe-rGoY2blyg&s=10' },
  curie: { name: 'Marie Curie', category: 'cientificos', profession: 'Física', imageUrl: 'https://content-historia.nationalgeographic.com.es/medio/2019/07/02/marie-curie_92a91b69_1375x2000.jpg' },
  darwin: { name: 'Charles Darwin', category: 'cientificos', profession: 'Biólogo', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Charles_Darwin_portrait.jpg?utm_source=es.wikipedia.org&utm_campaign=index&utm_content=original' },
  hawking: { name: 'Stephen Hawking', category: 'cientificos', profession: 'Físico', imageUrl: 'https://www.premiosfronterasdelconocimiento.es/wp-content/uploads/sites/2/2017/05/FBBVA-15-ciencia-Stephen-Hawking.jpg' },
  galileo: { name: 'Galileo Galilei', category: 'cientificos', profession: 'Astrónomo', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSmfig1cudP-F6-YzezByQC2QTre8qVRsoQrT5l8ZEwQ&s' },
  feynman: { name: 'Richard Feynman', category: 'cientificos', profession: 'Físico', imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1a/RichardFeynman-PaineMansionWoods1984_copyrightTamikoThiel_bw.jpg/250px-RichardFeynman-PaineMansionWoods1984_copyrightTamikoThiel_bw.jpg?utm_source=es.wikipedia.org&utm_campaign=parser&utm_content=thumbnail' },

// === FILÓSOFOS Y ESCRITORES ===
nietzsche: { name: 'Friedrich Nietzsche', category: 'filosofos', profession: 'Filósofo', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Nietzsche187a.jpg/250px-Nietzsche187a.jpg' },
socrates: { name: 'Sócrates', category: 'filosofos', profession: 'Filósofo', imageUrl: 'https://todomedieval.com/cdn/shop/articles/imagen_2026-02-07_040526817_13ef5ab5-1233-4dae-b77d-c1cc4bd8e7b7.png?v=1771580585&width=1024' },
plato: { name: 'Platón', category: 'filosofos', profession: 'Filósofo', imageUrl: 'https://www.lifeder.com/wp-content/uploads/2020/04/Platon.jpg' },
aristotle: { name: 'Aristóteles', category: 'filosofos', profession: 'Filósofo', imageUrl: 'https://cdn.britannica.com/84/87984-050-7C5547FE/Detail-Roman-copy-portrait-bust-Aristotle-Greek.jpg' },
twain: { name: 'Mark Twain', category: 'filosofos', profession: 'Escritor', imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/55/Mark_Twain_DLitt.jpg/250px-Mark_Twain_DLitt.jpg?utm_source=es.wikipedia.org&utm_campaign=parser&utm_content=thumbnail' },
wilde: { name: 'Oscar Wilde', category: 'filosofos', profession: 'Escritor', imageUrl: 'https://www.english-heritage.org.uk/siteassets/home/visit/blue-plaques/find-a-plaque/blue-plaques-u-z/oscar-wilde.jpg?maxwidth=580&mode=none&scale=downscale&quality=60&anchor=&WebsiteVersion=20200219' },
cervantes: { name: 'Miguel de Cervantes', category: 'filosofos', profession: 'Escritor', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuLEdJK8vT8vzQHsjFF50Sowo4u04X5e_vNZNLUuozY_IIc4r8LM_lRLU&s=10' },
shakespeare: { name: 'William Shakespeare', category: 'filosofos', profession: 'Dramaturgo', imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/21/William_Shakespeare_by_John_Taylor%2C_edited.jpg/960px-William_Shakespeare_by_John_Taylor%2C_edited.jpg?utm_source=es.wikipedia.org&utm_campaign=index&utm_content=thumbnail' },
camus: { name: 'Albert Camus', category: 'filosofos', profession: 'Filósofo', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Albert_Camus%2C_gagnant_de_prix_Nobel%2C_portrait_en_buste%2C_pos%C3%A9_au_bureau%2C_faisant_face_%C3%A0_gauche%2C_cigarette_de_tabagisme.jpg?utm_source=es.wikipedia.org&utm_campaign=index&utm_content=original' },
descartes: { name: 'René Descartes', category: 'filosofos', profession: 'Filósofo', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvQHd4Ak-EKw3v8EStZ0GL4i_owy31ii1HxAo6LTmBVQ&s' },
voltaire: { name: 'Voltaire', category: 'filosofos', profession: 'Filósofo', imageUrl: 'https://www.worldhistory.org/img/r/p/1500x1500/18099.jpg' },

// === FAMOSOS ===
jackson: { name: 'Michael Jackson', category: 'famosos', profession: 'Cantante', imageUrl: 'https://static.wikia.nocookie.net/michael-jackson/images/a/a7/MJ.jpg/revision/latest?cb=20240929214835&path-prefix=es' },
presley: { name: 'Elvis Presley', category: 'famosos', profession: 'Cantante', imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6b/Elvis_Presley_Publicity_Photo_for_The_Trouble_with_Girls_1968.jpg/250px-Elvis_Presley_Publicity_Photo_for_The_Trouble_with_Girls_1968.jpg?utm_source=es.wikipedia.org&utm_campaign=parser&utm_content=thumbnail' },
jobs: { name: 'Steve Jobs', category: 'famosos', profession: 'Empresario', imageUrl: 'https://www.muycomputerpro.com/wp-content/uploads/2025/02/Steve_Jobs_2.jpg' },
ali: { name: 'Muhammad Ali', category: 'famosos', profession: 'Boxeador', imageUrl: 'https://cloudfront-us-east-1.images.arcpublishing.com/copesa/YJ5TVPZFOZHLVKBHLKMLILXXPU.jpg' },
jordan: { name: 'Michael Jordan', category: 'famosos', profession: 'Baloncestista', imageUrl: 'https://media.vogue.es/photos/5ea1dfcae7a75f000938445e/2:3/w_2560%2Cc_limit/GettyImages-52298709.jpg' },
marley: { name: 'Bob Marley', category: 'famosos', profession: 'Cantante', imageUrl: 'https://www.radioaspen.com.py/wp-content/uploads/2017/12/Bob-Marley-5899213a3df78caebc04f6b9.jpg' },

// === CREADORES DE CONTENIDO / EMPRESARIOS ===
elon: { name: 'Elon Musk', category: 'creadores', profession: 'Empresario', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvtBCcQv2mp3Wb3v6xqkxs-txAF25qF_d5OSokWwmw0A&s=10' },

// === STREAMERS ===
rubius: { name: 'El Rubius', category: 'streamers', profession: 'Streamer', imageUrl: 'https://static.wikia.nocookie.net/es-streamers-twitch/images/9/90/Elrubius.jpg/revision/latest?cb=20250512234605&path-prefix=es' },
auron: { name: 'AuronPlay', category: 'streamers', profession: 'Streamer', imageUrl: 'https://i.pinimg.com/736x/bf/d7/5f/bfd75f41753c7d53611739767535137c.jpg' },
ibai: { name: 'Ibai', category: 'streamers', profession: 'Streamer', imageUrl: 'https://hips.hearstapps.com/hmg-prod/images/ibai-llanos-leo-messi-instagram-1628497413.jpg' },
xokas: { name: 'ElXokas', category: 'streamers', profession: 'Streamer', imageUrl: 'https://objetos-xlk.estaticos-marca.com/uploads/2026/08/19/6a858d63594b9.jpeg' },
bananirou: { name: 'Bananirou', category: 'streamers', profession: 'Streamer', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfErFYEaGWMeoFHDx4vo2HaBtLGrbakmvAWaOLworK1Ofe4nPdUnJLL9M&s=10' },
spreen: { name: 'Spreen', category: 'streamers', profession: 'Streamer', imageUrl: 'https://s3.ppllstatics.com/elcorreo/www/multimedia/2024/11/12/spreen-kBgD-U2201802205050DtG-1200x840@El%20Correo.jpg' },
mrbeast: { name: 'MrBeast', category: 'streamers', profession: 'Streamer', imageUrl: 'https://www.rollingstone.com/wp-content/uploads/2022/04/R1363_MrBeast_1feature.jpg?w=800&h=800&crop=1' },
stable_ronaldo: { name: 'Stable Ronaldo', category: 'streamers', profession: 'Streamer', imageUrl: 'https://imgs.search.brave.com/mBEy_mMb32yYq7Lo90Eu3w3Y7L1C5bg5JkOMS5fFb6I/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zLnlp/bWcuY29tL2xvL215/c3RlcmlvL2FwaS84/MzRjMDg0NmUwYTQ5/OWIxYjE0ODFmZTQx/MGMzODhjODBmZDI5/YWE2ZDkwNDFhN2Zl/MDMwNTgyMzc2NjM4/Y2M1L2xpZ2h0eWVh/cl9uZXR3b3JrYXBp/L3Jlc2l6ZWZpbGxf/dzk3NjtxdWFsaXR5/XzgwO2Zvcm1hdF93/ZWJwL2h0dHBzOi8v/bWVkaWEuemVuZnMu/Y29tL2VuL2NvbXBs/ZXhfMTMxL2JhMDAz/OWY5NDgzZTFiMzg1/ZGIxYmMxMzAwNjE0/Mzg1LmpwZw' },
kai_cenat: { name: 'Kai Cenat', category: 'streamers', profession: 'Streamer', imageUrl: 'https://static.wikia.nocookie.net/amp/images/f/f7/Kai_Cenat.jpg/revision/latest?cb=20240705052516' },
speed: { name: 'Speed', category: 'streamers', profession: 'Streamer', imageUrl: 'https://www.lanacion.com.py/resizer/v2/NPRQMHTXORHDNNXNZNAWMHU5SY.png?auth=b8aa87823b4e8ee85f11e1cdd5d4a0c9aa31c60cdd2478274f5b38aa07f94234&width=1280&smart=true' },
coscu: { name: 'Coscu', category: 'streamers', profession: 'Streamer', imageUrl: 'https://imgs.search.brave.com/8Q2taSobko0GXaqm0S3H7xsqOjapaHDa_9rXhjhXyFM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9mb3Rv/cy5wZXJmaWwuY29t/Ly8yMDIzLzA3LzI5/LzkwMC8wL2Nvc2N1/LXktbWVzc2ktMi0x/NjIwNTA0LmpwZw' },

// === STREAMERS NUEVOS ===
robleis: { name: 'Robleis', category: 'streamers', profession: 'Streamer', imageUrl: 'https://fotos.perfil.com//2023/09/23/900/0/robleis-1-1660309.jpg' },
davoxeneixe: { name: 'DavoXeneixe', category: 'streamers', profession: 'Streamer', imageUrl: 'https://robertoramasso.com/wp-content/uploads/Davoceneixe_ramasso1.webp' },
la_cobra: { name: 'La Cobra', category: 'streamers', profession: 'Streamer', imageUrl: 'https://imgs.search.brave.com/IH_ftTmqFiUvYzfq-ylcdeRwMv_pSHs-18nDWyKcpwY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9yb2Jl/cnRvcmFtYXNzby5j/b20vd3AtY29udGVu/dC91cGxvYWRzL2xh/LWNvYnJhX1JhbWFz/c28uYXZpZg' },
el_mariana: { name: 'ElMariana', category: 'streamers', profession: 'Streamer', imageUrl: 'https://imgs.search.brave.com/xZBCprqOJzs7ivXdUnUtnINMCXEJNDhAIjNqqxeb8X8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9sYWJp/b2RlLmNvbS93cC1j/b250ZW50L3VwbG9h/ZHMvMjAyMi8wOS9F/bC1NYXJpYW5hLmpw/Zw' },
westcol: { name: 'WestCOL', category: 'streamers', profession: 'Streamer', imageUrl: 'https://i.pinimg.com/736x/8c/9d/d7/8c9dd72d29c14afeaa21308882301928.jpg' },
illojuan: { name: 'IlloJuan', category: 'streamers', profession: 'Streamer', imageUrl: 'https://cdn.infolavelada.com/boxeadores/illojuan/01-sm.webp' },
pokimane: { name: 'Pokimane', category: 'streamers', profession: 'Streamer', imageUrl: 'https://imgs.search.brave.com/uXtVy1t-04qBRng3G0FtUlDurzWOaq9ynhb-ICMiS9A/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMwLmdhbWVyYW50/aW1hZ2VzLmNvbS93/b3JkcHJlc3Mvd3At/Y29udGVudC91cGxv/YWRzLzIwMjQvMDEv/cG9raW1hbmUtc3Ry/ZWFtLWltYWdlLWJl/ZHJvb20uanBnP3E9/NDkmZml0PWNvbnRh/aW4mdz0xODAwJmg9/OTAwJmRwcj0y' },
jynxzi: { name: 'Jynxzi', category: 'streamers', profession: 'Streamer', imageUrl: 'https://imgs.search.brave.com/QAXwFHXAbsOHc7qshjTY2aS3Sl_hpPWcqCyHxops_wU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9icmln/aHRwZnAuY29tL3dw/LWNvbnRlbnQvdXBs/b2Fkcy8yMDI2LzA3/L0p5bnh6aS1QZnAt/RnVubnktNC53ZWJw' },
xqc: { name: 'xQc', category: 'streamers', profession: 'Streamer', imageUrl: 'https://www.svg.com/img/gallery/the-shady-side-of-xqc/l-intro-1605808476.jpg' },
juansguarnizo: { name: 'Juansguarnizo', category: 'streamers', profession: 'Streamer', imageUrl: 'https://imgs.search.brave.com/Vbxt5Lz83bzzQ_U0oVdveI5UTp8EcOFu7lQruJiYhYI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzFhLzMz/LzU4LzFhMzM1OGRl/MWFmODY5ZGM5ODMy/ZjZjODhhNmVhZmUz/LmpwZw' },
momo: { name: 'Momo', category: 'streamers', profession: 'Streamer', imageUrl: 'https://imgs.search.brave.com/TorJ6oyh_MnLUYDVFdybWhJ6Rq_A7eks3pAZ3MMOsqI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuc3RlYW11c2Vy/Y29udGVudC5jb20v/dWdjLzI0OTExMzcx/NDc3NTIxMjkyMDUv/ODQwNjE1MTg2M0ZE/NUE4RTJFNUU3RkQy/RTYyMDhFOUNCQTBC/MUYyMi8_aW13PTI4/NCZpbWg9NTA2Jmlt/YT1maXQmaW1wb2xp/Y3k9TGV0dGVyYm94/JmltY29sb3I9IzAw/MDAwMCZsZXR0ZXJi/b3g9dHJ1ZQ' },
ninja: { name: 'Ninja', category: 'streamers', profession: 'Streamer', imageUrl: 'https://imgs.search.brave.com/d8AU-5-lUnwgNGX8IOOC7KTYZe61_B7tBEKRLuCqYJk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL00v/TVY1QlpqWTJNRFEx/TVRZdFpETXdNQzAw/WldZNUxUa3dNVGt0/TVRFMFltSXhZek01/TXpBd1hrRXlYa0Zx/Y0djQC5qcGc' },
tfue: { name: 'Tfue', category: 'streamers', profession: 'Streamer', imageUrl: 'https://static.wikia.nocookie.net/youtubepedia/images/8/81/Tfuedesconocido.jpg/revision/latest?cb=20200411171004&path-prefix=es' },
zias_blou: { name: 'Zias y B.Lou', category: 'streamers', profession: 'Streamers', imageUrl: 'https://media.tenor.com/6dJIuP79yjEAAAAe/blou-zias.png' },
thegrefg: { name: 'TheGrefg', category: 'streamers', profession: 'Streamer', imageUrl: 'https://i.ytimg.com/vi/iASbI7Mnj4E/maxresdefault.jpg' },
alonso: { name: 'Alonso (el down)', category: 'streamers', profession: 'Streamer', imageUrl: 'https://imgs.search.brave.com/v7c0ji00FcEqv-XWLJlbt1HxpOhoUGIr2_jBX1r56oM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZW5lcy5tb250ZXZp/ZGVvLmNvbS51eS9p/bWdub3RpY2lhcy8y/MDI1MDcvX1c5MzNf/ODAvOTI0ODI1Lmpw/Zw' },
lacy: { name: 'Lacy', category: 'streamers', profession: 'Streamer', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLjod5Pbrqbq2JMb6JORM52iyQaU_hJSKS2ymiG1zSqHeUHtkxwmHRUNc&s=10' },
jasontheween: { name: 'Jasontheween', category: 'streamers', profession: 'Streamer', imageUrl: 'https://imgs.search.brave.com/pzhJGn16PCC-H7_yP-VW7PdQHZ1tzVozCXE-eOkx9Zs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9wcmV2/aWV3LnJlZGQuaXQv/amFzb250aGV3ZWVu/LWhhcy1zdGFydGVk/LWRtY2FpbmctY2xp/cHMtYWJvdXQtaGlz/LXJlY2VudC12MC1w/Y2Njdm02Mmh1Y2gx/LnBuZz93aWR0aD05/MDAmZm9ybWF0PXBu/ZyZhdXRvPXdlYnAm/cz1mZWNmNzNjNmQz/ODQ4NDZjMDU3NGM1/ZThhZDE4MGQ5MzU1/MGYwZmU4' },
agusneta: { name: 'Agusneta', category: 'streamers', profession: 'Streamer', imageUrl: 'https://pbs.twimg.com/media/HSb_bo4WAAAN-Ad?format=webp&name=large' },

// === CIENTÍFICOS ADICIONALES ===
turing: { name: 'Alan Turing', category: 'cientificos', profession: 'Matemático', imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Alan_Turing_(1951).jpg' },
edison: { name: 'Thomas Edison', category: 'cientificos', profession: 'Inventor', imageUrl: 'https://cdn.britannica.com/44/19444-050-1DA32C1C/replica-Thomas-A-Edison-lightbulb-1925.jpg' },
terence_tao: { name: 'Terence Tao', category: 'cientificos', profession: 'Matemático', imageUrl: 'https://s3.amazonaws.com/cms.ipressroom.com/173/files/20258/68c099122cfac203a54672da_250827_TerenceTao-10/250827_TerenceTao-10_mid.jpg' },
pitagoras: { name: 'Pitágoras', category: 'cientificos', profession: 'Matemático', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSO0aAiAVPhF_zIDeLMEQWWn-OCAct8zJfHf_U1kjScA3SQGPBj9oiGquNw&s=10' },
euclides: { name: 'Euclides', category: 'cientificos', profession: 'Matemático', imageUrl: 'https://cdn-blog.superprof.com/blog_es/wp-content/uploads/2019/06/euclides.jpg' },
davinci: { name: 'Leonardo da Vinci', category: 'cientificos', profession: 'Inventor', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRylCxVXfK7adBn4monBf8KF1XD8yO_cJub833J0vTKhYvpf7jFvwPde38&s=10' },

// === FILÓSOFOS Y PENSADORES ADICIONALES ===
marco_aurelio: { name: 'Marco Aurelio', category: 'filosofos', profession: 'Filósofo', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/80/MSR-ra-61-b-1-DM_%28cropped%29.jpg?utm_source=es.wikipedia.org&utm_campaign=index&utm_content=original' },

// === FIGURAS HISTÓRICAS Y ESCRITORES ===
bobby_fischer: { name: 'Bobby Fischer', category: 'famosos', profession: 'Ajedrecista', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/34/Bobby_Fischer_1972.jpg?utm_source=es.wikipedia.org&utm_campaign=index&utm_content=original' },
julio_cesar: { name: 'Julio César', category: 'politicos', profession: 'Militar', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/62/Retrato_de_Julio_C%C3%A9sar_%2826724093101%29_%28cropped%29.jpg?utm_source=es.wikipedia.org&utm_campaign=index&utm_content=original' },
alejandro_magno: { name: 'Alejandro Magno', category: 'politicos', profession: 'Conquistador', imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/62/Bust_Alexander_BM_1857.jpg/250px-Bust_Alexander_BM_1857.jpg?utm_source=es.wikipedia.org&utm_campaign=parser&utm_content=thumbnail' },
quevedo: { name: 'Francisco de Quevedo', category: 'filosofos', profession: 'Escritor', imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e8/Francisco_de_Quevedo_%28Pacheco%29.jpg/250px-Francisco_de_Quevedo_%28Pacheco%29.jpg?utm_source=es.wikipedia.org&utm_campaign=parser&utm_content=thumbnail' },

// === STREAMERS ADICIONALES ===
kun_aguero: { name: 'Kun Agüero', category: 'streamers', profession: 'Streamer', imageUrl: 'https://media.c5n.com/p/c4742030367e32028e11e3c1017d1741/adjuntos/326/videos/000/017/0000017913/1200x675/smart/vamoajugajpg.jpg' },
onhepixle: { name: 'onhepixle', category: 'streamers', profession: 'Streamer', imageUrl: 'https://media.tenor.com/o6buo6-H0eUAAAAe/ohnepixel-counter-strike.png' },
emiru: { name: 'Emiru', category: 'streamers', profession: 'Streamer', imageUrl: 'https://img.redbull.com/images/c_limit,w_1500,h_1000/f_auto,q_auto/redbullcom/2025/12/23/qvpmp111xu4ad2gofky3/emiru-studio-portrait-2025' },
rakai: { name: 'Rakai', category: 'streamers', profession: 'Streamer', imageUrl: 'https://dwgyu36up6iuz.cloudfront.net/heru80fdn/image/upload/c_fill,d_placeholder_gq.png,fl_progressive,g_face,h_1080,q_80,w_1920/v1772107281/gq_10-essentials-2xrakai.jpg?_a=BACCg%20Ev' },
marlon: { name: 'Marlon', category: 'streamers', profession: 'Streamer', imageUrl: 'https://www.interviewmagazine.com/wp-content/uploads/2025/10/Interview_Issue-563_Fall-2025_Marlon-Garcia_8_web-scaled.jpg' },
tomasmazza: { name: 'TomasMazza', category: 'streamers', profession: 'Streamer', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQT0yOCmo4lbK-5RtULVSztPpY1o-Dc5QtFeHcT1K1qUQ&s=10' },
};

export function getPerson(key: string): Person {
  return people[key];
}

export function getRandomDecoy(authorKey: string): string {
  const allKeys = Object.keys(people).filter((k) => k !== authorKey);
  return allKeys[Math.floor(Math.random() * allKeys.length)];
}

export const categoryLabels: Record<Category, string> = {
  streamers: 'Streamers',
  creadores: 'Creadores de contenido',
  famosos: 'Famosos',
  politicos: 'Políticos',
  cientificos: 'Científicos',
  filosofos: 'Filósofos y escritores',
  internet: 'Cultura de Internet',
};

export { people };
