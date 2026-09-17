// Transcriptions des paragraphes mécaniques de la fiche fournie par le joueur.
// Elles restent séparées de la description jouable et de ses corrections.
export const SOURCE_DETAILS={
 attack:"Lorsqu’il utilise l’action Attaquer, Karu attaque deux fois au lieu d’une.",
 arts:"Karu maîtrise les combats à mains nues et avec les armes de moine.\n• Il peut utiliser la Dextérité à la place de la Force, mais préfère la Force.\n• Dé d’arts martiaux : 1d6.\n• Après l’action Attaquer avec une frappe à mains nues ou une arme de moine, il peut effectuer une frappe à mains nues en action bonus.\n• Son bâton de marche est une arme de moine.",
 flurry:"Après l’action Attaquer, Karu effectue deux frappes à mains nues en action bonus. 1 ki.\nL’aide de combat mentionne aussi : « Jusqu’à deux attaques supplémentaires. »",
 patient:"Karu utilise Esquiver en action bonus. 1 ki.",
 wind:"Karu utilise Se désengager ou Foncer en action bonus. Sa distance de saut est doublée pendant ce tour. 1 ki.",
 stun:"Quand Karu touche une créature avec une attaque de corps à corps, il peut dépenser 1 point de ki. La cible doit réussir un JS de Constitution DD 14 ou être étourdie jusqu’à la fin du prochain tour de Karu.",
 open:"Chaque fois qu’une attaque de sa Rafale de coups touche, Karu peut choisir l’un des effets suivants :\nA. Renversement : JS de Dextérité DD 14 ou la cible tombe à terre.\nB. Projection : JS de Force DD 14 ou la cible est repoussée de 4,5 m.\nC. Suppression des réactions : la cible ne peut pas utiliser de réaction jusqu’à la fin du prochain tour de Karu.",
 deflect:"Réaction. Lorsque Karu est touché par une attaque à distance, il réduit les dégâts de 1d10 + 8. Si cela réduit les dégâts à 0, il peut attraper le projectile et, pour 1 point de ki, le renvoyer immédiatement avec une portée de 6/18 m.",
 fall:"Réaction. Karu réduit les dégâts de chute de 35.",
 evasion:"Quand un effet permet normalement un JS de Dextérité pour subir seulement la moitié des dégâts, Karu ne subit aucun dégât en cas de réussite et seulement la moitié en cas d’échec.",
 still:"Par une action, Karu peut mettre fin à un effet qui le rend charmé ou effrayé.",
 whole:"Par une action, Karu récupère 21 PV. Utilisation : 1 fois par repos long.",
 empowered:"Les frappes à mains nues de Karu sont considérées comme magiques pour surmonter les résistances et immunités aux dégâts non magiques.",
 shell:"Par une action, Karu rentre dans sa carapace. Tant qu’il y reste : +4 CA (CA 21), avantage aux JS de Force et de Constitution, il est à terre, sa vitesse est de 0, il a le désavantage aux JS de Dextérité et ne peut pas utiliser de réaction. Avec ses Brassards de défense, ce bonus de +4 porte sa CA à 23. Il peut sortir de sa carapace par une action bonus.",
 natural:"Grâce à sa carapace, Karu possède une CA de base de 17. Avec ses Brassards de défense, sa CA habituelle est de 19. Il ne porte pas d’armure.\n\nDéfense sans armure : Tant qu’il ne porte ni armure ni bouclier, un moine peut calculer sa CA comme 10 + DEX + SAG. Pour Karu, cela ferait : 10 + 12 + 16 = 14. Karu utilise normalement la CA naturelle de sa carapace : 17. Grâce à ses Brassards de défense, sa CA naturelle est augmentée à 19.",
 ki:"Points de ki : 7. Récupération : repos court ou long, après méditation. DD du ki : 15. Grâce à sa Ceinture du Pas Immobile, Karu bénéficie d’un bonus de +1 au DD du ki.",
 movement:"Bonus de vitesse au niveau 7 : +4,5 m. Vitesse totale de Karu : 13,5 m. Avec Foncer : jusqu’à 27 m sur le tour. Vitesse d’escalade : 13,5 m grâce aux Chaussons d’araignée.",
 breath:"Karu peut retenir sa respiration pendant 1 heure.",
 survival:"Karu maîtrise la compétence Survie.",
};
export const SOURCE_ITEMS={
 belt:"Objet merveilleux, rare, nécessite l’harmonisation par un moine.\n\nCette large ceinture de toile gris-vert est renforcée par sept plaques de jade terne, chacune gravée d’une posture de tortue martiale.\n\nTant que vous ne portez ni armure ni bouclier, le DD de vos aptitudes de moine utilisant le ki augmente de 1.\n\nLorsque vous sortez de votre Défense de carapace, vous pouvez vous relever sans dépenser de déplacement, puis vous déplacer immédiatement jusqu’à la moitié de votre vitesse sans provoquer d’attaques d’opportunité.\n\nUne fois cette propriété utilisée, elle ne peut plus l’être avant un repos court ou long.",
 bracers:"Objet merveilleux, rare, nécessite l’harmonisation.\n\nTant que vous portez ces brassards sans porter d’armure ni de bouclier, vous gagnez un bonus de +2 à la classe d’armure.\n\nPour Karu, cela porte sa CA habituelle à 19, et sa Défense de carapace à 23.",
 slippers:"Objet merveilleux, peu commun, nécessite l’harmonisation.\n\nTant que vous portez ces chaussons, votre vitesse d’escalade est égale à votre vitesse de marche.\n\nVous pouvez vous déplacer le long des murs et des plafonds tout en gardant les mains libres, comme si la gravité vous ignorait un instant.\n\nPour Karu, cela donne une vitesse d’escalade de 13,5 mètres.",
 bag:"Objet merveilleux, peu commun.\n\nCe sac extradimensionnel peut contenir jusqu’à 250 kilogrammes de matériel, sans dépasser 1,8 mètre cube, tout en pesant toujours environ 7 kilogrammes.\n\nRécupérer un objet du sac demande une action.\n\nKaru y conserve son matériel d’herboriste, ses notes, des plantes séchées, des couvertures et les petits objets tranquilles ramassés sur la route.",
 gourd:"Objet merveilleux, commun.\n\nUne fois par aube, si la calebasse est vide, elle peut purifier jusqu’à 4 litres d’eau non magique versés à l’intérieur. L’eau devient potable et débarrassée des impuretés ordinaires.\n\nDes herbes placées dans la calebasse peuvent être transformées en infusion chaude en 1 minute, sans feu ni eau bouillante.\n\nLes plantes médicinales, feuilles, graines et préparations non magiques conservées dans la calebasse ne moisissent pas et ne perdent pas leur fraîcheur.\n\nLa calebasse peut contenir environ 2 litres."
};
SOURCE_DETAILS.belt=SOURCE_ITEMS.belt;
