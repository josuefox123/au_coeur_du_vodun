import { ImageSourcePropType } from 'react-native';

export type FeedType = 'ACTU' | 'VIDEO' | 'IMAGE' | 'BLOG';

export interface FeedItem {
  id: string;
  type: FeedType;
  title: string;
  tag: string;
  date: string;
  author: string;
  desc: string;
  content: string;
  image: ImageSourcePropType;
  duration?: string;
  videoUrl?: string;
  likes: number;
}

export const FEED_ITEMS: FeedItem[] = [
  {
    id: 'feed-1',
    type: 'ACTU',
    title: 'Célébration annuelle des Divinités Dan & Héviosso',
    tag: 'ACTUALITÉ DU TEMPLE',
    date: 'Aujourd\'hui',
    author: 'Secrétariat du Temple',
    desc: 'Les dignitaires et initiés se rassemblent pour les rituels de bénédiction et de prospérité.',
    content: `Le grand Conseil des sages du Temple annonce les dates sacrées de la grande célébration des divinités Dan (le serpent de l'abondance) et Héviosso (le tonnerre et la justice).

Durant trois jours, prières rituelles, offrandes de purification et veillées de chants sacrés auront lieu sous l'égide du Bokonon en chef. Les fidèles de toutes contrées sont invités à participer sur place ou à formuler leurs vœux de bénédiction à distance par l'intermédiaire de l'application.

Programme :
• Jour 1 : Purification des autels et consultation communautaire du Fâ.
• Jour 2 : Bénédiction des familles et consécration des amulettes protectrices.
• Jour 3 : Grande fête des danses cérémonielles et distribution des nourritures bénies.`,
    image: require('@/assets/images/temple_facade.jpg'),
    likes: 84,
  },
  {
    id: 'feed-2',
    type: 'VIDEO',
    title: 'Vidéo : Le Bokonon explique le lancer du Kpê',
    tag: 'VIDÉO RITUELLE',
    date: 'Hier',
    author: 'Bokonon Mahougnon',
    desc: 'Démonstration sacrée de la lecture des cauris sur le plateau Opon Ifá avec commentaire rituel.',
    content: `Dans cette séquence exclusive, le Bokonon détaille les gestes précis nécessaires à la transmission des signes divinatoires.

« Le plateau n'est pas un simple objet en bois : c'est un miroir céleste. Lorsque la farine sacrée d'Iyerosun y est dispersée, chaque cauri qui tombe vient révéler un chemin de lumière ou un avertissement à respecter. »

Visionnez la vidéo ci-dessus pour observer la posture rituelle, le souffle d'invocation et l'orientation des visages de chaque cauri.`,
    image: require('@/assets/images/fronton_soleil.jpg'),
    duration: '06:45',
    videoUrl: 'https://aucoeurduvodun.com/videos/kpeli-demonstration',
    likes: 152,
  },
  {
    id: 'feed-3',
    type: 'BLOG',
    title: 'Blog du Prêtre : Pourquoi consulter le Fâ au seuil d\'un projet ?',
    tag: 'CHRONIQUE SPIRITUELLE',
    date: 'Il y a 3 jours',
    author: 'Paroles du Bokonon',
    desc: 'Comprendre comment le Fâ anticipe les obstacles invisibles et harmonise vos énergies de vie.',
    content: `Dans la tradition ancestrale béninoise, entreprendre sans interroger le Fâ revient à marcher dans une forêt sombre sans torche.

Le Fâ n'impose pas un destin figé : il éclaire les forces invisibles à l'œuvre autour de vous. Qu'il s'agisse d'un mariage, d'un voyage, d'une création d'entreprise ou d'une décision familiale majeure, le signe divinatoire met en garde contre les jalousies cachées, préconise les sacrifices propitiatoires et confirme les alliances fastes.

Prenez le temps d'écouter les avertissements du signe avant de sceller vos engagements.`,
    image: require('@/assets/images/embleme_officiel.png'),
    likes: 120,
  },
  {
    id: 'feed-4',
    type: 'IMAGE',
    title: 'Galerie Sacrée : Préparation de l\'Amulette Bo',
    tag: 'IMAGES DU SANCTUAIRE',
    date: 'Cette semaine',
    author: 'Temple Ancestral',
    desc: 'Clichés exclusifs des plantes et symboles consacrés pour la protection des fidèles.',
    content: `Reportage photographique exclusif au cœur de la cour des rituels du Temple.

Les initiés préparent sous l'autorité du prêtre les amulettes de protection (Bo) composées d'écorces rares, de fils consacrés noir et blanc, et de minéraux réputés pour repousser les énergies négatives. Chaque pièce requiert sept jours d'incantations avant d'être transmise à son bénéficiaire.`,
    image: require('@/assets/images/temple.jpg'),
    likes: 96,
  },
];

